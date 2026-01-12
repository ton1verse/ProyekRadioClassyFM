import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import BeritaTable from '@/components/BeritaTable'

export default function BeritasPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Berita</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm border">
            <BeritaTable />
          </div>
        </main>
      </div>
    </div>
  )
}