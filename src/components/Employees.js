import React, { useState, useEffect } from 'react';
import EmployeeService from '../services/EmployeeService';
import DepartmentService from '../services/DepartmentService';  // Import Department Service
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Grid, Typography } from '@mui/material';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);  // State for departments
  const [loading, setLoading] = useState(true);
  const [newEmployee, setNewEmployee] = useState('');
  const [newEmployeeDepartment, setNewEmployeeDepartment] = useState('');  // Track department for new employee
  const [newEmployeeError, setNewEmployeeError] = useState('');  // Error message for new employee name
  const [newDepartmentError, setNewDepartmentError] = useState('');  // Error message for new employee department
  const [editingEmployee, setEditingEmployee] = useState(null);  // Track the employee being edited
  const [editedEmployeeName, setEditedEmployeeName] = useState('');  // Track edited employee name
  const [editedEmployeeDepartment, setEditedEmployeeDepartment] = useState('');  // Track edited employee's department
  const [editEmployeeNameError, setEditEmployeeNameError] = useState('');  // Error message for edited employee name
  const [editDepartmentError, setEditDepartmentError] = useState('');  // Error message for edited employee department

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Fetch employees with pagination
  const fetchEmployees = () => {
    setLoading(true);
    EmployeeService.getAllEmployees(0, 1000)
      .then((response) => {
        setEmployees(response.data.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        setLoading(false);
      });
  };

  // Fetch departments for the dropdown
  const fetchDepartments = () => {
    DepartmentService.getAllDepartments(0, 100)
      .then((response) => {
        setDepartments(response.data.content);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
      });
  };

  // Create a new employee with validation
  const createEmployee = () => {
    if (!newEmployee) {
      setNewEmployeeError('Employee name cannot be empty');  // Set name error
      return;
    }
    if (!newEmployeeDepartment) {
      setNewDepartmentError('Please select a department');  // Set department error
      return;
    }

    setNewEmployeeError('');  // Clear name error
    setNewDepartmentError('');  // Clear department error

    const employee = {
      name: newEmployee,
      department: { id: newEmployeeDepartment },  // Set selected department
    };

    EmployeeService.createEmployee(employee)
      .then((response) => {
        setEmployees((prevEmployees) => [
          ...prevEmployees,
          { ...response.data, department: departments.find(d => d.id === newEmployeeDepartment) },  // Add the newly created employee to the local state
        ]);
        setNewEmployee('');
        setNewEmployeeDepartment('');
      })
      .catch((error) => {
        console.error('Error creating employee:', error);
      });
  };

  // Edit employee - pre-fill the form with employee data
  const editEmployee = (employee) => {
    setEditingEmployee(employee);
    setEditedEmployeeName(employee.name);
    setEditedEmployeeDepartment(employee.department?.id || '');  // Pre-select the department
  };

  // Update the employee with validation
  const updateEmployee = (id) => {
    if (!editedEmployeeName) {
      setEditEmployeeNameError('Employee name cannot be empty');  // Set name error
      return;
    }
    if (!editedEmployeeDepartment) {
      setEditDepartmentError('Please select a department');  // Set department error
      return;
    }

    setEditEmployeeNameError('');  // Clear name error
    setEditDepartmentError('');  // Clear department error

    const updatedEmployee = {
      name: editedEmployeeName,
      department: { id: editedEmployeeDepartment },  // Set selected department
    };

    EmployeeService.updateEmployee(id, updatedEmployee)
      .then((response) => {
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === id
              ? { ...response.data, department: departments.find(d => d.id === editedEmployeeDepartment) }
              : employee
          )
        );  // Update the employee's department in the local state
        setEditingEmployee(null);  // Clear the editing state
        setEditedEmployeeName('');
        setEditedEmployeeDepartment('');
      })
      .catch((error) => {
        console.error('Error updating employee:', error);
      });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingEmployee(null);  // Clear editing state
    setEditedEmployeeName('');
    setEditedEmployeeDepartment('');
    setEditEmployeeNameError('');  // Clear validation error
    setEditDepartmentError('');  // Clear validation error
  };

  // Delete an employee
  const deleteEmployee = (id) => {
    EmployeeService.deleteEmployee(id)
      .then(() => {
        setEmployees((prevEmployees) => prevEmployees.filter(employee => employee.id !== id));  // Remove employee from local state
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
      });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Employees
      </Typography>

      {/* Create employee form */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Enter Employee Name"
            variant="outlined"
            fullWidth
            value={newEmployee}
            onChange={(e) => setNewEmployee(e.target.value)}
            error={!!newEmployeeError}  // Apply error state
            helperText={newEmployeeError}  // Display error message
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" error={!!newDepartmentError}>
            <InputLabel>Select Department</InputLabel>
            <Select
              value={newEmployeeDepartment}
              onChange={(e) => setNewEmployeeDepartment(e.target.value)}
              label="Select Department"
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
            {newDepartmentError && <Typography variant="caption" color="error">{newDepartmentError}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={createEmployee}
          >
            Add Employee
          </Button>
        </Grid>
      </Grid>

      {/* Employee list */}
      {loading ? (
        <CircularProgress />
      ) : (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              {employee.name} (Department: {employee.department?.name || 'None'})
              <Button onClick={() => editEmployee(employee)}>Edit</Button>
              <Button color="secondary" onClick={() => deleteEmployee(employee.id)}>Delete</Button>
            </li>
          ))}
        </ul>
      )}

      {/* Edit employee form */}
      {editingEmployee && (
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <TextField
              label="Edit Employee Name"
              variant="outlined"
              fullWidth
              value={editedEmployeeName}
              onChange={(e) => setEditedEmployeeName(e.target.value)}
              error={!!editEmployeeNameError}  // Apply error state
              helperText={editEmployeeNameError}  // Display error message
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" error={!!editDepartmentError}>
              <InputLabel>Edit Department</InputLabel>
              <Select
                value={editedEmployeeDepartment}
                onChange={(e) => setEditedEmployeeDepartment(e.target.value)}
                label="Edit Department"
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
              {editDepartmentError && <Typography variant="caption" color="error">{editDepartmentError}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => updateEmployee(editingEmployee.id)}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={cancelEdit}
              style={{ marginTop: '10px' }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Employees;
