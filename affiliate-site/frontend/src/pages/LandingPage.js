import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiExternalLink, FiStar, FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const LandingPage = () => {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredLinks, setFeaturedLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linksRes, categoriesRes, featuredRes] = await Promise.all([
        axios.get(`${API_URL}/links`),
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/links/featured`)
      ]);
      setLinks(linksRes.data);
      setCategories(categoriesRes.data);
      setFeaturedLinks(featuredRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleClick = async (id, url) => {
    try {
      await axios.put(`${API_URL}/links/click/${id}`);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          link.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary-600">
              Affiliate Links Hub
            </h1>
            <a 
              href="/admin" 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Admin Login
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Discover Amazing Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated collection of the best affiliate links and recommendations
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search links..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === cat._id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Links */}
        {featuredLinks.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <FiStar className="text-yellow-500 text-xl" />
              <h3 className="text-2xl font-bold text-gray-800">Featured Links</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLinks.map((link, index) => (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  {link.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`http://localhost:5000/uploads/${link.image}`}
                        alt={link.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {link.title}
                      </h4>
                      {link.isFeatured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {link.description}
                    </p>
                    <button
                      onClick={() => handleClick(link._id, link.url)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      Visit Link
                      <FiExternalLink />
                    </button>
                    <div className="mt-4 flex justify-between text-sm text-gray-500">
                      <span>{link.clicks} clicks</span>
                      <span>{link.category?.name}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Links */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            All Links ({filteredLinks.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLinks.map((link, index) => (
              <motion.div
                key={link._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h4 className="font-semibold text-gray-800 mb-2">
                  {link.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {link.description}
                </p>
                <button
                  onClick={() => handleClick(link._id, link.url)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                >
                  Visit Link
                  <FiExternalLink className="text-xs" />
                </button>
                <div className="mt-3 flex justify-between text-xs text-gray-500">
                  <span>{link.clicks} clicks</span>
                  {link.category && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {link.category.name}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Affiliate Links Hub. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Total Links: {links.length} | Total Clicks: {links.reduce((sum, link) => sum + link.clicks, 0)}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
