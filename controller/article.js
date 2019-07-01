const moment = require('moment');
const conn = require('../db/db.js');
const marked = require('marked');


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
        if (err) return res.send({ msg: err.message, status: 500, })
        if (result.affectedRows !== 1)({ msg: '新增失败', status: 501, })
            // console.log(result)
        res.send({ msg: '添加成功', status: 200, insertId: result.insertId });
    })


}
const info = (req, res) => {
    //获取文章id
    const id = req.params.id;
    //根据文章id查询信息
    const sql = 'select * from blog_articles where id=?'
    conn.query(sql, id, (err, result) => {
        if (err) return res.send({ msg: '查询文章详情失败', status: 500 })
        console.log(result)
            // res.redirect('/');是页面跳转到首页
        if (result.length !== 1) return res.redirect('/');
        //在渲染之间先把mk文本转为html文本
        //下载包文件转化npm i marked -S
        const html = marked(result[0].content);
        //把转换好的文本转换为html文本
        result[0].content = html;
        res.render('./article/detail.ejs', {
            user: req.session.user,
            islogin: req.session.islogin,
            article: result[0]
        });
    })
}

//展示编辑页面
const showEditPage = (req, res) => {
        //如果用户没有登录则不允许用户查看编辑页面
        if (!req.session.islogin) return res.redirect('/');
        //渲染原页面
        let sql = 'select * from blog_articles where id=?';

        conn.query(sql, req.params.id, (err, result) => {
            if (err) return res.redirect('/');
            // console.log(result);打印出文章详情是一个数组包含了一个文章详情的对象
            if (result.length !== 1) return res.redirect('/');
            //渲染详情页
            res.render('./article/edit.ejs', { user: req.session.user, islogin: req.session.islogin, article: result[0] });
        })


    }
    //编辑文章
const editArticle = (req, res) => {
    // const body = req.body;
    console.log(req.body);
    const sql = 'update blog_articles set ? where id=?'
    conn.query(sql, [req.body, req.body.id], (err, result) => {
        if (err) return res.send({ msg: '修改文章失败', status: 500 })
            //console.log(result);中的affectedRows等于1表示有数据
        if (result.affectedRows !== 1) return res.send({ msg: '修改文章失败', status: 501 })
        res.send({ msg: 'ok', status: 200 })
    })
}

module.exports = {
    articleAdd,
    detail,
    info,
    showEditPage,
    editArticle
}