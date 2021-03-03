const express = require('express');
const app = express();
const connectdb = require('./config/db');

// connect db

connectdb();

// Init middleware

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('<h1>Server Running</h1>'));

// Define Routes
app.use('/api/dept', require('./routes/api/dept'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/hr', require('./routes/api/hr'));
app.use('/api/applicant', require('./routes/api/applicant'));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
