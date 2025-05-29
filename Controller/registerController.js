const userModel = require("../db/userModel")
module.exports = async (req, res) => {
    const data = req.body
    try{
        const user = new userModel({
            login_name: data.login_name,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name,
            location: data.location,
            description: data.description,
            occupation: data.occupation
        })
        await user.save();
        res.status(200).send("Succesfully");
    }
    catch(e){
        res.status(400).send("Bad Request")
    }
}