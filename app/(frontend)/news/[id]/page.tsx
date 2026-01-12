import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import prisma from '@/lib/db';
import BackButton from '@/components/BackButton';

interface NewsDetailProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function NewsDetail({ params }: NewsDetailProps) {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
        notFound();
    }

    const berita = await prisma.berita.findUnique({
        where: { id: numericId },
        include: { category: true },
    });

    if (!berita) {
        notFound();
    }

    const categoryName = berita.category?.nama || 'Uncategorized';

    const relatedNews = await prisma.berita.findMany({
        where: {
            categoryId: berita.categoryId,
            id: { not: numericId },
        },
        include: { category: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
    });

    return (
        <main className="min-h-screen bg-white pb-20 pt-24">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <BackButton />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 min-w-0">
                        {/* Article Header */}
                        <div className="mb-8">
                            {/* Title */}
                            <h1 className="text-3xl md:text-5xl font-extrabold text-[#001A3A] mb-6 leading-tight font-sans">
                                {berita.judul}
                            </h1>

                            {/* Metadata Line */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 text-sm md:text-base font-medium mb-6">
                                <span className="text-[#A12227] font-bold">By {berita.penulis || 'Admin'}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>{new Date(berita.tanggal || berita.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-gray-600">{categoryName}</span>
                            </div>

                            {/* Image */}
                            <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-sm relative">
                                {berita.gambar ? (
                                    <img
                                        src={berita.gambar}
                                        alt={berita.judul}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-lg">No Image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-left break-words
                            prose-headings:font-sans prose-headings:text-[#001A3A]
                            prose-a:text-[#A12227] prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-xl prose-img:shadow prose-img:w-full
                            prose-p:break-words prose-p:min-w-0
                            [&_p]:mb-6 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4">
                            <div dangerouslySetInnerHTML={{ __html: berita.isi }} />
                        </article>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* More News Widget */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-sans text-xl font-bold text-[#001A3A]">More in {categoryName}</h3>
                                <Link href="/news" className="text-[#A12227] text-xs font-bold uppercase hover:underline">
                                    View All
                                </Link>
                            </div>

                            <div className="flex flex-col gap-6">
                                {relatedNews.length > 0 ? (
                                    relatedNews.map((item) => {
                                        const itemCategoryName = item.category?.nama || 'Uncategorized';
                                        const isInternal = ['about us', 'hot release'].includes(itemCategoryName.toLowerCase());
                                        const linkUrl = isInternal ? `/news/${item.id}` : item.link || '#';
                                        const target = isInternal ? '_self' : '_blank';

                                        return (
                                            <Link key={item.id} href={linkUrl} target={target} className="group flex gap-4 items-start">
                                                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                                    {item.gambar ? (
                                                        <img
                                                            src={item.gambar}
                                                            alt={item.judul}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                            <Tag size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0"> {/* min-w-0 ensures text truncation works */}
                                                    <span className="text-[10px] font-bold text-[#A12227] uppercase tracking-wider mb-1 block">
                                                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <h4 className="font-sans text-sm font-bold text-[#001A3A] group-hover:text-[#A12227] transition-colors line-clamp-3 leading-snug">
                                                        {item.judul}
                                                    </h4>
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="text-gray-500 text-sm italic py-4">
                                        No other news in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
