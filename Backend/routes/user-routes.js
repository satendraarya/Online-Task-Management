const express = require("express");

const { 
    singup, 
    login, 
    verifyToken,
    getUser,
    refreshToken,
    logout
} = require("../controllers/user-controllers");




const router = express.Router();

router.post("/signup", singup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

module.exports = router