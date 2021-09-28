
const Todo = require('../Models/todoModel');
const jwt = require("jsonwebtoken");


// Create todo controller
exports.create_todo = async (req, res) => {
    try {
        const {todotitle, status, category} = req.body;
        const newtodo = new Todo({
            todotitle,
            status, 
            category,
            user: req.user.id,
            role: req.user.userRole,
        });
        const savetodo = await newtodo.save();
        res.status(200).json(savetodo)

    } catch (err) {
        console.log(err);
        res.status(500).json({err});
    }
}

// Get todo controller
exports.get_todo = async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        const decodetoken = jwt.verify(token, process.env.SecretKey);
        if(decodetoken.user.userRole == "Admin"){
           const todos = await Todo.find();
           res.status(201).json(todos);
        } else {
            const userTodos = await Todo.find({user: decodetoken.user.id});
            res.status(201).json(userTodos);
        }
    } catch (err) {
        res.status(404).json(err);
    }
}

// Get All todos controller
exports.getAll_todo = async (req, res) => {
    try {
        // sorting data using createdAT field in descending order
        const data = await Todo.find().sort({createdAt: '-1'});
        const filters = req.query;
        const filteredCategory = data.filter(category => {
            let isValid = true;
            for (key in filters) {
                // console.log(key, category[key], filters[key]);
                isValid = isValid && category[key] == filters[key];
            }
            return isValid;
        })
        res.send(filteredCategory);
        // res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Update todo controller
exports.update_todo = async (req, res) => {
    try {
        const user = await Todo.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new:true});
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Delete todo controller
exports.delete_todo = async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json("Todo has been deleted");
    } catch(err) {
        return res.status(404).json(err);
    }
}