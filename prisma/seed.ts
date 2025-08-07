// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    // 1️⃣ CLEAN OUT EXISTING DATA (idempotent)
    await prisma.note.deleteMany();
    await prisma.novel.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();

    // 2️⃣ PREPARE ONE HASHED PASSWORD
    const DEFAULT_PW = 'Password123';
    const hashedPassword = await argon2.hash(DEFAULT_PW);

    // 3️⃣ SEED ADMIN USER ONLY
    await prisma.user.create({
        data: {
            firstName: 'Admin',
            lastName:  'User',
            email:     'admin@example.com',
            password:  hashedPassword,
            isAdmin:   true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    // 4️⃣ SEED GLOBAL GENRES (40+)
    const genreNames = [
        'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Thriller',
        'Non-Fiction', 'Biography', 'Self-Help', 'Historical', 'Poetry',
        'Graphic Novel', 'Adventure', 'Classics', 'Crime', 'Drama', 'Humor',
        "Children's", 'Young Adult', 'Philosophy', 'Science', 'Technology',
        'Travel', 'Health', 'Business', 'Cooking', 'Art', 'Music', 'Religion',
        'Politics', 'Sports', 'Education', 'Psychology', 'Anthology',
        'Short Stories', 'Essays', 'Memoir', 'Satire', 'Horror Comedy',
        'Western', 'LGBTQ+', 'Urban Fiction', 'Contemporary', 'Dystopian',
        'Steampunk', 'Paranormal', 'Military Fiction', 'Gothic'
    ];

    await prisma.genre.createMany({
        data: genreNames.map(name => ({ genreName: name })),
        skipDuplicates: true,
    });

    console.log('✅  Seed complete: admin user and genres only.');
}

main()
    .catch(e => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
