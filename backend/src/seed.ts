import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  await prisma.booking.deleteMany({});
  await prisma.slot.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.promoCode.deleteMany({});

  console.log('📝 Creating promo codes...');
  await prisma.promoCode.createMany({
    data: [
      { code: 'SAVE10', discount: 10, active: true },
      { code: 'FLAT100', discount: 100, active: true },
      { code: 'WELCOME20', discount: 20, active: true },
    ],
    skipDuplicates: true,
  });

  console.log('🎯 Creating experiences...');
  const experiences = await Promise.all([
    prisma.experience.create({
      data: {
        title: 'Sunset Desert Safari',
        description: 'Experience the magic of the desert with our unforgettable sunset safari. Enjoy thrilling dune bashing in a 4x4 vehicle, traditional camel riding, and witness a breathtaking sunset over golden sand dunes. End your adventure with a delicious BBQ dinner under the stars, complete with traditional entertainment including belly dancing and fire shows.',
        location: 'Dubai, UAE',
        price: 89,
        duration: '6 hours',
        category: 'Adventure',
        rating: 4.8,
        reviews: 234,
        imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Historic City Walking Tour',
        description: 'Discover the rich history and culture of Paris on this guided walking tour. Visit iconic landmarks including the Eiffel Tower, Notre-Dame Cathedral, and the Louvre Museum. Learn fascinating stories from our expert local guides about the city\'s architecture, art, and historical events. Perfect for history enthusiasts and first-time visitors.',
        location: 'Paris, France',
        price: 45,
        duration: '3 hours',
        category: 'Culture',
        rating: 4.9,
        reviews: 567,
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Scuba Diving Adventure',
        description: 'Dive into crystal-clear waters and explore vibrant coral reefs teeming with marine life. Our experienced instructors will guide you through underwater caves and colorful reefs. Perfect for both beginners and experienced divers. All equipment provided, including wet suits, tanks, and underwater cameras to capture your memories.',
        location: 'Maldives',
        price: 120,
        duration: '4 hours',
        category: 'Water Sports',
        rating: 4.7,
        reviews: 189,
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Mountain Hiking Expedition',
        description: 'Trek through breathtaking alpine landscapes with experienced mountain guides. Suitable for all fitness levels, this journey takes you through pristine forests, across mountain streams, and up to stunning panoramic viewpoints. Enjoy packed lunch at a scenic overlook and learn about local flora and fauna from our naturalist guides.',
        location: 'Swiss Alps, Switzerland',
        price: 95,
        duration: '8 hours',
        category: 'Adventure',
        rating: 4.9,
        reviews: 342,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Wine Tasting & Vineyard Tour',
        description: 'Indulge in a premium wine tasting experience at a historic vineyard. Tour the beautiful estate, learn about the wine-making process from grape to bottle, and sample 5 award-winning wines paired with artisanal cheeses. Includes a gourmet lunch overlooking the picturesque vineyards.',
        location: 'Tuscany, Italy',
        price: 75,
        duration: '5 hours',
        category: 'Food & Wine',
        rating: 4.8,
        reviews: 421,
        imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Hot Air Balloon Ride',
        description: 'Soar above stunning landscapes in a hot air balloon at sunrise. Experience the tranquility of floating through the sky while enjoying 360-degree views of mountains, valleys, and wildlife below. Includes pre-flight refreshments and a champagne celebration upon landing with a flight certificate.',
        location: 'Cappadocia, Turkey',
        price: 150,
        duration: '3 hours',
        category: 'Adventure',
        rating: 5.0,
        reviews: 892,
        imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Cooking Class with Chef',
        description: 'Learn to cook authentic Italian cuisine from a professional chef in a hands-on cooking class. Prepare a full three-course meal including homemade pasta, traditional sauces, and classic desserts. Take home recipes and new skills to impress your friends and family.',
        location: 'Rome, Italy',
        price: 85,
        duration: '4 hours',
        category: 'Food & Wine',
        rating: 4.9,
        reviews: 278,
        imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
      },
    }),
    prisma.experience.create({
      data: {
        title: 'Wildlife Safari Experience',
        description: 'Embark on an unforgettable wildlife safari to see the Big Five in their natural habitat. Professional rangers guide you through the savanna in open-top vehicles for optimal viewing and photography. Includes park fees, refreshments, and a sunset sundowner stop.',
        location: 'Serengeti, Tanzania',
        price: 180,
        duration: '10 hours',
        category: 'Nature & Wildlife',
        rating: 4.9,
        reviews: 534,
        imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
      },
    }),
  ]);

  console.log('📅 Creating time slots...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const experience of experiences) {
    const slots = [];

    for (let i = 0; i < 14; i++) {
      const slotDate = new Date(today);
      slotDate.setDate(slotDate.getDate() + i);

      const timeSlots = ['09:00 AM', '02:00 PM'];
      if (experience.duration.includes('3') || experience.duration.includes('4')) {
        timeSlots.push('05:00 PM');
      }

      for (const time of timeSlots) {
        slots.push({
          experienceId: experience.id,
          date: slotDate,
          time: time,
          availableSpots: Math.floor(Math.random() * 8) + 2, 
          totalSpots: 10,
        });
      }
    }

    await prisma.slot.createMany({
      data: slots,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${experiences.length} experiences`);
  console.log(`   - ${experiences.length * 14 * 2} time slots`);
  console.log(`   - 3 promo codes`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });