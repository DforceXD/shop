const express = require('express');
const router = express.Router();
const AffiliateLink = require('../../models/AffiliateLink');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all links (admin)
router.get('/', async (req, res) => {
  try {
    const links = await AffiliateLink.find().populate('category').sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create new link
router.post('/', upload.single('image'), [
  check('title', 'Title is required').not().isEmpty(),
  check('url', 'URL is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, url, category, tags, isFeatured, order } = req.body;
    
    const newLink = new AffiliateLink({
      title,
      description,
      url,
      category: category || null,
      tags: tags ? tags.split(',') : [],
      isFeatured: isFeatured === 'true',
      order: order || 0,
      image: req.file ? req.file.filename : null
    });

    const link = await newLink.save();
    res.json(link);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update link
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, url, category, tags, isFeatured, order } = req.body;
    
    let link = await AffiliateLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ msg: 'Link not found' });
    }

    const linkFields = {
      title,
      description,
      url,
      category: category || null,
      tags: tags ? tags.split(',') : link.tags,
      isFeatured: isFeatured === 'true',
      order: order || link.order,
      updatedAt: Date.now()
    };

    if (req.file) {
      linkFields.image = req.file.filename;
    }

    link = await AffiliateLink.findByIdAndUpdate(
      req.params.id,
      { $set: linkFields },
      { new: true }
    ).populate('category');

    res.json(link);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete link
router.delete('/:id', async (req, res) => {
  try {
    const link = await AffiliateLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ msg: 'Link not found' });
    }

    await link.deleteOne();
    res.json({ msg: 'Link removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
