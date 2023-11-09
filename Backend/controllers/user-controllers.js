const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const singup = async (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    }  catch (err) {
        console.log(err, "email");
    }
    if (existingUser) {
        return res
            .status(400)
            .json({ messeage: "User already exists! Login Instead "})
    }

    const hashedpassword = bcrypt.hashSync(password);
    
    const user = new User ({
        name,
        email,
        password : hashedpassword
    });
    try {
        await user.save();
    } catch (err) {
        console.log(err);
    }
    return res.status(201).json({ message: user });
};

// ........... Login function .........

const login = async (req, res) => {
    const { email, password} = req.body;
    
    let existingUser;
    try {
        existingUser = await User.findOne({
            email: email 
        });
    }
    catch (err) {
        return new Error(err);
    }
    if (!existingUser){
        return res.status(400).json({ message: "User not found Signup Please" })
    }
    // compare passwords
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Email/Password!"});
    }
    // create and sign token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d',
    });
    console.log("Generated Token\n", token);

    if (req.cookies[`${existingUser._id}`]) {
        req.cookies[`${existingUser._id}`] = "";
    }
    res.cookie(String(existingUser._id), token, 
    { 
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 7 * 24 * 24 * 60), // 7d
        sameSite: "lax",
    });
    return res
    .status(200)
    .json({ message: "Successfully LoggedIn", user: existingUser, token });
};

// ........... VerifyToken ..............
const verifyToken = (req, res, next) => {
    if (!req.headers.cookie) {
        return res.status(404).json({ message: "No token found" });
    }
    const token = req.headers.cookie.split("=")[1];

    if (!token) {
        return res.status(404).json({ message: "No token found" });
    }

    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Invalid Token" });
        }
        console.log(user.id);
        req.id = user.id;
        next();
    });
};


const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    }
    catch (err) {
        return new Error(err)
    }
    if (!user) {
        return res.status(400).json({ message: "User Not Found" })
    }
    return res.status(200).json({ user });
};

const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if (!prevToken) {
        return res.status(400).json({ message: "Couldn't find token" });
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Authentication failed" });
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });
        console.log("Regenerated Token\n", token);

        res.cookie(String(user.id), token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 7 * 24 * 24 * 60),
            sameSite: "lax",
        });

        req.id = user.id;
        next();
    });
};

const logout = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if (!prevToken) {
      return res.status(400).json({ message: "Couldn't find token" });
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Authentication failed" });
      }
      res.clearCookie(`${user.id}`);
      req.cookies[`${user.id}`] = "";
      return res.status(200).json({ message: "Successfully Logged Out" });
    });
  };





exports.singup = singup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.logout = logout;
