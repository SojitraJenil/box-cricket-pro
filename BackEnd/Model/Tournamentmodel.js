const mongoose = require("mongoose");

const tournamentSchema = mongoose.Schema({
    tournament_name: { type: String, required: true },
    organizer: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    venue: { type: String, required: true },
    teams: [
        {
            team_name: { type: String },
            captain: { type: String },
            players: [{ type: String }],
        },
    ],
    booked_slots: [
        {
            slot: { type: String, required: true },
            date: { type: Date, required: true },
        },
    ],
    status: { type: String, enum: ["Upcoming", "Ongoing", "Completed"], default: "Upcoming" },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product_details" },
});

module.exports = mongoose.model("Tournament", tournamentSchema);
