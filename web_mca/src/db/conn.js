const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mcawebproj1"
});

conn.connect((err)=>{
    if(err) throw err;
    console.log("Database connected successfully");
});

module.exports=conn;