// var mongoose = require("mongoose");

// var productDetailsSchema = mongoose.Schema({
//   product_name: { type: String },
//   product_price: { type: String },
//   product_description: { type: String },
//   category: { type: String },
//   product_img: { type: Array },
//   product_address: { type: String },
//   time_slots: [{
//     slot: { type: String },
//     available: { type: Boolean, default: true }
//   }],
//   Product_stock: { type: String },
//   Product_dis_rate: { type: String },
//   Product_rating: { type: String },
//   isRenovation: { type: Boolean, default: false }
// });

// module.exports = mongoose.model("Product_details", productDetailsSchema);
const mongoose = require("mongoose");

const productDetailsSchema = mongoose.Schema({
  product_name: { type: String, required: true },
  product_price: { type: String },
  product_description: { type: String },
  category: { type: String, required: true },
  product_img: { type: Array },
  product_address: { type: String },
  time_slots: [
    {
      slot: { type: String },
      available: { type: Boolean, default: true },
    },
  ],
  Product_stock: { type: String },
  Product_dis_rate: { type: String },
  Product_rating: { type: String },
  isRenovation: { type: Boolean, default: false },
  isTournament: { type: Boolean, default: false },
  // Fields specific to Box Cricket
  isBoxCricket: { type: Boolean, default: false },
  tournament_details: {
    tournament_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    max_teams: { type: Number },
    match_duration: { type: String }, // e.g., "4 hours per match"
  },
});

module.exports = mongoose.model("Product_details", productDetailsSchema);
