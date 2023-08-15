const express = require('express');
const routerUser = require('./user.router');
const router = express.Router();

// users
router.use("/users", routerUser)

module.exports = router;