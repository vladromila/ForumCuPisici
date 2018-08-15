const express=require('express');
const router=express.Router();
const Category = require('../../models/Category');

router.all('/*',(req,res,next)=>{

req.app.locals.layout='admin'
next();
});


router.get('/',(req,res)=>{
    Category.find({}).then(posts=>{
        res.render('admin/categories/index',{posts:posts});
    }).catch(err => console.log(err))
    
})
router.post('/create',(req,res)=>{
    const newPost = new Category({

        name:req.body.name


    });

    newPost.save().then(savedPost => {

req.flash('success_message', 'Post '+savedPost.name+' was created succesfully')

        res.redirect('/admin/categories');

    }).catch(error => {
        console.log("Could not save post: " + error);
    });

})


router.get('/edit/:id', (req, res)=>{

    Category.findOne({_id: req.params.id}).then(category=>{

        res.render('admin/categories/edit', {category: category});

    });



});

router.put('/edit/:id', (req, res)=>{

    Category.findOne({_id: req.params.id}).then(category=>{

        category.name = req.body.name;

        category.save().then(savedCategory=>{
            req.flash('success_message', `Category ${savedCategory.name} was succesfully updated`)
            res.redirect('/admin/categories');

        });



    });



});
router.delete('/delete/:id', (req, res)=>{

    Category.remove({_id: req.params.id}).then(result=>{
 
 
        res.redirect('/admin/categories');
 
 
 
    });
 
 
 
 
 
 });

module.exports=router;