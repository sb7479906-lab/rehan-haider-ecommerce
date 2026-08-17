import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Database seeding shuru ho rahi hai...');

  // 1. Admin Account Banayein
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const rawPassword = process.env.ADMIN_PASSWORD || 'CHANGE_THIS_DEVELOPMENT_PASSWORD';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Rehan Haider Admin',
      email: adminEmail,
      phone: '+923000000000',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`Admin account ready hai: ${admin.email}`);

  // 2. COD aur Store Settings Initialization
  const existingSettings = await prisma.siteSetting.findFirst();
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        storeName: 'Rehan Haider',
        codEnabled: true,
        codFee: 0,
        minCodOrder: 500,
        maxCodOrder: 100000,
        freeDeliveryAbove: 5000,
        deliveryFee: 200,
      },
    });
    console.log('Store settings aur Cash on Delivery (COD) config initialize ho gayi hai.');
  }

  // 3. Default Categories
  const categories = [
    { name: 'Men Fashion', slug: 'men-fashion', description: 'Apparel and accessories for men' },
    { name: 'Women Fashion', slug: 'women-fashion', description: 'Apparel and accessories for women' },
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets, accessories and electronics' },
    { name: 'Accessories', slug: 'accessories', description: 'Lifestyle accessories and leather goods' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Categories add ho gayi hain.');

  // 4. Welcome Coupon Code
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscount: 500,
      usageLimit: 100,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  console.log('Welcome Coupon WELCOME10 add ho gaya hai.');
}

main()
  .catch((e) => {
    console.error('Seeding me error aaya:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
