const moment = require('moment');
const conn = require('../db/db.js')

const articleAdd = (req, res) => {
    // console.log(req.session.user)
    // { id: 2,
    //     username: '111',
    //     password: '3333',
    //     nickname: '4444',
    //     ctime: '',
    //     isdel: 0 }
    if (!req.session.islogin) {
        //res.redirect('/')
        res.redirect('/')
    }
    res.render('./article/add.ejs', {
        user: req.session.user,
        islogin: req.session.islogin
    });


}
const detail = (req, res) => {
    let body = req.body;

    body.ctime = moment().format('YYYY-MM-DD HH:mm:ss');

    // {
    //     authorId: '2',
    //     title: '333',
    //     content: '111',
    //     ctime: '2019-06-25 15:01:48' }
    //'insert into blog_users set ?'
    //console.log(body);
    let sql = 'insert into blog_articles set ?';
    conn.query(sql, body, (err, result) => {
        if (err) return res.send({ msg: err.message, status: 501, })
        if (result.affectedRows !== 1)({ msg: '新增失败', status: 501, })
        res.send({ msg: '添加成功', status: 200 });
    })


}
module.exports = {
    articleAdd,
    detail
}