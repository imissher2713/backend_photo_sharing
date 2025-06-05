const Photo = require("../db/photoModel");

module.exports = async (req, res) => {
    try {
        try{
            const photoUpload = new Photo({
                file_name: req.file.filename,
                date_time: Date.now(),
                user_id: req.body.user_id,
                comments: []
            })
            await photoUpload.save();
            res.status(200).send("Success!")
        }
        catch(e){
            res.status(400).send("Failed!");
        }
    }
    catch(e){
        console.log(e);
        res.status(400).send({message: "Bad Request"});
    }
}
