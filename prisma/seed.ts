import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../src/prisma";

async function main() {
  const sellers = await Promise.all(
    Array.from({ length: 5 }).map(async () =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          passwordHash: await bcrypt.hash(faker.internet.password(), 12),
        },
      })
    )
  );

  const categories = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.category.create({
        data: {
          name: faker.commerce.department(),
        },
      })
    )
  );

  for (let i = 0; i < 200; i++) {
    const seller = faker.helpers.arrayElement(sellers);
    const category = faker.helpers.arrayElement(categories);

    const product = await prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: category.id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: new Prisma.Decimal(faker.commerce.price({ min: 5, max: 2000 })),
        stockQuantity: faker.number.int({ min: 0, max: 200 }),
        status: "active",
        publishedAt: faker.date.past(),
        config: {
          create: {
            isStockInfinite: faker.datatype.boolean({ probability: 0.6 }),
            showStockWarning: faker.datatype.boolean({ probability: 0.3 }),
          },
        },
      },
    });

    const imageCount = faker.number.int({ min: 0, max: 8 });

    await Promise.all(
      Array.from({ length: imageCount }).map((_, index) =>
        prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: faker.image.url({
              height: faker.number.int({ min: 175, max: 1080 }),
              width: faker.number.int({ min: 320, max: 1920 }),
            }),
            isCover: index === 0,
            displayOrder: index,
          },
        })
      )
    );
  }
}

main()
  .then(() => {
    console.log("Seed finalizado.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
