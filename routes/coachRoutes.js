const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
    getAllCoaches,
    getCoach,
    createCoach,
    updateCoach,
    deleteCoach
} = require('../controllers/coachController');

// Public routes
router.get('/', getAllCoaches);
router.get('/:identifier', getCoach);

// Admin routes
router.post('/', protect, restrictTo('admin'), createCoach);
router.put('/:id', protect, restrictTo('admin'), updateCoach);
router.delete('/:id', protect, restrictTo('admin'), deleteCoach);

module.exports = router;
