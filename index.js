const express = require("express");
const jwt = require('jsonwebtoken')
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const userModel = require("./db/userModel");
const addPhotoController = require('./Controller/AddPhotoController');
const secretKey = "toi_nho_em_nhieu_lam"
// const session = require("express-session");
const Photo = require("./db/photoModel");
const verifyToken = require("./middleware/auth");
const blacklistedTokens = require("./middleware/blacklistedTokens");
const registerController = require('./Controller/registerController');
app.use(cors())
app.use(express.json());
app.use('/images', express.static(__dirname + '/images'));

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const router = express.Router()

// config storage images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/images');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
dbConnect();
const loginController = async (req, res) => {
  const { login, password } = req.body;
  const user = await userModel.findOne({login_name: login, password: password}).exec();
  if (user) {
    const user_id = user._id;
    jwt.sign({user_id}, secretKey, {expiresIn: "1h"}, (err, token) => {
      if(err){
        res.status(500).send("Error generating token");
      }
      else{
        res.status(200).json({token, user})
      }
    })
  }
  else {
    console.log("Failed");
    res.status(400).send('Bad Request')
  }
}
const logoutController = (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    blacklistedTokens.add(token);
    res.status(200).json({ message: "Logged out" });
}
const commentController = async (req, res) => {
  try {
    if(req.body.comment !== "" || req.body.comment !== undefined){
      const photo_id = req.params.photo_id;
      let photo = await Photo.findOne({ _id: photo_id });
      let commentUser = {
        comment: req.body.comment,
        date_time: Date.now(),
        user_id: req.body.user_id,
        _id: "ID1"
      }
      photo.comments.push(commentUser)
      await Photo.findOneAndReplace({ _id: photo_id }, photo).exec();
      res.status(200).send("Success!");
    }
    else{
      res.status(400).send({message: "Bad Request"});
    }
  }
  catch (e) {
    res.status(400).send({message: "Bad Request"});
    console.log(e);
  }
}

app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);


app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});
app.post("/user", registerController)
app.post('/admin/login', loginController)
app.get('/admin/logout', verifyToken, logoutController)
const upload = multer({storage: storage})
app.post('/commentsOfPhoto/:photo_id', verifyToken ,commentController)
app.post('/photo/new', verifyToken, upload.single('file'), addPhotoController)

app.listen(8081, () => {

  console.log("server listening on port 8081");
});

