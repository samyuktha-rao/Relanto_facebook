import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, Fade, CardMedia, CardContent, Button } from '@mui/material';

function NewsFeed() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          'https://gnews.io/api/v4/search',
          {
            params: {
              q: 'artificial intelligence',
              token: '864ff606135c105450fa12730cede7dd',
              lang: 'en',
            },
          }
        );
        setNews(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, textAlign: 'center', letterSpacing: 1 }}>
        News on: Artificial Intelligence
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, textAlign: 'center', color: '#aaa' }}>
        Stay updated with headlines, fetched via GNews.io API.
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {news.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Fade in={true} timeout={500}>
              <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)', bgcolor: '#1e1e1e', color: '#fff', mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image || 'https://via.placeholder.com/300x180'}
                  alt={item.title || 'News Image'}
                  sx={{ objectFit: 'cover', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                />
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#1e88e5',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseOver={e => (e.currentTarget.style.color = '#00a8cc')}
                      onMouseOut={e => (e.currentTarget.style.color = '#1e88e5')}
                    >
                      {item.title || 'News Link'}
                    </a>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ color: '#ccc', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }}>
                    {item.description || 'No description available.'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888', mt: 1, display: 'block' }}>
                    Source: {item.source.name} | Published: {new Date(item.publishedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button variant="contained" sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#C70039' } }} href={item.url} target="_blank" rel="noopener noreferrer">
                    Read More
                  </Button>
                </Box>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default NewsFeed;
