const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../db/userModel");
const verifyToken = require("../middleware/auth");

router.get('/photosOfUser/:id', verifyToken ,async (req, res) => {
    try {
        const photos = await Photo.find({ user_id: req.params.id });
        // Trả về photo, user sở hữu photo(id_user), comment
        const result = await Promise.all(
            photos.map(async (photo) => {
                // Map ở bên trong: Trả về array photo
                const commentsWithUser = await Promise.all(
                    photo.comments.map(async (comment) => { // map để trả về mảng comment với từng phần tử giống của thằng return: key value
                        const user = await User.findById(comment.user_id, '_id first_name last_name');
                        return {
                            _id: comment._id,
                            comment: comment.comment, 
                            date_time: comment.date_time,
                            user,
                        };
                    })
                );
        
                return {
                    _id: photo._id,
                    user_id: photo.user_id,
                    file_name: photo.file_name,
                    date_time: photo.date_time,
                    comments: commentsWithUser, // [array]
                };
            })
        );
        res.json(result); // trả về front-end để front-end render ra
    } catch (err) {
        console.error('Error fetching photos or comments:', err); // Ghi log lỗi
        res.status(500).send({ error: 'Error fetching photos or comments' });
    }
});
module.exports = router;
