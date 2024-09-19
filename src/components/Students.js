import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';
import { Button, TextField, Container, Grid2, Typography, CircularProgress, Card, CardContent } from '@mui/material';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newStudent, setNewStudent] = useState('');
  const [editingStudent, setEditingStudent] = useState(null); // Track the student being edited
  const [editedStudentName, setEditedStudentName] = useState(''); // Track the updated name

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  // Fetch students with pagination
  const fetchStudents = (page) => {
    setLoading(true);
    StudentService.getAllStudents(page, 5)
      .then((response) => {
        setStudents(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setLoading(false);
      });
  };

  // Create a new student
  const createStudent = () => {
    const student = { name: newStudent };
    StudentService.createStudent(student)
      .then(() => {
        setNewStudent(''); // Clear the form
        fetchStudents(page); // Refresh the student list
      })
      .catch((error) => {
        console.error('Error creating student:', error);
      });
  };

  // Delete an student
  const deleteStudent = (id) => {
    StudentService.deleteStudent(id)
      .then(() => {
        fetchStudents(page); // Refresh the student list after deletion
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
  };

  // Start editing an student
  const editStudent = (student) => {
    setEditingStudent(student); // Set the student being edited
    setEditedStudentName(student.name); // Prepopulate the form with the current name
  };

  // Update the student
  const updateStudent = (id) => {
    const updatedStudent = { name: editedStudentName };
    StudentService.updateStudent(id, updatedStudent)
      .then(() => {
        fetchStudents(page); // Refresh the student list after update
        setEditingStudent(null); // Clear the editing state
        setEditedStudentName(''); // Clear the form
      })
      .catch((error) => {
        console.error('Error updating student:', error);
      });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingStudent(null); // Clear the editing state
    setEditedStudentName(''); // Clear the form
  };

  // Handle pagination
  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Students
      </Typography>

      <Grid2 container spacing={2} direction="column">
        <Grid2 item>
          <TextField
            label="Enter Student Name"
            value={newStudent}
            onChange={(e) => setNewStudent(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={createStudent} style={{ marginTop: '10px' }}>
            Add Student
          </Button>
        </Grid2>

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid2 item container spacing={2}>
            {students.map((student) => (
              <Grid2 item xs={12} sm={6} md={4} key={student.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{student.name}</Typography>
                    <Button color="secondary" onClick={() => deleteStudent(student.id)}>
                      Delete
                    </Button>
                    <Button color="primary" onClick={() => editStudent(student)}>
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        )}

        {editingStudent && (
          <Grid2 item>
            <TextField
              label="Edit Student Name"
              value={editedStudentName}
              onChange={(e) => setEditedStudentName(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateStudent(editingStudent.id)}
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

        {/* Pagination Controls */}
        <Grid2 item container justifyContent="space-between" style={{ marginTop: '20px' }}>
          <Button onClick={prevPage} disabled={page === 0}>
            Previous
          </Button>
          <Button onClick={nextPage} disabled={page === totalPages - 1}>
            Next
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Students;
