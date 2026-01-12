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
                        {songs.slice(0, 5).map((song: any, idx: number) => {
                            let TrendIcon = <span className="text-white/70 text-sm font-bold">-</span>;
                            if (song.trend === 'up') TrendIcon = <span className="text-green-400 text-sm font-bold">▲</span>;
                            if (song.trend === 'down') TrendIcon = <span className="text-red-400 text-sm font-bold">▼</span>;

                            return (
                                <div key={song.id || idx} className="flex items-center bg-gradient-to-r from-[#001A3A] to-[#A12227] p-3 rounded-xl shadow-lg hover:shadow-xl transition group border border-white/10">
                                    <div className="w-14 h-12 bg-white/10 text-white font-bold text-lg flex items-center justify-center rounded-lg mr-4 shrink-0 backdrop-blur-sm gap-1">
                                        <span>#{idx + 1}</span>
                                        {TrendIcon}
                                    </div>
                                    <div className="flex-1 min-w-0 mr-4">
                                        <h4 className="font-bold text-white truncate text-lg leading-tight">{song.judul || song.title}</h4>
                                        <p className="text-xs text-gray-300 truncate">{song.penyanyi || song.artist}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {songs.length === 0 && !loading && (
                            <p className="text-gray-500">No chart data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
