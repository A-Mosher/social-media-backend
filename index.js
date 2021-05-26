const connectDB = require('./startup/db');
const express = require('express');
const app = express();
const profile = require('./routes/profile');


connectDB();

app.use(express.json());
app.use('/api/auth', profile);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});