const express = require("express");

const { 
     
    login, 
    verifyToken,
    getUser,
    refreshToken,
    logout,
    singup,
} = require("../controllers/user-controllers");




const router = express.Router();

router.post("/signup", singup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.get("/refresh-token", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

module.exports = router;