const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//models
const TodoTask = require("./models/TodoTask");
dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true}));

// mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT).then(() => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
    });


app.set("view engine", "ejs");


// GET METHOD
app.get("/", async (req, res) => {
    try{
        const tasks = await TodoTask.find();
        if(res.status(200)) {
            res.render("todo.ejs", { todoTasks: tasks });
        }
    }
    catch (err) {
        throw err;
    } 
});

//POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
});

app
    .route("/edit/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        try{
            const tasks = await TodoTask.find();
            if(res.status(200)) {
                res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
            }
        }
        catch(err) {
            throw err;
        }
    })
    .post(async (req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, {content: req.body.content}) 
            .then((doc, err) => {
                if (err) return res.send(500, err);
                res.redirect("/");
            });
});


app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndDelete(id)
        .then(doc=> {
            res.redirect("/");
        }).catch(err => {
            res.send(500, err);
        });
})