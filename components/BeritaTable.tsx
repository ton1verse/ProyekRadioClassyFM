'use client';

import { useState, useEffect } from 'react';
import { Berita } from '@/models/Berita';

export default function BeritaTable() {
  const [beritas, setBeritas] = useState<Berita[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState<Berita | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
    gambar: '',
    link: '',
    penulis: ''
  });

  useEffect(() => {
    fetchBeritas();
  }, []);

  const fetchBeritas = async () => {
    try {
      const response = await fetch('/api/beritas');
      const data = await response.json();
      setBeritas(data);
    } catch (error) {
      console.error('Error fetching beritas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBerita ? `/api/beritas/${editingBerita._id}` : '/api/beritas';
      const method = editingBerita ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchBeritas();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving berita:', error);
    }
  };

  const handleEdit = (berita: Berita) => {
    setEditingBerita(berita);
    setFormData({
      judul: berita.judul,
      isi: berita.isi,
      gambar: berita.gambar,
      link: berita.link,
      penulis: berita.penulis
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this berita?')) {
      try {
        const response = await fetch(`/api/beritas/${id}`, { method: 'DELETE' });
        if (response.ok) fetchBeritas();
      } catch (error) {
        console.error('Error deleting berita:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingBerita(null);
    setFormData({ judul: '', isi: '', gambar: '', link: '', penulis: '' });
  };

  const filteredBeritas = beritas.filter(berita =>
    berita.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    berita.penulis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search beritas..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Berita
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Gambar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Judul</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Penulis</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Link</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeritas.map((berita) => (
              <tr key={berita._id?.toString()} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {berita.gambar && (
                    <img 
                      src={berita.gambar} 
                      alt={berita.judul} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-medium">{berita.judul}</td>
                <td className="py-3 px-4">{berita.penulis}</td>
                <td className="py-3 px-4">
                  <a href={berita.link} target="_blank" rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 text-sm truncate block max-w-xs">
                    {berita.link}
                  </a>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(berita)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(berita._id!.toString())}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingBerita ? 'Edit Berita' : 'Add New Berita'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Isi</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.isi}
                  onChange={(e) => setFormData({...formData, isi: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.penulis}
                  onChange={(e) => setFormData({...formData, penulis: e.target.value})}
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
                  {editingBerita ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}