const Contact = require('../models/Contact');

// @desc    Create a contact/enquiry
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const contactData = {
            name,
            email,
            phone,
            subject,
            message,
            tenantId: req.tenantId || req.body.tenantId
        };

        const contact = await Contact.create(contactData);

        res.status(201).json({
            status: 'success',
            message: 'Your message has been submitted successfully. We will get back to you soon!',
            data: { contact }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get all contacts/enquiries
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
    try {
        const { status, priority, page = 1, limit = 10 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        // Filter by tenantId if present (from middleware)
        if (req.tenantId) {
            query.tenantId = req.tenantId;
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('assignedTo', 'name email');

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            status: 'success',
            data: {
                contacts,
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

// @desc    Get contact by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).populate('assignedTo', 'name email');

        if (!contact) {
            return res.status(404).json({
                status: 'error',
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { contact }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update contact status/details
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContact = async (req, res) => {
    try {
        const { status, priority, assignedTo, notes } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status, priority, assignedTo, notes },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        if (!contact) {
            return res.status(404).json({
                status: 'error',
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Contact updated successfully',
            data: { contact }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                status: 'error',
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
