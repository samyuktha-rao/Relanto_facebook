import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Stack } from '@mui/material';

function Directory() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/employees').then(res => setEmployees(res.data));
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Employee Directory</Typography>
      <Stack spacing={2}>
        {employees.map(emp => (
          <Card key={emp.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{emp.name}</Typography>
              <Typography variant="body2">Department: {emp.department}</Typography>
              <Typography variant="body2">Role: {emp.role}</Typography>
              <Typography variant="body2">Contact: {emp.contact}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </div>
  );
}

export default Directory;
