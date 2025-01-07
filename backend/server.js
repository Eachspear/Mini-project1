// const express=require("express");

// const dotenv=require("dotenv").config();

// const app=express();


// app.get("/",(req,res) =>{
//     res.status(200).send("welcome to paper hub");
    
// })


// const port=5000;
// app.listen(port, ()=>{
//     console.log('server is running on port:',port);
// });
const express = require("express");
// const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//  import { MongoClient, GridFSBucket } from 'mongodb';
//const MongoClient = require('mongodb').MongoClient
// MongoDB connection URI
const uri = 'mongodb://localhost:27017/paperhub.question_papers';

// Connect to MongoDB//
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// }

mongoose.connect(
    "mongodb://localhost:27017/paperhub",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

// Define the exam paper schema
const examPaperSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  year: { type: String, required: true },
  name: {type: String, required: true}
  // Other fields for exam paper details
});

// Create a model from the schema
const ExamPaper = mongoose.model('question_papers', examPaperSchema);
 
const app = express();
var cors = require('cors');
// app.set("view engine", "ejs");
 
app.use(bodyParser.urlencoded({
    extended: true
}));
 
app.use(express.static(__dirname + '/public'));

async function getPapersBySubjectAndYear(subject, year) {
    try {
      // Find papers with the specified subject and year
      const papers = await ExamPaper.find({ subject: subject });
      return papers;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Throw the error to handle it in the calling function
    }
  }
  app.use(cors());
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
app.get("/exam-papers",
async function (req, res)  {
    try {
      // Connect to MongoDB
      //await mongoose.connect('mongodb://localhost:27017/paperhub.question_papers', { useNewUrlParser: true, useUnifiedTopology: true });
  
      // Find papers for subject "Mathematics" and year 2023
      console.log(req.query.subject)
      const papers = await getPapersBySubjectAndYear(req.query.subject);
      console.log('Papers:', papers);
      res.send({data:papers, success: true})
    } catch (error) {
      console.error('Error:', error);
      res.send({data:papers, success: false})
    } finally {
      // Disconnect from MongoDB
      //await mongoose.disconnect();
    }
  });
 
// app.post("/contact",
//     function (req, res) {
//         console.log(req.body.email);
//         const contact = new Contact({
//             email: req.body.email,
//             query: req.body.query,
//         });
//         contact.save(function (err) {
//             if (err) {
//                 throw err;
//             } else {
//                 res.render("contact");
//             }
//         });
//     });
 
app.listen(3000,
    function () {
        console.log("App is running on Port 3000");
        //connectToMongoDB();
    });