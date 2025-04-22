const Drip = require('../models/Drip');

exports.createDrip = async (req, res) => {
  try {
    const drip = new Drip(req.body);
    await drip.save();
    res.status(201).json(drip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDrips = async (req, res) => {
  try {
    const drips = await Drip.find();
    res.status(200).json(drips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
