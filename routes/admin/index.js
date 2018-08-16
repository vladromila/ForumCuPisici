const express=require('express');
const router=express.Router();
const faker = require('faker');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment=require('../../models/Comment');
const {userIsAdmin} = require('../../helpers/authentication');
const {userAuthenticated} = require('../../helpers/authentication');
router.all('/*',userAuthenticated,userIsAdmin,(req,res,next)=>{

req.app.locals.layout='admin'
next();
});


router.get('/',(req,res)=>{
    Post.countDocuments().then(postCount=>{
        Comment.countDocuments().then(commentCount=>{
            User.countDocuments().then(usersCount=>{
                User.find({}).then(users=>{
                    let k=0;
                    users.forEach(element=>{
                        if(element.about!=='')
                        k++;
                    })
                    res.render('admin/index',{postCount:postCount,commentCount:commentCount,usersCount:usersCount,updatedProfiles:k});
                })
                
            })
            
        })
      
    })
    
})


router.post('/generate-fake-posts', (req, res)=>{


    for(let i = 0; i < req.body.amount; i++){

        let post = new Post();

        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.slug = faker.name.title();
        post.save(function(err){

            if (err) throw err;

        });

    }

    res.redirect('/admin/posts');

});


module.exports=router;