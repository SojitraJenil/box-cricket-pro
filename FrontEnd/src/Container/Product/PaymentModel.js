import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RenderHost } from "../../API/Api";

function PaymentModal({ payload, setModalOpen, modalOpen, calculateTotalPrice, selectedSlots }) {
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const Navigation = useNavigate()
    const handleCloseModal = () => {
        setModalOpen(false);
        setLoading(false);
        setPaymentSuccess(false);
    };

    // const handlePayment = async () => {
    //     setLoading(true);
    //     setPaymentSuccess(false);

    //     try {
    //         try {
    //             await axios.post(`${RenderHost}/book-slot`, payload);
    //             // setModalOpen(true)
    //         } catch (error) {
    //             console.error('Error booking slot:', error);
    //             alert('Failed to book slot');
    //         }

    //         // Razorpay options
    //         const options = {
    //             key: "rzp_test_cX0VB9927mioP6", // Razorpay Key ID
    //             amount: calculateTotalPrice() * 100, // Amount in paise (1000 = 10.00 INR)
    //             currency: "INR", // Currency code
    //             name: "E-Box Cricket",
    //             description: "Slot Booking Payment",
    //             handler: async (response) => {
    //                 const verificationResponse = await fetch("http://localhost:5000/verify-payment", {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({
    //                         razorpay_order_id: response.razorpay_order_id,
    //                         razorpay_payment_id: response.razorpay_payment_id,
    //                         razorpay_signature: response.razorpay_signature,
    //                         user_id: payload.user_id,
    //                         product_id: payload.product_id,
    //                         selectedSlots: payload.selectedSlots,
    //                     }),
    //                 });
    //                 console.log({
    //                     razorpay_order_id: response.razorpay_order_id,
    //                     razorpay_payment_id: response.razorpay_payment_id,
    //                     razorpay_signature: response.razorpay_signature,
    //                     user_id: payload.user_id,
    //                     product_id: payload.product_id,
    //                     selectedSlots: payload.selectedSlots,
    //                 });


    //                 const result = await verificationResponse.json();
    //                 Navigation("/")
    //                 if (result.message === "Payment verified and booking successful") {
    //                     setPaymentSuccess(true);
    //                     Navigation("/")
    //                     alert("Booking confirmed!");
    //                 } else {
    //                     alert("Payment verification failed");
    //                 }
    //             },
    //             prefill: {
    //                 name: "Your Name",
    //                 email: "your-email@example.com",
    //                 contact: "1234567890",
    //             },
    //             theme: {
    //                 color: "#3399cc",
    //             },
    //         };

    //         // Open the Razorpay popup
    //         const paymentObject = new window.Razorpay(options);
    //         paymentObject.open();

    //         // Close the modal after opening Razorpay
    //         handleCloseModal();
    //     } catch (error) {
    //         console.error("Payment failed:", error);
    //         alert("Something went wrong");
    //     }
    // };

    const handleChat = () => {
        Navigation(`/help`);
    }

    const handlePayment = async () => {
        setLoading(true);
        setPaymentSuccess(false);

        try {
            await axios.post(`${RenderHost}/book-slot`, payload);

            const options = {
                key: "rzp_test_VTjYwDWX3A01rB",
                amount: calculateTotalPrice() * 100,
                currency: "INR",
                name: "E-Box Cricket",
                description: "Slot Booking Payment",
                handler: async (response) => {
                    try {
                        const verificationResponse = await fetch("http://localhost:5000/verify-payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                user_id: payload.user_id,
                                product_id: payload.product_id,
                                selectedSlots: payload.selectedSlots,
                            }),
                        });

                        if (verificationResponse.ok) {
                            const result = await verificationResponse.json();
                            if (result.message === "Payment verified and booking successful") {
                                setPaymentSuccess(true);
                                alert("Booking confirmed!");
                                Navigation(`/product/${payload.product_id}`);
                            } else {
                                alert("Payment verification failed");
                            }
                        } else {
                            window.location.reload(); // Corrected the typo here
                            Navigation(`/product/${payload.product_id}`);
                        }
                    } catch (error) {
                        Navigation(`/product/${payload.product_id}`);
                        console.error("Error verifying payment:", error);
                        window.location.reload(); // Reload the page on error as well
                    }
                },
                prefill: {
                    name: "Jenil",
                    email: "jeniltech18@gmail.com",
                    contact: "9979968463",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            handleCloseModal();
        } catch (error) {
            console.error("Payment failed:", error);
            // window.location.reload(); // Reload the page on error as well
            alert("Something went wrong. Please try again.");
        }
    };


    return (
        <Modal show={modalOpen} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Payment Screen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" role="status" />
                        <p className="mt-3">Processing your payment, please wait...</p>
                    </div>
                ) : paymentSuccess ? (
                    <div className="text-center text-success">
                        <h4>Payment Successful!</h4>
                        <p>Your payment has been processed successfully.</p>
                    </div>
                ) : (
                    <div>
                        <p>Complete your payment for {calculateTotalPrice()}</p>
                        <p>Selected Slot : {selectedSlots} </p>
                        <Button variant="primary" onClick={handlePayment}>
                            Pay Now
                        </Button>
                        <Button variant="danger" className="px-4 mx-3" onClick={handleChat}>
                            Help (Live Chat)
                        </Button>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                {!loading && !paymentSuccess && (
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default PaymentModal;
