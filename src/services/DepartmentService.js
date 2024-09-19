import axios from 'axios';

const API_URL = 'http://localhost:8080/api/departments';

class DepartmentService {
  // Fetch all departments (paginated)
  getAllDepartments(page, size) {
    const token = localStorage.getItem('token');
    return axios
      .get(`${API_URL}?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          window.location.href = '/login'; // Redirect to login if unauthorized
        }
        throw error; // Re-throw error to handle it in the calling component if needed
      });
  }

  // Create a new department
  createDepartment(department) {
    const token = localStorage.getItem('token');
    return axios
      .post(API_URL, department, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          window.location.href = '/login'; // Redirect to login if unauthorized
        }
        throw error; // Re-throw error to handle it in the calling component if needed
      });
  }

  // Update an existing department
  updateDepartment(id, department) {
    const token = localStorage.getItem('token');
    return axios
      .put(`${API_URL}/${id}`, department, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          window.location.href = '/login'; // Redirect to login if unauthorized
        }
        throw error; // Re-throw error to handle it in the calling component if needed
      });
  }

  // Delete a department
  deleteDepartment(id) {
    const token = localStorage.getItem('token');
    return axios
      .delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          window.location.href = '/login'; // Redirect to login if unauthorized
        }
        throw error; // Re-throw error to handle it in the calling component if needed
      });
  }
}

export default new DepartmentService();
