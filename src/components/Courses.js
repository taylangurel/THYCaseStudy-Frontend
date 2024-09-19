import React, { useState, useEffect } from 'react';
import CourseService from '../services/CourseService';
import { Button, TextField, Container, Grid2, Typography, CircularProgress, Card, CardContent } from '@mui/material';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newCourse, setNewCourse] = useState('');
  const [editingCourse, setEditingCourse] = useState(null); // Track the course being edited
  const [editedCourseName, setEditedCourseName] = useState(''); // Track the updated name

  useEffect(() => {
    fetchCourses(page);
  }, [page]);

  // Fetch courses with pagination
  const fetchCourses = (page) => {
    setLoading(true);
    CourseService.getAllCourses(page, 5)
      .then((response) => {
        setCourses(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });
  };

  // Create a new course
  const createCourse = () => {
    const course = { name: newCourse };
    CourseService.createCourse(course)
      .then(() => {
        setNewCourse(''); // Clear the form
        fetchCourses(page); // Refresh the course list
      })
      .catch((error) => {
        console.error('Error creating course:', error);
      });
  };

  // Delete a course
  const deleteCourse = (id) => {
    CourseService.deleteCourse(id)
      .then(() => {
        fetchCourses(page); // Refresh the course list after deletion
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
      });
  };

  // Start editing a course
  const editCourse = (course) => {
    setEditingCourse(course); // Set the course being edited
    setEditedCourseName(course.name); // Prepopulate the form with the current name
  };

  // Update the course
  const updateCourse = (id) => {
    const updatedCourse = { name: editedCourseName };
    CourseService.updateCourse(id, updatedCourse)
      .then(() => {
        fetchCourses(page); // Refresh the course list after update
        setEditingCourse(null); // Clear the editing state
        setEditedCourseName(''); // Clear the form
      })
      .catch((error) => {
        console.error('Error updating course:', error);
      });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingCourse(null); // Clear the editing state
    setEditedCourseName(''); // Clear the form
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
        Courses
      </Typography>

      <Grid2 container spacing={2} direction="column">
        <Grid2 item>
          <TextField
            label="Enter Course Name"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={createCourse} style={{ marginTop: '10px' }}>
            Add Course
          </Button>
        </Grid2>

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid2 item container spacing={2}>
            {courses.map((course) => (
              <Grid2 item xs={12} sm={6} md={4} key={course.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{course.name}</Typography>
                    <Button color="secondary" onClick={() => deleteCourse(course.id)}>
                      Delete
                    </Button>
                    <Button color="primary" onClick={() => editCourse(course)}>
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        )}

        {editingCourse && (
          <Grid2 item>
            <TextField
              label="Edit Course Name"
              value={editedCourseName}
              onChange={(e) => setEditedCourseName(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateCourse(editingCourse.id)}
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

export default Courses;
