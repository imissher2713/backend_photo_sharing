const express = require("express");
const User = require("../db/userModel");
const verifyToken = require("../middleware/auth");
const router = express();
router.get('/list', verifyToken, async (req, res) => {
    try {
    const users = await User.find({}, '_id first_name last_name');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send({ error: 'Không thể lấy danh sách người dùng.' });
  }
});
router.get('/:id', verifyToken, async (req, res) => {
    try {
    const user = await User.findById(req.params.id, '_id first_name last_name location description occupation');
    if (!user) return res.status(400).send({ error: 'ID người dùng không hợp lệ' });
    res.status(200).json(user);
  } catch (err) {
    console.log("Error!")
    res.status(400).send({ error: 'ID người dùng không hợp lệ' });
  }
})
module.exports = router;