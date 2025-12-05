const Coach = require('../models/Coach');

// @desc    Get all coaches
// @route   GET /api/coaches
// @access  Public
exports.getAllCoaches = async (req, res) => {
    try {
        const { isActive = true } = req.query;
        const filter = { isActive };

        // Filter by tenantId if present (from middleware)
        if (req.tenantId) {
            filter.tenantId = req.tenantId;
        }

        const coaches = await Coach.find(filter).sort({ name: 1 });

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

        let filter = {};
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            // Valid ObjectId
            filter._id = identifier;
        } else {
            // Treat as slug
            filter.slug = identifier;
        }

        // Filter by tenantId if present
        if (req.tenantId) {
            filter.tenantId = req.tenantId;
        }

        const coach = await Coach.findOne(filter);

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
        // Inject tenantId from middleware
        const coachData = {
            ...req.body,
            tenantId: req.tenantId || req.body.tenantId
        };

        const coach = await Coach.create(coachData);

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
