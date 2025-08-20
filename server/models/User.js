import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["Member", "Moderator", "Event Staff", "Admin", "Organisation"],
    default: "Member",
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalPointsEarned: {
    type: Number,
    default: 0,
    min: 0,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
  },
  badges: [{
    type: String,
    trim: true,
  }],
  profile: {
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  permissions: {
    canCreateEvents: {
      type: Boolean,
      default: false,
    },
    canManageTasks: {
      type: Boolean,
      default: false,
    },
    canAwardPoints: {
      type: Boolean,
      default: false,
    },
    canManageShop: {
      type: Boolean,
      default: false,
    },
    canManageUsers: {
      type: Boolean,
      default: false,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastActive: {
    type: Date,
    default: Date.now,
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

// Update permissions based on role
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  
  // Set permissions based on role
  switch (this.role) {
    case "Organisation":
      this.permissions = {
        canCreateEvents: true,
        canManageTasks: true,
        canAwardPoints: true,
        canManageShop: true,
        canManageUsers: true,
      };
      break;
    case "Admin":
      this.permissions = {
        canCreateEvents: true,
        canManageTasks: true,
        canAwardPoints: true,
        canManageShop: true,
        canManageUsers: true,
      };
      break;
    case "Event Staff":
      this.permissions = {
        canCreateEvents: false,
        canManageTasks: true,
        canAwardPoints: false,
        canManageShop: false,
        canManageUsers: false,
      };
      break;
    case "Moderator":
      this.permissions = {
        canCreateEvents: false,
        canManageTasks: false,
        canAwardPoints: true,
        canManageShop: false,
        canManageUsers: false,
      };
      break;
    case "Member":
    default:
      this.permissions = {
        canCreateEvents: false,
        canManageTasks: false,
        canAwardPoints: false,
        canManageShop: false,
        canManageUsers: false,
      };
      break;
  }
  
  next();

});

// Calculate level based on total points earned
userSchema.methods.calculateLevel = function() {
  // Simple level calculation: every 1000 points = 1 level
  const newLevel = Math.floor(this.totalPointsEarned / 1000) + 1;
  if (newLevel !== this.level) {
    this.level = newLevel;
    return true; // Level changed
  }
  return false; // Level unchanged
};

const User = mongoose.model("User", userSchema);

export default User;
