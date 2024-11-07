//Framework Configuration
const express = require("express");
const connectDb = require("./config/dbConnections");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
// const hbs = require("hbs");
const path = require("path");
const multer = require("multer");
// const upload = multer({dest:'./uploads' });
const dotenv = require("dotenv");
dotenv.config();

connectDb();
const app = express();
const port = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname));
    }
  })
  
  const upload = multer({ storage: storage })

app.use(express.json());
app.use(cors());

app.use(errorHandler);


const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('view engine', 'hbs');
// Serve static files from the 'uploads' folder

let imageUrls = [];

app.use('/api/register', require("./routes/userRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);
//ROUTES BELOW
app.get('/',(req,res)=>{
    res.send("working");
});

app.get('/home', (req, res) => {
    res.render("home", {
        title: "Dynamic Home Page",
        message: "Welcome to the dynamic home page!",
        user: {
            name: "John Doe",
            age: 30
        }
    });
})

app.get('/allusers', (req, res) => {
    // Mock array of user objects (replace with real data from a database)
    const users = [
        { name: "John Doe", age: 30, email: "johndoe@example.com", role: "Admin" },
        { name: "Jane Smith", age: 25, email: "janesmith@example.com", role: "User" },
        { name: "Alice Johnson", age: 28, email: "alicejohnson@example.com", role: "Moderator" }
    ];
    // Pass the users array to the view
    res.render('users', { users });
});

app.post("/profile", upload.single("avatar"), function(req, res, next) {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    console.log(req.body);
    console.log(req.file);

    const fileName = req.file.filename;
    const imageUrl = `/uploads/${fileName}`;
    imageUrls.push(imageUrl);
    return res.render("allimages", {
        imageUrls: imageUrls
    });
});

app.get("/allimages", (req, res) => {
    const imageUrls = []; 
    res.render("images", { imageUrls: imageUrls }); 
});

app.listen(port, () =>{
    console.log(`Server running in port http://localhost:${port}`);
});