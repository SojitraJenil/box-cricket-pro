import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { RenderHost } from "../../API/Api";
import Header from "../../Component/Navbar/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TopNavbar from "../../Component/TopNavbar/TopNavbar";
import "./Product.css";
import PaymentModal from "./PaymentModel";
import Footer from "../../Component/Footer/Footer";
import Loader from "../Loading/LoaderSmall";

function Product() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [image, setImage] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedSlotsForCancel, setSelectedSlotsForCancel] = useState([]);
  const [ModelOpen, setModalOpen] = useState(false);
  const [payload, setPayload] = useState({});
  const [allBookings, setAllBookings] = useState({})
  const hourlyPrice = 800; // Price per hour

  // Calculate total price based on selected slots
  const calculateTotalPrice = () => {
    return selectedSlots.length * hourlyPrice;
  };


  useEffect(() => {
    fetchAllBookedSlots();
    getdata();
    generateTimeSlots();
  }, []);

  useEffect(() => {
  }, [allBookings])

  const [selectedDate, setSelectedDate] = useState(new Date());


  const fetchAllBookedSlots = async (date) => {
    try {
      const userId = localStorage.getItem("userId");
      const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
      const response = await axios.get(`${RenderHost}/user-product-bookings/${id}/${userId}?date=${formattedDate}`);
      setAllBookings(response.data.allBookings);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };


  useEffect(() => {
    fetchAllBookedSlots(selectedDate);
  }, [selectedDate]);



  // Generate time slots from 7 AM to 7 AM (next day)
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = 7; // 7 AM
    for (let i = 0; i < 24; i++) {
      const hour = (startTime + i) % 24;
      const slot = `${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`;
      slots.push(slot);
    }
    setTimeSlots(slots);
  };

  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("userEmail");
  const bookSlot = async () => {
    if (!userId) {
      alert("Please log in to book a slot.");
      return;
    }
    setModalOpen(true)
    const selectedDateCurrent = new Date(); // Current date
    const Payload = {
      user_id: userId,
      product_id: id,
      selectedSlots,
      email,
      date: selectedDateCurrent,
    }
    setPayload(Payload)
  };
  const [loader, setLoader] = useState(false);
  const cancelBookedSlot = async () => {
    setLoader(true)
    const CancelSlotPayload = {
      user_id: userId,
      product_id: id,
      cancelSlots: selectedSlotsForCancel
    }
    try {
      await axios.post(`${RenderHost}/cancel-slot`, CancelSlotPayload);
      window.location.reload();
    } catch (error) {
      console.log('error :>> ', error);
    } finally {
      setLoader(false)
    }

  };



  const toggleSlot = (slot, type) => {
    if (type === "newSelect") {
      setSelectedSlots((prevSlots) => {
        if (!Array.isArray(prevSlots)) {
          return [slot];
        }
        return prevSlots.includes(slot)
          ? prevSlots.filter((s) => s !== slot)
          : [...prevSlots, slot];
      });
    }
    else if (type === "bookedSelect") {
      setSelectedSlotsForCancel((prevSlots) => {
        if (!Array.isArray(prevSlots)) {
          return [slot];
        }
        return prevSlots.includes(slot)
          ? prevSlots.filter((s) => s !== slot)
          : [...prevSlots, slot];
      });
    }
  };

  const getdata = async () => {
    try {
      const response = await axios.get(`${RenderHost}/Product_Show/ProductId/${id}`);
      setData(response.data.product);
      setImage(response.data.product?.product_img?.[0]);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      {ModelOpen && <PaymentModal payload={payload} setModalOpen={setModalOpen} modalOpen={setModalOpen} calculateTotalPrice={calculateTotalPrice} selectedSlots={selectedSlots} />}
      {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <Loader />
        </div>
      )}
      <TopNavbar />
      <Header />
      <Container className="product-container">
        <section id="product-info" className="mt-4">
          <Row>
            {/* Left Section: Thumbnails */}
            <Col md={2} className="thumbnail-column">
              {/* Product images section */}
              {data.product_img && data.product_img.length > 0 ? (
                data.product_img.map((imageUrl, index) => (
                  <div key={index} className="thumb-box my-2" onClick={() => setImage(imageUrl)}>
                    <img src={imageUrl} alt={`Product Image ${index + 1}`} className="thumb-img" />
                  </div>
                ))
              ) : (
                <p>No images available</p>
              )}

              {data.product_img && data.product_img.length > 0 ? (
                data.product_img.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="thumb-box my-2"
                    onClick={() => setImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Product Image ${index + 1}`}
                      className="thumb-img"
                    />
                  </div>
                ))
              ) : (
                <p>No images available</p>
              )}
              {data.product_img && data.product_img.length > 0 ? (
                data.product_img.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="thumb-box my-2"
                    onClick={() => setImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Product Image ${index + 1}`}
                      className="thumb-img"
                    />
                  </div>
                ))
              ) : (
                <p>No images available</p>
              )}
              {data.product_img && data.product_img.length > 0 ? (
                data.product_img.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="thumb-box my-2"
                    onClick={() => setImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Product Image ${index + 1}`}
                      className="thumb-img"
                    />
                  </div>
                ))
              ) : (
                <p>No images available</p>
              )}
              <h5 className=" mt-5 text-xl font-semibold text-center mb-4 text-blue-600">
                Our Branch
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
                {[
                  "Surat", "Rajkot", "Vadodara", "Gandhinagar", "Ahmedabad",
                  "Bhavnagar", "Junagadh", "Jamnagar", "Mehsana", "Navsari",
                  "Sabarkantha", "Kheda", "Surendranagar", "Amreli"
                ].map((city, index) => (
                  <h6 key={index} className="text-lg bg-white px-4 py-2 rounded-md shadow hover:bg-blue-200 cursor-pointer">
                    {city}
                  </h6>
                ))}
              </div>

            </Col>


            <Col md={6} className="main-image-column">
              <img
                src={image || (data.product_img && data.product_img[0])} // Show selected or first image
                alt="Main Product"
                className="main-product-img border border-black"
              />
              <div className="py-3">
                <h3>What is Box Cricket?</h3>
                <p>
                  Box Cricket is an exciting and fast-paced version of traditional cricket, played indoors in a confined space. The game combines the thrill of cricket with the challenges of playing in a smaller, enclosed area. It is typically played with teams of 6-8 players, making it an ideal sport for smaller groups.
                </p>
              </div>
              <div className="py-3">
                <h4>Key Features of Box Cricket</h4>
                <p>
                  <strong>Smaller Playing Area:</strong> Box Cricket is played within a confined space, often indoors, with smaller boundaries compared to a full-sized cricket field.
                </p>
                <p>
                  <strong>Rubberized Ball:</strong> A smaller, rubberized ball is used to ensure safety and enhance indoor play.
                </p>
                <p>
                  <strong>Wall Interactions:</strong> In Box Cricket, the walls play a unique role, with players using them for shots or bouncing the ball off them for strategic advantages.
                </p>
              </div>

              <h4>Why Box Cricket?</h4>
              <p>
                Box Cricket is a great way to enjoy cricket in areas where traditional outdoor play isn’t feasible. It’s perfect for urban areas, providing an accessible way to play cricket in smaller spaces, while still maintaining all the excitement and competitive spirit of the sport.
              </p>
            </Col>
            {/* Right Section: Product Details */}
            <Col md={4} className="product-details">
              <h2 className="product-title">
                {data.product_name} <span>{data.category?.name}</span>
              </h2>

              {/* Ratings and Reviews */}
              <div className="ratings mb-2">
                <span className="stars">★★★★☆</span>
                <span className="review-count">(120 reviews)</span>
              </div>

              {/* Product Price */}
              <h3 className="product-price">${data.product_price}</h3>

              {/* Other Product Details */}
              <p>
                <strong>Description:</strong> {data.product_description}
              </p>
              <p>
                <strong>Stock:</strong> {data.Product_stock}
              </p>
              <p>
                <strong>Discount Rate:</strong> {data.Product_dis_rate}
              </p>
              <p>
                <strong>Rating:</strong> {data.Product_rating}
              </p>
              <p>
                <strong>Address:</strong> {data.product_address}
              </p>

              <div>
                Date Picker : &nbsp;
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                />
              </div>
              <br />
              <h6>Book Your Slots:</h6>
              <div className="time-slot-container">
                {timeSlots.map((slot, index) => {

                  return (
                    <button
                      key={index}
                      className={`time-slot ${selectedSlots?.includes(slot) ? "selected" : ""} ${selectedSlotsForCancel?.includes(slot) ? "bg-danger" : ""} ${allBookings?.myBooking?.includes(slot) && !selectedSlots?.includes(slot) ? "bg-success text-light" : ""} `}
                      onClick={() => toggleSlot(slot, !allBookings?.myBooking?.includes(slot) ? "newSelect" : "bookedSelect")}
                      disabled={allBookings?.othersBooking?.includes(slot)}
                    >
                      {slot}
                    </button>
                  );
                })}

              </div>

              {/* Display Selected Slots */}
              <div className="selected-slots mt-3">
                <strong>Selected Slots:</strong>{" "}
                {selectedSlots.length > 0
                  ? selectedSlots.join(", ")
                  : "No slots selected"}
              </div>

              {/* Display Total Price */}
              <div className="total-price mt-3">
                <strong>Total Price:</strong> ${calculateTotalPrice()}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons mt-3">
                <button
                  className={`btn btn-primary w-100 ${selectedSlots.length === 0 ? "disabled" : ""}`}
                  disabled={selectedSlots.length === 0}
                  onClick={bookSlot}
                >
                  {selectedSlots.length > 0
                    ? `Proceed to Book (${selectedSlots.length} slots)`
                    : "Select Slots to Book"}
                </button>

                <button
                  className={`btn btn-danger my-2 w-100 ${selectedSlotsForCancel.length === 0 ? "disabled" : ""}`}
                  disabled={selectedSlotsForCancel.length === 0}
                  onClick={cancelBookedSlot}
                >
                  {selectedSlotsForCancel.length > 0
                    ? `Cancel (${selectedSlotsForCancel.length} slots)`
                    : "Select Slots to Cancel"}
                </button>
              </div>
            </Col>
            <section className="py-5">
              <div className="container">
                <div className="row">
                  <div className="col-md-6 wow fadeIn" data-wow-delay="0.1s">
                    <h2 className="fw-bold mb-4">Our Location</h2>
                    <p>We are located at the address below. Feel free to visit us or use the map to get directions:</p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil, debitis et? Inventore?</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita hic veritatis sequi iste?</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis rem modi optio quidem distinctio quibusdam aperiam illo et voluptatum!</p>
                  </div>
                  <div className="col-md-6 wow fadeIn" data-wow-delay="0.2s">
                    <iframe
                      className="position-relative rounded w-100 h-100"
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d59507.233368723566!2d72.8498176!3d21.2238336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1703589444996!5m2!1sen!2sin"
                      width="600"
                      height="450"
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                      frameBorder="0"
                      style={{ minHeight: "350px", border: "0" }}
                      aria-hidden="false"
                      tabIndex="0"
                    ></iframe>
                  </div>
                </div>
              </div>
            </section>
          </Row>
        </section>
      </Container>
      <Footer />
    </>
  );
}

export default Product;
