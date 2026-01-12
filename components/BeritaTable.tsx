'use client';

import { useState, useEffect } from 'react';
import { Berita } from '@/models/Berita';
import { Eye, Trash2, Edit, Search, Plus, X, ChevronDown, Upload, BookOpen, User, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import DeleteModal from './DeleteModal';
import { useToast } from '@/context/ToastContext';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

export default function BeritaTable() {
  const [beritas, setBeritas] = useState<Berita[]>([]);
  const { showToast } = useToast();
  const [categories, setCategories] = useState<{ id: number; nama: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingBerita, setEditingBerita] = useState<Berita | null>(null);
  const [beritaToDelete, setBeritaToDelete] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newBerita, setNewBerita] = useState({
    category_id: '',
    judul: '',
    isi: '',
    gambar: '',
    link: '',
    penulis: '',
    tanggal: ''
  });

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
      data.append('category_id', newBerita.category_id);
      data.append('judul', newBerita.judul);
      data.append('isi', newBerita.isi);
      data.append('link', newBerita.link);
      data.append('penulis', newBerita.penulis);
      data.append('tanggal', newBerita.tanggal);

      if (imageMode === 'url') {
        data.append('imageUrl', newBerita.gambar);
      } else if (imageFile) {
        data.append('imageFile', imageFile);
      }

      if (editingBerita && !imageFile && imageMode === 'file') {
        if (newBerita.gambar) data.append('imageUrl', newBerita.gambar);
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
    setNewBerita({
      category_id: (berita as any).categoryId || (berita as any).category_id || '',
      judul: berita.judul,
      isi: berita.isi,
      gambar: berita.gambar || '',
      link: berita.link || '',
      penulis: berita.penulis,
      tanggal: berita.tanggal ? new Date(berita.tanggal).toISOString().split('T')[0] : ''
    });
    setImageMode('url');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleView = (berita: Berita) => {
    setEditingBerita(berita);
    setIsViewMode(true);
    setNewBerita({
      category_id: (berita as any).categoryId || (berita as any).category_id || '',
      judul: berita.judul,
      isi: berita.isi,
      gambar: berita.gambar || '',
      link: berita.link || '',
      penulis: berita.penulis,
      tanggal: berita.tanggal ? new Date(berita.tanggal).toISOString().split('T')[0] : ''
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
        showToast('Berita deleted successfully!', 'success');
      } else {
        showToast('Failed to delete berita.', 'error');
      }
    } catch (error) {
      console.error('Error deleting berita:', error);
      showToast('Error deleting berita: Check console for details.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingBerita(null);
    setIsViewMode(false);
    setNewBerita({ category_id: '', judul: '', isi: '', gambar: '', link: '', penulis: '', tanggal: '' });
    setImageMode('url');
    setImageFile(null);
    setNewCategoryName('');
  };

  const filteredBeritas = beritas.filter(berita => {
    const matchesSearch = berita.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      berita.penulis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter ? (berita as any).category?.nama === selectedCategoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBeritas.length / itemsPerPage);
  const currentItems = filteredBeritas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoryFilter]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            placeholder="Cari berita..."
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
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Tambah Berita
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Gambar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Judul</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategori</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Penulis</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Link</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((berita) => (
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
                <td className="py-3 px-4 font-medium max-w-xs">
                  <div className="line-clamp-3 text-sm" title={berita.judul}>
                    {berita.judul}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {(berita as any).category?.nama || '-'}
                </td>
                <td className="py-3 px-4">{berita.penulis}</td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {berita.tanggal ? new Date(berita.tanggal).toLocaleDateString() : (berita.createdAt ? new Date(berita.createdAt).toLocaleDateString() : '-')}
                </td>
                <td className="py-3 px-4">
                  {['hot release', 'about us'].includes(((berita as any).category?.nama || '').toLowerCase()) ? (
                    <span className="text-gray-400 text-sm italic">Not Required</span>
                  ) : (
                    <div className="relative group">
                      <a href={berita.link} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm truncate block max-w-xs transition-colors group-hover:underline">
                        {berita.link}
                      </a>
                    </div>
                  )}
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
                      <Edit size={18} />
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

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredBeritas.length)}</span> of <span className="font-bold">{filteredBeritas.length}</span> results
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isViewMode ? 'Detail Berita' : editingBerita ? 'Edit Berita' : 'Tamah Berita'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Berita <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <select
                    required={!newCategoryName}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={newBerita.category_id || ''}
                    onChange={(e) => {
                      setNewBerita({ ...newBerita, category_id: e.target.value });
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
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">atau:</span>
                      <input
                        type="text"
                        placeholder="Buat kategori baru"
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={newCategoryName}
                        onChange={async (e) => {
                          setNewCategoryName(e.target.value);
                          if (e.target.value) {
                            setNewBerita({ ...newBerita, category_id: '' });
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
                                setNewBerita({ ...newBerita, category_id: newCat.id });
                                setNewCategoryName('');
                                showToast(`Category '${newCat.nama}' created!`, 'success');
                              }
                            } catch (error) {
                              console.error('Error creating category:', error);
                              showToast('Error creating category.', 'error');
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
                  value={newBerita.judul}
                  onChange={(e) => setNewBerita({ ...newBerita, judul: e.target.value })}
                  placeholder="Judul berita"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Isi <span className="text-red-500">*</span>
                </label>
                {isViewMode ? (
                  <div
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 min-h-[150px] overflow-auto"
                    dangerouslySetInnerHTML={{ __html: newBerita.isi }}
                  />
                ) : (
                  <RichTextEditor
                    value={newBerita.isi}
                    onChange={(val) => setNewBerita({ ...newBerita, isi: val })}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sumber Gambar <span className="text-red-500">*</span>
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
                    placeholder="https://example.com/image.jpg or /images/..."
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={newBerita.gambar}
                    onChange={(e) => setNewBerita({ ...newBerita, gambar: e.target.value })}
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
                        setNewBerita({ ...newBerita, gambar: URL.createObjectURL(e.target.files[0]) });
                      }
                    }}
                  />
                )}

                {newBerita.gambar && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Pratinjau:</p>
                    <img
                      src={newBerita.gambar}
                      alt="Pratinjau"
                      onClick={() => setPreviewImage(newBerita.gambar)}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                    />
                    <p className="text-xs text-center text-gray-500 mt-1">Klik gambar untuk memperbesar</p>
                  </div>
                )}
              </div>

              {!['hot release', 'about us'].includes(categories.find(c => c.id === parseInt(newBerita.category_id))?.nama.toLowerCase() || '') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required={'hot release' !== (categories.find(c => c.id === parseInt(newBerita.category_id))?.nama.toLowerCase() || '')}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={newBerita.link}
                    onChange={(e) => setNewBerita({ ...newBerita, link: e.target.value })}
                    placeholder="Link berita"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal <span className="text-gray-400 text-xs"></span>
                </label>
                <input
                  type="date"
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={newBerita.tanggal ? String(newBerita.tanggal) : ''}
                  onChange={(e) => setNewBerita({ ...newBerita, tanggal: e.target.value })}
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
                  value={newBerita.penulis}
                  onChange={(e) => setNewBerita({ ...newBerita, penulis: e.target.value })}
                  placeholder="Penulis berita"
                />
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
                    {editingBerita ? 'Perbarui' : 'Buat'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setBeritaToDelete(null); }}
        onConfirm={executeDelete}
        title="Hapus Berita"
        message="Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
      />

      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}