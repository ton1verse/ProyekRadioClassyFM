
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const monthParam = searchParams.get('month');
        const month = monthParam !== null ? parseInt(monthParam) : new Date().getMonth();
        const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dayNameMap: Record<string, number> = {
            'minggu': 0,
            'senin': 1,
            'selasa': 2,
            'rabu': 3,
            'kamis': 4,
            'jumat': 5,
            'sabtu': 6
        };

        const dayCounts = [0, 0, 0, 0, 0, 0, 0];
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            dayCounts[date.getDay()]++;
        }

        const classierId = searchParams.get('classier_id');

        const whereCondition: any = { status: 'active' };
        if (classierId) {
            whereCondition.id = parseInt(classierId);
        }

        const classiers = await prisma.classier.findMany({
            where: whereCondition,
            include: {
                programs: true,
                podcasts: {
                    where: {
                        tanggal: {
                            gte: new Date(year, month, 1),
                            lt: new Date(year, month + 1, 1)
                        }
                    }
                }
            }
        });

        console.log(`[HonorReport] Generating for ${month + 1}/${year}`);

        const reportData = classiers.map(classier => {
            console.log(`[HonorReport] Classier: ${classier.nama}, Podcasts Found: ${classier.podcasts.length}`);
            classier.podcasts.forEach(p => console.log(`  - Podcast ${p.id}: ${p.durasi}s`));

            const totalPodcastSeconds = classier.podcasts.reduce((sum, p) => sum + (p.durasi || 0), 0);
            const podcastHours = totalPodcastSeconds / 3600;
            console.log(`  - Total Seconds: ${totalPodcastSeconds}, Hours: ${podcastHours}`);

            let totalProgramMinutes = 0;

            classier.programs.forEach(program => {
                if (!program.jadwal) return;

                const dayParts = program.jadwal.split(';').map(p => p.trim());

                dayParts.forEach(part => {
                    const firstSpace = part.indexOf(' ');
                    if (firstSpace === -1) return;

                    const dayName = part.substring(0, firstSpace).toLowerCase();
                    const rangesStr = part.substring(firstSpace + 1);

                    const dayIndex = dayNameMap[dayName];
                    if (dayIndex === undefined) return;

                    let dailyMinutes = 0;
                    const ranges = rangesStr.split(',').map(r => r.trim());

                    ranges.forEach(range => {
                        const [startStr, endStr] = range.split('-').map(s => s.trim());
                        if (!startStr || !endStr) return;

                        const [startH, startM] = startStr.split(':').map(Number);
                        const [endH, endM] = endStr.split(':').map(Number);

                        if (!isNaN(startH) && !isNaN(endH)) {
                            let diffMinutes = (endH * 60 + (startM || 0)) - (startH * 60 + (startM || 0));
                            if (diffMinutes < 0) diffMinutes += 24 * 60;
                            dailyMinutes += diffMinutes;
                        }
                    });

                    totalProgramMinutes += dailyMinutes * dayCounts[dayIndex];
                });
            });


            const programHours = totalProgramMinutes / 60;
            const totalHours = podcastHours + programHours;
            const honorPerJam = classier.honor_per_jam || 0;
            const totalHonor = totalHours * honorPerJam;

            return {
                id: classier.id,
                nama: classier.nama,
                honor_per_jam: honorPerJam,
                program_hours: parseFloat(programHours.toFixed(2)),
                podcast_hours: parseFloat(podcastHours.toFixed(2)),
                total_hours: parseFloat(totalHours.toFixed(2)),
                total_honor: Math.round(totalHonor)
            };
        });

        return NextResponse.json(reportData);
    } catch (error) {
        console.error('Error generating honor report:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
