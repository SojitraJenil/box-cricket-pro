var Product = require("../Model/productmodel");
const Tournament = require('../Model/Tournamentmodel');

// exports.bookTournamentSlot = async (req, res) => {
//     const { user_id, product_id, selectedSlots, email, date, tournament_name } = req.body;

//     try {
//         if (!user_id || !product_id || !selectedSlots || selectedSlots.length === 0 || !date || !tournament_name) {
//             return res.status(400).json({ message: "Missing required data" });
//         }

//         if (selectedSlots.length !== 4) {
//             return res.status(400).json({ message: "You must select exactly 4 consecutive slots." });
//         }

//         // Fetch product details
//         const product = await Product.findById(product_id);
//         if (!product) {
//             return res.status(400).json({ message: "Product not found." });
//         }

//         const existingTournament = await Tournament.findOne({ tournament_name });

//         if (existingTournament) {
//             const conflictingSlots = [];
//             existingTournament.booked_slots.forEach(booking => {
//                 selectedSlots.forEach(slot => {
//                     if (booking.slot === slot && booking.date.toISOString().split("T")[0] === date) {
//                         conflictingSlots.push(slot);
//                     }
//                 });
//             });

//             if (conflictingSlots.length > 0) {
//                 return res.status(400).json({ message: `Slots ${conflictingSlots.join(", ")} are already booked.` });
//             }

//             // Add new slots to existing tournament
//             existingTournament.booked_slots.push(...selectedSlots.map(slot => ({ slot, date })));
//             await existingTournament.save();
//         } else {
//             // Create new tournament entry
//             const newTournament = new Tournament({
//                 tournament_name,
//                 organizer: email,
//                 start_date: date,
//                 end_date: date,
//                 venue: product.product_address,
//                 booked_slots: selectedSlots.map(slot => ({ slot, date })),
//                 status: "Upcoming",
//                 product_id: product_id, // Ensure product_id is stored
//             });

//             await newTournament.save();
//         }

//         // Return the response with **all product details**
//         res.status(201).json({
//             message: "Tournament slot booked successfully!",
//             tournament_details: existingTournament ? existingTournament : newTournament,
//             product_details: product
//         });


//     } catch (err) {
//         console.error("Error in booking tournament slot:", err);
//         res.status(500).json({ error: err.message });
//     }
// };

exports.bookTournamentSlot = async (req, res) => {
    const { user_id, product_id, selectedSlots, email, date, tournament_name } = req.body;

    try {
        // Ensure that all required fields are provided in the request
        if (!user_id || !product_id || !selectedSlots || selectedSlots.length === 0 || !date || !tournament_name) {
            return res.status(400).json({ message: "Missing required data" });
        }

        // Ensure exactly 4 slots are selected
        if (selectedSlots.length !== 4) {
            return res.status(400).json({ message: "You must select exactly 4 consecutive slots." });
        }

        // Fetch product details using the product_id
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(400).json({ message: "Product not found." });
        }

        // Check if the product is related to a tournament
        if (product.isTournament) {
            // Proceed if the product is part of a tournament
            const existingTournament = await Tournament.findOne({ tournament_name });

            if (existingTournament) {
                // Check if the selected slots conflict with already booked slots in the existing tournament
                const conflictingSlots = [];
                existingTournament.booked_slots.forEach(booking => {
                    selectedSlots.forEach(slot => {
                        if (booking.slot === slot && booking.date.toISOString().split("T")[0] === date) {
                            conflictingSlots.push(slot);
                        }
                    });
                });

                if (conflictingSlots.length > 0) {
                    return res.status(400).json({ message: `Slots ${conflictingSlots.join(", ")} are already booked.` });
                }

                // Add new slots to the existing tournament
                existingTournament.booked_slots.push(...selectedSlots.map(slot => ({ slot, date })));
                await existingTournament.save();
            } else {
                // Create a new tournament entry if none exists
                const newTournament = new Tournament({
                    tournament_name,
                    organizer: email,
                    start_date: date,
                    end_date: date,
                    venue: product.product_address,
                    booked_slots: selectedSlots.map(slot => ({ slot, date })),
                    status: "Upcoming",
                    product_id: product_id, // Ensure product_id is stored
                });

                await newTournament.save();
            }

            // Return the response with all product details and tournament details
            res.status(201).json({
                message: "Tournament slot booked successfully!",
                tournament_details: existingTournament ? existingTournament : newTournament,
                product_details: product
            });
        } else {
            // If the product is not part of a tournament, return an error message
            res.status(400).json({ message: "The selected product is not a tournament-related product." });
        }
    } catch (err) {
        console.error("Error in booking tournament slot:", err);
        res.status(500).json({ error: err.message });
    }
};


exports.getAllTournaments = async (req, res) => {
    try {
        // Find all products where isTournament is true
        const tournamentProducts = await Product.find({ isTournament: true });

        console.log('tournamentProducts :>> ', tournamentProducts);

        if (!tournamentProducts || tournamentProducts.length === 0) {
            return res.status(404).json({ message: "No tournament products found." });
        }

        // Fetch booked slots for each tournament product
        const tournamentsWithSlots = await Promise.all(
            tournamentProducts.map(async (product) => {
                const tournamentDetails = await Tournament.findOne({ product_id: product._id });

                return {
                    ...product.toObject(),
                    booked_slots: tournamentDetails ? tournamentDetails.booked_slots : [],
                };
            })
        );

        // Return updated tournament products with booked_slots
        res.status(200).json(tournamentsWithSlots);
    } catch (err) {
        console.error("Error fetching tournament products:", err);
        res.status(500).json({ error: err.message });
    }
};


exports.getTournamentById = async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }
        res.status(200).json(tournament);
    } catch (err) {
        console.error("Error fetching tournament:", err);
        res.status(500).json({ error: err.message });
    }
};



exports.setTournamentStatus = async (req, res) => {
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

        // Toggle the isTournament field (if true -> false, if false -> true)
        product.isTournament = !product.isTournament;

        // Save the updated product
        await product.save();

        // Return the updated product with a success message
        res.status(200).json({
            message: `Product tournament status updated to ${product.isTournament}`,
            product
        });

    } catch (error) {
        // Handle any errors and return a 500 server error
        console.error("Error updating tournament status:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserTournamentBookings = async (req, res) => {
    const { user_id, product_id } = req.params;

    if (!user_id || !product_id) {
        return res.status(400).json({ message: 'Missing user_id or product_id' });
    }

    console.log(user_id, product_id);

    try {
        // Fetch tournament details using product_id
        const tournament = await Tournament.findOne({ product_id });

        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        const allBookings = {
            myBooking: [],
            othersBooking: []
        };

        // Check booked slots and separate user bookings
        tournament.booked_slots.forEach((slot) => {
            if (slot.user_id && slot.user_id.toString() === user_id) {
                allBookings.myBooking.push(slot);
            } else {
                allBookings.othersBooking.push(slot);
            }
        });

        res.status(200).json({ message: 'success', tournament, allBookings });

    } catch (error) {
        console.error('Error fetching tournament bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
