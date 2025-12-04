const Coach = require('../models/Coach');

// @desc    Get all coaches
// @route   GET /api/coaches
// @access  Public
exports.getAllCoaches = async (req, res) => {
    try {
        const { isActive = true } = req.query;

        const coaches = await Coach.find({ isActive }).sort({ name: 1 });

        res.status(200).json({
            status: 'success',
            data: { coaches }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get coach by ID or slug
// @route   GET /api/coaches/:identifier
// @access  Public
exports.getCoach = async (req, res) => {
    try {
        const { identifier } = req.params;

        let coach;
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            // Valid ObjectId
            coach = await Coach.findById(identifier);
        } else {
            // Treat as slug
            coach = await Coach.findOne({ slug: identifier });
        }

        if (!coach) {
            return res.status(404).json({
                status: 'error',
                message: 'Coach not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { coach }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create a new coach
// @route   POST /api/coaches
// @access  Private/Admin
exports.createCoach = async (req, res) => {
    try {
        const coach = await Coach.create(req.body);

        res.status(201).json({
            status: 'success',
            message: 'Coach created successfully',
            data: { coach }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update coach
// @route   PUT /api/coaches/:id
// @access  Private/Admin
exports.updateCoach = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!coach) {
            return res.status(404).json({
                status: 'error',
                message: 'Coach not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Coach updated successfully',
            data: { coach }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete coach
// @route   DELETE /api/coaches/:id
// @access  Private/Admin
exports.deleteCoach = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndDelete(req.params.id);

        if (!coach) {
            return res.status(404).json({
                status: 'error',
                message: 'Coach not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Coach deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
