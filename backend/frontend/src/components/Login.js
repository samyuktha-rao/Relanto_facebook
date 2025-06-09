import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, Link } from '@mui/material';

function Login({ onSwitch }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Login failed');
        return;
      }
      localStorage.setItem('employee', JSON.stringify(data.employee));
      alert('Login successful!');
      window.location.reload();
    } catch (err) {
      setError('Login failed.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#e9ebee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, minWidth: 340, maxWidth: 380 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1976d2', mb: 2, textAlign: 'center', letterSpacing: 1 }}>Log In</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Username" name="username" value={form.username} onChange={handleChange} type="text" required />
            <TextField label="Password" name="password" value={form.password} onChange={handleChange} type="password" required />
            {error && <Typography color="error" fontSize={14}>{error}</Typography>}
            <Button type="submit" variant="contained" sx={{ fontWeight: 700, bgcolor: '#FF5733', color: '#fff', borderRadius: 2, py: 1.2 }}>Log In</Button>
          </Stack>
        </form>
        <Typography sx={{ mt: 3, textAlign: 'center', color: '#555' }}>
          Don't have an account?{' '}
          <Link href="#" onClick={() => onSwitch('signup')} underline="hover" sx={{ color: '#1976d2', fontWeight: 700 }}>Sign up</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;