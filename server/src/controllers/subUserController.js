const SubUser = require("../models/subUserModel"); // ✅ Ensure correct path

const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__dirname, "..", "uploads");

// ✅ Ensure upload directory exists before saving the file
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

exports.createSubUser = async (req, res) => {
    try {
      console.log("Received request body:", req.body);
     
  
      if (!req.body.customerId) {
        return res.status(400).json({ error: "Customer ID is required" });
      }
  
      let avatarPath = null;
      if (req.files?.avatar) {
        const avatar = req.files.avatar;
        const uploadDir = path.join(__dirname, "..", "uploads");
        const filePath = path.join(uploadDir, Date.now() + "-" + avatar.name);
  
        // ✅ Move file to correct directory using `mv()`
        await  avatar.mv(filePath, (err) => {
          if (err) {
            console.error("Error saving avatar:", err);
            return res.status(500).json({ error: "Error saving avatar" });
          }
        });
  
        avatarPath = `/uploads/${path.basename(filePath)}`;
      }
  
      // ✅ Save subuser to database including avatar path
      const subUser = new SubUser({ ...req.body, avatar: avatarPath });
      const savedSubUser = await subUser.save();
  
      res.status(201).json(savedSubUser);
    } catch (error) {
      console.error("Error creating subuser:", error);
      res.status(500).json({ error: "Failed to create subuser." });
    }
  };
  
  exports.getSubUsersByCustomer = async (req, res) => {
    try {
      const subUsers = await SubUser.find({ customerId: req.params.customerId });
      res.status(200).json(subUsers);
    } catch (error) {
      console.error("Error fetching subusers:", error);
      res.status(500).json({ error: "Failed to retrieve subusers." });
    }
  };

  exports.updateSubUser = async (req, res) => {
    try {
      const updatedSubUser = await SubUser.findByIdAndUpdate(req.params.subUserId, req.body, { new: true });
  
      if (!updatedSubUser) {
        return res.status(404).json({ error: "Subuser not found." });
      }
  
      return res.status(200).json(updatedSubUser);
    } catch (error) {
      console.error("Error updating subuser:", error);
      return res.status(500).json({ error: "Failed to update subuser." });
    }
  };
  
  exports.deleteSubUser = async (req, res) => {
    try {
      const deletedSubUser = await SubUser.findByIdAndDelete(req.params.subUserId);
      if (!deletedSubUser) {
        return res.status(404).json({ error: "Subuser not found." });
      }
      return res.status(200).json({ message: "Subuser deleted successfully." });
    } catch (error) {
      console.error("Error deleting subuser:", error);
      return res.status(500).json({ error: "Failed to delete subuser." });
    }
  };
  
  