import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, Stack, Fade, CardMedia, CardContent } from '@mui/material';

function NewsFeed() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/news').then(res => {
      setNews(res.data);
    });
  }, []);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', mb: 3, letterSpacing: 1 }}>
        AI News & Trends
      </Typography>
      <Grid container spacing={3}>
        {news.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Fade in={true}>
              <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(20,40,80,0.10)', bgcolor: '#22304a', color: '#fff', mb: 2 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image || 'https://via.placeholder.com/150'}
                  alt={item.title || 'News Image'}
                />
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#fff',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseOver={e => (e.currentTarget.style.color = '#00a8cc')}
                      onMouseOut={e => (e.currentTarget.style.color = '#fff')}
                    >
                      {item.title || 'News Link'}
                    </a>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ color: '#ccc' }}>
                    {item.description || 'No description available.'}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default NewsFeed;
