const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get('/new', (req, res) => {

  if(!req.user){
   return res.redirect('/?error=Vous êtes pas connecté'); 
  }
  res.render('newPostForm');
});


// Create new POst
router.post('/', async (req, res) => {
  try {
      const { title, content } = req.body;
      const user = req.user.userId

      const post = new Post({
          title,
          content,
          author: user,
      });

      await post.save();
      res.redirect('/');

  } catch (err) {
      console.log('Error creating post:', err);
      return res.redirect('/?error=Erreur de création article'); 
  }
});



// Modif post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const post = await Post.findById(id);

        post.title = title;
        post.content = content;

        await post.save();

        res.redirect('/');
    } catch (err) {
        console.log('Error updating post:', err);
        return res.redirect('/?error=Erreur de mise à jour article'); 

    }
});


  // delete posst
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        await Post.deleteOne({ _id: id });
        res.redirect('/');
    } catch (err) {
        console.log('Error deleting post:', err);
        return res.redirect('/?error=Erreur de suppression article'); 

    }
});


// Add com
router.post('/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const { commentText } = req.body;
  
      const post = await Post.findById(id);
  
      post.comments.push({
        text: commentText,
        author: req.user.userId,
       });
  
      await post.save();
  
      res.redirect('/');
    } catch (err) {
      console.log('Error adding comment:', err);
      return res.redirect('/?error=Erreur ajout commentaire'); 

    }
  });
  

  // like un post
router.post('/:id/like', async (req, res) => {
  try {
      const { id } = req.params;
      const userId = req.user.userId;

      const post = await Post.findById(id);


      if (!post.likes.includes(userId)) { // jverif si l'user a déjà like le post
          post.likes.push(userId); // si c'est pas le cas alors jlajoute à la liste d'user qui ont like le post
      } else {
          post.likes = post.likes.filter((like) => like.toString() !== userId.toString()); // si il a déjà liké le post alors jle retire de la liste des likes
      }

      await post.save();
      res.redirect('/');
  } catch (err) {
      console.log('Error liking or unlike post:', err);
      return res.redirect('/?error=Erreur de like / delike article'); 

  }
});

  

// Modif comment
router.put('/:postId/comments/:commentId', async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { commentText } = req.body;
  
      // je recupere le post pour pouvoir verif si il est associé au comm
      const post = await Post.findById(postId);

      // je cherche si le commentaire que je modifie est bien en bdd
      const comment = post.comments.id(commentId);
      
      //jfais pas un dessin..
      comment.text = commentText;
      await post.save();
  

      res.redirect('/');
    } catch (err) {
      console.log('Error updating comment:', err);
      return res.redirect('/?error=Erreur de mise à jour commentaire'); 

    }
  });

router.delete('/:postId/comments/:commentId', async (req, res) => {
    try {
      const { postId, commentId } = req.params;
  

      await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { comments: { _id: commentId } } } // dans le schema post , 'comments' contient un tableau qui contient le schema des commentaires
        //chaque element d'un schema a un _id généré par mongoose alors en supprimant  _id :commentId je dis de supprimer le 
        //commmentaire ayant l'id du commentaire que j'ai spécifié dans ma requête 
      );
      res.redirect('/');
    } catch (err) {
      console.log('Error deleting comment:', err);
      return res.redirect('/?error=Erreur de suppression commentaire'); 

    }
  });
  

module.exports = router;
