import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Stack, Modal, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const hrLinks = [
  {
    id: 1,
    name: 'Payroll System',
    desc: 'Access your payslips and tax information.',
    icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#00e6e6' }} />, url: '#',
    btn: 'Access Payroll System',
  },
  {
    id: 2,
    name: 'Leave Management',
    desc: 'Apply for leave and track your balance.',
    icon: <CalendarMonthIcon sx={{ fontSize: 40, color: '#00e6e6' }} />, 
    url: 'https://relanto.keka.com/#/me/leave/summary',
    btn: 'Access Leave Management',
  },
  {
    id: 3,
    name: 'HRMS Portal',
    desc: 'Update personal details and access HR policies.',
    icon: <BadgeIcon sx={{ fontSize: 40, color: '#00e6e6' }} />, url: '#',
    btn: 'Access HRMS Portal',
  },
  // Directory removed as per requirements
  {
    id: 5,
    name: 'Document Center',
    desc: 'Access company policies and forms.',
    icon: <DescriptionIcon sx={{ fontSize: 40, color: '#00e6e6' }} />, url: '#',
    btn: 'Access Document Center',
  },  {
    id: 6,
    name: 'IT Support',
    desc: 'Get help with IT issues and company policies.',
    icon: <SupportAgentIcon sx={{ fontSize: 40, color: '#00e6e6' }} />, 
    url: '/chatbot',
    btn: 'Access IT Support',
  },
];

const documents = [
  {
    name: 'Insurance Policy 24-25',
    path: 'http://localhost:5000/files/Relanto - Insurance Policy_24-25.pdf'
  },
  {
    name: 'Employee Handbook Jan 24',
    path: 'http://localhost:5000/files/Relanto Employee Handbook Jan 24 _ V 1.2 (1).pdf'
  },
  {
    name: 'Work From Home (WFH) Policy',
    path: 'http://localhost:5000/files/Relanto- Work From Home (WFH) Policy_Apr 24.pdf'
  }
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#0a1a2b',
  border: '2px solid #00e6e6',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  color: '#fff'
};

function HRPortal() {
  const [openDocuments, setOpenDocuments] = useState(false);

  const handleOpenDocuments = () => setOpenDocuments(true);
  const handleCloseDocuments = () => setOpenDocuments(false);

  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', mb: 1, letterSpacing: 1 }}>
        Quick Access HR Portal
      </Typography>
      <Typography variant="h6" sx={{ color: '#b0b8c1', mb: 4, fontWeight: 400 }}>
        Your one-stop dashboard for frequently accessed HR and administrative tools.
      </Typography>
      <Grid container spacing={4}>
        {hrLinks.map(link => (
          <Grid item xs={12} sm={6} md={4} key={link.id}>
            <Card sx={{ bgcolor: '#0a1a2b', color: '#fff', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(20,40,80,0.10)', p: 2, minHeight: 210, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  {link.icon}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>{link.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#b0b8c1', fontWeight: 400 }}>{link.desc}</Typography>
                  </Box>
                </Stack>
                <Button 
                  onClick={link.name === 'Document Center' ? handleOpenDocuments : undefined}
                  href={link.name === 'Document Center' ? undefined : link.url} 
                  variant="contained" 
                  sx={{ mt: 2, bgcolor: '#00e6e6', color: '#0a1a2b', fontWeight: 700, borderRadius: 2, boxShadow: 2, '&:hover': { bgcolor: '#00bcd4' } }}
                >
                  {link.btn}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={openDocuments}
        onClose={handleCloseDocuments}
        aria-labelledby="documents-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="documents-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Company Documents
          </Typography>
          <List>
            {documents.map((doc, index) => (
              <ListItem key={index} sx={{ 
                p: 2, 
                mb: 1, 
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}>
                <ListItemIcon>
                  <PictureAsPdfIcon sx={{ color: '#00e6e6' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={doc.name} 
                  sx={{ color: '#fff' }}
                />
                <Button
                  href={doc.path}
                  target="_blank"
                  variant="contained"
                  size="small"
                  sx={{ 
                    bgcolor: '#00e6e6',
                    color: '#0a1a2b',
                    '&:hover': { bgcolor: '#00bcd4' }
                  }}
                >
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </Box>
  );
}

export default HRPortal;
