'use client';

import { useState, useEffect } from 'react';
import { Musik } from '@/models/Musik';

export default function MusikTable() {
  const [musiks, setMusiks] = useState<Musik[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMusik, setEditingMusik] = useState<Musik | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    penyanyi: '',
    foto: '',
    deskripsi: '',
    lirik: ''
  });

  useEffect(() => {
    fetchMusiks();
  }, []);

  const fetchMusiks = async () => {
    try {
      const response = await fetch('/api/musiks');
      const data = await response.json();
      setMusiks(data);
    } catch (error) {
      console.error('Error fetching musiks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMusik ? `/api/musiks/${editingMusik._id}` : '/api/musiks';
      const method = editingMusik ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMusiks();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving musik:', error);
    }
  };

  const handleEdit = (musik: Musik) => {
    setEditingMusik(musik);
    setFormData({
      judul: musik.judul,
      penyanyi: musik.penyanyi,
      foto: musik.foto,
      deskripsi: musik.deskripsi,
      lirik: musik.lirik
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this musik?')) {
      try {
        const response = await fetch(`/api/musiks/${id}`, { method: 'DELETE' });
        if (response.ok) fetchMusiks();
      } catch (error) {
        console.error('Error deleting musik:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingMusik(null);
    setFormData({ judul: '', penyanyi: '', foto: '', deskripsi: '', lirik: '' });
  };

  const filteredMusiks = musiks.filter(musik =>
    musik.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    musik.penyanyi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search musiks..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Musik
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Foto</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Judul</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Penyanyi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMusiks.map((musik) => (
              <tr key={musik._id?.toString()} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {musik.foto && (
                    <img 
                      src={musik.foto} 
                      alt={musik.judul} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-medium">{musik.judul}</td>
                <td className="py-3 px-4">{musik.penyanyi}</td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{musik.deskripsi}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(musik)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(musik._id!.toString())}
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
              {editingMusik ? 'Edit Musik' : 'Add New Musik'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Penyanyi</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.penyanyi}
                  onChange={(e) => setFormData({...formData, penyanyi: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto URL</label>
                <input
                  type="url"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.foto}
                  onChange={(e) => setFormData({...formData, foto: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Lirik</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.lirik}
                  onChange={(e) => setFormData({...formData, lirik: e.target.value})}
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
                  {editingMusik ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}