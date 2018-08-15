module.exports = {



    userAuthenticated: function(req, res, next){


        if(req.isAuthenticated()){

 if(req.user.isAdmin===true)
        return next();
        else
            res.redirect('/');
        
        }
       else
        res.redirect('/login');


    }



};