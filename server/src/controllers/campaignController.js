const Campaign = require('../models/Campaign');

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }); // Sort by most recent
    res.json(campaigns);  // Send the campaigns data as a response
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Server Error' }); // Internal server error
  }
};

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { user_id, name, secondstep, usetollfree } = req.body;

    // Validate required fields
    if (!user_id || !name || !secondstep || usetollfree === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newCampaign = new Campaign({
      user_id,
      name,
      secondstep,
      usetollfree
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);  // Successfully created, return the campaign
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update an existing campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, name, secondstep, usetollfree } = req.body;

    // Find the campaign and update
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      { user_id, name, secondstep, usetollfree },
      { new: true }  // Return the updated campaign
    );

    if (!updatedCampaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(updatedCampaign);  // Send the updated campaign data
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCampaign = await Campaign.findByIdAndDelete(id);

    if (!deletedCampaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted successfully' });  // Send success message
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};
