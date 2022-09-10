const jwt=require('jsonwebtoken')
require('dotenv').config();

const jwtFun=(info,res)=>{
  jwt.sign(info,process.env.SECRET_KEY,(err,data)=>{
    if(err){
      console.log(err);
    }else{
      res.cookie('token',data)     
      res.send({all:"is done!"})  
    }
    })
}

const auth = (req, res, next)=>{
    const {token} = req.cookies;
    jwt.verify(token ,process.env.SECRET_KEY, (err,data)=>{
      if (!err){
        req.user={
          username:data.username,
          id:data.id,
          img:data.img
        }
      } else{
        req.noUser= {
          username:undefined,
        }
      }
      next();
    })
  }
  module.exports={jwtFun,auth}
  