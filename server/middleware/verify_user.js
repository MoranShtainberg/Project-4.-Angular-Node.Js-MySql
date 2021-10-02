const jwt = require('jsonwebtoken')

const usersOnly = (req, res, next)=> {
    //console.log(req.headers.authorization);
    jwt.verify(
        req.headers.authorization,
        process.env.TOKEN_SECRET,
        (err, payload)=>{
            if(err){
                return res.status(401).send(err)
            }
            req.user = payload
            next()
        }
    )
}

const adminsOnly = (req, res, next) => {
    jwt.verify(
        req.headers.authorization,
        process.env.TOKEN_SECRET,
        (err, payload) => {
            if (err) {
                return res.status(401).send(err)
            }

            if (!payload.isAdmin) {
                return res.status(401).send({
                    error: 'Admins only',
                });
            }

            req.user = payload
            next();
        }
    );
}

module.exports = {usersOnly, adminsOnly}