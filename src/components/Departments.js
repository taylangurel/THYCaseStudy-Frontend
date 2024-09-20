import React, { useState, useEffect } from 'react';
import DepartmentService from '../services/DepartmentService';
import { Button, TextField, Card, CardContent, CardActions, Typography, Grid2, CircularProgress, Container } from '@mui/material';

const Departments = () => {
  const [loading, setLoading] = useState(true);
  const [newDepartment, setNewDepartment] = useState('');
  const [newDepartmentError, setNewDepartmentError] = useState('');  // For validation
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editedDepartmentName, setEditedDepartmentName] = useState('');
  const [editedDepartmentError, setEditedDepartmentError] = useState('');  // For validation
  const [searchTerm, setSearchTerm] = useState('');  // State to store the search term
  const [allDepartments, setAllDepartments] = useState([]);

  //The empty array [] passed as the second argument means that this useEffect will only run once, when the component is mounted
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    setLoading(true);
    DepartmentService.getAllDepartments(0, 1000)  // Fetch the first page with 1000 data inside it
      .then((response) => {
        setAllDepartments(response.data.content);  // Store all departments for searching
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
        setLoading(false);
      });
  };

  const createDepartment = () => {
    if (!newDepartment) {
      setNewDepartmentError('Department name cannot be empty');  // Show error
      return;
    }
    setNewDepartmentError('');  // Clear the error when valid

    const department = { name: newDepartment };
    DepartmentService.createDepartment(department)
      .then(() => {
        setNewDepartment('');
        fetchDepartments();
      })
      .catch((error) => {
        console.error('Error creating department:', error);
      });
  };

  const editDepartment = (department) => {
    setEditingDepartment(department);
    setEditedDepartmentName(department.name);
  };

  const updateDepartment = (id) => {
    if (!editedDepartmentName) {
      setEditedDepartmentError('Department name cannot be empty');  // Show error
      return;
    }
    setEditedDepartmentError('');  // Clear the error when valid

    const updatedDepartment = { name: editedDepartmentName };
    DepartmentService.updateDepartment(id, updatedDepartment)
      .then(() => {
        fetchDepartments();
        setEditingDepartment(null);
        setEditedDepartmentName('');
      })
      .catch((error) => {
        console.error('Error updating department:', error);
      });
  };

  const cancelEdit = () => {
    setEditingDepartment(null);
    setEditedDepartmentName('');
    setEditedDepartmentError('');  // Clear validation error
  };

  const deleteDepartment = (id) => {
    DepartmentService.deleteDepartment(id)
      .then(() => {
        fetchDepartments();
      })
      .catch((error) => {
        console.error('Error deleting department:', error);
      });
  };

  // Filter departments based on the search term
  const filteredDepartments = allDepartments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Departments
      </Typography>

      {/* Search field for departments */}
      <TextField
        label="Search Departments"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  // Update search term
        style={{ marginBottom: '20px' }}
      />

      {/* Create department form */}
      <Grid2 container spacing={2} direction="column">
        <Grid2 item>
          <TextField
            label="Enter Department Name"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            variant="outlined"
            fullWidth
            error={!!newDepartmentError}  // Apply error state to the text field
            helperText={newDepartmentError}  // Display error message
          />
          <Button
            variant="contained"
            color="primary"
            onClick={createDepartment}
            style={{ marginTop: '10px' }}
          >
            Add Department
          </Button>
        </Grid2>

        {/* List of departments */}
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid2 container spacing={2}>
            {filteredDepartments.map((department) => (
              <Grid2 item xs={12} sm={6} md={4} key={department.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{department.name}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button color="secondary" onClick={() => deleteDepartment(department.id)}>
                      Delete
                    </Button>
                    <Button color="primary" onClick={() => editDepartment(department)}>
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        )}

        {/* Edit department form */}
        {editingDepartment && (
          <Grid2 item>
            <TextField
              label="Edit Department Name"
              value={editedDepartmentName}
              onChange={(e) => setEditedDepartmentName(e.target.value)}
              variant="outlined"
              fullWidth
              error={!!editedDepartmentError}  // Apply error state to the text field
              helperText={editedDepartmentError}  // Display error message
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateDepartment(editingDepartment.id)}
              style={{ marginTop: '10px' }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={cancelEdit}
              style={{ marginTop: '10px', marginLeft: '10px' }}
            >
              Cancel
            </Button>
          </Grid2>
        )}
      </Grid2>
    </Container>
  );
};

export default Departments;
