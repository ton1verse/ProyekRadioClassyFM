'use client';

import { useState, useEffect } from 'react';
import { Podcast } from '@/models/Podcast';

export default function PodcastTable() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [formData, setFormData] = useState({
    classier_id: '',
    judul: '',
    deskripsi: '',
    poster: '',
    link: '',
    durasi: 0
  });

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await fetch('/api/podcasts');
      const data = await response.json();
      setPodcasts(data);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPodcast ? `/api/podcasts/${editingPodcast._id}` : '/api/podcasts';
      const method = editingPodcast ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchPodcasts();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving podcast:', error);
    }
  };

  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setFormData({
      classier_id: podcast.classier_id.toString(),
      judul: podcast.judul,
      deskripsi: podcast.deskripsi,
      poster: podcast.poster,
      link: podcast.link,
      durasi: podcast.durasi
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this podcast?')) {
      try {
        const response = await fetch(`/api/podcasts/${id}`, { method: 'DELETE' });
        if (response.ok) fetchPodcasts();
      } catch (error) {
        console.error('Error deleting podcast:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingPodcast(null);
    setFormData({ classier_id: '', judul: '', deskripsi: '', poster: '', link: '', durasi: 0 });
  };

  const filteredPodcasts = podcasts.filter(podcast =>
    podcast.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search podcasts..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Podcast
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Poster</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Judul</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Durasi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPodcasts.map((podcast) => (
              <tr key={podcast._id?.toString()} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {podcast.poster && (
                    <img 
                      src={podcast.poster} 
                      alt={podcast.judul} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-medium">{podcast.judul}</td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{podcast.deskripsi}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium">{podcast.durasi} menit</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(podcast)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(podcast._id!.toString())}
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
              {editingPodcast ? 'Edit Podcast' : 'Add New Podcast'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classier ID</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.classier_id}
                  onChange={(e) => setFormData({...formData, classier_id: e.target.value})}
                />
              </div>
              
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
                <input
                  type="url"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.poster}
                  onChange={(e) => setFormData({...formData, poster: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="url"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (menit)</label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.durasi}
                  onChange={(e) => setFormData({...formData, durasi: parseInt(e.target.value)})}
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
                  {editingPodcast ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}