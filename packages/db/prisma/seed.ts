/**
 * Jasma Collections â€” Database Seed
 * ----------------------------------
 * Seeds: 2 shops, 4 users (1 SUPER_ADMIN, 1 MANAGER, 2 STAFF),
 *        3 categories, 6 products, 18 variants, inventory per variant/shop,
 *        5 sample sales + corresponding stock movements.
 *
 * Run: npm run db:seed (from packages/db)
 */

import { PrismaClient, Role, Gender, PaymentMethod, MovementType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// â”€â”€â”€ Barcode generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function generateBarcode(categoryCode: string, variantId: string): string {
  const random4 = Math.floor(1000 + Math.random() * 9000).toString();
  // Use last 5 chars of cuid for the variant portion
  const shortId = variantId.slice(-5).toUpperCase();
  return `JZM-${categoryCode}-${shortId}-${random4}`;
}

// â”€â”€â”€ Slug generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("ðŸŒ± Starting Jasma Collections seed...\n");

  // â”€â”€ Clean existing data (order matters for FK constraints) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.stockMovement.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.shop.deleteMany();

  // â”€â”€ 1. SHOPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const shopGateway = await prisma.shop.create({
    data: {
      name: "Jasma — Gateway Mall",
      location: "Gateway Mall, Nairobi",
    },
  });

  const shopKaren = await prisma.shop.create({
    data: {
      name: "Jasma — Roasters",
      location: "Roasters, Nairobi",
    },
  });

  console.log(`✅ Created shops: ${shopGateway.name}, ${shopKaren.name}`);

  // —— 2. USERS ————————————————————————————————————————————————————————————————
  const salt = 12;
  const adminPass = await bcrypt.hash("Admin@Jasma2024!", salt);
  const managerPass = await bcrypt.hash("Manager@123", salt);
  const staffPass = await bcrypt.hash("Staff@123", salt);

  const superAdmin = await prisma.user.create({
    data: {
      name: "Amina Wanjiku",
      email: "admin@jasma.co.ke",
      passwordHash: adminPass,
      role: Role.SUPER_ADMIN,
      shopId: null,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Grace Muthoni",
      email: "manager@jasma.co.ke",
      passwordHash: managerPass,
      role: Role.MANAGER,
      shopId: shopGateway.id,
    },
  });

  const staff1 = await prisma.user.create({
    data: {
      name: "Aisha Kamau",
      email: "aisha@jasma.co.ke",
      passwordHash: staffPass,
      role: Role.STAFF,
      shopId: shopGateway.id,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      name: "Fatuma Odhiambo",
      email: "fatuma@jasma.co.ke",
      passwordHash: staffPass,
      role: Role.STAFF,
      shopId: shopKaren.id,
    },
  });

  console.log(`âœ… Created users: ${superAdmin.name}, ${manager.name}, ${staff1.name}, ${staff2.name}`);

  // â”€â”€ 3. CATEGORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const catDresses = await prisma.category.create({
    data: { name: "Dresses", code: "DRS" },
  });
  const catTops = await prisma.category.create({
    data: { name: "Tops", code: "TOP" },
  });
  const catTrousers = await prisma.category.create({
    data: { name: "Trousers", code: "TRS" },
  });

  console.log("âœ… Created categories: Dresses, Tops, Trousers");

  // â”€â”€ 4. PRODUCTS + VARIANTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // Helper to create a product with variants and inventory
  async function createProductWithVariants(
    productData: {
      name: string;
      description: string;
      categoryId: string;
      gender: Gender;
      images: string[];
    },
    variants: { size: string; color: string; price: number }[]
  ) {
    const slug = slugify(productData.name);
    const product = await prisma.product.create({
      data: { ...productData, slug },
    });

    const createdVariants = [];
    for (const v of variants) {
      // Create variant first to get its id for barcode
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          size: v.size,
          color: v.color,
          price: v.price,
          barcode: "TEMP", // placeholder, updated below
        },
      });

      // Get the category code
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId },
      });
      const barcode = generateBarcode(category!.code, variant.id);

      // Update with real barcode
      const updatedVariant = await prisma.productVariant.update({
        where: { id: variant.id },
        data: { barcode },
      });

      // Create inventory for each shop and online (shopId = null)
      await prisma.inventory.createMany({
        data: [
          { variantId: variant.id, shopId: shopGateway.id, quantity: Math.floor(Math.random() * 15) + 5, lowStockThreshold: 3 },
          { variantId: variant.id, shopId: shopKaren.id, quantity: Math.floor(Math.random() * 12) + 3, lowStockThreshold: 3 },
          { variantId: variant.id, shopId: null, quantity: Math.floor(Math.random() * 30) + 10, lowStockThreshold: 5 },
        ],
      });

      createdVariants.push(updatedVariant);
    }

    return { product, variants: createdVariants };
  }

  // DRESSES (2 products)
  const { variants: dress1Variants } = await createProductWithVariants(
    {
      name: "Ankara Maxi Dress",
      description: "Elegant floor-length dress in vibrant Ankara print. Perfect for celebrations and formal events. Imported from Turkey with superior fabric quality.",
      categoryId: catDresses.id,
      gender: Gender.WOMEN,
      images: [
        "https://res.cloudinary.com/demo/image/upload/jasma/ankara-maxi-1.jpg",
        "https://res.cloudinary.com/demo/image/upload/jasma/ankara-maxi-2.jpg",
      ],
    },
    [
      { size: "S", color: "Indigo Blue", price: 4500 },
      { size: "M", color: "Indigo Blue", price: 4500 },
      { size: "L", color: "Terracotta", price: 4800 },
    ]
  );

  await createProductWithVariants(
    {
      name: "Kaftan Midi Dress",
      description: "Flowy kaftan-style midi dress with intricate embroidery at the neckline. Made from breathable chiffon, ideal for coastal events.",
      categoryId: catDresses.id,
      gender: Gender.WOMEN,
      images: [
        "https://res.cloudinary.com/demo/image/upload/jasma/kaftan-midi-1.jpg",
      ],
    },
    [
      { size: "M", color: "Ivory White", price: 3800 },
      { size: "L", color: "Ivory White", price: 3800 },
      { size: "XL", color: "Blush Pink", price: 4000 },
    ]
  );

  // TOPS (2 products)
  const { variants: top1Variants } = await createProductWithVariants(
    {
      name: "Linen Wrap Top",
      description: "Modern linen wrap-style top with adjustable tie. Pairs beautifully with wide-leg trousers or high-waist skirts.",
      categoryId: catTops.id,
      gender: Gender.WOMEN,
      images: [
        "https://res.cloudinary.com/demo/image/upload/jasma/linen-wrap-top-1.jpg",
        "https://res.cloudinary.com/demo/image/upload/jasma/linen-wrap-top-2.jpg",
      ],
    },
    [
      { size: "XS", color: "Sand Beige", price: 2200 },
      { size: "S", color: "Sand Beige", price: 2200 },
      { size: "M", color: "Olive Green", price: 2400 },
    ]
  );

  await createProductWithVariants(
    {
      name: "Structured Blazer",
      description: "Sharp single-breasted blazer in premium Turkish wool blend. Available in classic tones that work for both office and evening.",
      categoryId: catTops.id,
      gender: Gender.UNISEX,
      images: [
        "https://res.cloudinary.com/demo/image/upload/jasma/structured-blazer-1.jpg",
      ],
    },
    [
      { size: "S", color: "Charcoal", price: 6500 },
      { size: "M", color: "Charcoal", price: 6500 },
      { size: "L", color: "Camel", price: 6800 },
    ]
  );

  // TROUSERS (2 products)
  const { variants: trs1Variants } = await createProductWithVariants(
    {
      name: "Wide-Leg Palazzo Trousers",
      description: "Statement wide-leg palazzo trousers in flowing crepe fabric. The elastic waistband and relaxed silhouette ensure all-day comfort.",
      categoryId: catTrousers.id,
      gender: Gender.WOMEN,
      images: [
        "https://res.cloudinary.com/demo/image/upload/jasma/palazzo-trousers-1.jpg",
        "https://res.cloudinary.com/demo/image/upload/jasma/palazzo-trousers-2.jpg",
      ],
    },
    [
      { size: "S", color: "Black", price: 3200 },
      { size: "M", color: "Black", price: 3200 },
      { size: "L", color: "Burgundy", price: 3400 },
    ]
  );

  await createProductWithVariants(
    {
      name: "Tailored Chino Trousers",
      description: "Slim-fit tailored chinos imported from China. Versatile everyday trousers that pair well with casual and smart-casual looks.",
      categoryId: catTrousers.id,
      gender: Gender.UNISEX,
      images: [
        "https://res.cloudinary.com/demo/image/upload/jasma/chino-trousers-1.jpg",
      ],
    },
    [
      { size: "M", color: "Khaki", price: 2800 },
      { size: "L", color: "Khaki", price: 2800 },
      { size: "XL", color: "Navy Blue", price: 3000 },
    ]
  );

  console.log("âœ… Created 6 products with 3 variants each + inventory");

  // â”€â”€ 5. SAMPLE SALES + STOCK MOVEMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // Pick a variant from dress1 for the sample sale
  const saleVariant1 = dress1Variants[0];
  const saleVariant2 = top1Variants[1];
  const saleVariant3 = trs1Variants[0];

  // Reduce inventory for sold items (Westlands)
  await prisma.inventory.updateMany({
    where: { variantId: saleVariant1.id, shopId: shopGateway.id },
    data: { quantity: { decrement: 2 } },
  });
  await prisma.inventory.updateMany({
    where: { variantId: saleVariant2.id, shopId: shopGateway.id },
    data: { quantity: { decrement: 1 } },
  });
  await prisma.inventory.updateMany({
    where: { variantId: saleVariant3.id, shopId: shopKaren.id },
    data: { quantity: { decrement: 3 } },
  });

  // Create sale records
  const sale1 = await prisma.sale.create({
    data: {
      variantId: saleVariant1.id,
      shopId: shopGateway.id,
      staffId: staff1.id,
      quantity: 2,
      unitPrice: saleVariant1.price,
      paymentMethod: PaymentMethod.MPESA,
      mpesaRef: "QJK3T9B2OX",
      soldAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  });

  const sale2 = await prisma.sale.create({
    data: {
      variantId: saleVariant2.id,
      shopId: shopGateway.id,
      staffId: staff1.id,
      quantity: 1,
      unitPrice: saleVariant2.price,
      paymentMethod: PaymentMethod.CASH,
      soldAt: new Date(Date.now() - 90 * 60 * 1000), // 90 min ago
    },
  });

  const sale3 = await prisma.sale.create({
    data: {
      variantId: saleVariant3.id,
      shopId: shopKaren.id,
      staffId: staff2.id,
      quantity: 3,
      unitPrice: saleVariant3.price,
      paymentMethod: PaymentMethod.CARD,
      soldAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    },
  });

  // Create corresponding stock movement records (OUT)
  await prisma.stockMovement.createMany({
    data: [
      {
        variantId: saleVariant1.id,
        shopId: shopGateway.id,
        movementType: MovementType.OUT,
        quantity: -2,
        reference: sale1.id,
        note: "POS sale â€” M-Pesa",
      },
      {
        variantId: saleVariant2.id,
        shopId: shopGateway.id,
        movementType: MovementType.OUT,
        quantity: -1,
        reference: sale2.id,
        note: "POS sale â€” Cash",
      },
      {
        variantId: saleVariant3.id,
        shopId: shopKaren.id,
        movementType: MovementType.OUT,
        quantity: -3,
        reference: sale3.id,
        note: "POS sale â€” Card",
      },
    ],
  });

  // One sample stock-in (new shipment)
  await prisma.stockMovement.create({
    data: {
      variantId: saleVariant1.id,
      shopId: shopGateway.id,
      movementType: MovementType.IN,
      quantity: 20,
      reference: "SHIPMENT-2024-TRK-001",
      note: "Turkey shipment arrived â€” Ankara Maxi Dress restock",
    },
  });

  console.log("âœ… Created 3 sample sales + 4 stock movements");

  // â”€â”€ SUMMARY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const counts = {
    shops: await prisma.shop.count(),
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
    inventory: await prisma.inventory.count(),
    sales: await prisma.sale.count(),
    movements: await prisma.stockMovement.count(),
  };

  console.log("\nðŸ“Š Seed Summary:");
  console.table(counts);
  console.log("\nðŸ” Test Credentials:");
  console.log("  SUPER_ADMIN â†’ admin@jasma.co.ke   | Admin@Jasma2024!");
  console.log("  MANAGER     â†’ manager@jasma.co.ke | Manager@123");
  console.log("  STAFF       â†’ aisha@jasma.co.ke   | Staff@123");
  console.log("  STAFF       â†’ fatuma@jasma.co.ke  | Staff@123");
  console.log("\nâœ¨ Seed complete!\n");
}

main()
  .catch((e) => {
    console.error("âŒ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
