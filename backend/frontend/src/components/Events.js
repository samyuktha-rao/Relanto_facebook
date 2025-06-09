import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Stack, TextField, Box, Tabs, Tab } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// Example holiday data for India and USA
const holidaysData = {
  India: [
    { date: '2025-01-01', name: 'New Year' },
    { date: '2025-01-14', name: 'Uttarayana Punyakala / Makara Sankranti' },
    { date: '2025-02-26', name: 'Maha Shivaratri' },
    { date: '2025-03-14', name: 'Holi' },
    { date: '2025-03-31', name: 'Ramzan' },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-05-01', name: 'May Day' },
    { date: '2025-06-06', name: 'Bakrid' },
    { date: '2025-08-08', name: 'Varamahalakshmi Vrata' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-08-27', name: 'Ganesh Chaturthi' },
    { date: '2025-10-01', name: 'Ayudha Puja/Mahanavami' },
    { date: '2025-10-02', name: 'Gandhi Jayanthi & Vijayadashami' },
    { date: '2025-10-21', name: 'Diwali' },
    { date: '2025-12-25', name: 'Christmas' },
  ],
  USA: [
    { date: '2025-01-01', name: 'New Year’s Day' },
    { date: '2025-01-20', name: 'Martin Luther King Jr. Day' },
    { date: '2025-02-17', name: 'Presidents’ Day' },
    { date: '2025-05-26', name: 'Memorial Day' },
    { date: '2025-07-04', name: 'Independence Day' },
    { date: '2025-09-01', name: 'Labor Day' },
    { date: '2025-10-13', name: 'Columbus Day' },
    { date: '2025-11-11', name: 'Veterans Day' },
    { date: '2025-11-27', name: 'Thanksgiving Day' },
    { date: '2025-12-25', name: 'Christmas Day' },
  ],
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' });
}

function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', department: '' });
  const [tab, setTab] = useState('India');
  const [showCalendar, setShowCalendar] = useState(null); // null | 'India' | 'USA'
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [open, setOpen] = useState(false);

  // Get user from localStorage
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }, []);

  // Replaced Axios call with static data for events
  useEffect(() => {
    const staticEvents = [
      { id: 1, title: 'Annual Day Celebration', date: '2025-06-15', department: 'HR' },
      { id: 2, title: 'Tech Conference', date: '2025-07-20', department: 'IT' },
      { id: 3, title: 'Health Camp', date: '2025-08-10', department: 'Admin' },
    ];
    setEvents(staticEvents);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleTabChange = (e, newValue) => setTab(newValue);

  const handleSubmit = e => {
    e.preventDefault();
    // Send role with the event creation request for backend validation
    axios.post('http://localhost:5001/api/events', { ...form, role: user?.role }).then(res => {
      setEvents([...events, res.data]);
      setForm({ title: '', date: '', department: '' });
    }).catch(err => {
      if (err.response && err.response.status === 403) {
        alert('Only admins can announce events.');
      }
    });
  };

  const handleCalendarToggle = (region) => {
    const holidays = holidaysData[region].map(h => ({
      title: h.name,
      start: h.date,
      color: region === 'India' ? 'orange' : 'blue',
    }));
    setCalendarEvents(holidays);
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: events.length + 1,
      title: form.title,
      date: form.date,
      department: form.department,
    };
    setEvents([...events, newEvent]);
    setForm({ title: '', date: '', department: '' });
    setOpen(false);
  };

  // --- For pretty calendar like screenshot ---
  const monthColors = {
    'JAN': '#7fd3ed',
    'FEB': '#f7b2c2',
    'MAR': '#ffe6a7',
    'APR': '#b2e7c8',
    'MAY': '#f7d59c',
    'JUN': '#b2c7f7',
    'JUL': '#e0b2f7',
    'AUG': '#e7b2e7',
    'SEP': '#b2f7e7',
    'OCT': '#f7b2b2',
    'NOV': '#b2f7d6',
    'DEC': '#b2d7f7',
  };

  function getMonth(dateStr) {
    return new Date(dateStr).toLocaleString('en-US', { month: 'short' }).toUpperCase();
  }
  function getDay(dateStr) {
    return new Date(dateStr).toLocaleString('en-US', { day: '2-digit' });
  }
  function getWeekday(dateStr) {
    return new Date(dateStr).toLocaleString('en-US', { weekday: 'long' });
  }

  // For demo, mark some as floater
  const floaterDates = [
    '2025-06-06', // Bakrid
    '2025-04-18', // Good Friday
    '2025-10-01', // Ayudha Puja/Mahanavami
  ];

  // Highlight today's date in the calendar
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Event Announcements & Calendar <CalendarMonthIcon sx={{ fontSize: 32, ml: 1, verticalAlign: 'middle' }} /></Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color={showCalendar === 'India' ? 'primary' : 'secondary'}
          sx={{ bgcolor: '#FF5733', color: '#fff' }}
          onClick={() => {
            setShowCalendar(showCalendar === 'India' ? null : 'India');
            handleCalendarToggle('India');
          }}
        >
          India Calendar
        </Button>
        <Button
          variant="contained"
          color={showCalendar === 'USA' ? 'primary' : 'secondary'}
          sx={{ bgcolor: '#FF5733', color: '#fff' }}
          onClick={() => {
            setShowCalendar(showCalendar === 'USA' ? null : 'USA');
            handleCalendarToggle('USA');
          }}
        >
          USA Calendar
        </Button>
      </Stack>
      {showCalendar && (
        <Box sx={{ mt: 4 }}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
          />
        </Box>
      )}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, color: '#fff', fontWeight: 800, letterSpacing: 1 }}>Other Events</Typography>
      {user && user.role === 'admin' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} required sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 140 }} InputProps={{ style: { color: '#142850', fontWeight: 600 } }} />
            <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 120 }} InputProps={{ style: { color: '#142850', fontWeight: 600 } }} />
            <TextField label="Department" name="department" value={form.department} onChange={handleChange} required sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 120 }} InputProps={{ style: { color: '#142850', fontWeight: 600 } }} />
            <Button type="submit" variant="contained" sx={{ height: 48, minWidth: 120, fontWeight: 700, borderRadius: 3, bgcolor: '#FF5733', color: '#fff', '&:hover': { bgcolor: '#C70039' } }}>Announce</Button>
          </Stack>
        </form>
      )}
      <Stack spacing={2}>
        {events.map(event => (
          <Card key={event.id} sx={{ mb: 2, borderRadius: 4, boxShadow: '0 4px 16px 0 rgba(20,40,80,0.10)', bgcolor: '#fff', color: '#142850' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1565c0' }}>{event.title}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#22304a' }}>Date: {event.date}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#22304a' }}>Department: {event.department}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <IconButton
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16, bgcolor: '#FF5733', color: '#fff', borderRadius: '50%', boxShadow: 2 }}
      >
        <AddIcon fontSize="large" />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#1976d2', letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          New Event
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#fff', color: '#222' }}>
          <form id="event-form" onSubmit={handleAddEvent}>
            <Stack spacing={2}>
              <TextField label="Title" name="title" value={form.title} onChange={handleChange} required InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
              <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} required InputLabelProps={{ shrink: true }} InputProps={{ style: { color: '#222' } }} />
              <TextField label="Department" name="department" value={form.department} onChange={handleChange} required InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#fff' }}>
          <Button onClick={() => setOpen(false)} color="secondary" sx={{ color: '#FF5733' }}>Cancel</Button>
          <Button type="submit" form="event-form" variant="contained" sx={{ bgcolor: '#FF5733', color: '#fff', fontWeight: 700 }}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Events;
