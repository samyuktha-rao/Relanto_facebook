import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Stack, Link } from '@mui/material';

function Signup({ onSwitch }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    try {
      // Default role is 'employee' for signup
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: 'employee' })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Signup failed');
        return;
      }
      alert('Signup successful!');
      if (onSwitch) onSwitch('login');
    } catch (err) {
      setError('Signup failed.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#e9ebee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, minWidth: 340, maxWidth: 400 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1976d2', mb: 2, textAlign: 'center', letterSpacing: 1 }}>Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} type="email" required />
            <TextField label="Password" name="password" value={form.password} onChange={handleChange} type="password" required />
            <TextField label="Confirm Password" name="confirm" value={form.confirm} onChange={handleChange} type="password" required />
            {error && <Typography color="error" fontSize={14}>{error}</Typography>}
            <Button type="submit" variant="contained" sx={{ fontWeight: 700, bgcolor: '#FF5733', color: '#fff', borderRadius: 2, py: 1.2 }}>Sign Up</Button>
          </Stack>
        </form>
        <Typography sx={{ mt: 3, textAlign: 'center', color: '#555' }}>
          Already have an account?{' '}
          <Link href="#" onClick={() => onSwitch('login')} underline="hover" sx={{ color: '#1976d2', fontWeight: 700 }}>Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Signup;