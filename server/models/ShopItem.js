import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  category: {
    type: String,
    enum: ["badge", "role", "feature", "physical", "virtual", "custom"],
    default: "virtual",
  },
  image: {
    type: String,
    default: "",
  },
  stock: {
    type: Number,
    default: -1, // -1 for unlimited
    min: -1,
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requirements: {
    minLevel: {
      type: Number,
      default: 1,
      min: 1,
    },
    minPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    requiredBadges: [String],
    requiredRole: {
      type: String,
      enum: ["Member", "Moderator", "Event Staff", "Admin", "Organisation"],
    },
  },
  benefits: {
    pointsBonus: {
      type: Number,
      default: 0,
    },
    roleUpgrade: {
      type: String,
      enum: ["Member", "Moderator", "Event Staff", "Admin"],
    },
    customBadge: String,
    specialAccess: [String],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
shopItemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
shopItemSchema.index({ organization: 1, isActive: 1, category: 1 });
shopItemSchema.index({ organization: 1, isFeatured: 1 });
shopItemSchema.index({ price: 1, isActive: 1 });

const ShopItem = mongoose.model("ShopItem", shopItemSchema);

export default ShopItem; 