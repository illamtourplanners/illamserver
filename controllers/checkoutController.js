import dotenv from "dotenv";
dotenv.config();

import { Customer } from '../model/customerSchema.js';
import { customerSchema } from '../validation/customerJoi.js';
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import nodemailer from 'nodemailer'
import twilio from 'twilio';
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





export const confirmBooking = async (req, res) => {
  try {
    const {
       bookingId,
  transactionId,
  customerEmail,
  customerName,
  customerPhone,
  packageName,
  travelDate,
  totalPassengers,
  bookingNumber,
  allCustomerNames,
  allPickupPoints,
  to,
  seatnumbers
    } = req.body;

    console.log(req.body);
    
    // ✅ Check required fields
    if (!customerName || !customerEmail || !customerPhone || !packageName || !travelDate) {
      return res.status(400).json({ success: false, message: 'Missing required booking details.' });
    }

    // ✅ Send Email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS
      }
    });


const travelDateObj = new Date(travelDate);
const onlyDate = travelDateObj.toISOString().slice(0, 10);


 const allCustomerNamesStr = Array.isArray(allCustomerNames) ? allCustomerNames.join(', ') : allCustomerNames;
    const allPickupPointsStr = Array.isArray(allPickupPoints) ? allPickupPoints.join(', ') : allPickupPoints;


    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: customerEmail,
      subject: 'Booking Confirmation - Explore Kerala',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hi ${customerName},</h2>
          <p>Your booking with <strong>Explore Kerala</strong> is confirmed!</p>
          <p><strong>Package:</strong> ${packageName}</p>
          <p><strong>Travel Date:</strong> ${new Date(travelDate).toDateString()}</p>
          <p>We look forward to having you on board.</p>
          <br/>
          <p>Warm regards,<br/><strong>Vaidehi Holidays</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

  //   // ✅ Send WhatsApp Message using Twilio (Plain Text)
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      to: `whatsapp:+91${customerPhone}`,
      from: 'whatsapp:+17245585975',
      contentSid: 'HX172797fc60d7cd326db4b9431574deb8',
      contentVariables: JSON.stringify({
        "1": customerName,
        "2": allPickupPointsStr,
        "3": to,
        "4": "Vaidehi Holidays",
        "5": totalPassengers.toString(),
        "6": onlyDate,
        "7": bookingNumber,
        "8": allCustomerNames,
        "9": "Not assigned yet",
        "10": allPickupPointsStr,
        "11": "+918547854685,+919400440686,+919633628540,+918943806318"
      })
    });

const customerIndex=0
const status="Confirmed"
const booking = await Customer.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (!booking.customers[customerIndex])
      return res.status(400).json({ success: false, message: "Invalid customer index" });

  // Update the status
    // booking.customers[customerIndex].status = status;
 booking.status = status;
    // Tell Mongoose that the 'customers' field was modified
    booking.markModified('customers');
    await booking.save();




    res.status(200).json({ success: true, message: 'Booking confirmed. Email and WhatsApp sent.' });

  } catch (error) {
    console.error('Error in confirmBooking:', error);
    res.status(500).json({ success: false, message: 'Failed to send booking confirmation.' });
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

export const deleteCustomerFromBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Customer.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    

    return res.status(200).json({
      success: true,
      message: "Customer removed from booking",
      updatedBooking: booking
    });
  } catch (error) {
    console.error("Error removing customer:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
