const express=require('express');
const router=express.Router();
const faker = require('faker');
const Post = require('../../models/Post');
const {userAuthenticated} = require('../../helpers/authentication');
router.all('/*',(req,res,next)=>{

req.app.locals.layout='userdash'
next();
});


router.get('/',(req,res)=>{
    res.render('userdash/index');
})




module.exports=router;