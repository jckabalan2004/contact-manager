const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validateContact, validate } = require('../middleware/validation.middleware');

// Protect ALL routes
router.get('/', verifyToken, contactController.getAllContacts);
router.get('/:id', verifyToken, contactController.getContactById);
router.post('/', verifyToken, validateContact, validate, contactController.createContact);
router.put('/:id', verifyToken, validateContact, validate, contactController.updateContact);
router.delete('/:id', verifyToken, contactController.deleteContact);

module.exports = router;
