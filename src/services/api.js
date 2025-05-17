import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');
// Add registerUser, getUsers, updateUser, deleteUser if needed for admin management

// Classrooms
export const getClassrooms = () => api.get('/classrooms');
export const getClassroomById = (id) => api.get(`/classrooms/${id}`);
export const createClassroom = (data) => api.post('/classrooms', data);
export const updateClassroom = (id, data) => api.put(`/classrooms/${id}`, data);
export const deleteClassroom = (id) => api.delete(`/classrooms/${id}`);

// Computers
export const getComputers = (params) => api.get('/computers', { params }); // e.g., params = { classroomId: '...' }
export const getComputerById = (id) => api.get(`/computers/${id}`);
export const createComputer = (data) => api.post('/computers', data);
export const updateComputer = (id, data) => api.put(`/computers/${id}`, data);
export const deleteComputer = (id) => api.delete(`/computers/${id}`);
export const getComputersByClassroom = (classroomId) => api.get(`/classrooms/${classroomId}/computers`);


// Issues
export const getIssues = (params) => api.get('/issues', { params });
export const getIssueById = (id) => api.get(`/issues/${id}`);
// createIssue for admin might be different if it doesn't involve photos or direct reporting
// export const createIssueAdmin = (data) => api.post('/issues/admin', data); // Example
export const updateIssue = (id, data) => api.put(`/issues/${id}`, data);
export const deleteIssue = (id) => api.delete(`/issues/${id}`);
export const getIssuesByComputer = (computerId) => api.get(`/computers/${computerId}/issues`);


export default api;