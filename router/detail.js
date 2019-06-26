const express = require('express');
const router = express.Router();



router.get('./article/detail', (req, res) => {
    res.send('ok');
    res.render('./article/detail', {})
})

module.exports = router;