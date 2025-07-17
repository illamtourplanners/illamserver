import { Admin } from "../model/adminSchema.js";
import { Customer } from "../model/customerSchema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Package } from "../model/packageSchema.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { Tour } from "../model/tourSchema.js";
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
  

    const admin=req.admin;
    
    if(!admin){
        return res.status(401).json({success:false,message:'admin not authenticated'})
        }
    
  res.json({success:true,message:'admin is authenticated'})


} )


// Add this at the top of your controller file
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export const dashboardData = async (req, res) => {
  try {
    const allBookings = await Customer.find({}, "customers amount bookingNumber status packageName createdAt").sort({ createdAt: -1 });
    const allActivePackages = await Package.countDocuments();
    const upcomingBookings = await Customer.countDocuments();
    const recentBookings = await Customer.find().sort({ createdAt: -1 }).limit(5);

    // Fetch recent posts and packages
    const latestPackages = await Package.find().sort({ createdAt: -1 }).limit(3);
    const latestPosts = await Tour.find().sort({ createdAt: -1 }).limit(3);

    let totalCustomers = 0;
    let totalRevenue = 0;

    allBookings.forEach(booking => {
      totalCustomers += booking.customers.length;
      totalRevenue += booking.amount || 0;
    });

    // Format recent activities
    const bookingActivities = allBookings.slice(0, 3).map(booking => {
      const firstCustomer = booking.customers[0];
      return {
        type: "booking",
        title: `Booking ${booking.bookingNumber} ${booking.status === "confirmed" ? "confirmed" : "pending"}`,
        subtitle: `${firstCustomer?.fullName || "Guest"} - ${booking.packageName}`,
        icon: booking.status === "confirmed" ? "check" : "package",
        timeAgo: getTimeAgo(new Date(booking.createdAt))
      };
    });

    const packageActivities = latestPackages.map(pkg => ({
      type: "package",
      title: `New Package: ${pkg.packageName}`,
      subtitle: pkg.destination || "New travel package added",
      icon: "gift",
      timeAgo: getTimeAgo(new Date(pkg.createdAt))
    }));

    const postActivities = latestPosts.map(post => ({
      type: "post",
      title: `New Post: ${post.title}`,
      subtitle: post.description?.slice(0, 50) || "New content shared",
      icon: "note",
      timeAgo: getTimeAgo(new Date(post.createdAt))
    }));

    const recentActivities = [
      ...bookingActivities,
      ...packageActivities,
      ...postActivities
    ].sort((a, b) => new Date(b.timeAgo) - new Date(a.timeAgo)).slice(0, 6);

    res.status(200).json({
      totalCustomers,
      totalRevenue,
      allActivePackages,
      upcomingBookings,
      recentBookings,
      recentActivities
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = asyncHandler(async (req, res) => {
    try {
      res.cookie('Admintoken', '', { httpOnly: true,sameSite: 'None', expires: new Date(0) });
      res.status(200).json({ success: true, message: 'Admin logged out successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to log out' });
    }
  });