const test = (req, res) => {
    res.render('index', {
            islogin: req.session.islogin,
            user: req.session.user
        })
        //  console.log(req.session.user = 1)
};

module.exports = {
    test
};