import axios from 'axios';

const API_URL = 'http://localhost:3000/api/batches';

/**
 * Create a new batch
 * @param {Object} batchData - Batch data to create
 * @returns {Promise<Object>} Created batch
 */
export const createBatch = async (batchData) => {
  try {
    const response = await axios.post(API_URL, batchData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create batch';
  }
};

/**
 * Get all batches
 * @returns {Promise<Array>} Array of batches
 */
export const getAllBatches = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch batches';
  }
};

/**
 * Get a specific batch by ID
 * @param {string} batchId - Batch ID
 * @returns {Promise<Object>} Batch data
 */
export const getBatchById = async (batchId) => {
  try {
    const response = await axios.get(`${API_URL}/${batchId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch batch';
  }
};

/**
 * Get batches by campaign ID
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Array>} Array of batches
 */
export const getBatchesByCampaign = async (campaignId) => {
  try {
    const response = await axios.get(`${API_URL}/campaign/${campaignId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch campaign batches';
  }
};

/**
 * Update batch status
 * @param {string} batchId - Batch ID to update
 * @param {string} status - New status value
 * @returns {Promise<Object>} Updated batch
 */
export const updateBatchStatus = async (batchId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${batchId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update batch status';
  }
};

/**
 * Update batch details
 * @param {string} batchId - Batch ID to update
 * @param {Object} updatedData - Batch data to update
 * @returns {Promise<Object>} Updated batch
 */
export const updateBatch = async (batchId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${batchId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update batch';
  }
};

/**
 * Delete a batch
 * @param {string} batchId - Batch ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteBatch = async (batchId) => {
  try {
    const response = await axios.delete(`${API_URL}/${batchId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete batch';
  }
};

/**
 * Get all campaigns for batch creation
 * This method is needed for the BatchBuilderModal component
 * @returns {Promise<Array>} Array of campaigns
 */
export const getAllCampaigns = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/campaigns');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch campaigns';
  }
};

/**
 * Get all message templates
 * @returns {Promise<Array>} Array of templates
 */
export const getAllTemplates = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/templates');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch templates';
  }
};

/**
 * Get templates by type
 * @param {string} type - Template type (Residential or Commercial)
 * @returns {Promise<Array>} Array of templates
 */
export const getTemplatesByType = async (type) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/templates/type/${type}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch templates by type';
  }
};

/**
 * Get template messages by template ID
 * @param {string} templateId - Template ID
 * @returns {Promise<Array>} Array of template messages
 */
export const getTemplateMessages = async (templateId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/templates/${templateId}/messages`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch template messages';
  }
};

/**
 * Get contact count for a specific contact list
 * @param {string} contactListId - Contact list ID or name
 * @returns {Promise<number>} Total number of contacts in the list
 */
export const getContactCountByListId = async (contactListId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/contacts/count/${contactListId}`);
    return response.data.count;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch contact count';
  }
};

/**
 * Export all functions as a service object
 */
export const batchesService = {
  createBatch,
  getAllBatches,
  getBatchById,
  getBatchesByCampaign,
  updateBatchStatus,
  updateBatch,
  deleteBatch,
  getAllCampaigns,
  getAllTemplates,
  getTemplatesByType,
  getTemplateMessages,
  getContactCountByListId
};
 

export default batchesService;