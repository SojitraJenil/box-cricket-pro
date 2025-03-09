const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_VTjYwDWX3A01rB',
    key_secret: 'thVUcsh7RuDzxxVZQqXXOj0X',
});

module.exports = razorpayInstance;