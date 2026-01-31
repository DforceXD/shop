const express = require('express');
const router = express.Router();
const AffiliateLink = require('../models/AffiliateLink');
const Category = require('../models/Category');

// Get all links
router.get('/', async (req, res) => {
  try {
    const links = await AffiliateLink.find()
      .populate('category')
      .sort({ order: 1, createdAt: -1 });
    res.json(links);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get featured links
router.get('/featured', async (req, res) => {
  try {
    const links = await AffiliateLink.find({ isFeatured: true })
      .populate('category')
      .limit(10)
      .sort({ order: 1 });
    res.json(links);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get links by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const links = await AffiliateLink.find({ category: req.params.categoryId })
      .populate('category')
      .sort({ order: 1 });
    res.json(links);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Track click
router.put('/click/:id', async (req, res) => {
  try {
    const link = await AffiliateLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ msg: 'Link not found' });
    }
    
    link.clicks += 1;
    await link.save();
    
    res.json(link);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
