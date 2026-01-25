const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// @desc    Get AI Analysis
// @route   GET /api/ai/analyze
router.get('/analyze', protect, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ where: { userId: req.user.id } });

        // 1. Spending by Category
        const categoryMap = {};
        let totalExpense = 0;
        let totalIncome = 0;

        transactions.forEach(t => {
            if (t.amount < 0) {
                const amount = Math.abs(t.amount);
                categoryMap[t.category] = (categoryMap[t.category] || 0) + amount;
                totalExpense += amount;
            } else {
                totalIncome += t.amount;
            }
        });

        // 2. Anomaly Detection
        const anomalies = transactions.filter(t => {
            return t.amount < 0 && Math.abs(t.amount) > (totalExpense / (transactions.length || 1)) * 3;
        });

        // 3. Forecast
        const dailyBurnRate = transactions.length > 0 ? totalExpense / 30 : 0;
        const predictionNextMonth = dailyBurnRate * 30;

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                savings: totalIncome - totalExpense,
                spendingByCategory: categoryMap,
                anomalies,
                predictionNextMonth
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, error: 'AI Engine Error' });
    }
});

module.exports = router;
