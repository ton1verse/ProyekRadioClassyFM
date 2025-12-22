'use client';

import { useState, useEffect } from 'react';
import { Gallery } from '@/models/Gallery';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function GalleryTable() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selection States
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    gambar: ''
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    if (isViewMode) return;

    try {
      const url = editingGallery ? `/api/galleries/${editingGallery.id}` : '/api/galleries';
      const method = editingGallery ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('deskripsi', formData.deskripsi);

      if (imageMode === 'url') {
        data.append('imageUrl', formData.gambar);
      } else if (imageFile) {
        data.append('imageFile', imageFile);
      }

      if (editingGallery && !imageFile && imageMode === 'file') {
        if (formData.gambar) data.append('imageUrl', formData.gambar);
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        fetchGalleries();
        setIsModalOpen(false);
        resetForm();
        showToast('Gallery saved successfully!', 'success');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          console.error('Failed to save gallery:', errorData);
          showToast(`Failed to save: ${errorData.error || 'Unknown error'}`, 'error');
        } else {
          const text = await response.text();
          console.error('Failed to save gallery (Non-JSON):', text);
          showToast('Failed to save: Server returned an unexpected error.', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      showToast('Error saving gallery: Check console for details.', 'error');
    }
  };

  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setIsViewMode(false);
    setFormData({
      judul: gallery.judul,
      deskripsi: gallery.deskripsi,
      gambar: gallery.gambar || ''
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setIsViewMode(true);
    setFormData({
      judul: gallery.judul,
      deskripsi: gallery.deskripsi,
      gambar: gallery.gambar || ''
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setGalleryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!galleryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/galleries/${galleryToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchGalleries();
        setIsDeleteModalOpen(false);
        setGalleryToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingGallery(null);
    setIsViewMode(false);
    setFormData({ judul: '', deskripsi: '', gambar: '' });
    setImageMode('url');
    setImageFile(null);
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
              <tr key={gallery.id} className="border-b hover:bg-gray-50">
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
                      onClick={() => handleView(gallery)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(gallery)}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(gallery.id)}
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
              {isViewMode ? 'Detail Gallery' : editingGallery ? 'Edit Gallery' : 'Add New Gallery'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Source</label>
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
                    placeholder="https://example.com/gambar.jpg"
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.gambar}
                    onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
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
                        setFormData({ ...formData, gambar: URL.createObjectURL(e.target.files[0]) });
                      }
                    }}
                  />
                )}

                {/* Image Preview */}
                {formData.gambar && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                    <img
                      src={formData.gambar}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                    />
                  </div>
                )}
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
                    {editingGallery ? 'Update' : 'Create'}
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
        onClose={() => { setIsDeleteModalOpen(false); setGalleryToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Gallery"
        message="Apakah Anda yakin ingin menghapus gallery ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
      />
    </div>
  );
}