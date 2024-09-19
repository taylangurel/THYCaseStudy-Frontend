import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, Container } from '@mui/material'; //Material UI
import Departments from './components/Departments';
import Employees from './components/Employees';
import Courses from './components/Courses';
import Students from './components/Students';
import Login from './components/Login';

const drawerWidth = 240;

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* Top AppBar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Company Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {/* Sidebar Links */}
              <ListItem button component={Link} to="/departments">
                <ListItemText primary="Departments" />
              </ListItem>
              <ListItem button component={Link} to="/employees">
                <ListItemText primary="Employees" />
              </ListItem>
              <ListItem button component={Link} to="/courses">
                <ListItemText primary="Courses" />
              </ListItem>
              <ListItem button component={Link} to="/students">
                <ListItemText primary="Students" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container>
            <Routes>
              <Route path="/departments" element={<Departments />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/students" element={<Students />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
