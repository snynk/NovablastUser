import axios from 'axios';

const API_URL = 'http://localhost:3000/api/templates';

/**
 * Create a new template
 * @param {Object} templateData - Template data to create
 * @returns {Promise<Object>} Created template
 */
export const createTemplate = async (templateData) => {
  try {
    const response = await axios.post(API_URL, templateData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create template';
  }
};

/**
 * Get all templates with optional filtering
 * @param {Object} filters - Optional filters (templateType, etc.)
 * @returns {Promise<Array>} Array of templates
 */
export const getTemplates = async (filters = {}) => {
  try {
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch templates';
  }
};

/**
 * Get a specific template by ID
 * @param {string} templateId - Template ID
 * @returns {Promise<Object>} Template data
 */
export const getTemplateById = async (templateId) => {
  try {
    const response = await axios.get(`${API_URL}/${templateId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch template';
  }
};

/**
 * Update a template
 * @param {string} templateId - Template ID to update
 * @param {Object} updatedData - Template data to update
 * @returns {Promise<Object>} Updated template
 */
export const updateTemplate = async (templateId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${templateId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update template';
  }
};

/**
 * Delete a template
 * @param {string} templateId - Template ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteTemplate = async (templateId) => {
  try {
    const response = await axios.delete(`${API_URL}/${templateId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete template';
  }
};

/**
 * Search templates
 * @param {string} query - Search query
 * @param {string} templateType - Optional template type filter
 * @returns {Promise<Array>} Search results
 */
export const searchTemplates = async (query, templateType = null) => {
  try {
    const params = { query };
    if (templateType) params.templateType = templateType;
    const response = await axios.get(`${API_URL}/search`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to search templates';
  }
};