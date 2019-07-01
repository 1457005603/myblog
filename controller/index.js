const conn = require('../db/db.js')
const test = (req, res) => {
    //定义一页显示的条数
    let pageSize = 3;
    let nowPage = Number(req.query.page) || 1;
    //连表查询---用户id对应作者的id表示是一个用户写的东西,并筛选出需要的字段
    //执行多条sql语句注意要开启多语句的sql功能
    let sql = `select blog_articles.id, blog_articles.title, blog_articles.ctime, blog_users.nickname 
    from blog_articles 
    LEFT JOIN blog_users 
    ON blog_articles.authorId=blog_users.id ORDER BY blog_articles.id desc limit ${(nowPage - 1) * pageSize}, ${pageSize}; select count(*) as count from blog_articles
   `
        /****
         * //查询blog_articles表id,标题,创建时间,还有昵称字段
         * select blog_articles.id, blog_articles.title, blog_articles.ctime, blog_users.nickname 
         from blog_articles 
         //blog_users表和blog_articles中作者id和用户id一一对应进行连表查询
          LEFT JOIN blog_users  ON blog_articles.authorId=blog_users.id
         //对blog_articles表中id字段进行排序
          ORDER BY blog_articles.id desc;

         //查询blog_articles表id的长度存到count中
          select count(*) as count from blog_articles
         * //跳过多少页${(nowPage - 1) * pageSize}，取多少页${pageSize}
         //分页公式(nowPage - 1) * pageSize---当前页减去1乘以要展示多少条--得到要跳过的条数
         * limit ${(nowPage - 1) * pageSize}, ${pageSize}
    
         */


    conn.query(sql, (err, result) => {
        //因为执行了多条语句result不是单纯的文章数组了，所以要注意不要出错了
        if (err) {
            //使用了render渲染一定要是配置了ejs模板引擎
            return res.render('index', {
                islogin: req.session.islogin,
                user: req.session.user,
                //发生错误返回一个空的数组
                articles: []
            })
        }


        //使用了render渲染一定要是配置了ejs模板引擎
        // console.log(result)取得总条数count

        //页数 = 总条数/每页显示条数在向上取整

        let totalPage = Math.ceil(result[1][0].count / pageSize)
            // res.send({
            //     islogin: req.session.islogin,
            //     user: req.session.user,
            //     //成功则返回真实的文章列表返回的是一个数组
            //     articles: result[0],
            //     //总的页数
            //     totalPage: totalPage,
            //     nowPage: nowPage
            // })
        res.render('index', {
            islogin: req.session.islogin,
            user: req.session.user,
            //成功则返回真实的文章列表返回的是一个数组
            articles: result[0],
            //总的页数
            totalPage: totalPage,
            nowPage: nowPage
        })


    })


};

module.exports = {
    test
};