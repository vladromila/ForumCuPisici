const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');
router.get('/',(req,res)=>{
    Comment.find({}).populate('user').then(comments=>{
        res.render('admin/comments/index',{comments:comments})
    })
    
})
router.post('/',(req,res)=>{
    Post.findOne({_id:req.body.id}).then(post=>{
        const newComment= new Comment({
            user:req.user.id,
            body:req.body.body,
            date: Date.now()
        }
        )
        post.comments.push(newComment);
        post.save().then(savedPost=>{
            newComment.save().then(savedComment=>{
                res.redirect(`/post/${post.id}#comment`)
            })
        })
    })
})
router.delete('/:id', (req, res)=>{


    Comment.remove({_id: req.params.id}).then(deleteItem=>{

        Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data)=>{

           if(err) console.log(err);

            res.redirect('/admin/comments');

              });

        });

});

module.exports = router;