const express = require('express');
const router = express.Router();
const {
    getAllFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    getFAQById
} = require('../controllers/faqController');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     FAQ:
 *       type: object
 *       required:
 *         - question
 *         - answer
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the FAQ
 *         question:
 *           type: string
 *           description: The FAQ question
 *         answer:
 *           type: string
 *           description: The FAQ answer
 *         category:
 *           type: string
 *           description: The FAQ category
 *         isActive:
 *           type: boolean
 *           description: Whether the FAQ is active
 *       example:
 *         question: What are your opening hours?
 *         answer: We are open 24/7.
 *         category: general
 *         isActive: true
 */

/**
 * @swagger
 * tags:
 *   name: FAQs
 *   description: The FAQ managing API
 */

/**
 * @swagger
 * /faqs:
 *   get:
 *     summary: Returns the list of all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: The list of the FAQs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FAQ'
 */
router.get('/', getAllFAQs);

/**
 * @swagger
 * /faqs/{id}:
 *   get:
 *     summary: Get the FAQ by id
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The FAQ id
 *     responses:
 *       200:
 *         description: The FAQ description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQ'
 *       404:
 *         description: The FAQ was not found
 */
router.get('/:id', getFAQById);

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('admin'));

/**
 * @swagger
 * /faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FAQ'
 *     responses:
 *       201:
 *         description: The FAQ was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQ'
 *       500:
 *         description: Some server error
 */
router.post('/', createFAQ);

/**
 * @swagger
 * /faqs/{id}:
 *   put:
 *     summary: Update the FAQ by the id
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The FAQ id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FAQ'
 *     responses:
 *       200:
 *         description: The FAQ was updated
 *       404:
 *         description: The FAQ was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', updateFAQ);

/**
 * @swagger
 * /faqs/{id}:
 *   delete:
 *     summary: Remove the FAQ by id
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The FAQ id
 *     responses:
 *       200:
 *         description: The FAQ was deleted
 *       404:
 *         description: The FAQ was not found
 */
router.delete('/:id', deleteFAQ);

module.exports = router;
