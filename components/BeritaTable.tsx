'use client';

import { useState, useEffect } from 'react';
import { Berita } from '@/models/Berita';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function BeritaTable() {
  const [beritas, setBeritas] = useState<Berita[]>([]);
  const { showToast } = useToast();
  const [categories, setCategories] = useState<{ id: number; nama: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selection States
  const [editingBerita, setEditingBerita] = useState<Berita | null>(null);
  const [beritaToDelete, setBeritaToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    category_id: '',
    judul: '',
    isi: '',
    gambar: '',
    link: '',
    penulis: ''
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBeritas();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/news-categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching news categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    try {
      const url = editingBerita ? `/api/beritas/${editingBerita.id}` : '/api/beritas';
      const method = editingBerita ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('category_id', formData.category_id);
      data.append('judul', formData.judul);
      data.append('isi', formData.isi);
      data.append('link', formData.link);
      data.append('penulis', formData.penulis);

      if (imageMode === 'url') {
        data.append('imageUrl', formData.gambar);
      } else if (imageFile) {
        data.append('imageFile', imageFile);
      }

      if (editingBerita && !imageFile && imageMode === 'file') {
        // Fallback to existing image if no new file selected in file mode
        if (formData.gambar) data.append('imageUrl', formData.gambar);
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        fetchBeritas();
        setIsModalOpen(false);
        resetForm();
        showToast('Berita saved successfully!', 'success');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          console.error('Failed to save berita:', errorData);
          showToast(`Failed to save: ${errorData.error || 'Unknown error'}`, 'error');
        } else {
          const text = await response.text();
          console.error('Failed to save berita (Non-JSON):', text);
          showToast('Failed to save: Server returned an unexpected error.', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving berita:', error);
      showToast('Error saving berita: Check console for details.', 'error');
    }
  };

  const handleEdit = (berita: Berita) => {
    setEditingBerita(berita);
    setIsViewMode(false);
    setFormData({
      category_id: (berita as any).categoryId || (berita as any).category_id || '',
      judul: berita.judul,
      isi: berita.isi,
      gambar: berita.gambar || '',
      link: berita.link || '',
      penulis: berita.penulis
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = (berita: Berita) => {
    setEditingBerita(berita);
    setIsViewMode(true);
    setFormData({
      category_id: (berita as any).categoryId || (berita as any).category_id || '',
      judul: berita.judul,
      isi: berita.isi,
      gambar: berita.gambar || '',
      link: berita.link || '',
      penulis: berita.penulis
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setBeritaToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!beritaToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/beritas/${beritaToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchBeritas();
        setIsDeleteModalOpen(false);
        setBeritaToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting berita:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingBerita(null);
    setIsViewMode(false);
    setFormData({ category_id: '', judul: '', isi: '', gambar: '', link: '', penulis: '' });
    setImageMode('url');
    setImageFile(null);
    setNewCategoryName('');
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
              <tr key={berita.id} className="border-b hover:bg-gray-50">
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
                  <div className="relative group">
                    <a href={berita.link} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm truncate block max-w-xs transition-colors group-hover:underline">
                      {berita.link}
                    </a>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(berita)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(berita)}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(berita.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {isViewMode ? 'Detail Berita' : editingBerita ? 'Edit Berita' : 'Add New Berita'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  News Category <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <select
                    required={!newCategoryName}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.category_id || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, category_id: e.target.value });
                      setNewCategoryName('');
                    }}
                  >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama}
                      </option>
                    ))}
                  </select>
                  {!isViewMode && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">or create new:</span>
                      <input
                        type="text"
                        placeholder="New category name"
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={newCategoryName}
                        onChange={async (e) => {
                          setNewCategoryName(e.target.value);
                          if (e.target.value) {
                            setFormData({ ...formData, category_id: '' });
                          }
                        }}
                      />
                      {newCategoryName && (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/news-categories', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ nama: newCategoryName })
                              });
                              if (res.ok) {
                                const newCat = await res.json();
                                await fetchCategories();
                                setFormData({ ...formData, category_id: newCat.id });
                                setNewCategoryName('');
                                showToast(`Category '${newCat.nama}' created!`, 'success');
                              }
                            } catch (error) {
                              console.error('Error creating category:', error);
                            }
                          }}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

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
                  Isi <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.isi}
                  onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar Source <span className="text-red-500">*</span>
                </label>
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
                    placeholder="https://example.com/image.jpg"
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
                        // Create preview URL
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penulis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.penulis}
                  onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
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
                    {editingBerita ? 'Update' : 'Create'}
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
        onClose={() => { setIsDeleteModalOpen(false); setBeritaToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Berita"
        message="Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
      />
    </div>
  );
}