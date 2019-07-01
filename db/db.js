const mysql = require('mysql');
let conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'project',
    //开启执行多条sql语句的功能
    multipleStatements: true
})


module.exports = conn;