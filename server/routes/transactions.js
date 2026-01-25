const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get all transactions
// @route   GET /api/transactions
router.get('/', protect, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Add transaction
// @route   POST /api/transactions
router.post('/', protect, async (req, res) => {
    try {
        const { text, amount, category } = req.body;

        const transaction = await Transaction.create({
            text,
            amount,
            category,
            userId: req.user.id
        });

        // Update Wallet Balance
        const user = await User.findByPk(req.user.id);
        user.walletBalance += Number(amount);
        await user.save();

        res.status(201).json({
            success: true,
            data: transaction,
            newBalance: user.walletBalance
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
