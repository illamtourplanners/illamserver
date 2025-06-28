import dotenv from "dotenv";
dotenv.config();

import { Customer } from '../model/customerSchema.js';
import { customerSchema } from '../validation/customerJoi.js';
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";

function generatePNR() {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 char
  const timePart = Date.now().toString().slice(-6); // last 6 digits of timestamp
  return `BKN${timePart}${random}`;
}

export const makeCheckout = async (req, res) => {
  try {


    const {
      packageName,
      packageDate,
      packageDetails,
      amount,
      totalPerPerson,
      name,
      advancePayment,
      customers
    } = req.body;

    // Joi validation
    const { error } = customerSchema.validate({ packageName, packageDate });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Parse JSON strings
    const parsedCustomers = typeof customers === "string" ? JSON.parse(customers) : customers;
    const parsedPackageDetails = typeof packageDetails === "string" ? JSON.parse(packageDetails) : packageDetails;

    if (!Array.isArray(parsedCustomers) || parsedCustomers.length === 0) {
      return res.status(400).json({
        message: 'Customer list is required and must contain at least one customer',
      });
    }

    if (!amount || !name) {
      return res.status(400).json({
        message: 'Amount and name are required',
      });
    }

    const transactionId = 'TXN_' + Date.now();
    const pnr = generatePNR();

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "client-payments"
      });
      imageUrl = result.secure_url;
    }



    
    const newCheckout = new Customer({
      packageName,
      packageDate,
      packageDetails: parsedPackageDetails,
      customers: parsedCustomers,
      transactionId,
      bookingNumber: pnr,
      amount,
      totalPerPerson,
      advancePayment,
      image: imageUrl,

    });

    await newCheckout.save();

    return res.status(200).json({
      success: true,
      message: 'Checkout successful. No payment gateway used.',
      transactionId,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ message: error.message });
  }
};


export const getAllBookings = async (req, res) => {
  const { packageNumber } = req.params;
  
    try {
      const bookings = await Customer.find({
        "packageDetails.packageNumber": packageNumber
      });
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ success: false, message: "No bookings found for this package number" });
      }
  
      res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Customer.findById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllBookingsCount = async (req, res) => {


  try {
    const count = await Customer.countDocuments({
      "packageDetails.packageNumber": packageNumber
    });

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this package number"
      });
    }

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error("Error counting bookings:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getByTransactionId = async (req, res) => {
  const { transactionId } = req.params;
  
    try {
      const bookings = await Customer.find({
        "transactionId": transactionId
      });
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ success: false, message: "No bookings found for this package number" });
      }
  
      res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};