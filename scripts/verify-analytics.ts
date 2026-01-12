
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Podcast Listens...');

    try {
        const count = await prisma.podcastListen.count();
        console.log(`Total Podcast Listens: ${count}`);

        if (count > 0) {
            const lastListen = await prisma.podcastListen.findFirst({
                orderBy: { createdAt: 'desc' },
                include: { podcast: true }
            });
            console.log('Last Listen:', JSON.stringify(lastListen, null, 2));
        } else {
            console.log('No listens found. Attempting to create a test record...');
            // Find a podcast to attach to
            const podcast = await prisma.podcast.findFirst();
            if (podcast) {
                await prisma.podcastListen.create({
                    data: {
                        podcastId: podcast.id,
                        ipAddress: 'test-script'
                    }
                });
                console.log(`Created test listen for podcast ${podcast.id}. Check dashboard now.`);
            } else {
                console.log('No podcasts found to create a listen for.');
            }
        }

    } catch (error) {
        console.error('Error querying database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
