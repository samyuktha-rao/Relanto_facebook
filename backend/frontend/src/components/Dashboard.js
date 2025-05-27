import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Stack } from '@mui/material';

function Dashboard() {
  const [data, setData] = useState({ recentBlogs: [], openCases: [], appreciations: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard').then(res => setData(res.data));
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>User Dashboard</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Recent Blogs</Typography>
      <Stack spacing={1}>
        {data.recentBlogs.map(blog => (
          <Card key={blog.id}><CardContent><Typography>{blog.title}</Typography></CardContent></Card>
        ))}
      </Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>Open Cases</Typography>
      <Stack spacing={1}>
        {data.openCases.map(c => (
          <Card key={c.id}><CardContent><Typography>{c.subject} ({c.status})</Typography></CardContent></Card>
        ))}
      </Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>Recent Appreciations</Typography>
      <Stack spacing={1}>
        {data.appreciations.map(a => (
          <Card key={a.id}><CardContent><Typography>{a.type}: {a.message}</Typography></CardContent></Card>
        ))}
      </Stack>
    </div>
  );
}

export default Dashboard;
