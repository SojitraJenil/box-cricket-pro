const Razorpay = require("razorpay");
var Product = require("../Model/productmodel");
const User = require('../Model/usermodel'); // Adjust the path as needed
const Booking = require('../Model/Bookingmodel');
const nodemailer = require("nodemailer");

const crypto = require("crypto");

const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_VTjYwDWX3A01rB',
    key_secret: 'thVUcsh7RuDzxxVZQqXXOj0X',
});


const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: 'jeniltech18@gmail.com', // Replace with your email
        pass: 'bzfa otzm ltzr hfhd', // Replace with your email password or app password
    },
});
exports.setRenovationStatus = async (req, res) => {
    const { productId } = req.params; // Get the productId from the route parameter
    console.log('Product ID:', productId);

    try {
        // Ensure the product ID is valid and follows the correct format
        if (!productId || productId.length !== 24) { // Check if it's a valid ObjectId (MongoDB)
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        // Find the product by ID
        const product = await Product.findById(productId);

        // If the product is not found, return a 404 error
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Toggle the isRenovation field (if true -> false, if false -> true)
        product.isRenovation = !product.isRenovation;

        // Save the updated product
        await product.save();

        // Return the updated product with a success message
        res.status(200).json({
            message: `Product renovation status updated to ${product.isRenovation}`,
            product
        });

    } catch (error) {
        // Handle any errors and return a 500 server error
        console.error("Error updating renovation status:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        booking_id,
    } = req.body;

    try {
        // Fetch the booking by ID
        const booking = await Booking.findById(booking_id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Verify Razorpay signature
        const generatedSignature = crypto
            .createHmac("sha256", razorpayInstance.key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature === razorpay_signature) {
            // Signature is valid, update payment status
            booking.status = "Approved";
            await booking.save();
            const mailOptionsFinal = {
                from: "jeniltech18@gmail.com",
                to: booking.email,
                subject: "Box Booking Confirmation",
                text: `Dear Customer,

Your payment has been successfully verified and your booking is now confirmed for the product "${booking.product_id.product_name}".
Here are the final details:

- Product Name: ${booking.product_id.product_name}
- Booking Slots: ${booking.booked_slots.join(", ")}
- Total Payment: ₹${booking.product_id.product_price}

Thank you once again for booking with us!

Best Regards,
Your Team`,
            };



            transporter.sendMail(mailOptionsFinal, (err, info) => {
                if (err) {
                    console.error("Error while sending final confirmation email:", err);
                } else {
                    console.log("Final confirmation email sent:", info.response);
                }
            });

            return res.status(200).json({ message: "Payment verified, booking approved, and final confirmation email sent" });
        } else {
            return res.status(400).json({ message: "Invalid Razorpay signature" });
        }
    } catch (err) {
        console.error("Error in payment verification:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.showBooked1 = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('product_id', 'product_name product_price product_description category product_img product_address time_slots')
            .populate('user_id', 'fname lname mobileno'); // Populate user's first name and last name


        const currentTime = new Date();

        const bookingsWithExpiration = bookings.map((booking) => {
            return {
                ...booking._doc,
                remainingTime: Math.max(
                    0,
                    new Date(booking.createdAt).getTime() + 60 * 60 * 1000 - currentTime.getTime() // 1-hour expiration
                ),
            };
        });

        // Return the filtered and updated bookings
        res.json({ bookings: bookingsWithExpiration });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.showBooked = async (req, res) => {
    const { productId } = req.params;

    try {
        const bookings = await Booking.find({ product_id: productId }).populate(
            'product_id',
            'product_name product_price product_description category product_img product_address time_slots'
        );

        const currentTime = new Date();

        const bookingsWithExpiration = bookings.map((booking) => {
            return {
                ...booking._doc,
                remainingTime: Math.max(
                    0,
                    new Date(booking.createdAt).getTime() + 60 * 60 * 1000 - currentTime.getTime() // 1-hour expiration
                ),
            };
        });

        // Return the filtered and updated bookings
        res.json({ bookings: bookingsWithExpiration });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.bookSlot = async (req, res) => {
    const { user_id, product_id, selectedSlots, email, date } = req.body;

    try {
        if (!user_id || !product_id || !selectedSlots || selectedSlots.length === 0 || !date) {
            return res.status(400).json({ message: 'Missing required data' });
        }

        const product = await Product.findById(product_id);
        if (!product || !product.time_slots) {
            return res.status(400).json({ message: 'Product not found or time_slots missing' });
        }

        const availableSlots = product.time_slots.map(slot => slot.slot.toLowerCase());

        // Check if any booking exists for the same user, product, and date
        const existingBookings = await Booking.find({ user_id, product_id, date });

        const conflictingSlots = [];
        existingBookings.forEach(booking => {
            const bookedSlots = booking.booked_slots;
            selectedSlots.forEach(slot => {
                if (bookedSlots.includes(slot)) {
                    conflictingSlots.push(slot);
                }
            });
        });

        // Create a new record for each booking (to keep them separate)
        const newBooking = new Booking({
            user_id,
            product_id,
            booked_slots: selectedSlots,
            email,
            date,
            status: 'Pending',
        });

        await newBooking.save();
        console.log('newBooking :>> ', newBooking);
        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (err) {
        console.error('Error in booking slot:', err);
        res.status(500).json({ error: err.message });
    }
};


exports.approveBooking = async (req, res) => {
    const { bookingId, status, email } = req.body; // Booking ID and new status from admin

    try {
        const booking = await Booking.findById(bookingId).populate('product_id');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update booking status
        booking.status = status;
        await booking.save();

        // Send email every time the status is approved
        if (status === 'Approved') {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'jeniltech18@gmail.com',
                    pass: 'bzfa otzm ltzr hfhd', // Replace with your app-specific password
                },
            });

            const mailOptionsBooking = {
                from: 'jeniltech18@gmail.com', // Sender address
                to: email,
                subject: 'Booking Confirmation',
                text: `Dear Customer,

Thank you for booking the product.
Your booking details:
- Product: ${booking.product_id.product_name}
- Total Price: ${booking.product_id.product_price * booking.booked_slots.length}
- Date: ${booking.booking_date}
- Time Slots: ${booking.booked_slots.join(', ')}

We look forward to serving you!

For any assistance, contact us at jeniltech18@gmail.com.

Best Regards,
Your Team`,
            };

            transporter.sendMail(mailOptionsBooking, (err, info) => {
                if (err) {
                    console.error('Error while sending email:', err);
                } else {
                    console.log('Booking Confirmation email sent:', info.response);
                }
            });
        }

        res.status(200).json({
            message: `Booking ${status.toLowerCase()} successfully`,
            booking,
        });
    } catch (err) {
        console.error('Error in approving/rejecting booking:', err);
        res.status(500).json({ error: err.message });
    }
};
exports.getUserProductBookings = async (req, res) => {
    const { user_id, product_id } = req.params;

    if (!user_id || !product_id) {
        return res.status(400).json({ message: 'Missing user_id or product_id' });
    }

    console.log(user_id, product_id);

    try {
        const bookings = await Booking.find({ product_id })

        const allBookings = {
            myBooking: [],
            othersBooking: []
        }

        bookings.forEach((userBooked) => {
            if (user_id == userBooked.user_id)
                allBookings.myBooking = [...allBookings.myBooking, ...userBooked.booked_slots]
            else
                allBookings.othersBooking = [...allBookings.othersBooking, ...userBooked.booked_slots]
        })
        res.status(200).json({ message: 'success', allBookings });

    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.cancelSlot = async (req, res) => {
    const { user_id, product_id, cancelSlots } = req.body;

    try {
        // Validate input
        if (!user_id || !product_id || !cancelSlots || cancelSlots.length === 0) {
            return res.status(400).json({ message: 'Missing required data' });
        }

        // Find the booking
        const booking = await Booking.findOne({ user_id, product_id });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Validate slots to cancel
        const existingBookedSlots = booking.booked_slots;
        const invalidSlots = cancelSlots.filter(slot => !existingBookedSlots.includes(slot));

        // if (invalidSlots.length > 0) {
        //     return res.status(400).json({ message: `Invalid slots: ${invalidSlots.join(', ')}` });
        // }

        // Update slots
        booking.booked_slots = existingBookedSlots.filter(slot => !cancelSlots.includes(slot));

        let message;
        if (booking.booked_slots.length === 0) {
            // Delete the booking if no slots remain
            await Booking.deleteOne({ _id: booking._id });
            message = 'All slots canceled, booking removed.';
        } else {
            // Save the updated booking
            await booking.save();
            message = 'Selected slots canceled successfully.';
        }

        // Email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jeniltech18@gmail.com',
                pass: 'bzfa otzm ltzr hfhd', // Replace with your actual app-specific password
            },
        });

        const mailOptions = {
            from: 'jeniltech18@gmail.com',
            to: booking.email, // Assuming the booking has an `email` field
            subject: 'Booking Cancellation Confirmation',
            text: `Dear Customer,

We would like to inform you that the following slots have been canceled:
${cancelSlots.join(', ')}

${message}

As per our return policy, any applicable refunds will be processed within 7 business days. If you have any questions, please feel free to contact us.

Best Regards,
Your Team
Email: jeniltech18@gmail.com`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Cancellation email sent successfully');
        } catch (emailErr) {
            console.error('Error while sending cancellation email:', emailErr);
        }

        // Return success response
        res.status(200).json({ message, booking });
    } catch (err) {
        console.error('Error in canceling slot:', err);
        res.status(500).json({ error: err.message });
    }
};
exports.getPastBookings = async (req, res) => {
    try {
        const currentDate = new Date();
        const pastBookings = await Booking.find({ booking_date: { $lt: currentDate } })
            .populate('product_id', 'product_name product_price product_description category product_img product_address time_slots');

        if (pastBookings.length === 0) {
            return res.status(404).json({ message: 'No past bookings found' });
        }

        res.status(200).json({ message: 'Past bookings retrieved successfully', pastBookings });
    } catch (err) {
        console.error('Error fetching past bookings:', err);
        res.status(500).json({ error: err.message });
    }
};
