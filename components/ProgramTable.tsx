'use client';

import { useState, useEffect } from 'react';
import { Program } from '@/models/Program';

export default function ProgramTable() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    classier_id: '',
    nama_program: '',
    deskripsi: '',
    jadwal: '',
    poster: '',
    durasi: 0
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProgram ? `/api/programs/${editingProgram._id}` : '/api/programs';
      const method = editingProgram ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchPrograms();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      classier_id: program.classier_id.toString(),
      nama_program: program.nama_program,
      deskripsi: program.deskripsi,
      jadwal: program.jadwal.toString().slice(0, 16),
      poster: program.poster,
      durasi: program.durasi
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      try {
        const response = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
        if (response.ok) fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingProgram(null);
    setFormData({ classier_id: '', nama_program: '', deskripsi: '', jadwal: '', poster: '', durasi: 0 });
  };

  const filteredPrograms = programs.filter(program =>
    program.nama_program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search programs..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Program
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Program</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Jadwal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Durasi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((program) => (
              <tr key={program._id?.toString()} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {program.poster && (
                      <img src={program.poster} alt={program.nama_program} className="w-8 h-8 rounded mr-3" />
                    )}
                    <span className="font-medium">{program.nama_program}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{program.deskripsi}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm">{new Date(program.jadwal).toLocaleString()}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium">{program.durasi} menit</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(program)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(program._id!.toString())}
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
              {editingProgram ? 'Edit Program' : 'Add New Program'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.nama_program}
                  onChange={(e) => setFormData({...formData, nama_program: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.jadwal}
                  onChange={(e) => setFormData({...formData, jadwal: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.poster}
                  onChange={(e) => setFormData({...formData, poster: e.target.value})}
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
                  {editingProgram ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}