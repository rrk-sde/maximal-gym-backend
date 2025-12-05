const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
    createTenant,
    getAllTenants,
    getTenantById,
    updateTenant,
    deleteTenant
} = require('../controllers/tenantController');

// Super admin routes
router.post('/', protect, restrictTo('superadmin'), createTenant);
router.get('/', protect, restrictTo('superadmin'), getAllTenants);
router.delete('/:id', protect, restrictTo('superadmin'), deleteTenant);

// Admin and Super admin routes
router.get('/:id', protect, restrictTo('admin', 'superadmin'), getTenantById);
router.put('/:id', protect, restrictTo('admin', 'superadmin'), updateTenant);

module.exports = router;
