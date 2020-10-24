const express = require('express');
const router = express.Router();

router.get("/reserve", (req, res) => {
    return res.end("HEYOOO");
})

module.exports = router;