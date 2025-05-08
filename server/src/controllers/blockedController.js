const Blocked = require('../models/Blocked');

exports.getBlockedNumbers = async (req, res) => {
  try {
    const blockedNumbers = await Blocked.find();
    res.json(blockedNumbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBlockedNumber = async (req, res) => {
  try {
    const { phoneNumber, firstName, lastName, permanent } = req.body;
    const newBlocked = await Blocked.create({ phoneNumber, firstName, lastName, permanent });
    res.status(201).json(newBlocked);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editBlockedNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlocked = await Blocked.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBlocked) return res.status(404).json({ message: 'Blocked number not found' });

    res.json(updatedBlocked);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBlockedNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlocked = await Blocked.findByIdAndDelete(id);
    if (!deletedBlocked) return res.status(404).json({ message: 'Blocked number not found' });

    res.json({ message: 'Blocked number deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
