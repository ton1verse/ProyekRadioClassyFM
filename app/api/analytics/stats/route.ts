
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '7d';
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        let startDate = new Date();
        let endDate = new Date();

        if (month && year) {
            const m = parseInt(month);
            const y = parseInt(year);
            startDate = new Date(y, m - 1, 1);
            endDate = new Date(y, m, 0);
            endDate.setHours(23, 59, 59, 999);
        } else {
            endDate.setHours(23, 59, 59, 999);

            if (range === 'today') {
                startDate.setHours(0, 0, 0, 0);
            } else if (range === '7d') {
                startDate.setDate(endDate.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
            } else if (range === '30d') {
                startDate.setDate(endDate.getDate() - 29);
                startDate.setHours(0, 0, 0, 0);
            } else if (range === '90d') {
                startDate.setDate(endDate.getDate() - 89);
                startDate.setHours(0, 0, 0, 0);
            } else {
                startDate.setDate(endDate.getDate() - 29);
                startDate.setHours(0, 0, 0, 0);
            }
        }

        const categoryId = searchParams.get('categoryId');
        const podcastId = searchParams.get('podcastId');

        const whereCondition: any = {
            createdAt: { gte: startDate, lte: endDate }
        };

        if (podcastId) {
            whereCondition.podcastId = parseInt(podcastId);
        } else if (categoryId) {
            whereCondition.podcast = {
                categoryId: parseInt(categoryId)
            };
        }
        const listens = await prisma.podcastListen.findMany({
            where: whereCondition,
            select: { createdAt: true },
            orderBy: {
                createdAt: 'asc'
            }
        });

        const chartDataMap = new Map();

        const getLocalDateString = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const loopDate = new Date(startDate);
        while (loopDate <= endDate) {
            chartDataMap.set(getLocalDateString(loopDate), 0);
            loopDate.setDate(loopDate.getDate() + 1);
        }

        listens.forEach((listen: any) => {
            const dateStr = getLocalDateString(new Date(listen.createdAt));
            if (chartDataMap.has(dateStr)) {
                chartDataMap.set(dateStr, (chartDataMap.get(dateStr) || 0) + 1);
            }
        });

        const chartData = Array.from(chartDataMap.entries())
            .map(([date, count]) => ({
                date,
                listens: count
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        const entityStatsRaw = await prisma.podcastListen.groupBy({
            by: ['podcastId'],
            where: whereCondition,
            _count: { podcastId: true },
            orderBy: { _count: { podcastId: 'desc' } },
            take: 20
        });

        const entityStats = await Promise.all(entityStatsRaw.map(async (item: any) => {
            const p = await prisma.podcast.findUnique({
                where: { id: item.podcastId },
                include: { category: true }
            });
            return {
                id: p?.id,
                label: p?.judul || 'Unknown',
                category: p?.category?.nama || 'Uncategorized',
                count: item._count.podcastId
            };
        }));
        const allPodcastStats = await prisma.podcastListen.groupBy({
            by: ['podcastId'],
            where: whereCondition,
            _count: { podcastId: true }
        });

        const allCategories = await prisma.podcastCategory.findMany({
            select: { id: true, nama: true }
        });

        const categoryStatsMap = new Map<string, number>();
        allCategories.forEach(cat => {
            categoryStatsMap.set(cat.nama, 0);
        });
        categoryStatsMap.set('Uncategorized', 0);

        const uniquePodcastIds = allPodcastStats.map(item => item.podcastId);
        let podcastsWithCategories: { id: number; category: { nama: string } | null }[] = [];
        if (uniquePodcastIds.length > 0) {
            podcastsWithCategories = await prisma.podcast.findMany({
                where: { id: { in: uniquePodcastIds } },
                select: {
                    id: true,
                    category: {
                        select: { nama: true }
                    }
                }
            });
        }

        const podcastCategoryMap = new Map<number, string>();
        podcastsWithCategories.forEach(p => {
            podcastCategoryMap.set(p.id, p.category?.nama || 'Uncategorized');
        });

        allPodcastStats.forEach(stat => {
            const catName = podcastCategoryMap.get(stat.podcastId) || 'Uncategorized';
            categoryStatsMap.set(catName, (categoryStatsMap.get(catName) || 0) + stat._count.podcastId);
        });

        if (categoryStatsMap.get('Uncategorized') === 0) {
            categoryStatsMap.delete('Uncategorized');
        }

        const categoryStats = Array.from(categoryStatsMap.entries())
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count);

        const topPodcastsRaw = await prisma.podcastListen.groupBy({
            by: ['podcastId'],
            where: whereCondition,
            _count: {
                podcastId: true
            },
            orderBy: {
                _count: {
                    podcastId: 'desc'
                }
            },
            take: 10
        });

        const topPodcasts = await Promise.all(topPodcastsRaw.map(async (item: any) => {
            const podcast = await prisma.podcast.findUnique({
                where: { id: item.podcastId },
                select: { judul: true, poster: true }
            });
            return {
                ...podcast,
                nama: podcast?.judul,
                total: item._count.podcastId
            };
        }));

        const totalListensAllTime = await prisma.podcastListen.count();
        const totalListensPeriod = listens.length;

        return NextResponse.json({
            chartData,
            entityStats,
            categoryStats,
            topPodcasts,
            summary: {
                totalAllTime: totalListensAllTime,
                totalPeriod: totalListensPeriod
            }
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
