const FAQ = require('../models/FAQ');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
exports.getAllFAQs = async (req, res) => {
    try {
        const { category, isActive = true } = req.query;

        const query = { isActive };
        if (category) query.category = category;

        const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: { faqs }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get FAQ by ID
// @route   GET /api/faqs/:id
// @access  Public
exports.getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);

        if (!faq) {
            return res.status(404).json({
                status: 'error',
                message: 'FAQ not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { faq }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private/Admin
exports.createFAQ = async (req, res) => {
    try {
        const faq = await FAQ.create(req.body);

        res.status(201).json({
            status: 'success',
            message: 'FAQ created successfully',
            data: { faq }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
exports.updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!faq) {
            return res.status(404).json({
                status: 'error',
                message: 'FAQ not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'FAQ updated successfully',
            data: { faq }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
exports.deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);

        if (!faq) {
            return res.status(404).json({
                status: 'error',
                message: 'FAQ not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'FAQ deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
