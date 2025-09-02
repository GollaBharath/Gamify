import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/google", passport.authenticate("google",{ scope: ["profile", "email"] }))

router.get("/google/callback",
    passport.authenticate("google", {failureRedirect: "http://localhost:5000/auth" }),
    (req, res) => {
      
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        })
        // redirect back to frontend with token in query
        res.redirect(`http://localhost:5173/dashboard?token=${token}`)
    }
)

export default router;
