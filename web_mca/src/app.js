const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const hbs = require("hbs");
const connection = require("./db/conn");

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req, res)=>{
    res.render("index");
});

app.get('/admin_dashboard', (req, res)=>{
    res.render('admin_dashboard');
});

app.post("/register_teacher", async (req, res)=>{
    
    let teacher = req.body;
    let post = {t_fname: teacher.first_name, 
                t_mname: teacher.middle_name, 
                t_lname: teacher.last_name,
                t_email: teacher.email,
                t_contact: teacher.contact_no,
                t_city: teacher.city,
                t_state: teacher.state, 
                t_street: teacher.street,
                t_country: teacher.country,
                t_pincode: teacher.pincode
            };
    let insert = "insert into tab_teacher_details set?";
    let fetch = "select * from tab_teacher_details";
    let data;

    connection.query(fetch, (err, d_rows)=>{
        if(err){
            console.log(err);
            res.render("teacher_register", {data: ''});
        }else{
            rows = d_rows;
        }
    });

    connection.query(insert, [post], (err)=>{
        
        if(err){
                res.status(400).send(err);
                console.log(err);
        }else{
            connection.query(fetch, (err, d_rows)=>{
                if(err){
                    console.log(err);
                    res.render("teacher_register", {data: ''});
                }else{
                    rows = d_rows;
                    res.redirect('http://localhost:3000/register_teacher');
                }
            });
            console.log(rows);
        }
        
    });
});

app.get("/register_teacher", (req, res)=>{
    connection.query("select * from tab_teacher_details", (err, rows)=>{
        if(err){
            console.log(err);
            res.render('teacher_register', {data: ''});
        }else{
            console.log(rows);
            res.render('teacher_register', {data: rows})
        }
    });
});

app.get("/admin_login", (req, res)=>{
    res.render('login');
});

app.post("/admin_login", (req, res)=>{

    const admin = req.body;

    const user_id = admin.username;
    const user_password = admin.password;

    console.log("user id : " + user_id);
    console.log("user passwprd : " + user_password);

    let admin_id;
    let admin_pass;

    connection.query("select admin_email_id, admin_password from tab_admin_details where admin_email_id = 'arunsen265@gmail.com'", (err, row)=>{
        if(err){
            console.log(err);
        }else{
            console.log(row);
            admin_id = row[0].admin_email_id;
            admin_pass = row[0].admin_password;
            
            admin_id === user_id && admin_pass === user_password ? res.render('admin_dashboard') : res.send('login failed');
        }
    });
});

app.listen(port, ()=>{
    console.log("server running at port no "+ port);
});
