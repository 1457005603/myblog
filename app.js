const express = require('express')
const app = express()
const fs = require('fs');
const path = require('path');
const app1 = require('./app');
//post请求的模块
const bodyParser = require('body-parser');
const session = require('express-session');
// 启用 session 中间件
app.use(session({
    secret: 'keyboard cat', // 相当于是一个加密密钥，值可以是任意字符串
    resave: false, // 强制session保存到session store中
    saveUninitialized: false // 强制没有“初始化”的session保存到storage中
}))
app.use(bodyParser.urlencoded({ extended: false }));

// 设置 默认采用的模板引擎名称
app.set('view engine', 'ejs')
    // 设置模板页面的存放路径
app.set('views', './views')
    //node_modules文件夹下的静态资源托管
app.use('/node_modules', express.static('node_modules'))
    //导入路由模块
    // const index = require('./router/index.js');

// app.use(index);

// const user = require('./router/user.js');

// app.use(user);
//读取路由下的文件循环导入路由模块
fs.readdir(path.join(__dirname, './router'), (err, filename) => {

    if (err) return console.log('读取router中的文件失败')

    filename.forEach(item => {
        // 用绝对路径导入
        // console.log(path.join(__dirname, "./router", item));
        const lujing = require(path.join(__dirname, "./router", item));
        app.use(lujing);
    })
})




app.listen(3002, () => {
    console.log("服务器运行成功……")
})
