const asyncHandler = require("express-async-handler");
const newsLetter = require("../models/newsLetterModels");
require("dotenv").config();

const registerNewsLetter = asyncHandler(async(req,res) => {
    const { title, author, date, description, imageUrl } = req.body;

    // Check for missing fields
    if (!title || !author || !date || !description || !imageUrl) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    // Check if the newsLetter already exists
    const newsLetterExists = await newsLetter.findOne({ title });
    if (newsLetterExists) {
        return res.status(400).json({ message: "newsLetter already exists" });
    }


    // Create a new doctor
    const newNewsLetter = await newsLetter.create({
        title,
        author,
        date,
        description,
        imageUrl,
    });

    // Respond with success message and the created newsLetter
    res.status(201).json({ message: "newsLetter registered successfully", newsLetter: newNewsLetter });
})


// Get all newsLetter
const getNewsletter = asyncHandler(async (req, res) => {

    try{
        // Get specific newsletter by ID
        const newsletter = await Newsletter.findById();
        res.status(200).json(newsletter);
    }
    catch(error){        
        res.status(404).json({ error: "Newsletter not found" });
        return;}
        
        
}
);

// Update a specific newsletter by ID
const updateNewsletter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, author, date, description, imageUrl } = req.body;

    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
        res.status(404).json({ error: "Newsletter not found" });
        return;
    }

    // Update fields if provided in request
    newsletter.title = title || newsletter.title;
    newsletter.author = author || newsletter.author;
    newsletter.date = date || newsletter.date;
    newsletter.description = description || newsletter.description;
    newsletter.imageUrl = imageUrl || newsletter.imageUrl;

    const updatedNewsletter = await newsletter.save();
    res.status(200).json({ message: "Newsletter updated successfully", newsletter: updatedNewsletter });
});

// Delete a specific newsletter by ID
const deleteNewsletter = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
        res.status(404).json({ error: "Newsletter not found" });
        return;
    }

    await newsletter.remove();
    res.status(200).json({ message: "Newsletter deleted successfully" });
});


module.exports = { registerNewsLetter ,getNewsletter,updateNewsletter,deleteNewsletter};