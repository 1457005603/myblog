const express = require('express');
const router = express.Router();

const articleAdd = require('../controller/article.js');

router.get('/article/add', articleAdd.articleAdd);

router.post('/article/add', articleAdd.detail);

module.exports = router;