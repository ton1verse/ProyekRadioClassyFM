'use client';

import { useState, useEffect } from 'react';
import { Gallery } from '@/models/Gallery';

export default function GalleryTable() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    gambar: ''
  });

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/galleries');
      const data = await response.json();
      setGalleries(data);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingGallery ? `/api/galleries/${editingGallery._id}` : '/api/galleries';
      const method = editingGallery ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchGalleries();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
    }
  };

  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({
      judul: gallery.judul,
      deskripsi: gallery.deskripsi,
      gambar: gallery.gambar
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery?')) {
      try {
        const response = await fetch(`/api/galleries/${id}`, { method: 'DELETE' });
        if (response.ok) fetchGalleries();
      } catch (error) {
        console.error('Error deleting gallery:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingGallery(null);
    setFormData({ judul: '', deskripsi: '', gambar: '' });
  };

  const filteredGalleries = galleries.filter(gallery =>
    gallery.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search galleries..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Gallery
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Gambar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Judul</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGalleries.map((gallery) => (
              <tr key={gallery._id?.toString()} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {gallery.gambar && (
                    <img 
                      src={gallery.gambar} 
                      alt={gallery.judul} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-medium">{gallery.judul}</td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{gallery.deskripsi}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(gallery)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(gallery._id!.toString())}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingGallery ? 'Edit Gallery' : 'Add New Gallery'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar URL</label>
                <input
                  type="url"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.gambar}
                  onChange={(e) => setFormData({...formData, gambar: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingGallery ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}