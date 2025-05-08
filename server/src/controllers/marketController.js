const Market = require('../models/Market');
const TenDLC = require('../models/TenDLC');

exports.getMarkets = async (req, res) => {
  try {
    const markets = await Market.find();
    res.json(markets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMarket = async (req, res) => {
  try {
    const { name, callForwardingNumber, areaCode, timeZone, status, customerId  } = req.body;
    const newMarket = await Market.create({  name, callForwardingNumber, areaCode, timeZone, status, customerId  });
    res.status(201).json(newMarket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editMarket = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMarket = await Market.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMarket) return res.status(404).json({ message: 'Market not found' });

    res.json(updatedMarket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMarket = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMarket = await Market.findByIdAndDelete(id);
    if (!deletedMarket) return res.status(404).json({ message: 'Market not found' });

    res.json({ message: 'Market deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//===============10dlc form==================

exports.createMarketWithDLC = async (req, res) => {
    try {
      const { marketname,  businessType, taxId, websiteUrl, brandName, email, firstName, lastName, verticalType, zip, phoneNumber, state, customerId  } = req.body;
  
      // const market = await Market.create({ name, callForwardingNumber, areaCode, timeZone, status: 'Pending' });
  
      const tenDlcForm = await TenDLC.create({
        // marketId: market._id,
        marketname,
        businessType,
        taxId,
        websiteUrl,
        brandName,
        email,
        firstName,
        lastName,
        verticalType,
        zip,
        phoneNumber,
        state,
        customerId,  // ✅ Storing customer ID
      });
  
      res.status(201).json({ market, tenDlcForm });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.getMarketsWithDLC = async (req, res) => {
    try {
      const markets = await Market.find().populate('tenDlcForm');
      res.json(markets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
