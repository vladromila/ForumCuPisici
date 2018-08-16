const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')
const Category = require('../../models/Category')
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'home'
    next();
});
router.get('/', (req, res) => {
    let checker = false;
    if (req.user === undefined)
        checker = false;
    else
        if (req.user.isAdmin === false)
            checker = false;
        else
            checker = true;
    Post.find({}).populate('user').then(posts => {
        Category.find({}).then(categories => {
            res.render('home/index', { posts: posts, categories: categories,checker:checker });
        })

    }).catch(err => console.log(err))

})

router.get('/category/:id', (req, res) => {
    let checker = false;
    if (req.user === undefined)
        checker = false;
    else
        if (req.user.isAdmin === false)
            checker = false;
        else
            checker = true;
    Post.find({category:req.params.id}).populate('user').then(posts => {
        Category.find({}).then(categories => {
            res.render('home/index', { posts: posts, categories: categories,checker:checker });
        })

    }).catch(err => console.log(err))

})
router.get('/post/:id', (req, res) => {

    Post.findOne({ _id: req.params.id })
        .populate('user')
        .populate({ path: 'comments', populate: { path: 'user', model: 'users' } })
        .then(post => {
            Category.find({}).then(categories => {
                res.render('home/post', { post: post, categories: categories })
            })

        }).catch(err => console.log(err))

})
router.get('/about', (req, res) => {

    res.render('home/about');

});


router.get('/login', (req, res) => {

    res.render('home/login');

});


// APP LOGIN

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

    User.findOne({ email: email }).then(user => {

        if (!user) return done(null, false, { message: 'No user found' });

        bcrypt.compare(password, user.password, (err, matched) => {

            if (err) return err;


            if (matched) {
                return done(null, user);

            } else {

                return done(null, false, { message: 'Incorrect password' });

            }

        });

    });

}));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});



router.post('/login', (req, res, next) => {


    passport.authenticate('local', {

        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next);

});


router.get('/register', (req, res) => {
    res.render('home/register');
})

router.post('/register', (req, res) => {
    let errors = [];
    if (!req.body.firstName) {
        errors.push({ message: 'Please enter your First Name' });
    }
    if (!req.body.lastName) {
        errors.push({ message: 'Please enter your Last Name' });
    }
    if (!req.body.email) {
        errors.push({ message: 'Please enter your Email' });
    }
    if (!req.body.password) {
        errors.push({ message: 'Please enter your password' });
    }
    if (!req.body.passwordConfirm) {
        errors.push({ message: 'You need to confirm your password' });
    }
    if (errors.length > 0) {
        res.render('home/register', {
            errors: errors
        })
    }
    else {
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                req.flash('error_message', 'An account with this Email already exists, please login')
                res.redirect('/login');
            }
            else {
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        newUser.password = hash;
                        newUser.save().then(newUser => {
                            req.flash('success_message', 'Your account was succesfully created, log in now')
                            res.redirect('/login');
                        })
                    })
                })

            }
        })
    }

})
router.get('/logout', (req, res) => {


    req.logOut();
    res.redirect('/login');

});

router.get('/profile/:id', (req, res) => {
    Category.find({}).then(categories => {
        User.findOne({ _id: req.params.id }).then(user => {
            res.render('home/profile', { categories: categories, profileuser: user });
        })

    })

})

module.exports = router;