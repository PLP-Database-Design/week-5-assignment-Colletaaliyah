const express = require('express')
const app = express()
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv'); 

// 
app.use(express.json());
app.use(cors());
dotenv.config(); 

// connection to the database 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});
// Check if there is a connection 
db.connect((err) => {
    // If no connection 
    if (err) {
        console.error("Error connecting to MYSQL:", err);  // Log detailed error
        return;
    }
    //If connect works successfully
    console.log("Connected to MYSQL as id: ", db.threadId); 
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// Question 1 goes here
app.get('/data', (req,res) => {
    // Retrieve data from database 
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err){
            console.error(err);
            res.status(500).send('Error Retrieving data')
        }else {
            //Display the records to the browser 
            res.render('data', {results: results});
        }
    });
});


// Question 2 goes here
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers data');
        } else if (results.length === 0) {
            res.status(404).send('No providers found');
        } else {
            res.json(results);
        }
    });
});


// Question 3 goes here
app.get('/patients', (req, res) => {
    db.query('SELECT first_name FROM patients', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving patients data');
        } else if (results.length === 0) {
            res.status(404).send('No patients found');
        } else {
            res.json(results); // Return the results as JSON
        }
    });
});



// Question 4 goes here
app.get('/providers/specialty', (req, res) => {
    console.log("Request received for /providers/specialty");
    const providerSpecialty = req.query.provider_specialty;

    if (!providerSpecialty) {
        return res.status(400).send('Provider specialty query parameter is required');
    }

    db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [providerSpecialty], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers data');
        } else if (results.length === 0) {
            res.status(404).send(`No providers found with the specialty: ${providerSpecialty}`);
        } else {
            res.json(results);
        }
    });
});
// usage on the /providers/specialty endpoint
// http://localhost:3000/providers/specialty?provider_specialty=PrimaryCare


// listen to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Sending a message to the browser
    app.get('/', (req, res) => {
        res.send('Server Started Successfully!');
    });
});
