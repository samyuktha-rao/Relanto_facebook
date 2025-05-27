
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Stack, TextField, Box, Chip, Avatar, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Input } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const placeholderImg = 'https://via.placeholder.com/600x400?text=600+x+400';


function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ author: '', title: '', content: '', tags: '' });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/blogs').then(res => setBlogs(res.data));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const blogData = {
      ...form,
      tags: tagsArr
    };
    axios.post('http://localhost:5000/api/blogs', blogData).then(res => {
      setBlogs([...blogs, res.data]);
      setForm({ author: '', title: '', content: '', tags: '' });
      setOpen(false);
    });
  };

  // Helper: get initials for avatar
  const getInitials = name => name ? name.split(' ').map(w => w[0]).join('').toUpperCase() : '?';

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: '#fff', letterSpacing: 1 }}>Blogs</Typography>
        <IconButton color="primary" onClick={() => setOpen(true)} sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
          <AddIcon fontSize="large" />
        </IconButton>
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#1976d2', letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          New Blog
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#fff', color: '#222' }}>
          <form id="blog-form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Author" name="author" value={form.author} onChange={handleChange} required InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
              <TextField label="Title" name="title" value={form.title} onChange={handleChange} required InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
              <TextField label="Content" name="content" value={form.content} onChange={handleChange} required multiline minRows={3} InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
              <TextField label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#fff' }}>
          <Button onClick={() => setOpen(false)} color="secondary" sx={{ color: '#1976d2' }}>Cancel</Button>
          <Button type="submit" form="blog-form" variant="contained" sx={{ bgcolor: '#142850', color: '#fff', fontWeight: 700 }}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={4}>
        {blogs.map((blog, idx) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(20,40,80,0.10)', bgcolor: '#101a2b', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ width: '100%', height: 180, bgcolor: '#e0e6ef', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <img src={placeholderImg} alt="blog" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px 16px 0 0' }} />
              </Box>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  {/* Editor's Pick example */}
                  {blog.title && blog.title.toLowerCase().includes('future') && (
                    <Chip label="Editor's Pick" color="info" size="small" sx={{ mb: 1, fontWeight: 700, bgcolor: '#00bcd4', color: '#fff' }} />
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>{blog.title}</Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontWeight: 700 }}>{getInitials(blog.author)}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{blog.author}</Typography>
                      <Typography sx={{ color: '#b0b8c1', fontSize: 13 }}>Published on {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : (new Date()).toLocaleDateString()}</Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" sx={{ color: '#b0b8c1', mb: 1, minHeight: 40, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis' }}>{blog.content}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    {blog.tags && blog.tags.map((tag, i) => (
                      <Chip key={i} label={tag} size="small" sx={{ bgcolor: '#142850', color: '#fff', fontWeight: 700, mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Stack>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#00bcd4', fontWeight: 700 }}>Likes: {blog.likes}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BlogSection;
