import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Stack, TextField, MenuItem, Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

function CaseManagement() {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({ user: '', department: '', subject: '', priority: '' });
  const [filter, setFilter] = useState({ user: '', department: '', priority: '', subject: '' });
  const [tickets, setTickets] = useState([
    { id: 1, user: 'Alice Johnson', department: 'IT', priority: 'High', subject: 'Laptop not booting', status: 'Old', assignedTo: 'Bob Smith', sla: '24h' },
    { id: 2, user: 'Bob Smith', department: 'HR', priority: 'Medium', subject: 'Payroll issue', status: 'Old', assignedTo: 'David Kim', sla: '48h' },
    { id: 3, user: 'Catherine Lee', department: 'Admin', priority: 'Low', subject: 'Office chair broken', status: 'Old', assignedTo: 'John Doe', sla: '72h' },
  ]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5001/api/cases').then(res => setCases(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFilterChange = e => setFilter({ ...filter, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5001/api/cases', form).then(res => {
      setCases([...cases, res.data]);
      setForm({ user: '', department: '', subject: '', priority: '' });
      setOpen(false);
    });
  };

  const handleFilter = () => {
    const filteredTickets = tickets.filter(ticket => {
      return (
        (!filter.user || ticket.user.toLowerCase().includes(filter.user.toLowerCase())) &&
        (!filter.department || ticket.department.toLowerCase().includes(filter.department.toLowerCase())) &&
        (!filter.priority || ticket.priority.toLowerCase().includes(filter.priority.toLowerCase())) &&
        (!filter.subject || ticket.subject.toLowerCase().includes(filter.subject.toLowerCase()))
      );
    });
    setTickets(filteredTickets);
  };

  const handleAddTicket = () => {
    const newTicket = {
      id: tickets.length + 1,
      user: 'New User',
      department: 'New Department',
      priority: 'New Priority',
      subject: 'New Subject',
      status: 'New',
      assignedTo: 'New Assignee',
      sla: 'New SLA',
    };
    setTickets([...tickets, newTicket]);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>HR/IT Case Management</Typography>
      <Stack direction="row" spacing={2} style={{ marginBottom: 24 }}>
        <TextField label="User" name="user" value={filter.user} onChange={handleFilterChange} sx={{ minWidth: 160, bgcolor: '#f5f5f5', borderRadius: 2 }} />
        <TextField label="Department" name="department" value={filter.department} onChange={handleFilterChange} sx={{ minWidth: 160, bgcolor: '#f5f5f5', borderRadius: 2 }} />
        <TextField label="Priority" name="priority" value={filter.priority} onChange={handleFilterChange} sx={{ minWidth: 140, bgcolor: '#f5f5f5', borderRadius: 2 }} />
        <TextField label="Subject" name="subject" value={filter.subject} onChange={handleFilterChange} sx={{ minWidth: 200, bgcolor: '#f5f5f5', borderRadius: 2 }} />
        <Button variant="contained" onClick={handleFilter} sx={{ height: 48, minWidth: 120, fontWeight: 700, borderRadius: 3, bgcolor: '#28a745', color: '#fff', '&:hover': { bgcolor: '#218838' } }}>
          Filter
        </Button>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ height: 48, minWidth: 120, fontWeight: 700, borderRadius: 3, bgcolor: '#007bff', color: '#fff', '&:hover': { bgcolor: '#0069d9' } }}>
          +
        </Button>
      </Stack>
      <Stack spacing={2}>
        {tickets.map(ticket => (
          <Card key={ticket.id} sx={{ mb: 2, bgcolor: '#1a2233', color: '#fff' }}>
            <CardContent>
              <Typography variant="h6">{ticket.subject}</Typography>
              <Typography variant="body2">User: {ticket.user} | Dept: {ticket.department} | Priority: {ticket.priority} | Status: {ticket.status}</Typography>
              <Typography variant="body2">Assigned To: {ticket.assignedTo} | SLA: {ticket.sla}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#1976d2', letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Raise Ticket
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#fff', color: '#222' }}>
          <form id="ticket-form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="User" name="user" value={form.user} onChange={handleChange} required InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
              <TextField label="Department" name="department" value={form.department} onChange={handleChange} required InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
              <TextField label="Priority" name="priority" value={form.priority} onChange={handleChange} required InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
              <TextField label="Subject" name="subject" value={form.subject} onChange={handleChange} required InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#fff' }}>
          <Button onClick={() => setOpen(false)} color="secondary" sx={{ color: '#FF5733' }}>Cancel</Button>
          <Button type="submit" form="ticket-form" variant="contained" sx={{ bgcolor: '#FF5733', color: '#fff', fontWeight: 700 }}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CaseManagement;
