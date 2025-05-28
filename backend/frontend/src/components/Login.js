import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, Link } from '@mui/material';

function Login({ onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Login failed');
        return;
      }
      // Save user info (including role) to localStorage for role-based access
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login successful!');
      window.location.reload(); // Reload to update app state
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
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} type="email" required />
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