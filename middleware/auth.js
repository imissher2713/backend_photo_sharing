const jwt = require('jsonwebtoken');
const secretKey = "toi_nho_em_nhieu_lam";
const blacklistedTokens = require('./blacklistedTokens');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (typeof token !== undefined) {
        if (blacklistedTokens.has(token)) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        console.log(token.split(' ')[1])
        jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid Token' });
            else
            {   
                req.user_id = decoded.user_id;
                next();
        }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = verifyToken;