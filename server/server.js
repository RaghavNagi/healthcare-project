// Framework Configuration
const express = require("express");
const connectDb = require("./config/dbConnections");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
const hbs = require("hbs");
dotenv.config();

connectDb();
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables CORS for all origins

// Set up storage for multer file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// View engine setup
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('view engine', 'hbs');

// Import routes
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const newsLetterRoutes = require("./routes/newsLetterRoutes");
// Define routes
app.use('/api/register', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use("/api/users", userRoutes); // Avoid duplicate routes if possible
app.use("/api/newsLetter",newsLetterRoutes);

// Route definitions
app.get('/', (req, res) => res.send("working"));

app.get('/home', (req, res) => {
    res.render("home", {
        title: "Dynamic Home Page",
        message: "Welcome to the dynamic home page!",
        user: { name: "John Doe", age: 30 }
    });
});

app.get('/allusers', (req, res) => {
    const users = [
        { name: "John Doe", age: 30, email: "johndoe@example.com", role: "Admin" },
        { name: "Jane Smith", age: 25, email: "janesmith@example.com", role: "User" },
        { name: "Alice Johnson", age: 28, email: "alicejohnson@example.com", role: "Moderator" }
    ];
    res.render('users', { users });
});

app.post("/profile", upload.single("avatar"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const fileName = req.file.filename;
    const imageUrl = `/uploads/${fileName}`;
    imageUrls.push(imageUrl);
    return res.render("allimages", { imageUrls });
});

app.get("/allimages", (req, res) => res.render("images", { imageUrls }));

// Error handler middleware should be used last
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));