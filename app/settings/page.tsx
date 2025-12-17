import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">General Settings</h3>
                <p className="text-gray-600">Configure your radio streaming platform settings.</p>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h3>
                <p className="text-gray-600">Settings features will be implemented in the next update.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}