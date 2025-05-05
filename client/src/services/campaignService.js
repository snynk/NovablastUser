import axios from 'axios';

const API_URL = 'http://localhost:3000/api/campaigns';

/**
 * Create a new campaign
 * @param {Object} campaignData - Campaign data to create
 * @returns {Promise<Object>} Created campaign
 */
export const createCampaign = async (campaignData) => {
  try {
    const response = await axios.post(API_URL, campaignData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create campaign';
  }
};

/**
 * Create a new follow-up campaign
 * @param {Object} followUpData - Follow-up campaign data
 * @returns {Promise<Object>} Created follow-up campaign
 */
export const createFollowUpCampaign = async (followUpData) => {
  try {
    const response = await axios.post(`${API_URL}/follow-up`, followUpData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create follow-up campaign';
  }
};

/**
 * Get all campaigns with optional filtering
 * @param {Object} filters - Optional filters (market, isFollowUp)
 * @returns {Promise<Array>} Array of campaigns
 */
export const getCampaigns = async (filters = {}) => {
  try {
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch campaigns';
  }
};

/**
 * Get parent campaigns (for follow-up selection)
 * @returns {Promise<Array>} Array of parent campaigns
 */
export const getParentCampaigns = async () => {
  try {
    const response = await axios.get(`${API_URL}/parents`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch parent campaigns';
  }
};

/**
 * Get a specific campaign by ID
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} Campaign data
 */
export const getCampaignById = async (campaignId) => {
  try {
    const response = await axios.get(`${API_URL}/${campaignId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch campaign';
  }
};

/**
 * Update a campaign
 * @param {string} campaignId - Campaign ID to update
 * @param {Object} updatedData - Campaign data to update
 * @returns {Promise<Object>} Updated campaign
 */
export const updateCampaign = async (campaignId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${campaignId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update campaign';
  }
};

/**
 * Delete a campaign
 * @param {string} campaignId - Campaign ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteCampaign = async (campaignId) => {
  try {
    const response = await axios.delete(`${API_URL}/${campaignId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete campaign';
  }
};

/**
 * Search campaigns
 * @param {string} query - Search query
 * @param {Object} additionalFilters - Optional additional filters
 * @returns {Promise<Array>} Search results
 */
export const searchCampaigns = async (query, additionalFilters = {}) => {
  try {
    const params = { query, ...additionalFilters };
    const response = await axios.get(`${API_URL}/search`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to search campaigns';
  }
};