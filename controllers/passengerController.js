import { Customer } from "../model/customerSchema.js";


// Get all passengers for pickup list
export const getPickupList = async (req, res) => {
  const { packageNumber } = req.params;
  try {

     const bookings = await Customer.find({
        "packageDetails.packageNumber": packageNumber
      });
//     const bookings = await Customer.find();
// console.log(bookings);

    const passengers = bookings.flatMap((booking) =>
      booking.customers.map((customer, index) => ({
        id: `${booking._id}-${index}`,
        name: customer.fullName,
        pickupPoint: customer.pickupPoint,
        people: booking.packageDetails[0]?.packagePerson || 1,
        isBoarded: customer.status === "Boarded", 
        bookingId: booking._id,
        customerIndex: index,
      }))
    );

    const allPickupPoints = bookings.flatMap((booking) =>
      booking.customers.map((customer) => customer.pickupPoint)
    );

    // Remove duplicates
    const uniquePickupPoints = [...new Set(allPickupPoints)];


    res.status(200).json({ success: true, passengers,pickupPoints: uniquePickupPoints });
  } catch (error) {
    console.error("Error fetching pickup list:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update boarding status
export const updateBoardingStatus = async (req, res) => {
  try {
    const { bookingId, customerIndex, status } = req.body;

    console.log(status);
    
    const booking = await Customer.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (!booking.customers[customerIndex])
      return res.status(400).json({ success: false, message: "Invalid customer index" });

  // Update the status
    booking.customers[customerIndex].status = status;
 booking.status = status;
    // Tell Mongoose that the 'customers' field was modified
    booking.markModified('customers');
    await booking.save();

    res.status(200).json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


