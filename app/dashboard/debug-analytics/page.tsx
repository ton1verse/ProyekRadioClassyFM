
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DebugAnalyticsPage() {
    const totalListens = await prisma.podcastListen.count();
    const lastListens = await prisma.podcastListen.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { podcast: true }
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Debug Analytics</h1>
            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl">Total Listens: {totalListens}</h2>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl mb-4">Last 10 Listens</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                    {JSON.stringify(lastListens, null, 2)}
                </pre>
            </div>
        </div>
    );
}
