const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
} = require('../controllers/contactController');

// Public route
router.post('/', createContact);

// Admin routes
router.get('/', protect, restrictTo('admin'), getAllContacts);
router.get('/:id', protect, restrictTo('admin'), getContactById);
router.put('/:id', protect, restrictTo('admin'), updateContact);
router.delete('/:id', protect, restrictTo('admin'), deleteContact);

module.exports = router;
