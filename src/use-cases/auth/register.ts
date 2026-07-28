// export const create = async (email: string, password: string) => {
//     const existingUser = await prisma.user.findUnique({where: {email}});
//     if (existingUser) throw new Error('User already exists');
//
//     const hashedPassword = await bcrypt.hash(password, 10);
//
//
//     return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
//         const user = await tx.user.create({
//             data: {email, password: hashedPassword},
//         });
//
//         pgBossManager.queue.enqueueTx(kafkaProducersConfig.userCreated, user, tx);
//
//         return user;
//
//     });
//
// };