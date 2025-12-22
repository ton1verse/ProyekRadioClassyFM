const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Connecting to database...')
    try {
        // Create a test user
        const user = await prisma.user.create({
            data: {
                nama: 'Test User',
                username: 'testuser_' + Date.now(),
                email: 'test_' + Date.now() + '@example.com',
                password: 'password123'
            }
        })
        console.log('Created user:', user)

        // Fetch users
        const users = await prisma.user.findMany()
        console.log('All users:', users)

    } catch (e) {
        console.error('Error:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
