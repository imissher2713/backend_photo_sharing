const Photo = require("../db/photoModel");


module.exports = async (req, res) => {
    try {
        if(!req.body.file_name){
            res.status(400).send({message: "Bad Request"});
        }
        console.log(req.body)
        const data = req.body;
        const user_id = data.user_id
        const photo = await Photo.create({
            file_name: req.body.file_name,
            date_time: Date.now(),
            user_id: user_id,
            comments: []
        })
        res.status(200).send({message: "Successful"});

    }
    catch(e){
        res.status(400).send({message: "Bad Request"});
    }
}