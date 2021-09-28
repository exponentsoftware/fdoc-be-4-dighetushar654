const router = require("express").Router();
const UserController = require("../Controllers/user_controllers");


router.post("/", UserController.registarUser); 

module.exports = router;