const express = require('express');
const router = express.Router();
const { ensureAunthenticated} = require('../config/auth')
//Welcome page
router.get('/',(req,res) => res.render('welcome'))

//dashboard
router.get('/dashboard', (req,res) => res.render('dashboard'))



module.exports = router; 