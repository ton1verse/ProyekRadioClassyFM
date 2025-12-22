interface ChartProps {
    songs: any[];
    loading: boolean;
}

export default function Chart({ songs, loading }: ChartProps) {
    return (
        <section id="chart" className="py-20 container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="md:w-1/2 bg-gray-50 rounded-3xl p-10 flex items-center justify-center min-h-[400px]">
                    <div className="p-10 bg-white rounded-full shadow-inner">
                        <img src="/classy.jpg" alt="Classy 103.4 FM" className="w-48 opacity-80" />
                    </div>
                </div>
                <div className="md:w-1/2">
                    <h3 className="text-3xl font-bold bg-[#001A3A] text-white p-4 inline-block mb-8 transform -skew-x-6">
                        <span className="skew-x-6 inline-block">THE ULTIMATE MUSIC CHART</span>
                    </h3>
                    <div className="space-y-4">
                        {songs.slice(0, 5).map((song: any, idx: number) => (
                            <div key={song.id || idx} className="flex items-center bg-yellow-400 p-2 rounded-lg shadow-md hover:bg-yellow-300 transition cursor-pointer border-l-4 border-black">
                                <div className="w-12 h-12 bg-black text-white font-bold text-xl flex items-center justify-center rounded-md mr-4">
                                    #{idx + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{song.title}</h4>
                                    <p className="text-xs text-gray-800">{song.artist}</p>
                                </div>
                            </div>
                        ))}
                        {songs.length === 0 && !loading && (
                            <p className="text-gray-500">No chart data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
