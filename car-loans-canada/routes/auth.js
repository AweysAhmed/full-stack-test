const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation }  = require('../validation');



router.post('/register', async (req, res) => {
  
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //checking to see if user exists

  const emailExists = await User.findOne({email: req.body.email});
  if(emailExists) {
    return res.status(400).send('Email already exists');
  }

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
    });
    try {
      //fix this
      const savedUser = await user.save();
      res.send({user: user.name});
    } catch (err) {
        res.status(400).send(err)
    }
});

router.post('/login', async (req, res) => {
  // login routhe
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findOne({email: req.body.email });
  if(!user) {
    return res.status(400).send('Email or password is wrong');
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) {
    return res.status(400).send('Email or password is incorrect');
  }

  res.send('You are logged in!');


});


module.exports = router;