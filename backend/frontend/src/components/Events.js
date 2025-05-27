import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Stack, TextField, Box, Tabs, Tab } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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

  // Get user from localStorage
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events').then(res => setEvents(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleTabChange = (e, newValue) => setTab(newValue);

  const handleSubmit = e => {
    e.preventDefault();
    // Send role with the event creation request for backend validation
    axios.post('http://localhost:5000/api/events', { ...form, role: user?.role }).then(res => {
      setEvents([...events, res.data]);
      setForm({ title: '', date: '', department: '' });
    }).catch(err => {
      if (err.response && err.response.status === 403) {
        alert('Only admins can announce events.');
      }
    });
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Event Announcements & Calendar <CalendarMonthIcon sx={{ fontSize: 32, ml: 1, verticalAlign: 'middle' }} /></Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color={showCalendar === 'India' ? 'primary' : 'secondary'}
          sx={{ fontWeight: 700, borderRadius: 3, px: 3, fontSize: 16 }}
          onClick={() => setShowCalendar(showCalendar === 'India' ? null : 'India')}
        >
          India Calendar
        </Button>
        <Button
          variant="contained"
          color={showCalendar === 'USA' ? 'primary' : 'secondary'}
          sx={{ fontWeight: 700, borderRadius: 3, px: 3, fontSize: 16 }}
          onClick={() => setShowCalendar(showCalendar === 'USA' ? null : 'USA')}
        >
          USA Calendar
        </Button>
      </Stack>
      {showCalendar && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(30,40,60,0.18)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Box sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            p: { xs: 2, sm: 4 },
            minWidth: { xs: '90vw', sm: 540 },
            maxWidth: { xs: '98vw', sm: 900 },
            width: { xs: '98vw', sm: '70vw', md: '60vw', lg: '50vw' },
            maxHeight: { xs: '90vh', sm: '90vh' },
            overflowY: 'auto',
            boxShadow: '0 8px 32px 0 rgba(20,40,80,0.18)',
            border: '1.5px solid #e0e6ef',
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 4,
          }}>
            <Box sx={{ position: 'absolute', top: 18, right: 18, cursor: 'pointer', color: '#888', fontWeight: 900, fontSize: 28, zIndex: 10 }} onClick={() => setShowCalendar(null)}>
              ×
            </Box>
            <Box sx={{ flex: 1, minWidth: 180 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#22304a', letterSpacing: 1 }}>Holidays</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#888', mb: 2 }}>{showCalendar} <span style={{ fontWeight: 400, fontSize: 18, marginLeft: 8 }}>2025</span></Typography>
              <Stack spacing={1}>
                {holidaysData[showCalendar].map((h, idx) => (
                  <Stack key={idx} direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Box sx={{
                      minWidth: 54,
                      height: 54,
                      bgcolor: monthColors[getMonth(h.date)] || '#e0e6ef',
                      color: '#22304a',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 16,
                      mr: 2,
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.07)',
                    }}>
                      <Box sx={{ fontSize: 13, fontWeight: 700 }}>{getMonth(h.date)}</Box>
                      <Box sx={{ fontSize: 22, fontWeight: 900 }}>{getDay(h.date)}</Box>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#22304a', fontSize: 17 }}>{h.name}</Typography>
                      <Typography sx={{ fontWeight: 400, color: '#888', fontSize: 15 }}>{getWeekday(h.date)}</Typography>
                    </Box>
                    {floaterDates.includes(h.date) && (
                      <Box sx={{ ml: 2, px: 1.5, py: 0.5, bgcolor: '#e5dfcf', color: '#7a6f4d', borderRadius: 1, fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
                        FLOATER
                      </Box>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      )}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, color: '#fff', fontWeight: 800, letterSpacing: 1 }}>Other Events</Typography>
      {user && user.role === 'admin' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} required sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 140 }} InputProps={{ style: { color: '#142850', fontWeight: 600 } }} />
            <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} required sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 120 }} InputProps={{ style: { color: '#142850', fontWeight: 600 } }} />
            <TextField label="Department" name="department" value={form.department} onChange={handleChange} required sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 120 }} InputProps={{ style: { color: '#142850', fontWeight: 600 } }} />
            <Button type="submit" variant="contained" sx={{ height: 48, minWidth: 120, fontWeight: 700, borderRadius: 3, bgcolor: '#1565c0', color: '#fff', '&:hover': { bgcolor: '#00a8cc' } }}>Announce</Button>
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
    </Box>
  );
}

export default Events;
