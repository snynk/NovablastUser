const Tag = require('../models/Tag');

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name, color, customerId } = req.body;
    const newTag = await Tag.create({ name, color,customerId });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editTag = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTag = await Tag.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTag) return res.status(404).json({ message: 'Tag not found' });

    res.json(updatedTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) return res.status(404).json({ message: 'Tag not found' });

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
