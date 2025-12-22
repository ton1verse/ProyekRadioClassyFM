'use client';

import { useState, useEffect } from 'react';
import { Musik } from '@/models/Musik';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function MusikTable() {
  const [musiks, setMusiks] = useState<Musik[]>([]);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selection States
  const [editingMusik, setEditingMusik] = useState<Musik | null>(null);
  const [musikToDelete, setMusikToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    penyanyi: '',
    foto: '',
    deskripsi: '',
    lirik: ''
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    if (isViewMode) return;

    try {
      const url = editingMusik ? `/api/musiks/${editingMusik.id}` : '/api/musiks';
      const method = editingMusik ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('penyanyi', formData.penyanyi);
      data.append('deskripsi', formData.deskripsi);
      data.append('lirik', formData.lirik);

      if (imageMode === 'url') {
        data.append('imageUrl', formData.foto);
      } else if (imageFile) {
        data.append('imageFile', imageFile);
      }

      if (editingMusik && !imageFile && imageMode === 'file') {
        if (formData.foto) data.append('imageUrl', formData.foto);
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        fetchMusiks();
        setIsModalOpen(false);
        resetForm();
        showToast('Musik saved successfully!', 'success');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          console.error('Failed to save musik:', errorData);
          showToast(`Failed to save: ${errorData.error || 'Unknown error'}`, 'error');
        } else {
          const text = await response.text();
          console.error('Failed to save musik (Non-JSON):', text);
          showToast('Failed to save: Server returned an unexpected error.', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving musik:', error);
      showToast('Error saving musik: Check console for details.', 'error');
    }
  };

  const handleEdit = (musik: Musik) => {
    setEditingMusik(musik);
    setIsViewMode(false);
    setFormData({
      judul: musik.judul,
      penyanyi: musik.penyanyi || '',
      foto: musik.foto || '',
      deskripsi: musik.deskripsi || '',
      lirik: musik.lirik || ''
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = (musik: Musik) => {
    setEditingMusik(musik);
    setIsViewMode(true);
    setFormData({
      judul: musik.judul,
      penyanyi: musik.penyanyi || '',
      foto: musik.foto || '',
      deskripsi: musik.deskripsi || '',
      lirik: musik.lirik || ''
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setMusikToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!musikToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/musiks/${musikToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchMusiks();
        setIsDeleteModalOpen(false);
        setMusikToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting musik:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingMusik(null);
    setIsViewMode(false);
    setFormData({ judul: '', penyanyi: '', foto: '', deskripsi: '', lirik: '' });
    setImageMode('url');
    setImageFile(null);
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
              <tr key={musik.id} className="border-b hover:bg-gray-50">
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
                      onClick={() => handleView(musik)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(musik)}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(musik.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
              {isViewMode ? 'Detail Musik' : editingMusik ? 'Edit Musik' : 'Add New Musik'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penyanyi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.penyanyi}
                  onChange={(e) => setFormData({ ...formData, penyanyi: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Source</label>
                <div className="flex space-x-4 mb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageMode"
                      value="url"
                      checked={imageMode === 'url'}
                      onChange={() => setImageMode('url')}
                      disabled={isViewMode}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Image URL</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageMode"
                      value="file"
                      checked={imageMode === 'file'}
                      onChange={() => setImageMode('file')}
                      disabled={isViewMode}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Upload File</span>
                  </label>
                </div>

                {imageMode === 'url' ? (
                  <input
                    type="url"
                    placeholder="https://example.com/foto.jpg"
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.foto}
                    onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setFormData({ ...formData, foto: URL.createObjectURL(e.target.files[0]) });
                      }
                    }}
                  />
                )}

                {/* Image Preview */}
                {formData.foto && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                    <img
                      src={formData.foto}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lirik <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.lirik}
                  onChange={(e) => setFormData({ ...formData, lirik: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  {isViewMode ? 'Close' : 'Cancel'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingMusik ? 'Update' : 'Create'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setMusikToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Musik"
        message="Apakah Anda yakin ingin menghapus musik ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
      />
    </div>
  );
}