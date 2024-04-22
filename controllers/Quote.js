const Quote = require("../models/Quote");
const nodemailer = require("nodemailer");

// Controller function for getting all quotes
const getAllQuote = async (req, res) => {
  try {
    const allQuotes = await Quote.find();

    res.status(200).json({ quotes: allQuotes });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function for getting quote by id
const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }

    res.status(200).json({ quote });
  } catch (error) {
    console.error("Error getting quote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function for creating quote
const createQuote = async (req, res) => {
  try {
    const {
      shippedItem,
      shipmentDescribe,
      addDimensions,
      pickupDropOffLocation,
      name,
      email,
    } = req.body;

    // Validate the required fields
    if (
      !shippedItem ||
      !shipmentDescribe ||
      !pickupDropOffLocation ||
      !name ||
      !email
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Calculate totalWeight and finalWeight
    const calculateWeights = (dimensions) => {
      let finalWeight = 0;

      const dimensionsWithTotalWeight = dimensions.map((dimension) => {
        const totalWeight = dimension.itemWeight * dimension.quantity;
        finalWeight += totalWeight;
        return { ...dimension, totalWeight };
      });

      return { dimensionsWithTotalWeight, finalWeight };
    };

    const { dimensionsWithTotalWeight, finalWeight } = calculateWeights(addDimensions);

    const newQuote = new Quote({
      shippedItem,
      shipmentDescribe,
      addDimensions: dimensionsWithTotalWeight,
      finalWeight,
      pickupDropOffLocation,
      name,
      email,
    });

    await newQuote.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "swatikkathiriya@gmail.com",
        pass: "btie hxds yurg wmzu",
      },
    });

    // Check if addDimensions exists and it's an array
    let addDimensionsTable = '';
    if (Array.isArray(dimensionsWithTotalWeight) && dimensionsWithTotalWeight.length > 0) {
      addDimensionsTable = `
        <table border="1">
          <tr>
            <th>Quantity</th>
            <th>Item Weight</th>
            <th>Item Weight Unit</th>
            <th>Weight Unit</th>
            <th>Total Weight</th>
            <th>Length</th>
            <th>Length Unit</th>
            <th>Width</th>
            <th>Width Unit</th>
            <th>Height</th>
            <th>Height Unit</th>
            <th>Final Weight</th>
          </tr>
          ${dimensionsWithTotalWeight.map(dimension => `
            <tr>
              <td>${dimension.quantity}</td>
              <td>${dimension.itemWeight}</td>
              <td>${dimension.itemWeightUnit}</td>
              <td>${dimension.weightUnit}</td>
              <td>${dimension.totalWeight}</td>
              <td>${dimension.length}</td>
              <td>${dimension.lengthUnit}</td>
              <td>${dimension.width}</td>
              <td>${dimension.widthUnit}</td>
              <td>${dimension.height}</td>
              <td>${dimension.heightUnit}</td>
              <td>${dimension.finalWeight}</td>
            </tr>
          `).join('')}
        </table>
      `;
    } else {
      // Handle case when addDimensions is empty or not an array
      addDimensionsTable = '<p>No dimensions available</p>';
    }

    const pickupDropOffLocationTable = `
      <table border="1">
        <tr>
          <th>Pickup Location</th>
          <td>${req.body.pickupDropOffLocation.pickUpLocation}</td>
        </tr>
        <tr>
          <th>Type of Pickup Location</th>
          <td>${req.body.pickupDropOffLocation.typePickupLocation}</td>
        </tr>
        <tr>
          <th>Drop-off Location</th>
          <td>${req.body.pickupDropOffLocation.dropOffLocation}</td>
        </tr>
        <tr>
          <th>Type of Drop-off Location</th>
          <td>${req.body.pickupDropOffLocation.typeDropOffLocation}</td>
        </tr>
        <tr>
          <th>Pickup Date</th>
          <td>${req.body.pickupDropOffLocation.pickUpDate}</td>
        </tr>
        <tr>
          <th>Pickup Time</th>
          <td>${req.body.pickupDropOffLocation.pickUpTime}</td>
        </tr>
        <tr>
          <th>Drop-off Date</th>
          <td>${req.body.pickupDropOffLocation.dropOffDate}</td>
        </tr>
        <tr>
          <th>Drop-off Time</th>
          <td>${req.body.pickupDropOffLocation.dropOffTime}</td>
        </tr>
      </table>
    `;

    const quoteDetailsTable = `
      <table border="1">
        <tr>
          <th>Name</th>
          <td>${req.body.name}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td>${req.body.email}</td>
        </tr>
        <tr>
          <th>Shipped Item</th>
          <td>${req.body.shippedItem}</td>
        </tr>
        <tr>
          <th>Shipment Description</th>
          <td>${req.body.shipmentDescribe}</td>
        </tr>
        <tr>
          <th>Additional Dimensions</th>
          <td>${addDimensionsTable}</td>
        </tr>
        <tr>
          <th>Final Weight</th>
          <td>${finalWeight}</td>
        </tr>
        <tr>
          <th>Pickup/Drop-off Location</th>
          <td>${pickupDropOffLocationTable}</td>
        </tr>
      </table>
    `;
    
    const mailOptions = {
      from: "swatikkathiriya@gmail.com",
      to: `${req.body.email}`,
      subject: "Quote Created",
      html: `
        <p>Dear ${name},</p>
        <p>Your quote for ${shippedItem} has been created successfully.</p>
        ${quoteDetailsTable}
        <p>Thank you for choosing us.</p>
        <p>Best regards,</p>
        <p>${name}</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res
      .status(201)
      .json({ message: "Quote created successfully", quote: newQuote });
  } catch (error) {
    console.error("Error creating quote:", error);
    res.status(500).json({ error: "Failed to create quote" });
  }
};

module.exports = { getAllQuote, getQuoteById, createQuote };