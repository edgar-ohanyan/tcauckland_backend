const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();

const jsonParser = bodyParser.json();

const app = express();
const port = 3001;

// Set up storage for uploaded files using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail", // e.g., 'Gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const cors = require("cors");
app.use(cors());

// API endpoint to receive email and filefrom submit-cv page
app.post("/submit-cv", jsonParser, upload.single("file"), (req, res) => {
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
    subject: "User uploaded CV",
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
    attachments: [
      {
        filename: file.originalname,
        content: file.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email.");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully.");
    }
  });
});

// API endpoint to receive email and filefrom Tutoring Request page
app.post("/tutoring-req", jsonParser, upload.single("file"), (req, res) => {
  const { topic, name, edu, timing, area, email, phone, specReq } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "Find A Tutor",
    text: `
      Topic: ${topic},
      Name: ${name},
      Education Level: ${edu},
      Select timing: ${timing},
      Area: ${area},
      Email: ${email},
      Phone: ${phone},
      Special Requirenments: ${specReq},
            `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email.");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully.");
    }
  });
});

// API endpoint to receive email and filefrom Submit Vacancy page
app.post("/submit-vacancy", jsonParser, upload.single("file"), (req, res) => {
  const {
    name,
    email,
    phone,
    compName,
    schoolName,
    jobTitle,
    website,
    city,
    country,
    curriculum,
    ey,
    primary,
    secondary,
    wholeSchool,
    noOfVaccanies,
  } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "Submit Vacancy",
    text: `
      Name: ${name},
      Email: ${email},
      Phone: ${phone},
      Company Name: ${compName},
      School Name: ${schoolName},
      Job Title: ${jobTitle},
      Website: ${website},
      City: ${city},
      Country: ${country},
      Curriculum: ${curriculum},
      EY: ${ey == "true" ? "Accepted" : "Empty"}
      Primary: ${primary == "true" ? "Accepted" : "Empty"},
      Secondary: ${secondary == "true" ? "Accepted" : "Empty"},
      Whole School: ${wholeSchool == "true" ? "Accepted" : "Empty"},
      No Of Vacancies: ${noOfVaccanies},
            `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email.");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully.");
    }
  });
});

// API endpoint to receive email from Applicant Details
app.post(
  "/student-application",
  jsonParser,
  upload.single("file"),
  (req, res) => {
    let {
      fName,
      lName,
      mName,
      gender,
      bDay,
      nation,
      birthCountry,
      addressStr,
      addressStrLine2,
      city,
      stateProvince,
      postalZipCode,
      country,
      phone,
      email,
      emergContactName,
      emergContactRelation,
      emergContactAddr,
      emergContactPhone,
      intendedDegree,
      sponsorName,
      proposedStartDate,
      scholarship,
      secondaryEduName,
      secondaryEduCountry,
      secondaryEduDates,
      eduQualifSubject,
      eduQualifLevel,
      eduQualifGrade,
      eduQualifDate,
      englishLangCertificate,
      englishLangCertificateGrade,
      englishLangCertificateDate,
      applicationSupportStatement,
      confirmationCheckbox,
      certificationCheckbox,
    } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "Applicant Details",
      text: `
  Full Name: ${fName} ${mName} ${lName}
  Gender: ${gender}
  Date of Birth: ${bDay}
  Nationality: ${nation}
  Country Of Birth: ${birthCountry}
  Address Street: ${addressStr}
  Address Street Line 2: ${addressStrLine2}
  City: ${city}
  State / Province: ${stateProvince}
  Postal / Zip Code: ${postalZipCode}
  Country: ${country}
  Phone: ${phone}
  Email: ${email}

  Emergency Contact Name: ${emergContactName}
  Emergency Contact Relation: ${emergContactRelation}
  Emergency Contact Phone Number: ${emergContactPhone}
  Emergency Contact Address: ${emergContactAddr}

  What is the intended degree? ${intendedDegree}
  Name of sponsor: ${sponsorName}
  Proposed start date: ${proposedStartDate}
  How do you intend to pay? ${scholarship}

  Secondary, Higher Education: ${secondaryEduName}
  Secondary, Higher Education Country: ${secondaryEduCountry}
  Secondary, Higher Education Dates: ${secondaryEduDates}

  Educational Qualifications Subject: ${eduQualifSubject}
  Educational Qualifications Level: ${eduQualifLevel}
  Educational Qualifications Grade: ${eduQualifGrade}
  Educational Qualifications Date: ${eduQualifDate}

  English Language Proficiency: ${englishLangCertificate}
  English Language Proficiency Grade: ${englishLangCertificateGrade}
  English Language Proficiency Date: ${englishLangCertificateDate}

  Statement In Support Of Application
  ${applicationSupportStatement}

  I confirm that I give the authority to Scholar Students Ltd to discuss my application, receive correspondence and apply to universities and institutes in New Zealand on my behalf.
  ${confirmationCheckbox == "true" ? "Accepted" : "Rejected"}

  I certify that, to the best of my knowledge, the information I have provided is complete and true.
  ${certificationCheckbox == "true" ? "Accepted" : "Rejected"}

          `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending email.");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Email sent successfully.");
      }
    });
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
