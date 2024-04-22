const mongoose = require("mongoose");
const DimensionSchema = new mongoose.Schema(
    {
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
});

// Create a model from the schema
const Dimension = mongoose.model("Dimension", DimensionSchema);
    
 module.exports = Dimension;
