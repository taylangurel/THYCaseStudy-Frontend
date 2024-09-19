import axios from 'axios';

const API_URL = 'http://localhost:8080/api/employees';

class EmployeeService {
  // Fetch all employees (paginated)
  getAllEmployees(page, size) {
    const token = localStorage.getItem('token');
    return axios
      .get(`${API_URL}?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          window.location.href = '/login'; // Redirect to login if unauthorized
        }
        throw error; // Re-throw error for further handling
      });
  }

  // Create a new employee
  createEmployee(employee) {
    const token = localStorage.getItem('token');
    return axios
      .post(API_URL, employee, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          window.location.href = '/login'; // Redirect to login if unauthorized
        }
        throw error; // Re-throw error for further handling
      });
  }

  // Update an existing employee
  updateEmployee(id, employee) {
    const token = localStorage.getItem('token');
    return axios
      .put(`${API_URL}/${id}`, employee, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          window.location.href = '/login'; // Redirect to login if unauthorized
        }
        throw error; // Re-throw error for further handling
      });
  }

  // Delete an employee
  deleteEmployee(id) {
    const token = localStorage.getItem('token');
    return axios
      .delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          window.location.href = '/login'; // Redirect to login if unauthorized
        }
        throw error; // Re-throw error for further handling
      });
  }
}

export default new EmployeeService();
