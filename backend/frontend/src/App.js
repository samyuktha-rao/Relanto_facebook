// Main navigation and page routing for the internal Facebook app
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LinkIcon from '@mui/icons-material/Link';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArticleIcon from '@mui/icons-material/Article';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NewsFeed from './components/NewsFeed';
import HRPortal from './components/HRPortal';
import CaseManagement from './components/CaseManagement';
import BlogSection from './components/BlogSection';
import AppreciationWall from './components/AppreciationWall';
import Chatbot from './components/Chatbot';
import Events from './components/Events';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import img from './pictures/image.png';


// Add a custom theme for vibrant colors
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: { main: '#142850' }, // dark blue
    secondary: { main: '#00a8cc' }, // accent cyan
    background: { default: '#1a2233' },
    text: { primary: '#fff', secondary: '#b0b8c1' },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, Arial',
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(20,40,80,0.25), 0 1.5px 6px 0 rgba(0,168,204,0.10)',
          background: 'linear-gradient(135deg, #1a2233 60%, #142850 100%)',
          color: '#fff',
          transition: 'transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s',
          '&:hover': {
            transform: 'scale3d(1.04,1.04,1.04) rotateY(2deg)',
            boxShadow: '0 16px 48px 0 rgba(0,168,204,0.18), 0 3px 12px 0 rgba(20,40,80,0.18)',
          },
        },
      },
    },
  },
});

const navItems = [
  { text: 'AI News & Trends', to: '/', icon: <NewspaperIcon /> },
  { text: 'HR Portal', to: '/hr', icon: <LinkIcon /> },
  { text: 'Cases', to: '/cases', icon: <AssignmentIcon /> },
  { text: 'Blogs', to: '/blogs', icon: <ArticleIcon /> },
  { text: 'Appreciation', to: '/appreciations', icon: <EmojiEventsIcon /> },
  { text: 'Chatbot', to: '/chatbot', icon: <ChatIcon /> },
  // Directory removed from side menu
  { text: 'Events', to: '/events', icon: <EventIcon /> },
  { text: 'Admin', to: '/admin', icon: <AdminPanelSettingsIcon /> },
];



function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [authPage, setAuthPage] = React.useState('login');
  // Get user from localStorage (if logged in)
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Filter nav items for role-based access
  const filteredNavItems = React.useMemo(() => {
    if (!user) return navItems.filter(item => item.text !== 'Admin');
    if (user.role === 'admin') return navItems;
    return navItems.filter(item => item.text !== 'Admin');
  }, [user]);

  // If not logged in, show login/signup page only
  if (!user) {
    // Import Login and Signup here to avoid duplicate import errors
    const Login = require('./components/Login').default;
    const Signup = require('./components/Signup').default;
    return authPage === 'signup'
      ? <Signup onSwitch={setAuthPage} />
      : <Login onSwitch={setAuthPage} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Drawer
            variant="permanent"
            open={drawerOpen}
            sx={{
              width: 240,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: 240,
                boxSizing: 'border-box',
                bgcolor: '#16213e',
                color: '#fff',
                borderRight: '1px solid #22304a',
                background: 'linear-gradient(180deg, #142850 60%, #27496d 100%)',
                transition: 'box-shadow 0.3s',
              },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '5px', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={img} alt="Relanto Logo" style={{ height: '40px', cursor: 'pointer' }} />
              </div>
            </Toolbar>
            <List sx={{ padding: 0 }}>
              {filteredNavItems.map((item, idx) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.to}
                    selected={activeIndex === idx}
                    onClick={() => setActiveIndex(idx)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      color: activeIndex === idx ? '#00a8cc' : '#fff',
                      background: activeIndex === idx ? 'rgba(0,168,204,0.12)' : '#1a2233',
                      transition: 'background 0.2s, color 0.2s',
                      '&:hover': {
                        background: 'rgba(0,168,204,0.18)',
                        color: '#00a8cc',
                        transform: 'scale(1.04)',
                        boxShadow: '0 2px 8px 0 rgba(0,168,204,0.10)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: activeIndex === idx ? '#00a8cc' : '#b0b8c1', minWidth: 36 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} sx={{ '.MuiTypography-root': { fontWeight: activeIndex === idx ? 700 : 500 } }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, maxWidth: '100vw' }}>
            <AppBar position="static" color="primary" sx={{ boxShadow: 3, mb: 2, borderRadius: 2, bgcolor: '#142850' }}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, color: '#fff' }}>
                  Company Internal Platform
                </Typography>
                {user && (
                  <Typography sx={{ ml: 2, color: '#00e6e6', fontWeight: 700 }}>
                    {user.name} ({user.role})
                  </Typography>
                )}
                {user && (
                  <Button color="inherit" sx={{ ml: 2, fontWeight: 700, bgcolor: '#FF5733', color: '#fff' }} onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}>Logout</Button>
                )}
              </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ bgcolor: '#1a2233', borderRadius: 4, boxShadow: 3, p: { xs: 1, sm: 3 }, minHeight: '80vh', transition: 'box-shadow 0.3s', color: '#fff' }}>
              <Routes>
                <Route path="/" element={<NewsFeed />} />
                <Route path="/hr" element={<HRPortal />} />
                <Route path="/cases" element={<CaseManagement />} />
                <Route path="/blogs" element={<BlogSection />} />
                <Route path="/appreciations" element={<AppreciationWall animated={true} />} />
                <Route path="/chatbot" element={<Chatbot />} />
                {/* Directory route removed from main navigation */}
                <Route path="/events" element={<Events />} />
                {/* Only allow /admin route for admin users */}
                {user && user.role === 'admin' && <Route path="/admin" element={<AdminPanel />} />}
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
