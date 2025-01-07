// Import required modules
import express from 'express';
import { MongoClient, GridFSBucket } from 'mongodb';

// Create Express app
const app = express();
const port = 3000;

// MongoDB connection URI
const uri = 'mongodb://localhost:27017/paperhub.question_papers';

// Connect to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Middleware to handle requests
app.get('/pdf/:subject', async (req, res) => {
  const subject = req.params.subject;
  
  try {
    // Access the MongoDB database and collection
    const db = client.db('paperhub');
    const collection = db.collection('subjects');
    
    // Retrieve the document containing metadata about the PDF file
    const document = await collection.findOne({ subject: subject });
    
    if (document && document.pdf_file) {
      // Create a GridFSBucket instance
      const gridfsBucket = new GridFSBucket(db);
      
      // Open a download stream for the PDF file
      const downloadStream = gridfsBucket.openDownloadStreamByName(document.pdf_file.filename);
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${document.pdf_file.filename}"`);
      
      // Stream the PDF file content to the response
      downloadStream.pipe(res);
      
      // You may also want to handle errors during the streaming process
      downloadStream.on('error', error => {
        console.error('Error streaming PDF file:', error);
        res.status(500).send('Internal Server Error');
      });
    } else {
      res.status(404).send('PDF file not found');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
  // Connect to MongoDB when the server starts
  connectToMongoDB();
});
const mongoose = require('mongoose');

// Define the exam paper schema
const examPaperSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  year: { type: Number, required: true },
  // Other fields for exam paper details
});

// Create a model from the schema
const ExamPaper = mongoose.model('question_papers', examPaperSchema);

// Query to find papers based on subject and year
async function getPapersBySubjectAndYear(subject, year) {
  try {
    // Find papers with the specified subject and year
    const papers = await ExamPaper.find({ subject: subject, year: year });
    return papers;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Throw the error to handle it in the calling function
  }
}

// Example usage:
async function exampleUsage() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/paperhub.question_papers', { useNewUrlParser: true, useUnifiedTopology: true });

    // Find papers for subject "Mathematics" and year 2023
    const papers = await getPapersBySubjectAndYear('Operating System', 2022);
    console.log('Papers:', papers);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
  }
}

// Call the example usage function
exampleUsage();
