
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Stack, 
  TextField, 
  Box, 
  Paper,
  CircularProgress,
  IconButton,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion('');
    setIsLoading(true);

    // Add user question immediately
    setChatHistory(prev => [...prev, { type: 'user', text: userQuestion }]);

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot', { question: userQuestion });
      setChatHistory(prev => [...prev, { type: 'bot', text: res.data.answer }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        text: 'I apologize, but I encountered an error. Please try asking your question again.',
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box sx={{ 
      height: '90vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#0a1a2b',
      p: 3,
      borderRadius: 2
    }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#fff', fontWeight: 700 }}>
        IT Support & Company Policy Assistant
      </Typography>
      
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        mb: 2,
        p: 2,
        bgcolor: 'rgba(255,255,255,0.05)',
        borderRadius: 2
      }}>
        {chatHistory.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: '#b0b8c1'
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Welcome to Relanto's Virtual Assistant
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              I can help you with questions about company policies, IT support, and more.
              <br />Feel free to ask me anything!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {chatHistory.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: msg.type === 'user' ? '#00e6e6' : 'rgba(255,255,255,0.1)',
                    color: msg.type === 'user' ? '#0a1a2b' : '#fff',
                    borderRadius: 2,
                    ...(msg.isError && {
                      bgcolor: 'rgba(255,0,0,0.1)',
                      borderLeft: '4px solid #ff4444'
                    })
                  }}
                >
                  <Typography variant="body1">
                    {msg.text}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        )}
      </Box>

      <Paper 
        component="form" 
        onSubmit={handleAsk}
        sx={{ 
          p: 2, 
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          display: 'flex',
          gap: 2
        }}
      >
        <TextField
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
          disabled={isLoading}
          multiline
          maxRows={4}
          sx={{
            '& .MuiInputBase-input': {
              color: '#fff',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#00e6e6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00e6e6',
              },
            },
          }}
        />
        <IconButton 
          type="submit" 
          disabled={isLoading || !question.trim()} 
          sx={{ 
            bgcolor: '#00e6e6',
            color: '#0a1a2b',
            '&:hover': { bgcolor: '#00bcd4' },
            '&.Mui-disabled': {
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
}

export default Chatbot;
