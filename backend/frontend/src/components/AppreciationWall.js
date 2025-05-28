import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Stack, TextField, Box, Chip, Fade, Tooltip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const appreciationColors = [
  '#6C63FF', '#FF6584', '#43E6FC', '#FFD166', '#7CFFB2', '#FFB347', '#FF6F91', '#845EC2'
];

function AppreciationWall({ animated }) {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({ from: '', to: '', type: '', message: '' });
  const [showAnim, setShowAnim] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/appreciations').then(res => {
      const updatedData = res.data.map(app => ({
        ...app,
        reactions: app.reactions || { clap: [], heart: [], thumbsUp: [] },
      }));
      setApps(updatedData);
      setShowAnim(updatedData.map(() => false));
      if (animated) {
        // Animate each card in sequence
        updatedData.forEach((_, i) => setTimeout(() => setShowAnim(sa => sa.map((v, idx) => idx === i ? true : v)), 200 * i));
      } else {
        setShowAnim(updatedData.map(() => true));
      }
    });
  }, [animated]);

  useEffect(() => {
    // Assuming the logged-in user's name is stored in localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setForm(prevForm => ({ ...prevForm, from: loggedInUser.name }));
    }
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // Ensure correct keys for backend
    const payload = {
      from: form.from,
      to: form.to,
      type: form.type,
      message: form.message
    };
    axios.post('http://localhost:5000/api/appreciations', payload).then(res => {
      setApps([...apps, res.data]);
      setShowAnim(sa => [...sa, true]);
      setForm({ from: '', to: '', type: '', message: '' });
    });
  };

  const handleReaction = (id, reactionType) => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      alert('You must be logged in to react.');
      return;
    }

    axios.post(`http://localhost:5000/api/appreciations/${id}/reactions`, {
      reactionType,
      userId: loggedInUser.id,
    })
      .then(res => {
        setApps(apps.map(app => app.id === id ? { ...app, reactions: res.data.reactions } : app));
      })
      .catch(err => console.error('Error updating reactions:', err));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{color: '#fff', fontWeight: 800, letterSpacing: 1 }}>
        Appreciation Wall <EmojiEventsIcon sx={{ color: 'secondary.main', fontSize: 36, ml: 1, verticalAlign: 'middle' }} />
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <TextField
            label="From"
            name="from"
            value={form.from}
            onChange={handleChange}
            required
            sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 120 }}
            InputProps={{ style: { color: '#000', fontWeight: 600 }, readOnly: true }}
            InputLabelProps={{ style: { color: '#000' } }}
          />
          <TextField
            label="To"
            name="to"
            value={form.to}
            onChange={handleChange}
            required
            sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 120 }}
            InputProps={{ style: { color: '#000', fontWeight: 600 } }}
            InputLabelProps={{ style: { color: '#000' } }}
          />
          <TextField
            label="Type (Kudos, Thank You, Great Job)"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 180 }}
            InputProps={{ style: { color: '#000', fontWeight: 600 } }}
            InputLabelProps={{ style: { color: '#000' } }}
          />
          <TextField
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 220 }}
            InputProps={{ style: { color: '#000', fontWeight: 600 } }}
            InputLabelProps={{ style: { color: '#000' } }}
          />
          <Button type="submit" variant="contained" color="secondary" sx={{ boxShadow: 2, bgcolor: '#FF5733', color: '#fff' }}>
            Appreciate
          </Button>
        </Stack>
      </form>
      <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap">
        {apps.map((app, i) => (
          <Fade in={showAnim[i]} timeout={600 + i * 100} key={app.id}>
            <Card
              sx={{
                minWidth: 280,
                maxWidth: 340,
                m: 1,
                background: `linear-gradient(135deg, ${appreciationColors[i % appreciationColors.length]}22 0%, #fff 100%)`,
                border: `2.5px solid ${appreciationColors[i % appreciationColors.length]}`,
                boxShadow: '0 8px 32px 0 rgba(108,99,255,0.15), 0 1.5px 6px 0 rgba(255,101,132,0.10)',
                transform: 'perspective(800px) rotateY(-6deg) scale(1)',
                transition: 'transform 0.4s cubic-bezier(.25,.8,.25,1), box-shadow 0.4s',
                '&:hover': {
                  transform: 'perspective(800px) rotateY(6deg) scale(1.04)',
                  boxShadow: '0 16px 48px 0 rgba(108,99,255,0.25), 0 3px 12px 0 rgba(255,101,132,0.18)',
                },
                position: 'relative',
                overflow: 'visible',
              }}
              elevation={6}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EmojiEventsIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{app.type}</Typography>
                  <Chip label={`From: ${app.from}`} color="primary" size="small" />
                  <Chip label={`To: ${app.to}`} color="secondary" size="small" />
                </Stack>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 500, color: '#333', fontSize: 18, letterSpacing: 0.5 }}>
                  {app.message}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Likes: {app.likes}</Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  {['clap', 'heart', 'thumbsUp'].map(reactionType => (
                    <Tooltip
                      key={reactionType}
                      title={
                        (app.reactions?.[reactionType] || []).length > 0
                          ? (app.reactions[reactionType] || []).map(user => user.name).join(', ')
                          : 'Be the first to react!'
                      }
                      arrow
                    >
                      <Button
                        variant="text"
                        startIcon={
                          reactionType === 'clap' ? <span role="img" aria-label="clap">👏</span> :
                          reactionType === 'heart' ? <span role="img" aria-label="heart">❤️</span> :
                          <span role="img" aria-label="thumbs up">👍</span>
                        }
                        sx={{ color: reactionType === 'clap' ? '#6C63FF' : reactionType === 'heart' ? '#FF6584' : '#43E6FC', fontWeight: 700 }}
                        onClick={() => handleReaction(app.id, reactionType)}
                      >
                        {reactionType.charAt(0).toUpperCase() + reactionType.slice(1)}
                      </Button>
                    </Tooltip>
                  ))}
                </Box>
              </CardContent>
              <Box sx={{
                position: 'absolute',
                top: -18,
                right: -18,
                width: 36,
                height: 36,
                background: `radial-gradient(circle, ${appreciationColors[i % appreciationColors.length]} 60%, #fff 100%)`,
                borderRadius: '50%',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 18,
                color: '#fff',
                zIndex: 2,
                animation: animated ? `pop 0.7s cubic-bezier(.25,.8,.25,1) ${0.1 * i}s` : 'none',
                '@keyframes pop': {
                  '0%': { transform: 'scale(0.5)', opacity: 0 },
                  '60%': { transform: 'scale(1.2)', opacity: 1 },
                  '100%': { transform: 'scale(1)', opacity: 1 },
                },
              }}>
                <EmojiEventsIcon sx={{ fontSize: 22 }} />
              </Box>
            </Card>
          </Fade>
        ))}
      </Stack>
    </Box>
  );
}

export default AppreciationWall;
