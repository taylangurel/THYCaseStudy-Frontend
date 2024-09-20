import React, { useState, useEffect } from 'react';
import CourseService from '../services/CourseService';
import { Button, TextField, Card, CardContent, CardActions, Typography, Grid2, CircularProgress, Container } from '@mui/material';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newCourse, setNewCourse] = useState('');
  const [newCourseError, setNewCourseError] = useState('');  // For validation
  const [editingCourse, setEditingCourse] = useState(null);
  const [editedCourseName, setEditedCourseName] = useState('');
  const [editedCourseError, setEditedCourseError] = useState('');  // For validation
  const [searchTerm, setSearchTerm] = useState('');  // Add search term state

  useEffect(() => {
    fetchCourses(page);
  }, [page]);

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

  const createCourse = () => {
    if (!newCourse) {
      setNewCourseError('Course name cannot be empty');  // Show error
      return;
    }
    setNewCourseError('');  // Clear the error when valid

    const course = { name: newCourse };
    CourseService.createCourse(course)
      .then(() => {
        setNewCourse('');
        fetchCourses(page);
      })
      .catch((error) => {
        console.error('Error creating course:', error);
      });
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setEditedCourseName(course.name);
  };

  const updateCourse = (id) => {
    if (!editedCourseName) {
      setEditedCourseError('Course name cannot be empty');  // Show error
      return;
    }
    setEditedCourseError('');  // Clear the error when valid

    const updatedCourse = { name: editedCourseName };
    CourseService.updateCourse(id, updatedCourse)
      .then(() => {
        fetchCourses(page);
        setEditingCourse(null);
        setEditedCourseName('');
      })
      .catch((error) => {
        console.error('Error updating course:', error);
      });
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setEditedCourseName('');
    setEditedCourseError('');  // Clear validation error
  };

  const deleteCourse = (id) => {
    CourseService.deleteCourse(id)
      .then(() => {
        fetchCourses(page);
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
      });
  };

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

  // Dynamic filtering for search
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Courses
      </Typography>

      {/* Search field for courses */}
      <TextField
        label="Search Courses"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  // Update search term as user types
        style={{ marginBottom: '20px' }}
      />

      {/* Create course form */}
      <Grid2 container spacing={2} direction="column">
        <Grid2 item>
          <TextField
            label="Enter Course Name"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            variant="outlined"
            fullWidth
            error={!!newCourseError}  // Apply error state to the text field
            helperText={newCourseError}  // Display error message
          />
          <Button
            variant="contained"
            color="primary"
            onClick={createCourse}
            style={{ marginTop: '10px' }}
          >
            Add Course
          </Button>
        </Grid2>

        {/* List of courses */}
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid2 container spacing={2}>
            {filteredCourses.map((course) => (  // Use filteredCourses for dynamic search
              <Grid2 item xs={12} sm={6} md={4} key={course.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{course.name}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button color="secondary" onClick={() => deleteCourse(course.id)}>
                      Delete
                    </Button>
                    <Button color="primary" onClick={() => editCourse(course)}>
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        )}

        {/* Edit course form */}
        {editingCourse && (
          <Grid2 item>
            <TextField
              label="Edit Course Name"
              value={editedCourseName}
              onChange={(e) => setEditedCourseName(e.target.value)}
              variant="outlined"
              fullWidth
              error={!!editedCourseError}  // Apply error state to the text field
              helperText={editedCourseError}  // Display error message
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
