// server.js
// Express backend for internal company Facebook-like app
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const xml2js = require('xml2js');
const path = require('path');
const mysql = require('mysql2/promise');
const { getAnswer } = require('./services/chatbotService');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the 'file' directory
app.use('/files', express.static(path.join(__dirname, 'file')));

// --- User Authentication (Login/Signup) ---

// Signup endpoint (with role)
app.post('/api/signup', async (req, res) => {
  const { full_name, username, password, designation } = req.body;
  if (!full_name || !username || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const [employees] = await db.query('SELECT * FROM employees WHERE username = ?', [username]);
    if (employees.length > 0) return res.status(400).json({ error: 'Username already exists' });
    await db.query('INSERT INTO employees (full_name, username, password, designation) VALUES (?, ?, ?, ?)', [full_name, username, password, designation]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint (returns role)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const [employees] = await db.query('SELECT * FROM employees WHERE username = ?', [username]);
    if (employees.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
    const employee = employees[0];
    if (password !== employee.password) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ success: true, employee: { id: employee.id, full_name: employee.full_name, username: employee.username, designation: employee.designation } });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.use(cors());
app.use(express.json());

// --- MySQL Database Connection ---
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'jerome',
  database: 'internal_facebook',
});

// --- Helper to fetch AI news from Google News RSS ---
async function fetchAINews() {
  try {
    const apiKey = '70a7bc198bf0d7c2a801a3c106f17884'; // GNews API key provided by the user
    const gnewsUrl = `https://gnews.io/api/v4/search?q=artificial+intelligence&lang=en&country=us&max=10&apikey=${apiKey}`;
    const response = await axios.get(gnewsUrl);
    const articles = response.data.articles;
    return articles.map((article, idx) => ({
      id: 'gnews-' + idx,
      title: article.title,
      link: article.url,
      pubDate: article.publishedAt,
      source: article.source.name,
      likes: 0,
      comments: [],
      isExternal: true,
      image: article.image || 'https://via.placeholder.com/150' // Use article image or placeholder
    }));
  } catch (e) {
    console.error('Error fetching AI news:', e);
    return [];
  }
}

// --- API Endpoints ---

// News Feed (AI news + DB news)
app.get('/api/news', async (req, res) => {
  const aiNews = await fetchAINews();
  const [dbNews] = await db.query('SELECT * FROM news');
  dbNews.forEach(n => {
    n.comments = [];
    n.image = n.image || 'https://via.placeholder.com/150'; // Ensure DB news has an image
  });
  const combined = [...aiNews, ...dbNews];
  res.json(combined);
});
app.post('/api/news/like', async (req, res) => {
  const { id } = req.body;
  // Only update likes for DB news
  const [result] = await db.query('UPDATE news SET likes = likes + 1 WHERE id = ?', [id]);
  const [rows] = await db.query('SELECT * FROM news WHERE id = ?', [id]);
  if (rows.length > 0) {
    rows[0].comments = [];
    return res.json(rows[0]);
  }
  // If Google news, likes are not persisted
  res.json({ id, likes: 1 });
});
app.post('/api/news/comment', async (req, res) => {
  // Comments not persisted for DB news in this example
  const { id, comment } = req.body;
  res.json({ id, comments: [comment] });
});


// HR Links (still in-memory, update if you add to DB)
app.get('/api/hr-links', (req, res) => res.json([]));

// Case Management
app.get('/api/cases', async (req, res) => {
const [rows] = await db.query('SELECT * FROM cases');
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  rows.forEach(row => {
    // Ensure created_at is a string for comparison
    let createdAtStr = row.created_at;
    if (row.created_at instanceof Date) {
      createdAtStr = row.created_at.toISOString().slice(0, 10);
    } else if (typeof row.created_at === 'string') {
      createdAtStr = row.created_at.slice(0, 10);
    }
    if (createdAtStr < today) {
      row.status = 'Old';
    }
  });
  res.json(rows);
});
app.post('/api/cases', async (req, res) => {
const { user, department, subject, priority } = req.body;
  // Default values for new case
  const status = 'New';
  const assignedTo = '';
  const sla = '24h';
  const [result] = await db.query(
    'INSERT INTO cases (user, department, status, subject, assignedTo, sla, priority) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user, department, status, subject, assignedTo, sla, priority]
  );
  // Fetch the newly created case (including created_at)
  const [rows] = await db.query('SELECT * FROM cases WHERE id = ?', [result.insertId]);
  res.json(rows[0]);
});
app.patch('/api/cases/:id', async (req, res) => {
  const { status, assignedTo, sla, subject } = req.body;
  await db.query(
    'UPDATE cases SET status = ?, assignedTo = ?, sla = ?, subject = ? WHERE id = ?',
    [status, assignedTo, sla, subject, req.params.id]
  );
  const [rows] = await db.query('SELECT * FROM cases WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
});

// Blogs
app.get('/api/blogs', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM blogs');
  // Convert tags from CSV string to array
  rows.forEach(row => row.tags = row.tags ? row.tags.split(',') : []);
  res.json(rows);
});
app.post('/api/blogs', async (req, res) => {
  const { author, title, content, tags } = req.body;
  const tagsStr = Array.isArray(tags) ? tags.join(',') : '';
  const [result] = await db.query(
    'INSERT INTO blogs (author, title, content, tags, likes) VALUES (?, ?, ?, ?, 0)',
    [author, title, content, tagsStr]
  );
  res.json({ id: result.insertId, author, title, content, tags: tagsStr.split(','), likes: 0 });
});
app.patch('/api/blogs/:id', async (req, res) => {
  const { title, content, tags, likes } = req.body;
  const tagsStr = Array.isArray(tags) ? tags.join(',') : '';
  await db.query(
    'UPDATE blogs SET title = ?, content = ?, tags = ?, likes = ? WHERE id = ?',
    [title, content, tagsStr, likes, req.params.id]
  );
  const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
  rows.forEach(row => row.tags = row.tags ? row.tags.split(',') : []);
  res.json(rows[0]);
});

// Appreciation Wall (MySQL)
app.get('/api/appreciations', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM appreciations');
  res.json(rows);
});
app.post('/api/appreciations', async (req, res) => {
  // Accept both camelCase and snake_case keys from frontend
  const from = req.body.from || req.body.From;
  const to = req.body.to || req.body.To;
  const type = req.body.type || req.body.Type;
  const message = req.body.message || req.body.Message;
  if (!from || !to || !type || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const [result] = await db.query(
    'INSERT INTO appreciations (`from`, `to`, type, message, likes) VALUES (?, ?, ?, ?, 0)',
    [from, to, type, message]
  );
  res.json({ id: result.insertId, from, to, type, message, likes: 0 });
});

// API endpoint to fetch all employees
app.get('/api/employees', async (req, res) => {
  try {
    const [employees] = await db.query('SELECT * FROM employees');
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Added /api/events endpoint
app.get('/api/events', async (req, res) => {
  try {
    const [events] = await db.query('SELECT * FROM events');
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// --- Reactions API ---

// Add or update a reaction for an appreciation post
app.post('/api/appreciations/:id/reactions', async (req, res) => {
  const { id } = req.params; // Appreciation post ID
  const { reactionType, userId } = req.body;

  if (!reactionType || !userId) {
    return res.status(400).json({ error: 'Missing reactionType or userId' });
  }

  try {
    // Check if the user has already reacted to this post
    const [existingReaction] = await db.query(
      'SELECT * FROM reactions WHERE appreciation_id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingReaction.length > 0) {
      // Update the reaction type if it already exists
      await db.query(
        'UPDATE reactions SET reaction_type = ? WHERE id = ?',
        [reactionType, existingReaction[0].id]
      );
    } else {
      // Insert a new reaction
      await db.query(
        'INSERT INTO reactions (appreciation_id, user_id, reaction_type) VALUES (?, ?, ?)',
        [id, userId, reactionType]
      );
    }

    // Fetch the updated list of reactions for the appreciation post
    const [reactions] = await db.query(
      'SELECT reaction_type, COUNT(*) as count FROM reactions WHERE appreciation_id = ? GROUP BY reaction_type',
      [id]
    );

    res.json({ reactions });
  } catch (error) {
    console.error('Error handling reaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test login endpoint (for verification against MySQL Workbench)
app.post('/api/test-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    console.log(`Testing login for email: ${email}`);
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      console.log('No user found with the provided email.');
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Password mismatch.');
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    console.log('Login successful:', user);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error during test login:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
