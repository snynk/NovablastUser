import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fetch all markets - Using the campaign controller's getMarkets endpoint
export const getMarkets = async () => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/markets`);
    return response.data;
  } catch (error) {
    console.error('Error fetching markets:', error);
    throw error;
  }
};

// Create new campaign
export const createCampaign = async (campaignData) => {
  try {
    const response = await axios.post(`${API_URL}/campaigns`, campaignData);
    return response.data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

// Create follow-up campaign
export const createFollowUpCampaign = async (campaignData) => {
  try {
    const response = await axios.post(`${API_URL}/campaigns/follow-up`, campaignData);
    return response.data;
  } catch (error) {
    console.error('Error creating follow-up campaign:', error);
    throw error;
  }
};

// Get all campaigns
export const getCampaigns = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/campaigns`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

// Get parent campaigns for follow-up creation
export const getParentCampaigns = async () => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/parents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching parent campaigns:', error);
    throw error;
  }
};

// Get campaign by ID
export const getCampaignById = async (campaignId) => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching campaign ${campaignId}:`, error);
    throw error;
  }
};

// Update campaign
export const updateCampaign = async (campaignId, campaignData) => {
  try {
    const response = await axios.put(`${API_URL}/campaigns/${campaignId}`, campaignData);
    return response.data;
  } catch (error) {
    console.error(`Error updating campaign ${campaignId}:`, error);
    throw error;
  }
};

// Delete campaign
export const deleteCampaign = async (campaignId) => {
  try {
    const response = await axios.delete(`${API_URL}/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting campaign ${campaignId}:`, error);
    throw error;
  }
};

// Search campaigns
export const searchCampaigns = async (query, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/search`, { 
      params: { query, ...filters } 
    });
    return response.data;
  } catch (error) {
    console.error('Error searching campaigns:', error);
    throw error;
  }
};

// Get all contact lists
export const getContactLists = async () => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/contact-lists`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contact lists:', error);
    throw error;
  }
};

// Get phone numbers from a specific contact list
export const getContactListPhoneNumbers = async (sampleName) => {
  try {
    const response = await axios.get(`${API_URL}/campaigns/contact-lists/${sampleName}/phones`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching phone numbers for ${sampleName}:`, error);
    throw error;
  }
};