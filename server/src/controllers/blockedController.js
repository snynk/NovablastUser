const Blocked = require('../models/Blocked');
const ExcelJS = require("exceljs"); // ✅ Use ExcelJS to generate the file

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
    const { phoneNumber, customerId, permanent } = req.body;
     // Validate required fields
     if (!phoneNumber || !customerId) {
      return res.status(400).json({ error: "Phone Number and Customer ID are required" });
    }
    const newBlocked = await Blocked.create({ phoneNumber, customerId, permanent });
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

exports.exportBlockedNumbers = async (req, res) => {
  try {
    const blockedNumbers = await Blocked.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Blocked Numbers");

    // **Define Columns**
    worksheet.columns = [
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      // { header: "Customer ID", key: "customerId", width: 20 },
    ];

    // **Add Data to Worksheet**
    blockedNumbers.forEach((entry) => {
      worksheet.addRow({
        phoneNumber: entry.phoneNumber,
        // customerId: entry.customerId,
      });
    });

    // **Generate Excel File**
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=BlockedNumbers.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
