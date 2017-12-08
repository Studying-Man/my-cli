
let userModel = require('../model/user');
let moment = require('moment');
let jwt = require('jwt-simple');
let tokenSecret = require('../bin/credentials').tokenSecret;
let redisClient = require('../bin/redisc');

module.exports={
    signup:function (req,res) {
        console.log('Enter signup-');
        console.log(req.body);
        if(!req.body.userName || !req.body.password){
            return res.end('sign up invalid',400);
        }
        let newUser = new userModel({
            userName: req.body.userName,
            password: req.body.password
        });
        newUser.save(function (err,ddc) {
            if(err){return res.end('save err',500)}

            res.send(ddc,200);
        });
    },
    login: function (req,res){
        console.log(req.body);
        userModel.findOne({userName:req.body.userName},function (error,user){
            console.log('enter checking');
            if(error){
                console.log('ente'+error.stack);
                return res.end('server err',500);
            }
            if(!user){
                return res.end('user not exist',400);
            }

            if(req.body.password !== user.password){
                return res.end('Authentication failed',403);
            }

            let expires = moment().add(7,'days').valueOf();
            let token = jwt.encode({
                iss: user.id,
                exp: expires
            },tokenSecret,'HS256');

            redisClient.set(token,token,function (err,value) {
                if(err){
                    console.log(err.stack);
                    return res.send({result:0,msg:'fail save token'})
                }
                res.send({
                    token : token,
                    expires: expires,
                    user: user
                },200);
            });

        });
    },
    tokenVerify:function (req,res,next) {
        console.log('Enter tokenVerify-----');
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        if(!token){ return res.send('Unauthorized Request',401);}

        redisClient.get(token,function (err,value) {
            if(err){ return res.status(403).send('token invalid') }

            if(!value){
                // return res.status(403).send('token invalid');
                return res.send('token invalid',403);
            }

            try{
                let decoded = jwt.decode(value,tokenSecret,'HS256');
                if(decoded.exp <= Date.now()){
                    return res.send('Access token has expired', 400);
                }

                userModel.find({_id: decoded.iss},function (err,user) {
                    if(err){
                        console.log(err.stack+' token find user err');
                        return res.send('User not Existed', 403);
                    }
                    if(!user){
                        return res.send('User not Existed', 403);
                    }
                    req.user = user;
                    console.log('----token is valid---');
                    next();
                })

            }catch (err){
                console.log('----ERR token is Invalid---');
                return res.send('server err token verify',500);
            }
        });
    },
    logout: function (req,res) {
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        redisClient.del(token,function (err) {
            if(!err){
                res.send({
                    result: 1
                },200)
            }
            return res.send('logut err',500);
        });
    }
};