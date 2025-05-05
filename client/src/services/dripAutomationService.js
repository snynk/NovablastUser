import axios from 'axios';

// API base URL - make sure this matches your backend route
const API_URL = 'http://localhost:3000/api/drip-automations';

/**
 * Service for handling drip automation API requests
 */
export const dripAutomationService = {
  /**
   * Get all drip automations
   * @returns {Promise<Object>} Response with data array
   */
  getAllDripAutomations: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch drip automations';
    }
  },

  /**
   * Get a specific drip automation by ID
   * @param {string} id - Drip automation ID
   * @returns {Promise<Object>} Drip automation data
   */
  getDripAutomation: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch drip automation';
    }
  },

  /**
   * Create a new drip automation
   * @param {Object} automationData - Drip automation data
   * @returns {Promise<Object>} Created drip automation
   */
  createDripAutomation: async (automationData) => {
    try {
      const response = await axios.post(API_URL, automationData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to create drip automation';
    }
  },

  /**
   * Update a drip automation
   * @param {string} id - Drip automation ID to update
   * @param {Object} updatedData - Updated drip automation data
   * @returns {Promise<Object>} Updated drip automation
   */
  updateDripAutomation: async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to update drip automation';
    }
  },

  /**
   * Delete a drip automation
   * @param {string} id - Drip automation ID to delete
   * @returns {Promise<Object>} Deletion result
   */
  deleteDripAutomation: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to delete drip automation';
    }
  },

  /**
   * Search drip automations
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  searchDripAutomations: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/search`, { params: { query } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to search drip automations';
    }
  }
};