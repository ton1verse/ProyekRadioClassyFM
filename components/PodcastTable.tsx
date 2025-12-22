'use client';

import { useState, useEffect } from 'react';
import { Podcast } from '@/models/Podcast';
import { Classier } from '@/models/Classier';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function PodcastTable() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const { showToast } = useToast();
  const [classiers, setClassiers] = useState<Classier[]>([]);
  const [categories, setCategories] = useState<{ id: number; nama: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selection States
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [podcastToDelete, setPodcastToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    classier_id: '',
    category_id: '',
    judul: '',
    deskripsi: '',
    poster: '',
    link: '',
    durasi: 0
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPodcasts();
    fetchClassiers();
    fetchCategories();
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

  const fetchClassiers = async () => {
    try {
      const response = await fetch('/api/classiers');
      const data = await response.json();
      setClassiers(data);
    } catch (error) {
      console.error('Error fetching classiers:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/podcast-categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    try {
      const url = editingPodcast ? `/api/podcasts/${editingPodcast.id}` : '/api/podcasts';
      const method = editingPodcast ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('classier_id', formData.classier_id);
      data.append('category_id', formData.category_id);
      data.append('judul', formData.judul);
      data.append('deskripsi', formData.deskripsi);
      data.append('link', formData.link);
      data.append('durasi', formData.durasi.toString());

      if (imageMode === 'url') {
        data.append('imageUrl', formData.poster);
      } else if (imageFile) {
        data.append('imageFile', imageFile);
      }

      if (editingPodcast && !imageFile && imageMode === 'file') {
        if (formData.poster) data.append('imageUrl', formData.poster);
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      if (response.ok) {
        fetchPodcasts();
        setIsModalOpen(false);
        resetForm();
        showToast('Podcast saved successfully!', 'success');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          console.error('Failed to save podcast:', errorData);
          showToast(`Failed to save: ${errorData.error || 'Unknown error'}`, 'error');
        } else {
          const text = await response.text();
          console.error('Failed to save podcast (Non-JSON):', text);
          showToast('Failed to save: Server returned an unexpected error.', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving podcast:', error);
      showToast('Error saving podcast: Check console for details.', 'error');
    }
  };

  const getSafeClassierId = (podcast: any) => {
    if (podcast.classierId) return podcast.classierId.toString();
    if (podcast.classier_id) return podcast.classier_id.toString();
    if (podcast.classier && podcast.classier.id) return podcast.classier.id.toString();
    return '';
  };

  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setIsViewMode(false);

    setFormData({
      classier_id: getSafeClassierId(podcast) || '',
      category_id: (podcast as any).categoryId || (podcast as any).category_id || '',
      judul: podcast.judul || '',
      deskripsi: podcast.deskripsi || '',
      poster: podcast.poster || '',
      link: podcast.link || '',
      durasi: podcast.durasi || 0
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setIsViewMode(true);

    setFormData({
      classier_id: getSafeClassierId(podcast) || '',
      category_id: (podcast as any).categoryId || (podcast as any).category_id || '',
      judul: podcast.judul || '',
      deskripsi: podcast.deskripsi || '',
      poster: podcast.poster || '',
      link: podcast.link || '',
      durasi: podcast.durasi || 0
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setPodcastToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!podcastToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/podcasts/${podcastToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPodcasts();
        setIsDeleteModalOpen(false);
        setPodcastToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting podcast:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingPodcast(null);
    setIsViewMode(false);
    setFormData({ classier_id: '', category_id: '', judul: '', deskripsi: '', poster: '', link: '', durasi: 0 });
    setImageMode('url');
    setImageFile(null);
    setNewCategoryName('');
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
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Classier</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Durasi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPodcasts.map((podcast) => (
              <tr key={podcast.id} className="border-b hover:bg-gray-50">
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
                <td className="py-3 px-4">{podcast.classier?.nama || '-'}</td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{podcast.deskripsi}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium">{podcast.durasi} menit</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(podcast)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(podcast)}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(podcast.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isViewMode ? 'Detail Podcast' : editingPodcast ? 'Edit Podcast' : 'Add New Podcast'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classier <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.classier_id || ''}
                  onChange={(e) => setFormData({ ...formData, classier_id: e.target.value })}
                >
                  <option value="">Select a Classier</option>
                  {classiers.map((classier) => (
                    <option key={classier.id} value={classier.id}>
                      {classier.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Podcast <span className="text-red-500">*</span>
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
                              const res = await fetch('/api/podcast-categories', {
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
                  value={formData.judul || ''}
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
                  value={formData.deskripsi || ''}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster Source</label>
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
                    placeholder="https://example.com/poster.jpg"
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={formData.poster || ''}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
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
                        setFormData({ ...formData, poster: URL.createObjectURL(e.target.files[0]) });
                      }
                    }}
                  />
                )}

                {/* Image Preview */}
                {formData.poster && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                    <img
                      src={formData.poster}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link / Spotify Embed Code <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder='Paste URL or <iframe src="..."></iframe>'
                />
                {formData.link && (
                  <div className="mt-2">
                    {formData.link.includes('<iframe') ? (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Embed Preview:</p>
                        <div dangerouslySetInnerHTML={{ __html: formData.link }} />
                      </div>
                    ) : (
                      <a
                        href={formData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline block"
                      >
                        Open Link
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durasi (menit) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.durasi || ''}
                  onChange={(e) => setFormData({ ...formData, durasi: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  {isViewMode ? 'Close' : 'Cancel'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingPodcast ? 'Update' : 'Create'}
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
        onClose={() => { setIsDeleteModalOpen(false); setPodcastToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Podcast"
        message="Apakah Anda yakin ingin menghapus podcast ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
      />
    </div>
  );
}