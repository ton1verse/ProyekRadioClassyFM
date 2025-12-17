import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import GalleryTable from '@/components/GalleryTable'

export default function GalleriesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Galleries Management</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm border">
            <GalleryTable />
          </div>
        </main>
      </div>
    </div>
  )
}