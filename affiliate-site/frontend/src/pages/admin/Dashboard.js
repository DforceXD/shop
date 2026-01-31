import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  FiLink, FiFolder, FiUsers, FiTrendingUp, 
  FiPlus, FiEdit, FiTrash2, FiLogOut 
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    totalCategories: 0,
    featuredLinks: 0
  });
  const [recentLinks, setRecentLinks] = useState([]);
  const [topLinks, setTopLinks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'x-auth-token': token }
      };

      const [linksRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/links`, config),
        axios.get(`${API_URL}/admin/categories`, config)
      ]);

      const links = linksRes.data;
      const categories = categoriesRes.data;

      const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
      const featuredLinks = links.filter(link => link.isFeatured).length;

      setStats({
        totalLinks: links.length,
        totalClicks,
        totalCategories: categories.length,
        featuredLinks
      });

      setRecentLinks(links.slice(0, 5).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setTopLinks(links.sort((a, b) => b.clicks - a.clicks).slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const chartData = topLinks.map(link => ({
    name: link.title.substring(0, 15) + '...',
    clicks: link.clicks
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Admin Panel
            </h2>
            <nav className="space-y-2">
              <a 
                href="/admin" 
                className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-lg font-medium"
              >
                <FiTrendingUp />
                Dashboard
              </a>
              <a 
                href="/admin/links" 
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FiLink />
                Manage Links
              </a>
              <a 
                href="/admin/categories" 
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FiFolder />
                Manage Categories
              </a>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-8"
              >
                <FiLogOut />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600">Here's what's happening with your links</p>
            </div>
            <a 
              href="/admin/links/new" 
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <FiPlus />
              Add New Link
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Links</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalLinks}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiLink className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Clicks</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalClicks}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiTrendingUp className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Categories</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.totalCategories}</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiFolder className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Featured</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.featuredLinks}</h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FiStar className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Links Chart */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Top Performing Links
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Links */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recently Added Links
              </h3>
              <div className="space-y-3">
                {recentLinks.map(link => (
                  <div key={link._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                    <div>
                      <h4 className="font-medium text-gray-800">{link.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{link.clicks} clicks</span>
                      <a 
                        href={`/admin/links/edit/${link._id}`}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FiEdit />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Links Table */}
          <div className="bg-white p-6 rounded-xl shadow mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Most Clicked Links
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-gray-600">Link</th>
                    <th className="text-left py-3 text-gray-600">Category</th>
                    <th className="text-left py-3 text-gray-600">Clicks</th>
                    <th className="text-left py-3 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topLinks.map(link => (
                    <tr key={link._id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-800">{link.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{link.url}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        {link.category ? (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {link.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">No category</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-primary-600">{link.clicks}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <a 
                            href={`/admin/links/edit/${link._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <FiEdit />
                          </a>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
