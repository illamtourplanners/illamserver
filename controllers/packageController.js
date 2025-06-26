import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Package } from "../model/packageSchema.js";

// CREATE
function generatePackageNumber() {
  const prefix = "PKG";
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // e.g., 4 random chars
  const timePart = Date.now().toString().slice(-6); // last 6 digits of timestamp
  return `${prefix}-${randomPart}${timePart}`;
}

export const createPackage = async (req, res) => {
  try {
    const {
      PackageName,
      PricePerPerson,
      date,
      day,
      night,
      includes,
      pickupPoints,
       advancePrice,
      dropoff,
      discount,
      description
    } = req.body;

   
    
 
    if (
      !PackageName ||
      !PricePerPerson ||
      !date ||
      !day ||
      !night ||
      !includes ||
      !advancePrice ||
      !pickupPoints.length === 0 ||
      !dropoff ||
      !description||
      !discount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingPackages = await Package.find({ PackageName, dropoff });
    if (existingPackages.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Package already exists",
      });
    }


  

    // if (typeof PricePerPerson !== "number" || PricePerPerson <= 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "PricePerPerson must be a positive number",
    //   });
    // }

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "travel-packages"
      });
      imageUrl = result.secure_url;
    }

  const pkgNumber = generatePackageNumber();


    const newPackage = await Package.create({
      PackageName,
      PricePerPerson,
      date,
      day,
      night,
      includes,
      pickupPoints,
       advancePrice,
      dropoff,
      discount,
      description,
       pkgNumber,
      image: imageUrl, 
    });

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: newPackage,
    });
  } catch (error) {
    console.error("Error creating package:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find({});
    return res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      
    });
    
  }
};

// GET BY ID
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const packageData = await Package.findById(id);
    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: packageData,
    });
  } catch (error) {
    console.error("Error fetching package by id:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.PricePerPerson && (typeof updates.PricePerPerson !== "number" || updates.PricePerPerson <= 0)) {
      return res.status(400).json({
        success: false,
        message: "PricePerPerson must be a positive number",
      });
    }

    const updatedPackage = await Package.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: updatedPackage,
    });
  } catch (error) {
    console.error("Error updating package:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
