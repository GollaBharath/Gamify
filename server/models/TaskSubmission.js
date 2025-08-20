import mongoose from "mongoose";

const taskSubmissionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  attachments: [{
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
  }],
  links: [{
    url: {
      type: String,
      required: true,
    },
    title: String,
    description: String,
  }],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "resubmitted"],
    default: "pending",
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewNotes: {
    type: String,
    maxlength: 1000,
  },
  pointsAwarded: {
    type: Number,
    default: 0,
    min: 0,
  },
  feedback: {
    type: String,
    maxlength: 1000,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
  },
  resubmittedAt: {
    type: Date,
  },
  version: {
    type: Number,
    default: 1,
  },
  isLate: {
    type: Boolean,
    default: false,
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0,
  },
});

// Update the updatedAt field on save
taskSubmissionSchema.pre("save", function (next) {
  // Check if submission is late
  if (this.task) {
    // This will be populated when querying
    // For now, we'll handle this in the controller
  }
  next();
});

// Index for better query performance
taskSubmissionSchema.index({ task: 1, user: 1, status: 1 });
taskSubmissionSchema.index({ user: 1, status: 1, submittedAt: -1 });
taskSubmissionSchema.index({ event: 1, status: 1 });
taskSubmissionSchema.index({ reviewedBy: 1, status: 1 });

// Compound index for unique submissions per user per task
taskSubmissionSchema.index({ task: 1, user: 1 }, { unique: false });

const TaskSubmission = mongoose.model("TaskSubmission", taskSubmissionSchema);

export default TaskSubmission; 