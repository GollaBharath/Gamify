import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  settings: {
    pointMultiplier: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 10,
    },
    maxPointsPerTask: {
      type: Number,
      default: 100,
      min: 1,
      max: 1000,
    },
    allowPointTransfer: {
      type: Boolean,
      default: false,
    },
    autoApproveTasks: {
      type: Boolean,
      default: false,
    },
  },
  isActive: {
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
organizationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization; 