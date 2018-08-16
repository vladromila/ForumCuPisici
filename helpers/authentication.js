module.exports = {



    userAuthenticated: function (req, res, next) {


        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');


    },
    userIsAdmin: function (req, res, next) {

       
            if (req.user.isAdmin===true) {
                return next();
            }
        res.redirect('/');


    }



};