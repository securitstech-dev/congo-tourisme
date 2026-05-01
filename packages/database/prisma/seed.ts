import { PrismaClient, UserRole, BusinessType, ListingType, SubscriptionPlan } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Début de la simulation de données...');

  // 1. Création du Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'securitstech@gmail.com' },
    update: {},
    create: {
      email: 'securitstech@gmail.com',
      firstName: 'Admin',
      lastName: 'Securits Tech',
      role: UserRole.ADMIN,
      isActive: true,
      isVerified: true,
      passwordHash: '$2b$12$K89K3K3K3K3K3K3K3K3K3uI6Y2R6Q5W5R5T5Y5U5I5O5P5S5D5F5', // Password123! simulé
    },
  });
  console.log('Super Admin créé:', admin.email);

  // 2. Création de 10 Opérateurs
  const operatorsData = [
    { name: 'Grand Hôtel de la Paix', type: BusinessType.HOTEL, city: 'Pointe-Noire', region: 'Kouilou' },
    { name: 'Mwana Village', type: BusinessType.HOTEL, city: 'Pointe-Noire', region: 'Kouilou' },
    { name: 'Le Jardin des Saveurs', type: BusinessType.RESTAURANT, city: 'Brazzaville', region: 'Brazzaville' },
    { name: 'Atlantic Palace', type: BusinessType.HOTEL, city: 'Pointe-Noire', region: 'Kouilou' },
    { name: 'Casino de Brazza', type: BusinessType.CASINO, city: 'Brazzaville', region: 'Brazzaville' },
    { name: 'Safari Congo', type: BusinessType.TRAVEL_AGENCY, city: 'Brazzaville', region: 'Brazzaville' },
    { name: 'Blue Night Club', type: BusinessType.BAR_NIGHTCLUB, city: 'Pointe-Noire', region: 'Kouilou' },
    { name: 'Site de Diosso', type: BusinessType.TOURIST_SITE, city: 'Diosso', region: 'Kouilou' },
    { name: 'Palais des Congrès', type: BusinessType.EVENT_HALL, city: 'Brazzaville', region: 'Brazzaville' },
    { name: 'Wellness Spa PN', type: BusinessType.SPA_WELLNESS, city: 'Pointe-Noire', region: 'Kouilou' },
  ];

  for (const op of operatorsData) {
    const email = `${op.name.toLowerCase().replace(/ /g, '.')}@example.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        firstName: 'Gérant',
        lastName: op.name,
        role: UserRole.OPERATOR,
        isActive: true,
        isVerified: true,
        passwordHash: '$2b$12$K89K3K3K3K3K3K3K3K3K3uI6Y2R6Q5W5R5T5Y5U5I5O5P5S5D5F5',
        operator: {
          create: {
            businessName: op.name,
            businessType: op.type,
            description: `Bienvenue chez ${op.name}, leader dans le domaine ${op.type} au Congo. Nous offrons des services de qualité supérieure à ${op.city}.`,
            city: op.city,
            region: op.region,
            address: `Avenue de l'indépendance, ${op.city}`,
            phone: '+242 06 123 45 67',
            isValidated: true,
            subscriptionPlan: SubscriptionPlan.PREMIUM,
          }
        }
      },
      include: { operator: true }
    });

    // 3. Création d'annonces pour chaque opérateur
    if (user.operator) {
      await prisma.listing.create({
        data: {
          operatorId: user.operator.id,
          title: `Service Standard - ${op.name}`,
          description: `Profitez de notre offre exclusive chez ${op.name}. Un service irréprochable dans un cadre idyllique.`,
          listingType: op.type === BusinessType.HOTEL ? ListingType.HOTEL_ROOM : ListingType.SPECIAL_OFFER,
          pricePerNight: op.type === BusinessType.HOTEL ? 45000 : null,
          pricePerPerson: op.type !== BusinessType.HOTEL ? 15000 : null,
          currency: 'XAF',
          isAvailable: true,
          amenities: ['Wifi', 'Climatisation', 'Parking'],
          images: {
            create: [
              {
                url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
                cloudinaryId: 'sample_id_1',
                altText: 'Vue principale'
              }
            ]
          }
        }
      });
    }
  }

  console.log('Simulation terminée avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
