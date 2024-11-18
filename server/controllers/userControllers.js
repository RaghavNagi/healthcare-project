// const asyncHandler = require("express-async-handler");
// const bcrypt = require("bcrypt");
// const User = require("../models/userModel"); // Corrected variable name to 'User'
// require("dotenv").config();

// const registerUser = asyncHandler(async (req, res) => {
//     const { firstName, lastName, age, gender, bloodGroup, email, phoneNumber, password } = req.body;

//     // Validate all required fields
//     if (!firstName || !lastName || !age || !gender || !bloodGroup || !email || !phoneNumber || !password) {
//         res.status(400);
//         throw new Error("Please fill all fields");
//     }

//     // Check if the user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//         return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create a new user
//     const newUser = await User.create({
//         firstName,
//         lastName,
//         age,
//         gender,
//         bloodGroup,
//         email,
//         phoneNumber,
//         password: hashedPassword,
//     });

//     res.status(201).json({ message: "User registered successfully", user: newUser });
// });

// const loginUser = asyncHandler(async(req, res) => {
//     const {email, password} = req.body;
//     if(!email || !password){
//         res.status(400);
//         throw new Error("please fill all fields");
//     }
//     const user = await User.findOne({email});
//     if(!user){
//         return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const passwordMatch  = await bcrypt.compare(password, user.password);
//     if(!passwordMatch){
//         return res.status(400).json({message:"password did not match"});
//     } 
    
//     res.status(200).json({
//         message: "Login successful",
//         user: {
//             id: user._id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             bloodGroup: user.bloodGroup,
//             age: user.age,
//             gender: user.gender,
//         },
//     });
// })

// module.exports = { registerUser , loginUser};

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const User = require("../model/userModel");
const User = require("../models/userModel"); // Corrected variable name to 'User'
require("dotenv").config();

// Register user
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, age, gender, bloodGroup, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !age || !gender || !bloodGroup || !email || !phoneNumber || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        firstName,
        lastName,
        age,
        gender,
        bloodGroup,
        email,
        phoneNumber,
        password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }
    
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.PRIVATE_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// Get all users (admin or superuser access)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json({
        message: "Users fetched successfully",
        users,
    });
});

// Get the current user's profile
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;  // The user ID comes from the JWT token validation middleware

    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        message: "User profile fetched successfully",
        user,
    });
});

// Update the current user's profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;  // The user ID comes from the JWT token validation middleware
    const { firstName, lastName, age, gender, bloodGroup, email, phoneNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Update the user's profile
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.bloodGroup = bloodGroup || user.bloodGroup;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();

    res.status(200).json({
        message: "User profile updated successfully",
        user,
    });
});

module.exports = { registerUser, loginUser, getAllUsers, getUserProfile, updateUserProfile };