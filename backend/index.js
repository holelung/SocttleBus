const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "335276",
    database: "shuttle_bus",
})

app.get("/", function (req, res) {
  res.send("안녕하세요!");
});

app.post("/join", (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    const name = req.body.name;

    db.query(
        "INSERT INTO SHUTTLE_BUS.USER (ID, PASSWORD, NAME) VALUES (?,?,?)",
        [id, password, name],
        (err, result) => {
            if (err) {
                console.log(err);
            }else {
                res.send("Inserted values successfully!");
            }
        }
    );
});

app.get("/login", (req, res) => {
    db.query("SELECT * FROM SHUTTLE_BUS.USER", (err, result) =>{
        if (err) {
            console.log(err);
        }else {
            res.send(`Selected values successfully!`);
        }
    });
});

app.listen(3001, () => {
  console.log("Server is running onn port 3001");
});


