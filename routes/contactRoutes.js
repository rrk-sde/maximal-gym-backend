const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenantMiddleware');
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
router.get('/', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), getAllContacts);
router.get('/:id', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), getContactById);
router.put('/:id', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), updateContact);
router.delete('/:id', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), deleteContact);

module.exports = router;
