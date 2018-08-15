const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper')
const fs = require('fs');

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'admin'
    next();
});
router.get('/', (req, res) => {

    Post.find({}).populate('category').then(posts => {
        res.render('admin/posts/index', { posts: posts });
    }).catch(err => console.log(err))

})
router.get('/myposts', (req, res) => {

    Post.find({user:req.user.id}).populate('category').then(posts => {
        res.render('admin/posts/index', { posts: posts });
    }).catch(err => console.log(err))

})
router.get('/create', (req, res) => {
    Category.find({}).then(categories => {
        res.render('admin/posts/create', { categories: categories });
    })

})
router.post('/create', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ message: 'Please enter a title' });
    } if (!req.body.body) {
        errors.push({ message: 'Please enter a description' });
    }
    if (errors.length > 0) {
        res.render('admin/posts/create', {
            errors: errors
        })
    }
    let filename = '';
    if (!isEmpty(req.files)) {

        let file = req.files.file;
        filename = Date.now() + '.' + file.name;
        const dirUploads = './public/uploads/';

        file.mv(dirUploads + filename, (err) => {
            if (err)
                throw err;
        }
        )
    }
    let allowComments = true;
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }
    const newPost = new Post({
        user:req.user.id,
        category: req.body.category,
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        file: filename,
        date: Date.now()


    });

    newPost.save().then(savedPost => {

        req.flash('success_message', 'Post ' + savedPost.title + ' was created succesfully')

        res.redirect('/admin/posts');

    }).catch(error => {
        console.log("Could not save post: " + error);
    });

});
router.get('/edit', (req, res) => {
    res.render('admin/posts/edit');
})
router.get('/edit/:id', (req, res) => {

    Post.findOne({ _id: req.params.id })
        .then(post => {

            Category.find({}).then(categories => {

                res.render('admin/posts/edit', { post: post, categories: categories });

            });


        });


});
router.put('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            } 
            post.category=req.body.category;
            post.title = req.body.title;
            post.status = req.body.status;
            post.allowComments = allowComments;
            post.body = req.body.body;
           

            if (!isEmpty(req.files)) {

                let file = req.files.file;
                filename = Date.now() + '.' + file.name;
                const dirUploads = './public/uploads/';
                post.file = filename;

                file.mv(dirUploads + filename, (err) => {
                    if (err)
                        throw err;
                })
            }

            post.save().then(updatedPost => {

                req.flash('success_message', `Post ${updatedPost.title} was succesfully updated`)

                res.redirect('/admin/posts');
            }).catch(err => console.log(err))
        })
})
router.delete('/delete/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).populate('comments').then(post => {
        fs.unlink(uploadDir + post.file, (err) => {
if(!post.comments.length<1)
{post.comments.forEach(comment => {
    comment.remove();
});
    
}
            post.remove();
            console.log(err);
        })
        req.flash('success_message', 'Post ' + post.title + ' was deleted succesfully');
        res.redirect('/admin/posts')
    })
})
module.exports = router;