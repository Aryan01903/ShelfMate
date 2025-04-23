const user_model = require("../models/user_model");
const jwt = require("jsonwebtoken");
const auth_config = require("../configs/auth_config");

/**
 *  Middleware to validate the signup body (before OTP is sent)
 */
const verifySendOtpBody = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "Email is required to send OTP" });
    }

    const existingUser = await user_model.findOne({ email });
    if (existingUser) {
        return res.status(400).send({ message: "User already exists with this email" });
    }

    next();
};

/**
 *  Middleware to validate OTP + signup request
 */
const verifyOtpSignupBody = async (req, res, next) => {
    const { name, userId, email, password, otp } = req.body;

    if (!name || !userId || !email || !password || !otp) {
        return res.status(400).send({ message: "All fields are required for OTP signup" });
    }

    const existingUser = await user_model.findOne({ userId });
    if (existingUser) {
        return res.status(400).send({ message: "User with this userId already exists" });
    }

    next();
};

/**
 *  Middleware to validate signin body
 */
const verifySignInBody = (req, res, next) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).send({
            message: "Both identifier (userId or email) and password are required",
        });
    }

    next();
};

/**
 *  Middleware to verify JWT token
 */
const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(token, auth_config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized! Invalid token." });
        }

        const user = await user_model.findOne({ userId: decoded.id });

        if (!user) {
            return res.status(400).send({
                message: "User not found for the given token",
            });
        }

        req.user = user; // Attach user info to request
        next();
    });
};

module.exports = {
    verifySendOtpBody,
    verifyOtpSignupBody,
    verifySignInBody,
    verifyToken,
};
