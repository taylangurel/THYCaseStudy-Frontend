import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Button, Toolbar, Typography, Box } from '@mui/material';

const Sidebar = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const showMainLinks = () => {
    setSelectedSection(null);  // Reset to show the main links
  };

  const showDepartmentsAndEmployees = () => {
    setSelectedSection('departments-employees');
  };

  const showCoursesAndStudents = () => {
    setSelectedSection('courses-students');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6">Dashboard</Typography>
      </Toolbar>

      <Box sx={{ overflow: 'auto' }}>
        <List>
          {/* Conditional Rendering of Links Based on Selected Section */}
          {!selectedSection && (
            <>
              <ListItem button onClick={showDepartmentsAndEmployees}>
                <ListItemText primary="Departments and Employees" />
              </ListItem>
              <ListItem button onClick={showCoursesAndStudents}>
                <ListItemText primary="Courses and Students" />
              </ListItem>
            </>
          )}

          {selectedSection === 'departments-employees' && (
            <>
              <ListItem button component={Link} to="/departments">
                <ListItemText primary="Departments" />
              </ListItem>
              <ListItem button component={Link} to="/employees">
                <ListItemText primary="Employees" />
              </ListItem>
              <ListItem>
                <Button variant="contained" onClick={showMainLinks}>
                  Back
                </Button>
              </ListItem>
            </>
          )}

          {selectedSection === 'courses-students' && (
            <>
              <ListItem button component={Link} to="/courses">
                <ListItemText primary="Courses" />
              </ListItem>
              <ListItem button component={Link} to="/students">
                <ListItemText primary="Students" />
              </ListItem>
              <ListItem>
                <Button variant="contained" onClick={showMainLinks}>
                  Back
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
