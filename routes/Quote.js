const express = require('express');
const router = express.Router();
const { getAllQuote,getQuoteById,createQuote } = require('../controllers/Quote');

// Route for getAllQuote
router.get('/getallquote', getAllQuote);
router.post('/sendquote', createQuote);
router.get('/getquote/:id', getQuoteById);
module.exports = router;