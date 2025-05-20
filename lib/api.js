const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_URL = 'https://user-management-backend-oyqa.onrender.com';
/**
 * Handles API responses with complete error protection
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed response data
 * @throws {Error} Custom error with status and details
 */
const handleResponse = async (response) => {
  // Handle empty responses (204 No Content)
  if (response.status === 204) return null;

  // First safely read response as text
  let responseText;
  try {
    responseText = await response.text();
  } catch (error) {
    console.error('Failed to read response:', error);
    throw new Error(`Failed to process server response (status ${response.status})`);
  }

  // Try to parse as JSON if possible
  let jsonData;
  if (responseText) {
    try {
      jsonData = JSON.parse(responseText);
    } catch (error) {
      // Response isn't JSON - use text as error message
      const err = new Error(responseText || `Request failed (status ${response.status})`);
      err.status = response.status;
      throw err;
    }
  }

  // Handle error responses
  if (!response.ok) {
    const error = new Error(
      jsonData?.message || 
      jsonData?.error || 
      response.statusText || 
      `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = jsonData;
    throw error;
  }

  return jsonData;
};

/**
 * Gets authorization headers with JWT token
 * @returns {Object} Headers object with authorization
 */
const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }

  return headers;
};

/**
 * Main API client with all user management functions
 */
const api = {
  async getUsers(page = 1, limit = 10) {
    const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return {
      users: data?.data?.users || [],
      pagination: data?.pagination || {
        total: 0,
        page,
        limit,
        pages: 0
      }
    };
  },

  async getUser(id) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: getAuthHeaders()
      });
      const data = await handleResponse(response);
      return data?.data?.user || null;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },

  // Authentication
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      const data = await handleResponse(response);
      
      if (data.token) {
        try {
          localStorage.setItem('token', data.token);
          if (data.data?.user) {
            localStorage.setItem('user', JSON.stringify(data.data.user));
          }
        } catch (error) {
          console.error('Failed to store auth data:', error);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  },

  async validateToken() {
    try {
      const response = await fetch(`${API_URL}/auth/validate`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Token validation failed:', error);
      throw error;
    }
  }
};

export const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
  validateToken
} = api;

export default api;
