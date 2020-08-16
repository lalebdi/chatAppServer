const express = require('express');
const router = express.Router();



router.get('/', (req, res) => {
    res.send('server is up and running'); // this is so when you open localhost that the server is running
})

module.exports = router;