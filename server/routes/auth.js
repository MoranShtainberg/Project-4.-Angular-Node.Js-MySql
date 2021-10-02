const router = require('express').Router();
const { myQuery } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// -- GET / POST / DELETE / PUT


//----------------------------------------------------register---------------
router.post("/register", async (req, res)=>{
    
    try {
        const usersTempArr = await myQuery('SELECT * FROM users_table');
        //console.log(usersTempArr);
        
        // username is the email
        const { username, password, first_name, last_name, Id_number, city, street } = req.body;
        // console.log("username: "+username);
        // console.log("password: "+password);
        // console.log("first_name: "+first_name);
        // console.log("last_name: "+last_name);
        // console.log("Id_number: "+Id_number);
        // console.log("city: "+city);
        // console.log("street: "+street);
    
        //check missing info
        if (!username || !password || !first_name || !last_name || !Id_number || !city || !street) {
            return res.status(400).send({err:"Missing some info"})
        }
        
        //check if the Id_number () is already exist
        if (usersTempArr.some((user)=> user.Id_number === Id_number)) {
            return res.status(400).send({err:"Id number is already exist"})
        }

        //check if the username is already taken
        if (usersTempArr.some((user)=> user.username === username)) {
            return res.status(400).send({err:"Username is already taken"})
        }
    
        //Encrypt the password
        const hashedPass = await bcrypt.hash(password,10);
                
        await myQuery(`INSERT INTO users_table(first_name, last_name, username, password, isAdmin, Id_number, city, street ) 
                                    VALUES ("${first_name}", "${last_name}", "${username}", "${hashedPass}", false, ${Id_number}, "${city}", "${street}" )`);
        res.status(201).send();
        
    } catch (error) {
        res.status(500).send(error);
    }
})
//----------------------------------------------------POST: Pre-Registeration----------
router.post("/pre_registration", async (req, res)=>{
    
    try {
        const usersTempArr = await myQuery('SELECT * FROM users_table');
        //console.log(usersTempArr);
        
        // username is the email
        const { username, password, confirm_password, Id_number } = req.body;
        // console.log("username: "+username);
        // console.log("password: "+password);
        // console.log("confirm_password: "+confirm_password);
        // console.log("Id_number: "+Id_number);
    
        //check missing info
        if (!username || !password || !confirm_password || !Id_number) {
            return res.status(400).send({err:"Missing some info"})
        }

        if (password != confirm_password) {
            return res.status(400).send({err:"Password confirmation does not match the password"})
        }
        
        //check if the Id_number () is already exist
        if (usersTempArr.some((user)=> user.Id_number === Id_number)) {
            return res.status(400).send({err:"Id number is already exist"})
        }

        //check if the username is already taken
        if (usersTempArr.some((user)=> user.username === username)) {
            return res.status(400).send({err:"Username is already taken"})
        }

        res.status(201).send();   
        
    } catch (error) {
        res.status(500).send(error);
    }
})

//----------------------------------------------------login---------------

router.post("/login", async (req, res)=>{
    try {
        const usersTempArr = await myQuery('SELECT * FROM users_table')
        //console.log(usersTempArr);
        
        const { username, password } = req.body;
    
        //check missing info
        if (!username || !password ) {
            return res.status(400).send({err:"Missing some info"});
        }
        
        const user = usersTempArr.find((user)=>user.username === username);
    
        //user does not exist
        if (!user) {
            return res.status(400).send({err:"User not found"});
        }
    
        // password compare
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({err:"Wrong password"});
        }
    
        //create a token
        const token = jwt.sign(
            {
                user_id:    user.user_id,
                username:   user.username,
                first_name: user.first_name,
                isAdmin:    user.isAdmin,
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "50m"
            }
        );
    
        res.send({token});
        
    } catch (error) {
        res.status(500).send(error);
    }
})
//-------------------------------------------export----------------------

module.exports = router;