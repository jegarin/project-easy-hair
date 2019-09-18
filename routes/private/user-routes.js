const express = require('express');
const User = require('../../models/User');

const router = express.Router();

// user/
router.get('/profile', async (req, res) => {
  const { currentUser } = req.session;
  // console.log(`rota privada usuário logado ${currentUser.userName}`);
  res.render('private/user-profile', currentUser);
})

router.get('/:id/edit', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.render('private/user-edit', user);
  } catch (err) {
    throw new Error(err);
  };
});

router.post('/:id/edit', async (req, res) => {
  const { id } = req.params;
  const { userName, userEmail, cellphone } = req.body;
  const user = { userName, userEmail, cellphone, id };

  if (userName === '' || userEmail === '' || cellphone === '' ) {
    res.render('private/user-edit', { user, errorMessage: 'Todos os campos devem ser preenchidos' });
    return;
  }

  try {
    await User.findByIdAndUpdate(id, { userName, userEmail, cellphone });
    res.redirect('/user/:id/edit');
  } catch (error) {
    throw new Error(error);
  }

})

router.post('/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndRemove(id);
    req.session.destroy((err) => {
      if (err) {
        throw new Error(error);
      } else {
        res.redirect('/');
      }
    });
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = router;