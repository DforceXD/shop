const mongoose = require('mongoose');

const affiliateLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String, default: 'Uncategorized' },
  tags: [{ type: String }],
  clicks: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AffiliateLink', affiliateLinkSchema);
