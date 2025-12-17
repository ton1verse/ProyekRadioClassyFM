import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ClassierTable from '@/components/ClassierTable'

export default function ClassiersPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Classiers Management</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm border">
            <ClassierTable />
          </div>
        </main>
      </div>
    </div>
  )
}