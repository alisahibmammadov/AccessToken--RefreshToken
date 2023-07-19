import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
  }
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
    if(err){
        console.log(err);
        res.status(400).json(err)
    }
    req.user = user
    next()
  })
};
