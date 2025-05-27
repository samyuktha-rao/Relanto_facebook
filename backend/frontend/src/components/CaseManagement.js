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
            sx={{ minWidth: 160, bgcolor: '#fff', borderRadius: 2 }}
            InputProps={{ style: { color: '#142850' } }}
          />
          <TextField
            label="Department"
            name="department"
            select
            value={form.department}
            onChange={handleChange}
            required
            sx={{ minWidth: 160, bgcolor: '#fff', borderRadius: 2 }}
            InputLabelProps={{ style: { color: '#142850', fontWeight: 700 } }}
            SelectProps={{
              sx: { color: '#142850', fontWeight: 700, backgroundColor: '#fff' },
              MenuProps: {
                PaperProps: {
                  sx: {
                    bgcolor: '#fff',
                    color: '#142850',
                    fontWeight: 700,
                  },
                },
              },
            }}
            InputProps={{ style: { color: '#142850', fontWeight: 700, backgroundColor: '#fff' } }}
          >
            <MenuItem value="" disabled style={{ color: '#142850', fontWeight: 700 }}>Select Department</MenuItem>
            <MenuItem value="HR" style={{ color: '#142850', fontWeight: 700 }}>HR</MenuItem>
            <MenuItem value="IT" style={{ color: '#142850', fontWeight: 700 }}>IT</MenuItem>
            <MenuItem value="Admin" style={{ color: '#142850', fontWeight: 700 }}>Admin</MenuItem>
          </TextField>
          <TextField
            label="Priority"
            name="priority"
            select
            value={form.priority}
            onChange={handleChange}
            required
            sx={{ minWidth: 140, bgcolor: '#fff', borderRadius: 2 }}
            InputLabelProps={{ style: { color: '#142850', fontWeight: 700 } }}
            SelectProps={{
              sx: { color: '#142850', fontWeight: 700, backgroundColor: '#fff' },
              MenuProps: {
                PaperProps: {
                  sx: {
                    bgcolor: '#fff',
                    color: '#142850',
                    fontWeight: 700,
                  },
                },
              },
            }}
            InputProps={{ style: { color: '#142850', fontWeight: 700, backgroundColor: '#fff' } }}
          >
            <MenuItem value="" disabled style={{ color: '#142850', fontWeight: 700 }}>Select priority</MenuItem>
            <MenuItem value="Low" style={{ color: '#142850', fontWeight: 700 }}>Low</MenuItem>
            <MenuItem value="Medium" style={{ color: '#142850', fontWeight: 700, backgroundColor: '#ff7043', color: '#fff' }}>Medium</MenuItem>
            <MenuItem value="High" style={{ color: '#fff', fontWeight: 700, backgroundColor: '#d32f2f' }}>High</MenuItem>
          </TextField>
          <TextField
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            sx={{ minWidth: 200, bgcolor: '#fff', borderRadius: 2 }}
            InputProps={{ style: { color: '#142850' } }}
          />
          <Button type="submit" variant="contained" sx={{ height: 48, minWidth: 120, fontWeight: 700, borderRadius: 3, bgcolor: '#1565c0', color: '#fff', '&:hover': { bgcolor: '#00a8cc' } }}>
            Raise Ticket
          </Button>
        </Stack>
      </form>
      <Stack spacing={2}>
        {cases.map(c => (
          <Card key={c.id} sx={{ mb: 2 }}>
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
