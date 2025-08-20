import mongoose from "mongoose";

const pointTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  type: {
    type: String,
    enum: ["earned", "spent", "awarded", "deducted", "bonus", "refund"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true, // balance after transaction
  },
  source: {
    type: String,
    enum: ["task", "admin_award", "shop_purchase", "event_bonus", "level_up", "badge", "manual"],
    required: true,
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId, // Task, Event, Purchase, or other ID
  },
  referenceType: {
    type: String,
    enum: ["Task", "Event", "Purchase", "ShopItem", "TaskSubmission", "User"],
  },
  description: {
    type: String,
    maxlength: 500,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  metadata: {
    taskTitle: String,
    eventTitle: String,
    itemName: String,
    reason: String,
    multiplier: {
      type: Number,
      default: 1,
    },
  },
  isReversible: {
    type: Boolean,
    default: true,
  },
  reversedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reversedAt: {
    type: Date,
  },
  reversalReason: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for better query performance
pointTransactionSchema.index({ user: 1, organization: 1, createdAt: -1 });
pointTransactionSchema.index({ organization: 1, type: 1, createdAt: -1 });
pointTransactionSchema.index({ source: 1, createdAt: -1 });
pointTransactionSchema.index({ reference: 1, referenceType: 1 });

const PointTransaction = mongoose.model("PointTransaction", pointTransactionSchema);

export default PointTransaction; 