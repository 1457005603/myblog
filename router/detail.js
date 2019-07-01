const express = require('express');
const router = express.Router();
const ctrl = require('../controller/article.js')



router.get('/article/detail/:id', ctrl.info)


//监听 客户端请求文章编辑页面
router.get('/article/edit/:id', ctrl.showEditPage)

router.post('/article/edit/', ctrl.editArticle)

module.exports = router;