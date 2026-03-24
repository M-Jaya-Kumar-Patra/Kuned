import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  images: [
    {
      type: String
    }
  ],

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  slug: {
    type: String,
    unique: true
  },

  isHighlighted: {
    type: Boolean,
    default: false
  },

  topListing: {
  type: Boolean,
  default: false
},

urgentSale: {
  type: Boolean,
  default: false
},
reportCount: {
  type: Number,
  default: 0
},

hidden: {
  type: Boolean,
  default: false
},
views: {
  type: Number,
  default: 0
},
status: {
  type: String,
  enum: ["active", "sold"],
  default: "active"
},
specifications: [
  {
    key: String,
    value: String
  }
],
condition: {
  type: String,
  enum: ["new", "used", "refurbished"],
  required: true,
},

},
{ timestamps: true }
);

const Listing =  mongoose.models.Listing || mongoose.model("Listing", ListingSchema);

export default Listing