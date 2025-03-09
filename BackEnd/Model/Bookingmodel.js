const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'registers' },
    product_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product_details' },
    booked_slots: [String], // Store booked slots for this booking
    email: { type: String, required: true },
    booking_date: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] }, // New field for admin approval
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
