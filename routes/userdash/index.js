const express=require('express');
const router=express.Router();
const faker = require('faker');
const Post = require('../../models/Post');
const User=require('../../models/User')
const {userAuthenticated} = require('../../helpers/authentication');
router.all('/*',userAuthenticated,(req,res,next)=>{

req.app.locals.layout='userdash'
next();
});


router.get('/',(req,res)=>{
    res.render('userdash/index');
})
router.get('/profile/edit/:id',(req,res)=>{
    res.render('userdash/profile/edit');
})
router.put('/profile/edit/:id',(req,res)=>{
    User.findOne({_id:req.params.id}).then(user=>{
        user.firstName=req.body.firstName;
        user.lastName=req.body.lastName;
        user.about=req.body.about;
        user.save().then(updatedUser=>{
          res.redirect('/')  
        }).catch(err=>{throw err})
    })
    
})




module.exports=router;