import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopItem",
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  pointsSpent: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled", "refunded"],
    default: "pending",
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  benefitsApplied: {
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
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  refundedAt: {
    type: Date,
  },
  refundReason: {
    type: String,
    maxlength: 500,
  },
});

// Index for better query performance
purchaseSchema.index({ user: 1, status: 1, purchasedAt: -1 });
purchaseSchema.index({ organization: 1, status: 1 });
purchaseSchema.index({ item: 1, status: 1 });

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase; 