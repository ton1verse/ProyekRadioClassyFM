'use client';

import { useState, useEffect } from 'react';
import { Classier } from '@/models/Classier';

export default function ClassierTable() {
  const [classiers, setClassiers] = useState<Classier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassier, setEditingClassier] = useState<Classier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    foto: '',
    status: 'active' as 'active' | 'inactive',
    honor_per_jam: 0
  });

  useEffect(() => {
    fetchClassiers();
  }, []);

  const fetchClassiers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/classiers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setClassiers(data);
    } catch (error) {
      console.error('Error fetching classiers:', error);
      setError('Failed to load classiers');
      setClassiers([]); // Set empty array sebagai fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const url = editingClassier ? `/api/classiers/${editingClassier._id}` : '/api/classiers';
      const method = editingClassier ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save classier');
      }

      await fetchClassiers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving classier:', error);
      setError(error instanceof Error ? error.message : 'Failed to save classier');
    }
  };

  const handleEdit = (classier: Classier) => {
    setEditingClassier(classier);
    setFormData({
      nama: classier.nama,
      deskripsi: classier.deskripsi,
      foto: classier.foto || '',
      status: classier.status,
      honor_per_jam: classier.honor_per_jam
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this classier?')) {
      try {
        setError(null);
        const response = await fetch(`/api/classiers/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete classier');
        }
        
        await fetchClassiers();
      } catch (error) {
        console.error('Error deleting classier:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete classier');
      }
    }
  };

  const resetForm = () => {
    setEditingClassier(null);
    setFormData({ nama: '', deskripsi: '', foto: '', status: 'active', honor_per_jam: 0 });
  };

  const filteredClassiers = classiers.filter(classier =>
    classier.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-600">Loading classiers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search classiers..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Classier
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Honor/Jam</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClassiers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  {classiers.length === 0 ? 'No classiers found' : 'No matching classiers found'}
                </td>
              </tr>
            ) : (
              filteredClassiers.map((classier) => (
                <tr key={classier._id?.toString()} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {classier.foto && (
                        <img src={classier.foto} alt={classier.nama} className="w-8 h-8 rounded-full mr-3" />
                      )}
                      <span className="font-medium">{classier.nama}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{classier.deskripsi}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      classier.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {classier.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">Rp {classier.honor_per_jam.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(classier)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => classier._id && handleDelete(classier._id.toString())}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingClassier ? 'Edit Classier' : 'Add New Classier'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.foto}
                  onChange={(e) => setFormData({...formData, foto: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Honor per Jam</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.honor_per_jam}
                  onChange={(e) => setFormData({...formData, honor_per_jam: parseInt(e.target.value) || 0})}
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
                  {editingClassier ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}