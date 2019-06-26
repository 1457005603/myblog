const moment = require('moment');
const conn = require('../db/db.js')

const register1 = (req, res) => {
    res.render('./user/register.ejs', {});
};

const login1 = (req, res) => {
    res.render('./user/login.ejs');
};

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
    const sql2 = 'insert into blog_users set ?'
    conn.query(sql2, body, (err, result) => {
        if (err) return res.send({ msg: '用户注册失败', status: 504 });
        if (result.affectedRows !== 1) return res.send({ msg: '注册用户失败', status: '505' });
        res.send({ msg: '注册新用户成功！', status: 200 });
    })
};

const login = (req, res) => {
    const body = req.body;

    const sql1 = 'select * from blog_users where username=? and password=?';
    conn.query(sql1, [body.username, body.password], (err, result) => {
        if (err) return res.send({ msg: '用户登录失败', status: 501 });
        // console.log(result)当登录成功时返回一个数组带用户登录信息的数组;
        if (result.length !== 1) return res.send({ msg: '用户登录失败', status: 502 })
            //将用户信息存储到session中
        req.session.user = result[0];
        req.session.islogin = true;
        res.send({ msg: 'ok', status: 200 });
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