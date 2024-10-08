const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");

          ///////////  AUTH  /////////// 
router.post('/register', async (req, res) => {
  try {
      const email = req.body.email
      const username = req.body.username
      const password = req.body.password

      const existingUser = await User.findOne({ $or: [{ email }, { username }] }); // $or pour verifier si tel OU tel valeur est en bdd
      // go check ici  https://mongoosejs.com/docs/api/query.html#Query.prototype.or()

      if (existingUser) {
        return res.redirect('/?error=utilisateur déjà existant !&registered=false'); 
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, username, password: hashedPassword });
      await user.save();

      return res.redirect('/?message=Compte créé avec succès !&registered=true'); 

    } catch (err) {
      console.log('Error during registration:', err);
      return res.render('index', { error: 'Erreur lors de la création du compte.', user: null });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect('/?error=Email introuvable en bdd');
    }

    if(user.status == "deleted"){
      return res.redirect('/?error=Votre compte est supprimé.');
    }

    const correctPass = await bcrypt.compare(password, user.password);
    if (correctPass) {
      const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token);
      return res.redirect('/?message=Connexion réussie!'); 
    } else {
      return res.redirect('/?error=Mot de passe incorrect');
    }
  } catch (err) {
    console.log('Error during login:', err);
    return res.redirect('/?error=Erreur lors de la connexion'); 
  }
});

          ///////////  User CRUD  /////////// 
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); 
    res.render('dashboard', { user });
  } catch (err) {
    return res.redirect('/?error=Impossible d acceder au dashboard vous êtes pas connecté..'); 
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.render('dashboard', { user });
  } catch (err) {
    console.log('Error fetching user:', err);
    return res.redirect('/?error=Impossible d acceder au dashboard..'); 
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { username, email } = req.body; 

    const user = await User.findById(id);

    user.username = username;
    user.email = email;

    await user.save();

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
    //// je veux remettre à jour le msg d'accueil disant "bonjour username" le truc c'est queje recupere user.username dans le token.
    // Donc je met à jour le token avec le nouveau username. Qui dit maj du token dit maj du cookie aussi..
    res.cookie('token', token); 

    res.redirect('/'); 
  } catch (err) {
    console.log('Error updating user:', err);
    return res.redirect('/?error=Erreur de mise à jour utilisateur'); 
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'deleted' }); // juste un petit soft delete qui va passer le status en deleted..

    res.clearCookie('token');  // déco

    return res.redirect('/?message=compte supprimé avec succès');
  } catch (err) {
    console.log('Error deleting user:', err);
    return res.redirect('/?error=Erreur de suppression utilisateur'); 

  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.redirect('/');
});

module.exports = router;
