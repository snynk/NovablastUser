const mongoose = require("mongoose");

const tenDlcSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Customer" },
  legalBusinessName: { type: String, required: true },
  businessType: { type: String, required: true },
  businessRegistrationIdType: { type: String, required: true },
  businessRegistrationNumber: { type: String, required: true },
  businessIndustry: { type: String, required: true },
  businessEmail: { 
    type: String, 
    required: true, 
    validate: {
      validator: function (email) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  websiteURL: { 
    type: String, 
    required: true, 
    validate: {
      validator: function (url) {
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/.*)?$/.test(url);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  businessRegionOfOperations: { type: String, required: true },
  country: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  stateProvinceRegion: { type: String, required: true },
  postalZipCode: { 
    type: String, 
    required: true, 
    validate: {
      validator: function (zip) {
        return /^\d{5,10}$/.test(zip);
      },
      message: props => `${props.value} is not a valid postal/zip code!`
    }
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { 
    type: String, 
    required: true, 
    validate: {
      validator: function (email) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    validate: {
      validator: function (phone) {
        return /^\d{10,15}$/.test(phone);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  jobPosition: { type: String },
  locatedInUSOrCanada: { type: String, required: true },
  hasTaxId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("TenDLC", tenDlcSchema);
