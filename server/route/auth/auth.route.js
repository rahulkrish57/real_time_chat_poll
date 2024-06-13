const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('../../controller/auth/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);


module.exports = router;
