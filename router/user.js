const express = require('express');
const router = express.Router();
const user = require('../controller/user.js');




//用户请求的是注册页面
router.get('/register', user.register1)

//用户请求的是登录页面
router.get('/login', user.login1)
    //要注册新用户了
router.post('/register', user.register)
    //登录请求
router.post('/login', user.login)
    //注销功能
router.get('/outlogin', user.outlogin)
module.exports = router;