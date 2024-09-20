import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';
import CourseService from '../services/CourseService';  // Import Course Service
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Grid, Typography } from '@mui/material';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);  // State for courses
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newStudent, setNewStudent] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('');  // Track course for new student
  const [newStudentError, setNewStudentError] = useState('');  // Error message for new student name
  const [newCourseError, setNewCourseError] = useState('');  // Error message for new student course
  const [editingStudent, setEditingStudent] = useState(null);  // Track the student being edited
  const [editedStudentName, setEditedStudentName] = useState('');  // Track edited student name
  const [editedStudentCourse, setEditedStudentCourse] = useState('');  // Track edited student's course
  const [editStudentNameError, setEditStudentNameError] = useState('');  // Error message for edited student name
  const [editCourseError, setEditCourseError] = useState('');  // Error message for edited student course

  useEffect(() => {
    fetchStudents(page);
    fetchCourses();  // Fetch courses when component loads
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

  // Fetch courses for the dropdown
  const fetchCourses = () => {
    CourseService.getAllCourses(0, 100)
      .then((response) => {
        setCourses(response.data.content);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  };

  // Create a new student with validation
  const createStudent = () => {
    if (!newStudent) {
      setNewStudentError('Student name cannot be empty');  // Set name error
      return;
    }
    if (!newStudentCourse) {
      setNewCourseError('Please select a course');  // Set course error
      return;
    }

    setNewStudentError('');  // Clear name error
    setNewCourseError('');  // Clear course error

    const student = {
      name: newStudent,
      course: { id: newStudentCourse },  // Set selected course
    };

    StudentService.createStudent(student)
      .then((response) => {
        setStudents((prevStudents) => [
          ...prevStudents,
          { ...response.data, course: courses.find(d => d.id === newStudentCourse) },  // Add the newly created student to the local state
        ]);
        setNewStudent('');
        setNewStudentCourse('');
      })
      .catch((error) => {
        console.error('Error creating student:', error);
      });
  };

  // Edit student - pre-fill the form with student data
  const editStudent = (student) => {
    setEditingStudent(student);
    setEditedStudentName(student.name);
    setEditedStudentCourse(student.course?.id || '');  // Pre-select the course
  };

  // Update the student with validation
  const updateStudent = (id) => {
    if (!editedStudentName) {
      setEditStudentNameError('Student name cannot be empty');  // Set name error
      return;
    }
    if (!editedStudentCourse) {
      setEditCourseError('Please select a course');  // Set course error
      return;
    }

    setEditStudentNameError('');  // Clear name error
    setEditCourseError('');  // Clear course error

    const updatedStudent = {
      name: editedStudentName,
      course: { id: editedStudentCourse },  // Set selected course
    };

    StudentService.updateStudent(id, updatedStudent)
      .then((response) => {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === id
              ? { ...response.data, course: courses.find(d => d.id === editedStudentCourse) }
              : student
          )
        );  // Update the student's course in the local state
        setEditingStudent(null);  // Clear the editing state
        setEditedStudentName('');
        setEditedStudentCourse('');
      })
      .catch((error) => {
        console.error('Error updating student:', error);
      });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingStudent(null);  // Clear editing state
    setEditedStudentName('');
    setEditedStudentCourse('');
    setEditStudentNameError('');  // Clear validation error
    setEditCourseError('');  // Clear validation error
  };

  // Delete an student
  const deleteStudent = (id) => {
    StudentService.deleteStudent(id)
      .then(() => {
        setStudents((prevStudents) => prevStudents.filter(student => student.id !== id));  // Remove student from local state
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Students
      </Typography>

      {/* Create student form */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Enter Student Name"
            variant="outlined"
            fullWidth
            value={newStudent}
            onChange={(e) => setNewStudent(e.target.value)}
            error={!!newStudentError}  // Apply error state
            helperText={newStudentError}  // Display error message
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" error={!!newCourseError}>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={newStudentCourse}
              onChange={(e) => setNewStudentCourse(e.target.value)}
              label="Select Course"
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
            {newCourseError && <Typography variant="caption" color="error">{newCourseError}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={createStudent}
          >
            Add Student
          </Button>
        </Grid>
      </Grid>

      {/* Student list */}
      {loading ? (
        <CircularProgress />
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.name} (Course: {student.course?.name || 'None'})
              <Button onClick={() => editStudent(student)}>Edit</Button>
              <Button color="secondary" onClick={() => deleteStudent(student.id)}>Delete</Button>
            </li>
          ))}
        </ul>
      )}

      {/* Edit student form */}
      {editingStudent && (
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <TextField
              label="Edit Student Name"
              variant="outlined"
              fullWidth
              value={editedStudentName}
              onChange={(e) => setEditedStudentName(e.target.value)}
              error={!!editStudentNameError}  // Apply error state
              helperText={editStudentNameError}  // Display error message
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" error={!!editCourseError}>
              <InputLabel>Edit Course</InputLabel>
              <Select
                value={editedStudentCourse}
                onChange={(e) => setEditedStudentCourse(e.target.value)}
                label="Edit Course"
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
              {editCourseError && <Typography variant="caption" color="error">{editCourseError}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => updateStudent(editingStudent.id)}
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

export default Students;
