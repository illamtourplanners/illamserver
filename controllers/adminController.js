import { Admin } from "../model/adminSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
// Create Admin
export const adminCreate = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const adminExists = await Admin.findOne({ name });
  if (adminExists) {
    return res.status(400).json({ success: false, message: 'Admin with this username already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newAdmin = await Admin.create({
    name,
    password: hashedPassword,
  });

  res.status(201).json({ success: true, message: 'Admin created', admin: newAdmin });
});


// Login Admin
export const adminLogin = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const admin = await Admin.findOne({ name });
console.log(req.body);

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.password);
  
  
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    res.cookie('Admintoken', token, {  httpOnly: true,  sameSite: 'None',
      // secure: true,
       secure: process.env.NODE_ENV === 'production' });

  res.status(200).json({ success: true, message: 'Login successful', admin,token });
});


 export const checkAdmin=asyncHandler(async(req,res,next)=>{
  
console.log(req);

    const admin=req.admin;
    
    if(!admin){
        return res.status(401).json({success:false,message:'admin not authenticated'})
        }
    
  res.json({success:true,message:'admin is authenticated'})


} )