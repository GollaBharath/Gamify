import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "active", "paused", "completed", "cancelled"],
    default: "draft",
  },
  maxParticipants: {
    type: Number,
    min: 1,
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  image: {
    type: String,
    default: "",
  },
  rules: [{
    type: String,
    trim: true,
  }],
  rewards: {
    firstPlace: {
      type: Number,
      default: 0,
    },
    secondPlace: {
      type: Number,
      default: 0,
    },
    thirdPlace: {
      type: Number,
      default: 0,
    },
    participation: {
      type: Number,
      default: 0,
    },
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
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
eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Validate that endDate is after startDate
eventSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

// Index for better query performance
eventSchema.index({ organization: 1, status: 1, startDate: -1 });
eventSchema.index({ status: 1, startDate: -1 });

const Event = mongoose.model("Event", eventSchema);

export default Event; 