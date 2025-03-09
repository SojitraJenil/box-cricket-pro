import React from "react"
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa"

function Footer() {
    return (
        <div className="container-fluid text-dark footer pt-5 mt-5 bg-[#F4F7F9] wow fadeIn" data-wow-delay="0.4s">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <h4 className="text-light mb-4">
                            <img src="/box-cricket-logo.svg" alt="Box Cricket Logo" className="h-10" />
                        </h4>
                        <p className="mb-2 fs-5">We are passionate about bringing</p>
                        <p className="mb-2 fs-5">the excitement of cricket to</p>
                        <p className="mb-2 fs-5">indoor spaces</p>

                        <div className="d-flex pt-2">
                            <a href="#" className="btn text-black bg-white mx-1 btn-social rounded-xl">
                                <FaTwitter />
                            </a>
                            <a href="#" className="btn text-black bg-white mx-1 btn-social rounded-xl">
                                <FaFacebook />
                            </a>
                            <a href="#" className="btn text-black bg-white mx-1 btn-social rounded-xl">
                                <FaYoutube />
                            </a>
                            <a href="#" className="btn text-black bg-white mx-1 btn-social rounded-xl">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="text-dark mb-4">Quick Links</h4>
                        <ul className="list-unstyled">
                            <li>Book a Court</li>
                            <li>Tournament Schedule</li>
                            <li>Membership</li>
                            <li>My Bookings</li>
                            <li>Rules & Regulations</li>
                            <li>Equipment Rental</li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="text-dark mb-4">Information</h4>
                        <ul className="list-unstyled">
                            <li>About Box Cricket</li>
                            <li>Our Facilities</li>
                            <li>Coaching Services</li>
                            <li>Terms & Conditions</li>
                            <li>Latest News</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <h4 className="text-dark mb-4">Contact Us</h4>
                        <p>Got questions? Call us</p>
                        <h6 className="font-bold">+91 99799 68463</h6>
                        <h5 className="py-2 fs-5">info@boxcricket.com</h5>
                        <div className="pt-2">
                            <p>123 Cricket Lane, Sportsville, NY 12345</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="copyright border-top">
                    <div className="row pt-3 pb-3">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; 2024 All Rights Reserved | Box Cricket Arena
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="footer-menu">
                                <img src="/box-cricket-logo.svg" alt="Box Cricket Logo" className="h-8 mx-auto me-xl-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer

