import validator from "validator";
import { Contact } from "../model/contactSchema.js";

// CREATE MESSAGE
export const createMessage = async (req, res) => {
  const { name, email, message } = req.body;

  console.log(req.body);
  
  try {
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    const newMessage = new Contact({
      FullName: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    await newMessage.save();

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// GET ALL MESSAGES
export const getAllMessage = async (req, res) => {
  try {
    const messages = await Contact.find();
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, error: "Failed to retrieve messages" });
  }
};
