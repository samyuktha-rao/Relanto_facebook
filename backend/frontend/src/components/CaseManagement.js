import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Stack, TextField, MenuItem } from '@mui/material';

function CaseManagement() {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({ user: '', department: '', subject: '', priority: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/cases').then(res => setCases(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/cases', form).then(res => {
      setCases([...cases, res.data]);
      setForm({ user: '', department: '', subject: '', priority: '' });
    });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>HR/IT Case Management</Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="User"
            name="user"
            value={form.user}
            onChange={handleChange}
            required
            sx={{ minWidth: 160, bgcolor: '#f5f5f5', borderRadius: 2 }}
            InputProps={{ style: { color: '#000' } }}
          />
          <TextField
            label="Department"
            name="department"
            select
            value={form.department}
            onChange={handleChange}
            required
            sx={{ minWidth: 160, bgcolor: '#f5f5f5', borderRadius: 2 }}
            InputLabelProps={{ style: { color: '#b0b8c1', fontWeight: 700 } }}
            SelectProps={{
              sx: { color: '#000', fontWeight: 700, backgroundColor: '#f5f5f5' },
              MenuProps: {
                PaperProps: {
                  sx: {
                    bgcolor: '#f5f5f5',
                    color: '#000',
                    fontWeight: 700,
                  },
                },
              },
            }}
            InputProps={{ style: { color: '#000', fontWeight: 700, backgroundColor: '#f5f5f5' } }}
          >
            <MenuItem value="" disabled style={{ color: '#000', fontWeight: 700 }}>Select Department</MenuItem>
            <MenuItem value="HR" style={{ color: '#000', fontWeight: 700 }}>HR</MenuItem>
            <MenuItem value="IT" style={{ color: '#000', fontWeight: 700 }}>IT</MenuItem>
            <MenuItem value="Admin" style={{ color: '#000', fontWeight: 700 }}>Admin</MenuItem>
          </TextField>
          <TextField
            label="Priority"
            name="priority"
            select
            value={form.priority}
            onChange={handleChange}
            required
            sx={{ minWidth: 140, bgcolor: '#f5f5f5', borderRadius: 2 }}
            InputLabelProps={{ style: { color: '#b0b8c1', fontWeight: 700 } }}
            SelectProps={{
              sx: { color: '#000', fontWeight: 700, backgroundColor: '#f5f5f5' },
              MenuProps: {
                PaperProps: {
                  sx: {
                    bgcolor: '#f5f5f5',
                    color: '#000',
                    fontWeight: 700,
                  },
                },
              },
            }}
            InputProps={{ style: { color: '#000', fontWeight: 700, backgroundColor: '#f5f5f5' } }}
          >
            <MenuItem value="" disabled style={{ color: '#000', fontWeight: 700 }}>Select priority</MenuItem>
            <MenuItem value="Low" style={{ color: '#000', fontWeight: 700 }}>Low</MenuItem>
            <MenuItem value="Medium" style={{ color: '#000', fontWeight: 700, backgroundColor: '#ff7043' }}>Medium</MenuItem>
            <MenuItem value="High" style={{ color: '#fff', fontWeight: 700, backgroundColor: '#d32f2f' }}>High</MenuItem>
          </TextField>
          <TextField
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            sx={{ minWidth: 200, bgcolor: '#f5f5f5', borderRadius: 2 }}
            InputProps={{ style: { color: '#000' } }}
          />
          <Button type="submit" variant="contained" sx={{ height: 48, minWidth: 120, fontWeight: 700, borderRadius: 3, bgcolor: '#FF5733', color: '#fff', '&:hover': { bgcolor: '#C70039' } }}>
            Raise Ticket
          </Button>
        </Stack>
      </form>
      <Stack spacing={2}>
        {cases.map(c => (
          <Card key={c.id} sx={{ mb: 2, bgcolor: '#1a2233', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6">{c.subject}</Typography>
              <Typography variant="body2">User: {c.user} | Dept: {c.department} | Priority: {c.priority || 'N/A'} | Status: {c.status}</Typography>
              <Typography variant="body2">Assigned To: {c.assignedTo} | SLA: {c.sla}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </div>
  );
}

export default CaseManagement;
