import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
    const reactions = await prisma.reactions.createMany({
        data: [
            {
                label: 'Like'
            },
            {
                label: 'Deslike'
            }
        ]
    });
    console.log(reactions);
})();
