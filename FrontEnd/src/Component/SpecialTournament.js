import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdCurrencyRupee } from "react-icons/md";
import { FaCalendarAlt, FaMapMarkerAlt, FaTools, FaUser } from "react-icons/fa";

function SpecialTournament() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const userId = localStorage.getItem("userId");
    const [formData, setFormData] = useState({
        user_id: userId,
        selectedSlots: [],
        email: localStorage.getItem("userEmail") || "",
        date: "",
    });

    useEffect(() => {
        axios.get("http://localhost:8000/tournaments")
            .then(response => {
                setTournaments(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching tournament data:", error);
                setError("Failed to load tournament data. Please try again later.");
                setLoading(false);
            });
    }, []);

    const getTimeSlotGroups = () => {
        return [
            { label: "07:00 - 11:00", value: ["07:00", "08:00", "09:00", "10:00"] },
            { label: "12:00 - 16:00", value: ["12:00", "13:00", "14:00", "15:00"] },
            { label: "17:00 - 21:00", value: ["17:00", "18:00", "19:00", "20:00"] },
            { label: "22:00 - 02:00", value: ["22:00", "23:00", "00:00", "01:00"] },
            { label: "03:00 - 07:00", value: ["03:00", "04:00", "05:00", "06:00"] }
        ];
    };

    const handleRegisterClick = async (tournament) => {
        setSelectedTournament(tournament);
        setShowModal(true);
        setFormData((prev) => ({
            ...prev,
            date: new Date().toISOString().split("T")[0], // Default to today
            email: localStorage.getItem("userEmail") || "",
            selectedSlots: [],
        }));

        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User ID not found. Please login.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/user-tournament-bookings/${tournament._id}/${userId}`);
            console.log('response.data :>> ', response.data.allBookings.othersBooking);

            if (response.data && response.data.allBookings.myBooking.length > 0) {
                console.log('response.data.allBookings.myBooking :>> ', response.data.allBookings.myBooking);
                setFormData((prev) => ({
                    ...prev,
                    selectedSlots: response.data.allBookings.othersBooking.map(slot => slot.slot),
                }));
            }
        } catch (error) {
            console.error("Error fetching user tournament bookings:", error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSlotSelection = (slot) => {
        setFormData((prev) => {
            const isSelected = prev.selectedSlots.includes(slot);
            return {
                ...prev,
                selectedSlots: isSelected
                    ? prev.selectedSlots.filter((s) => s !== slot)
                    : [...prev.selectedSlots, slot],
            };
        });
    };


    const handleSubmit = () => {
        if (!selectedTournament) return;

        const payload = {
            ...formData,
            product_id: selectedTournament._id,
            tournament_name: selectedTournament.product_name,
        };

        axios.post("http://localhost:8000/book-tournament-slot", payload)
            .then((response) => {
                alert("Registration successful!");
                setShowModal(false);
            })
            .catch((error) => {
                console.error("Registration failed:", error);
                alert("Registration failed. Please try again.");
            });
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (

        <div className="container py-5">
            <h2 className="text-center mb-4">🏏 Special Tournament Offers (4 Hour) 🏏</h2>
            <div className="row">
                {tournaments.map((tournament) => (
                    <div className="col-md-6 mb-4" key={tournament._id}>
                        <div className="card shadow-lg position-relative">
                            {tournament.isRenovation && (
                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
                                    style={{ zIndex: 2 }}
                                >
                                    <div className="text-center">
                                        <FaTools className="text-warning mb-2" size={24} />
                                        <h5 className="fw-bold text-dark m-0">We are under maintenance</h5>
                                    </div>
                                </div>
                            )}
                            <div className="row g-0" style={{ filter: tournament.isRenovation ? "grayscale(70%)" : "none" }}>
                                <div className="col-md-4">
                                    {tournament.product_img[0] && (
                                        <img
                                            src={tournament.product_img[0]}
                                            className="img-fluid rounded-start h-100 object-fit-cover"
                                            alt={tournament.product_name}
                                        />
                                    )}
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h3 className="card-title fw-bold">{tournament.product_name}</h3>
                                        <p><FaUser className="me-2 text-primary" /><strong>Organizer:</strong> {tournament.organizer || "N/A"}</p>
                                        <p><FaMapMarkerAlt className="me-2 text-danger" /><strong>Venue:</strong> {tournament.product_address}</p>
                                        <p><FaCalendarAlt className="me-2 text-success" /><strong>Discount Rate:</strong> {tournament.Product_dis_rate}%</p>
                                        <p><MdCurrencyRupee className="me-2 text-warning" /><strong>Price:</strong> {tournament.product_price} INR</p>

                                        <div className="mt-4">
                                            <button className="btn btn-primary me-2" onClick={() => handleRegisterClick(tournament)} disabled={tournament.isRenovation}>
                                                Register Now
                                            </button>
                                            <button className="btn btn-outline-secondary" disabled={tournament.isRenovation}>
                                                More Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* Registration Modal */}
            {
                showModal && selectedTournament && (
                    <div className="modal d-block bg-dark bg-opacity-50">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Register for {selectedTournament.product_name}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Select Time Slot</label>
                                        {getTimeSlotGroups().map((group) => (
                                            <div key={group.label} className="mb-2">
                                                <strong>{group.label}</strong>
                                                <div>
                                                    {group.value.map((slot) => (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            className={`btn me-2 ${formData.selectedSlots.includes(slot) ? "btn-success" : "btn-outline-secondary"}`}
                                                            onClick={() => handleSlotSelection(slot)}
                                                        >
                                                            {slot}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
                                    <button className="btn btn-primary" onClick={handleSubmit}>Confirm Registration</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default SpecialTournament;
