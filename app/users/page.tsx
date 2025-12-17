import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import UserTable from '@/components/UserTable'

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm border">
            <UserTable />
          </div>
        </main>
      </div>
    </div>
  )
}