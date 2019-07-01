const moment = require('moment');
const conn = require('../db/db.js')
    //导入加密模块
const bcrypt = require('bcrypt');
const saltRounds = 10

const register1 = (req, res) => {
    res.render('./user/register.ejs', {});
};

const login1 = (req, res) => {
    res.render('./user/login.ejs');
};
//注册功能
const register = (req, res) => {
    let body = req.body;

    if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
        return res.send({ msg: '请将表单填写完整', status: 501 });
    }

    //查询用户名是否重复
    const sql1 = 'select count(*) as count from blog_users where username=?';

    conn.query(sql1, body.username, (err, result) => {
        if (err) return res.send({ msg: '用户名查重失败', status: 502 })
            //console.log(result[0].count ==0)的话表示用户名是新建的不存在数据库当中;
        if (result[0].count !== 0) return res.send({ msg: '请更换其他用户名', status: 503 })

    })
    body.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
    //调用bcrypt.hash()加密,在设置添加用户名和密码之前对密码进行加密
    bcrypt.hash(body.password, saltRounds, (err, pwdCryped) => {
        if (err) return res.send({ msg: '用户zhuce失败', status: 500 })
        console.log(pwdCryped)
        body.password = pwdCryped;
        //设置用户名的用户名和密码到blog_users表当中
        const sql2 = 'insert into blog_users set ?'
        conn.query(sql2, body, (err, result) => {
            if (err) return res.send({ msg: '用户注册失败', status: 504 });
            if (result.affectedRows !== 1) return res.send({ msg: '注册用户失败', status: '505' });
            res.send({ msg: '注册新用户成功！', status: 200 });
        })
    })

};

const login = (req, res) => {
    const body = req.body;
    console.log(body);
    // const sql1 = 'select * from blog_users where username=? and password=?';
    //查询用户名是否存在
    const sql1 = 'select * from blog_users where username=?';
    conn.query(sql1, [body.username], (err, result) => {
        if (err) return res.send({ msg: '用户登录失败', status: 501 });
        console.log(result)
            // console.log(result)当登录成功时返回一个数组带用户登录信息的数组;
        if (result.length !== 1) return res.send({ msg: '用户登录失败', status: 502 })

        //当用户登录成功之间进行密码解析对比
        bcrypt.compare(body.password, result[0].password, function(err, compireResult) {

            if (err) return res.send({ msg: '用户登录失败', status: 503 })
            console.log(compireResult)
            if (!compireResult) return res.send({ msg: '用户登录失败', status: 504 })

            // 内部对比的过程：
            // 1. 先获取 输入的明文
            // 2. 获取输入的密文
            // 2.1 从密文中，解析出来  bcrypt 算法的 版本号
            // 2.2 从密文中，解析出来 幂次
            // 2.3 从密文中，解析出来前 22 位 这个随机盐
            // 3. compare 方法内部，调用 类似于 hash 方法 把 明文，幂次，随机盐 都传递进去     最终得到正向加密后的密文
            // 4. 根据最新得到的密文，和 compare 提供的密文进行对比，如果相等，则 返回 true ，否则返回 false;
            //将用户信息存储到session中
            req.session.user = result[0];
            req.session.islogin = true;
            res.send({ msg: 'ok', status: 200 });
        })

    })
}

const outlogin = (req, res) => {
    //当点击注销时清除session
    req.session.destroy(function() {
            //使用res.redirect()方法让用户访问指定的页面
            res.redirect('/')
        })
        // res.redirect('/');
}
module.exports = {
    register1,
    login1,
    register,
    login,
    outlogin
}