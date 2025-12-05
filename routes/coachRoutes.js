const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenantMiddleware');
const {
    getAllCoaches,
    getCoach,
    createCoach,
    updateCoach,
    deleteCoach
} = require('../controllers/coachController');

// Public routes
router.get('/', tenantMiddleware, getAllCoaches);
router.get('/:identifier', tenantMiddleware, getCoach);

// Admin routes
router.post('/', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), createCoach);
router.put('/:id', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), updateCoach);
router.delete('/:id', protect, tenantMiddleware, restrictTo('admin', 'superadmin'), deleteCoach);

module.exports = router;
