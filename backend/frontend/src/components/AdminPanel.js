import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Stack, Card, CardContent } from '@mui/material';

function AdminPanel() {
  const [data, setData] = useState({ news: [], hrLinks: [], cases: [], blogs: [], appreciations: [], employees: [], events: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin').then(res => setData(res.data));
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>
      <Typography variant="h6">Users</Typography>
      <Stack spacing={1}>{data.employees.map(e => <Card key={e.id}><CardContent>{e.name} - {e.role}</CardContent></Card>)}</Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>Blogs (Moderation)</Typography>
      <Stack spacing={1}>{data.blogs.map(b => <Card key={b.id}><CardContent>{b.title} by {b.author}</CardContent></Card>)}</Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>Appreciations</Typography>
      <Stack spacing={1}>{data.appreciations.map(a => <Card key={a.id}><CardContent>{a.type}: {a.message}</CardContent></Card>)}</Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>Cases</Typography>
      <Stack spacing={1}>{data.cases.map(c => <Card key={c.id}><CardContent>{c.subject} ({c.status})</CardContent></Card>)}</Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>HR Links</Typography>
      <Stack spacing={1}>{data.hrLinks.map(l => <Card key={l.id}><CardContent>{l.name}</CardContent></Card>)}</Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>News</Typography>
      <Stack spacing={1}>{data.news.map(n => <Card key={n.id}><CardContent>{n.title}</CardContent></Card>)}</Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>Events</Typography>
      <Stack spacing={1}>{data.events.map(ev => <Card key={ev.id}><CardContent>{ev.title}</CardContent></Card>)}</Stack>
    </div>
  );
}

export default AdminPanel;
