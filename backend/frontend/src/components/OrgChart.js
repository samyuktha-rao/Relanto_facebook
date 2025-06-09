import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import OrgChart from '@balkangraph/orgchart.js';

// Set the Axios base URL to connect to the backend server
axios.defaults.baseURL = 'http://localhost:5001';

function OrgChartPage() {
  const [orgChartData, setOrgChartData] = useState([]);

  useEffect(() => {
    // Fetch employee data from the backend
    axios.get('/api/employees')
      .then(response => {
        // Format data into hierarchical structure
        const formattedData = response.data.map(employee => ({
          id: employee.id,
          name: employee.full_name,
          title: employee.designation,
          department: employee.department,
          pid: employee.reports_to, // Use reports_to for hierarchy
        }));
        setOrgChartData(formattedData);

        // Initialize OrgChart after data is fetched
        const chart = new OrgChart(document.getElementById('orgchart'), {
          nodes: formattedData,
          nodeBinding: {
            field_0: 'name',
            field_1: 'title',
            field_2: 'department',
          },
          enableDragDrop: false, // Disable drag and drop to prevent editing the flow or employee information
          scaleInitial: 1, // Disable zooming by setting initial scale
          zoom: true, // Enable zooming
          scroll: true, // Enable scrolling
        });

        // Add zoom controls
        const zoomControls = document.createElement('div');
        zoomControls.style.position = 'absolute';
        zoomControls.style.top = '10px';
        zoomControls.style.right = '10px';
        zoomControls.style.zIndex = '1000';
        zoomControls.innerHTML = `
          <button id="zoomIn" style="margin-right: 5px;">Zoom In</button>
          <button id="zoomOut">Zoom Out</button>
        `;
        document.getElementById('orgchart').appendChild(zoomControls);

        document.getElementById('zoomIn').addEventListener('click', () => chart.zoomIn());
        document.getElementById('zoomOut').addEventListener('click', () => chart.zoomOut());
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Organization Chart</Typography>
      <div id="orgchart" style={{ height: '600px', width: '100%', overflow: 'scroll' }}></div>
    </Box>
  );
}

export default OrgChartPage;
