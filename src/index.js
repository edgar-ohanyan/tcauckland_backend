const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const jsonParser = bodyParser.json();

const app = express();
const port = 5000;

// Set up storage for uploaded files using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const cors = require('cors');
app.use(cors());

// API endpoint to receive email and file
app.post('/sendEmail', jsonParser, upload.single('file'), (req, res) => {
    const {
        name,
        email,
        phone,
        dob,
        nationality,
        countryOfResidence,
        maritalStatus,
        dependentChildren,
        teachingRegions,
        applicationSubject,
        qualifiedSubject,
        qualifiedSubject2,
    } = req.body;

    const file = req.file;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: 'User uploaded CV',
        text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Date of Birth: ${dob}
Nationality: ${nationality}
Country of residence: ${countryOfResidence}
Marital Status: ${maritalStatus}
Dependent Children: ${dependentChildren}
Teaching Regions: ${teachingRegions}
Application Subject: ${applicationSubject}
Qualified Subject 1: ${qualifiedSubject}
Qualified Subject 2: ${qualifiedSubject2}
        `,
        attachments: [{
            filename: file.originalname,
            content: file.buffer
        }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email.');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
