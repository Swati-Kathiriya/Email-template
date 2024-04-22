const mongoose = require("mongoose");

// Define the schema
const QuoteSchema = new mongoose.Schema({
  shippedItem: {
    type: String,
    required: true,
  },
  shippedItemQuantity: {
    type: Number,
    default: 0,
  },
  shipmentDescribe: {
    type: String,
    required: true,
  },
  addOnAccessories1: String,
  addOnAccessories2: String,

  finalWeight: { type: String, required: true },
  pickupDropOffLocation: {
    pickUpLocation: String,
    typePickupLocation: String,
    dropOffLocation: String,
    typeDropOffLocation: String,
    pickUpDate: Date,
    pickUpTime: String,
    dropOffDate: Date,
    dropOffTime: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  addDimensions:{
    quantity: {
      type: Number,
      required: true,
    },
    itemWeight: {
      type: Number,
      required: true,
    },
    itemWeightUnit: {
      type: String,
      required: true,
    },
    weightUnit: {
      type: String,
      required: true,
    },
    totalWeight: String,
    length: {
      type: Number,
      required: true,
    },
    lengthUnit: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    widthUnit: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    heightUnit: {
      type: String,
      required: true,
    },
    finalWeight: String,
  }
});

// Create a model from the schema
const Quote = mongoose.model("Quote", QuoteSchema);

module.exports = Quote;
