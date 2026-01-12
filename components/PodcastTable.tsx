'use client';

import { useState, useEffect, useRef } from 'react';
import { Podcast } from '@/models/Podcast';
import { Classier } from '@/models/Classier';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

export default function PodcastTable() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const { showToast } = useToast();
  const [classiers, setClassiers] = useState<Classier[]>([]);
  const [categories, setCategories] = useState<{ id: number; nama: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const componentRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handlePrint = () => {
    window.print();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    durasi: 0,
    tanggal: new Date().toISOString().split('T')[0]
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
      data.append('tanggal', formData.tanggal);

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
      durasi: podcast.durasi || 0,
      tanggal: podcast.tanggal ? new Date(podcast.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
      durasi: podcast.durasi || 0,
      tanggal: podcast.tanggal ? new Date(podcast.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
        fetchCategories();
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
    setFormData({ classier_id: '', category_id: '', judul: '', deskripsi: '', poster: '', link: '', durasi: 0, tanggal: new Date().toISOString().split('T')[0] });
    setImageMode('url');
    setImageFile(null);
    setNewCategoryName('');
  };

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = podcast.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter ? podcast.category?.nama === selectedCategoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPodcasts.length / itemsPerPage);
  const currentItems = filteredPodcasts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoryFilter]);

  const getCategoryColor = (categoryName: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-red-100 text-red-800',
      'bg-teal-100 text-teal-800',
    ];

    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            placeholder="Cari podcast..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.nama}>
                {cat.nama}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => window.open('/dashboard/podcasts/print', '_blank')}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <Printer size={18} />
          Cetak Laporan
        </button>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Tambah Podcast
        </button>
      </div>

      <div className="hidden print:block mb-8 text-center pt-4 border-b pb-6">
        <img src="/classy.jpg" alt="Logo" className="h-16 mx-auto mb-2 object-contain" />
        <h2 className="text-2xl font-black text-[#001A3A] uppercase tracking-wider">LAPORAN DATA PODCAST</h2>
        <p className="text-gray-600 font-medium">Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            background: white;
            margin: 1cm;
          }
          .print\\:hidden,
          button,
          input,
          select,
          nav,
          .pagination-controls,
          /* Hide sidebar via its class or a global hide */
          .w-64.flex-shrink-0 { 
            display: none !important;
          }
          .overflow-x-auto {
            overflow: visible !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd !important;
            padding: 8px !important;
            font-size: 12px;
          }
           /* Hide Action Column in Print */
           th:last-child, td:last-child {
             display: none !important;
           }
        }
      `}</style>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Poster</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Judul</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Classier</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategori</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Durasi</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Pendengar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((podcast) => (
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
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(podcast.category?.nama || '')}`}>
                    {podcast.category?.nama || 'Uncategorized'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{podcast.deskripsi}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium">
                    {Math.floor(podcast.durasi / 60)}m {podcast.durasi % 60}s
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">
                    {podcast.tanggal ? new Date(podcast.tanggal).toLocaleDateString('id-ID') : new Date(podcast.createdAt || '').toLocaleDateString('id-ID')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-[#A12227]">
                    {podcast._count?.listens || 0}
                  </span>
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
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(podcast.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => window.open(`/dashboard/podcasts/print/${podcast.id}`, '_blank')}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      title="Cetak Laporan"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredPodcasts.length)}</span> of <span className="font-bold">{filteredPodcasts.length}</span> results
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#A12227] text-white hover:bg-[#A12227]/80'
                }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#001A3A] text-white hover:bg-[#001A3A]/80'
                }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isViewMode ? 'Detail Podcast' : editingPodcast ? 'Edit Podcast' : 'Tambah Podcast'}
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
                  <option value="">Pilih Classier</option>
                  {classiers.map((classier) => (
                    <option key={classier.id} value={classier.id}>
                      {classier.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                />
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
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama}
                      </option>
                    ))}
                  </select>
                  {!isViewMode && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">atau:</span>
                      <input
                        type="text"
                        placeholder="Buat kategori baru"
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
                  placeholder="Judul podcast"
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
                  placeholder="Deskripsi podcast"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sumber Poster</label>
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
                    <span className="text-sm text-gray-700">URL</span>
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
                    <span className="text-sm text-gray-700">Upload</span>
                  </label>
                </div>

                {imageMode === 'url' ? (
                  <input
                    type="text"
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
                  Spotify Embed URL <span className="text-red-500">*</span>
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
                  Durasi <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      required
                      min="0"
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      value={Math.floor(formData.durasi / 60) || 0}
                      onChange={(e) => {
                        const minutes = parseInt(e.target.value) || 0;
                        const seconds = formData.durasi % 60;
                        setFormData({ ...formData, durasi: minutes * 60 + seconds });
                      }}
                      placeholder="Menit"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Menit</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      required
                      min="0"
                      max="59"
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      value={formData.durasi % 60 || 0}
                      onChange={(e) => {
                        const seconds = parseInt(e.target.value) || 0;
                        const minutes = Math.floor(formData.durasi / 60);
                        setFormData({ ...formData, durasi: minutes * 60 + seconds });
                      }}
                      placeholder="Detik"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Detik</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-right -mt-2">
                Total: {formData.durasi} detik
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  {isViewMode ? 'Tutup' : 'Batal'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingPodcast ? 'Perbarui' : 'Buat'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

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