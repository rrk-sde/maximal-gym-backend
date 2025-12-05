const Tenant = require('../models/Tenant');

// @desc    Create new tenant
// @route   POST /api/tenants
// @access  SuperAdmin
exports.createTenant = async (req, res) => {
    try {
        const tenant = await Tenant.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { tenant }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  SuperAdmin
exports.getAllTenants = async (req, res) => {
    try {
        const { isActive, page = 1, limit = 10 } = req.query;

        const query = {};
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const tenants = await Tenant.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Tenant.countDocuments(query);

        res.status(200).json({
            status: 'success',
            data: {
                tenants,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get tenant by ID
// @route   GET /api/tenants/:id
// @access  Admin, SuperAdmin
exports.getTenantById = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);

        if (!tenant) {
            return res.status(404).json({
                status: 'error',
                message: 'Tenant not found'
            });
        }

        // Regular admins can only view their own tenant
        if (req.user.role === 'admin' && tenant._id.toString() !== req.user.tenantId.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { tenant }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Admin, SuperAdmin
exports.updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);

        if (!tenant) {
            return res.status(404).json({
                status: 'error',
                message: 'Tenant not found'
            });
        }

        // Regular admins can only update their own tenant
        if (req.user.role === 'admin' && tenant._id.toString() !== req.user.tenantId.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied'
            });
        }

        const updatedTenant = await Tenant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            data: { tenant: updatedTenant }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  SuperAdmin
exports.deleteTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);

        if (!tenant) {
            return res.status(404).json({
                status: 'error',
                message: 'Tenant not found'
            });
        }

        await tenant.deleteOne();

        res.status(200).json({
            status: 'success',
            message: 'Tenant deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
