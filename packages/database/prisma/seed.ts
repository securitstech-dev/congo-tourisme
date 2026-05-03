import { PrismaClient, UserRole, BusinessType, SubscriptionPlan, ListingType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...');

  // Nettoyage optionnel (à utiliser avec précaution)
  // await prisma.listingImage.deleteMany();
  // await prisma.listing.deleteMany();
  // await prisma.operator.deleteMany();
  // await prisma.user.deleteMany();

  // 1. Création de l'Administrateur
  const admin = await prisma.user.upsert({
    where: { email: 'admin@congo-tourisme.cg' },
    update: {},
    create: {
      email: 'admin@congo-tourisme.cg',
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
      // Mot de passe : "Congo2026!"
      passwordHash: '$2b$10$mZWW2C7HQbADbcwigHHgAOpDLfwwcfIUgaC0ijPF.fWsgzusNrG6.', 
    },
  });
  console.log(`✅ Admin créé : ${admin.email}`);

  // 2. Création de l'Opérateur
  const operatorUser = await prisma.user.upsert({
    where: { email: 'operator@congo-tourisme.cg' },
    update: {},
    create: {
      email: 'operator@congo-tourisme.cg',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.OPERATOR,
      isVerified: true,
      isActive: true,
      passwordHash: '$2b$10$mZWW2C7HQbADbcwigHHgAOpDLfwwcfIUgaC0ijPF.fWsgzusNrG6.',
    },
  });

  const operator = await prisma.operator.upsert({
    where: { userId: operatorUser.id },
    update: {},
    create: {
      userId: operatorUser.id,
      businessName: 'Congo Discoveries SA',
      businessType: BusinessType.OTHER,
      description: 'Agence multi-services proposant les meilleures expériences touristiques, hôtelières et événementielles au Congo.',
      region: 'Brazzaville',
      city: 'Brazzaville',
      address: 'Centre-ville, Avenue Foch',
      phone: '061234567',
      whatsapp: '061234567',
      isValidated: true,
      validatedAt: new Date(),
      subscriptionPlan: SubscriptionPlan.PREMIUM,
      subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  });
  console.log(`✅ Opérateur créé : ${operator.businessName}`);

  // 3. Création d'un Touriste
  const tourist = await prisma.user.upsert({
    where: { email: 'tourist@example.com' },
    update: {},
    create: {
      email: 'tourist@example.com',
      firstName: 'Alice',
      lastName: 'Martin',
      role: UserRole.TOURIST,
      isVerified: true,
      isActive: true,
      passwordHash: '$2b$10$mZWW2C7HQbADbcwigHHgAOpDLfwwcfIUgaC0ijPF.fWsgzusNrG6.',
    },
  });
  console.log(`✅ Touriste créé : ${tourist.email}`);

  // 4. Création des Annonces (Listings)
  const listings = [
    {
      title: 'Safari au Parc National d\'Odzala-Kokoua',
      description: 'Découvrez la forêt tropicale vierge, rencontrez les gorilles des plaines de l\'Ouest et les éléphants de forêt. Une expérience inoubliable au cœur du bassin du Congo. Hébergement en lodge de luxe et safaris guidés inclus.',
      listingType: ListingType.EXCURSION,
      pricePerPerson: 1500000,
      amenities: ['Guide professionnel', 'Hébergement', 'Repas inclus', 'Transferts'],
      images: [
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&q=80&w=1000'
      ]
    },
    {
      title: 'Suite Royale - Grand Hôtel de Kintélé',
      description: 'Profitez d\'une vue imprenable sur le fleuve Congo dans notre Suite Royale. Un luxe absolu avec service d\'étage 24/7, accès privilégié au spa et à la piscine à débordement.',
      listingType: ListingType.HOTEL_SUITE,
      pricePerNight: 250000,
      amenities: ['Climatisation', 'Wi-Fi très haut débit', 'Piscine', 'Service d\'étage', 'Spa'],
      images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?auto=format&fit=crop&q=80&w=1000'
      ]
    },
    {
      title: 'Dîner Gastronomique - Mami Wata',
      description: 'Dégustez les meilleures spécialités locales et internationales sur notre terrasse flottante sur le majestueux fleuve Congo. Une ambiance romantique parfaite pour vos soirées.',
      listingType: ListingType.RESTAURANT_TABLE,
      pricePerPerson: 45000,
      amenities: ['Vue sur le fleuve', 'Musique live', 'Parking sécurisé', 'Air conditionné'],
      images: [
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1000'
      ]
    },
    {
      title: 'Soirée VIP - Boîte de Nuit "Le M"',
      description: 'L\'expérience nocturne ultime à Brazzaville. Réservation de table VIP avec bouteille incluse. Système son de pointe, jeux de lumières époustouflants et les meilleurs DJs de la capitale.',
      listingType: ListingType.NIGHTCLUB_ENTRY,
      priceFlatRate: 100000,
      amenities: ['Accès VIP', 'Bouteille incluse', 'Espace privé', 'Sécurité renforcée'],
      images: [
        'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&q=80&w=1000'
      ]
    }
  ];

  for (const item of listings) {
    const listing = await prisma.listing.create({
      data: {
        operatorId: operator.id,
        title: item.title,
        description: item.description,
        listingType: item.listingType,
        pricePerNight: item.pricePerNight,
        pricePerPerson: item.pricePerPerson,
        priceFlatRate: item.priceFlatRate,
        amenities: item.amenities,
        isFeatured: true,
        images: {
          create: item.images.map((url, index) => ({
            url: url,
            cloudinaryId: `seed_image_${index}`,
            order: index
          }))
        }
      }
    });
    console.log(`✅ Annonce créée : ${listing.title}`);
  }

  console.log('🎉 Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
