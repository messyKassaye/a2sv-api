import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('MESERET98@gmail.com', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'kassayemeseret21@gmail.com' },
        update: {},
        create: {
            username: 'messyKassaye',
            email: 'kassayemeseret21@gmail.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Admin user created:', admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
