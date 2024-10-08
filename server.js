const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");// PÖURQUOI method override ? En fait pour les methodes DELETE ET PUT,
// je dois "tromper" express en faisant croire que ce sont des methodes post.
// Du coup dans mes requêtes client j'ia juste à preciser un parametre "_method=<vraie_methode>"
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/User');
const postRoutes = require('./routes/Post');
const Post = require('./models/Post');
const { checkUser } = require('./middleware/auth'); 
require('dotenv').config();
const app = express();

const port = process.env.PORT || 3000; 
const uri = process.env.MONGODB_URI;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sanitizer = require ("perfect-express-sanitizer")
app.use(
    sanitizer.clean({
        xss: true,
        crsf: true,
    })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

app.use(checkUser);

app.use('/users', userRoutes);
app.use('/posts', postRoutes);


mongoose.connect(uri)
  .then(() => {
    console.log('Connected to Blogify DB');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("Blogify DB connection error:", err));


 // la main page
  app.get('/', async (req, res) => {
    try {
      const posts = await Post.find({})   // je recupere les username des auteurs (posts et comments) via des réferences 
        .populate('author')    
        .populate('comments.author')
        .exec();


        const message = req.query.message || null;
        const registered = req.query.registered === 'true'; // je convertis la variable get en booleen avec l'égalité absolue "==="
        const error = req.query.error || null

      res.render('index', { user: req.user, posts, error,  message, registered});
    } catch (err) {
      console.log('Error fetching posts:', err);
    }
  });
  
