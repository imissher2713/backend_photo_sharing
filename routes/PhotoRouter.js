const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../db/userModel");
const verifyToken = require("../middleware/auth");

router.get('/photosOfUser/:id', verifyToken ,async (req, res) => {
    try {
        const photos = await Photo.find({ user_id: req.params.id });
        const result = await Promise.all(
            photos.map(async (photo) => {
                const commentsWithUser = await Promise.all(
                    photo.comments.map(async (comment) => {
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
                    comments: commentsWithUser,
                };
            })
        );
        res.json(result);
    } catch (err) {
        console.error('Error fetching photos or comments:', err); // Ghi log lỗi
        res.status(500).send({ error: 'Error fetching photos or comments' });
    }
});
module.exports = router;
