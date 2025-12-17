import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import RevenueChart from '@/components/RevenueChart';
import RecentActivity from '@/components/RecentActivity';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Pendegar Aktif"
              value="324"
            />
            <StatsCard
              title="Jumlah Episode Podcast"
              value="15"
            />
            <StatsCard
              title="Jumlah Musik"
              value="1,247"
            />
            <StatsCard
              title="Jumlah Program"
              value="15"
            />
          </div>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <RevenueChart />
            </div>
            <div className="space-y-8">
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}