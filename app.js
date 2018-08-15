const epxress=require ('express');
const app=epxress();
const path=require('path');
const exphbs=require('express-handlebars');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const methodOverride=require('method-override');
const upload=require('express-fileupload');
const session=require('express-session');
const flash=require('connect-flash');
const {select,generateDate,fieldChecker,ifer}=require('./helpers/handelbars-helper.js');
const {mongoDbUrl}=require('./config/databse.js');
const passport=require('passport');

mongoose.connect(mongoDbUrl,{ useNewUrlParser: true })
.then(db=>{
    console.log('WORKS')
}).catch(err=>console.log(err));

app.use(session({
    secret: 'vjs',
    resave: true,
    saveUninitialized: true
  }))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.user=req.user || null;
    res.locals.success_message=req.flash('success_message');
    res.locals.error=req.flash('error');
    res.locals.error_message=req.flash('error_message');
    next();
})



app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(upload());

app.use(methodOverride('_method'));

app.use(epxress.static(path.join(__dirname,'public')));

app.engine('handlebars',exphbs({defaultLayout:'home',helpers:{select:select,generateDate:generateDate,fieldChecker:fieldChecker,ifer:ifer}}))

app.set('view engine','handlebars');

const home=require('./routes/home/index');

const admin=require('./routes/admin/index');

const posts=require('./routes/admin/posts');

const categories=require('./routes/admin/categories');

const comments=require('./routes/admin/comments');

const userDash=require('./routes/userdash/index');

const userDashposts=require('./routes/userdash/posts');

const userDashcomments=require('./routes/userdash/comments');


app.use('/',home);

app.use('/admin',admin);

app.use('/admin/posts',posts);
app.use('/admin/categories',categories)
app.use('/admin/comments',comments)
app.use('/userdash',userDash)
app.use('/userdash/posts',userDashposts);
app.use('/userdash/comments',userDashcomments)
const port=process.env.PORT || 4500;
app.listen(port,()=>{
    console.log('Connected');
})