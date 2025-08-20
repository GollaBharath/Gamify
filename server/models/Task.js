import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
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
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 1000,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard", "expert"],
    default: "medium",
  },
  type: {
    type: String,
    enum: ["submission", "quiz", "participation", "creative", "survey"],
    default: "submission",
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  submissionFormat: {
    type: String,
    enum: ["text", "file", "link", "image", "video", "multiple"],
    default: "text",
  },
  maxSubmissions: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  deadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["draft", "active", "inactive", "completed"],
    default: "draft",
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
  }],
  criteria: {
    minLength: {
      type: Number,
      default: 0,
    },
    maxLength: {
      type: Number,
      default: 10000,
    },
    allowedFileTypes: [String],
    maxFileSize: {
      type: Number,
      default: 10, // MB
    },
  },
  autoApprove: {
    type: Boolean,
    default: false,
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
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Validate that deadline is after creation date
taskSchema.pre("save", function (next) {
  if (this.deadline && this.deadline <= new Date()) {
    return next(new Error("Deadline must be in the future"));
  }
  next();
});

// Index for better query performance
taskSchema.index({ event: 1, status: 1, order: 1 });
taskSchema.index({ status: 1, deadline: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task; 