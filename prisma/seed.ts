import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcryptjs from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // Hash passwords
  const adminPassword = await bcryptjs.hash("admin@123", 10);
  const customerPassword = await bcryptjs.hash("customer@123", 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@ecommerce.com",
      phone: "+92-300-1234567",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+92-300-2234567",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+92-300-3234567",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  console.log("✅ Users created");

  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and gadgets",
      isActive: true,
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: "Clothing",
      slug: "clothing",
      description: "Apparel and fashion items",
      isActive: true,
    },
  });

  const homeDecor = await prisma.category.create({
    data: {
      name: "Home Decor",
      slug: "home-decor",
      description: "Home decoration and furnishings",
      isActive: true,
    },
  });

  console.log("✅ Categories created");

  // Create products
  const laptop = await prisma.product.create({
    data: {
      name: "MacBook Pro 14-inch",
      slug: "macbook-pro-14",
      sku: "MBP-14-001",
      description:
        "Powerful laptop with M3 Pro chip, perfect for professionals",
      shortDescription: "High-performance laptop",
      price: 299999, // PKR
      compareAtPrice: 349999,
      discount: 14,
      stock: 50,
      lowStockAlert: 5,
      categoryId: electronics.id,
      status: true,
      featured: true,
      bestSeller: true,
    },
  });

  const tshirt = await prisma.product.create({
    data: {
      name: "Cotton T-Shirt",
      slug: "cotton-tshirt",
      sku: "TSH-001",
      description: "Comfortable 100% cotton t-shirt in multiple colors",
      shortDescription: "Classic cotton tee",
      price: 1500, // PKR
      compareAtPrice: 1999,
      discount: 25,
      stock: 200,
      lowStockAlert: 10,
      categoryId: clothing.id,
      status: true,
      featured: false,
      bestSeller: true,
    },
  });

  const cushion = await prisma.product.create({
    data: {
      name: "Decorative Cushion",
      slug: "decorative-cushion",
      sku: "CUSH-001",
      description: "Soft and stylish decorative cushion for your home",
      shortDescription: "Home décor cushion",
      price: 2500, // PKR
      compareAtPrice: 3500,
      discount: 28,
      stock: 100,
      lowStockAlert: 5,
      categoryId: homeDecor.id,
      status: true,
      featured: true,
      bestSeller: false,
    },
  });

  console.log("✅ Products created");

  // Create address
  await prisma.address.create({
    data: {
      userId: customer1.id,
      fullName: "John Doe",
      phone: "+92-300-2234567",
      address: "123 Main Street",
      city: "Karachi",
      state: "Sindh",
      postalCode: "75200",
      country: "Pakistan",
      isDefault: true,
    },
  });

  console.log("✅ Addresses created");

  // Create an order
  const order = await prisma.order.create({
    data: {
      userId: customer1.id,
      addressId: (
        await prisma.address.findFirst({
          where: { userId: customer1.id },
        })
      )!.id,
      orderNumber: "ORD-001",
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      subtotal: laptop.price,
      tax: Math.floor(laptop.price * 0.17),
      shippingCost: 500,
      total: laptop.price + Math.floor(laptop.price * 0.17) + 500,
      items: {
        create: [
          {
            productId: laptop.id,
            quantity: 1,
            price: laptop.price,
          },
        ],
      },
    },
  });

  console.log("✅ Orders created");

  // Create reviews
  await prisma.review.create({
    data: {
      productId: tshirt.id,
      userId: customer2.id,
      rating: 5,
      title: "Great quality!",
      comment: "Very comfortable and durable t-shirt",
      helpful: 5,
    },
  });

  console.log("✅ Reviews created");

  // Create wishlist items
  await prisma.wishlistItem.create({
    data: {
      userId: customer2.id,
      productId: laptop.id,
    },
  });

  console.log("✅ Wishlist items created");

  console.log("✨ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
