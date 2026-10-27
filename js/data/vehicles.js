/**
 * DriveMart Vehicle Fleet Database - Chhatrapati Sambhajinagar Hub
 */
export const VEHICLES_DATA = [
  // ---------------- BIKES 🏍️ ----------------
  {
    id: 'bike-re-classic-350',
    name: 'Royal Enfield Classic 350',
    category: 'bike',
    subCategory: 'Cruiser',
    brand: 'Royal Enfield',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
  
    gallery: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 1199,
    hourlyPrice: 89,
    rating: 4.88,
    reviewsCount: 142,
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 2,
    engine: '349cc Single Cylinder',
    mileage: '35 km/l',
    speedLimit: '100 km/h',
    securityDeposit: 2000,
    freeKmPerDay: 250,
    extraKmCharge: 5,
    location: 'CIDCO Connaught, Sambhajinagar',
    pickupHubId: 'hub-cidco',
    partnerId: 'partner-marathwada-wheels',
    partnerName: 'Marathwada Self-Drive Wheels',
    partnerRating: 4.9,
    partnerVerified: true,
    features: ['ABS Dual Channel', 'USB Charger', 'Tubeless Tyres', 'Pannier Mounts', 'Helmet Included (1x)'],
    badge: 'Popular for Ellora & Daulatabad',
    isAvailable: true,
    tripsCompleted: 312,
    year: 2024
  },
  {
    id: 'bike-re-hunter-350',
    name: 'Royal Enfield Hunter 350 (Dapper Ash)',
    category: 'bike',
    subCategory: 'Roadster',
    brand: 'Royal Enfield',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 999,
    hourlyPrice: 75,
    rating: 4.82,
    reviewsCount: 98,
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 2,
    engine: '349cc J-Series',
    mileage: '36 km/l',
    speedLimit: '100 km/h',
    securityDeposit: 1500,
    freeKmPerDay: 250,
    extraKmCharge: 4,
    location: 'Railway Station Road, Sambhajinagar',
    pickupHubId: 'hub-station',
    partnerId: 'partner-ajanta-moto',
    partnerName: 'Ajanta Moto Hub',
    partnerRating: 4.85,
    partnerVerified: true,
    features: ['Dual Channel ABS', 'Lightweight Agility', 'LED Headlamp', 'Free Helmet (1x)'],
    badge: 'Best for City Commute',
    isAvailable: true,
    tripsCompleted: 215,
    year: 2024
  },
  {
    id: 'bike-ktm-duke-250',
    name: 'KTM Duke 250 Gen 3',
    category: 'bike',
    subCategory: 'Sport Naked',
    brand: 'KTM',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 1399,
    hourlyPrice: 110,
    rating: 4.91,
    reviewsCount: 76,
    transmission: 'Manual (Quickshifter+)',
    fuelType: 'Petrol',
    seats: 2,
    engine: '249cc Liquid Cooled (31 PS)',
    mileage: '30 km/l',
    speedLimit: '110 km/h',
    securityDeposit: 2500,
    freeKmPerDay: 250,
    extraKmCharge: 6,
    location: 'MGM Campus & Jalna Road',
    pickupHubId: 'hub-mgm',
    partnerId: 'partner-deccan-cruisers',
    partnerName: 'Deccan Cruiser Fleet',
    partnerRating: 4.95,
    partnerVerified: true,
    features: ['Slipper Clutch', 'TFT Display', 'Dual ABS Supermoto', 'Premium Helmet Included'],
    badge: 'High Performance',
    isAvailable: true,
    tripsCompleted: 164,
    year: 2025
  },
  {
    id: 'bike-yamaha-mt15',
    name: 'Yamaha MT-15 V2 (Cyber Green)',
    category: 'bike',
    subCategory: 'Hyper Naked',
    brand: 'Yamaha',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 899,
    hourlyPrice: 69,
    rating: 4.79,
    reviewsCount: 112,
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 2,
    engine: '155cc VVA Liquid Cooled',
    mileage: '48 km/l',
    speedLimit: '100 km/h',
    securityDeposit: 1500,
    freeKmPerDay: 200,
    extraKmCharge: 4,
    location: 'Waluj MIDC Hub, Sambhajinagar',
    pickupHubId: 'hub-waluj',
    partnerId: 'partner-ellora-auto',
    partnerName: 'Ellora Heritage Auto Rentals',
    partnerRating: 4.8,
    partnerVerified: true,
    features: ['Traction Control', 'Assist & Slipper Clutch', 'Bluetooth Y-Connect'],
    badge: 'Super Mileage',
    isAvailable: true,
    tripsCompleted: 240,
    year: 2024
  },
  {
    id: 'bike-honda-cb350',
    name: "Honda CB350 H'ness",
    category: 'bike',
    subCategory: 'Classic Tourer',
    brand: 'Honda',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 1150,
    hourlyPrice: 85,
    rating: 4.86,
    reviewsCount: 64,
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 2,
    engine: '348cc PGM-FI',
    mileage: '38 km/l',
    speedLimit: '100 km/h',
    securityDeposit: 2000,
    freeKmPerDay: 250,
    extraKmCharge: 5,
    location: 'Chikalthana Airport, Sambhajinagar',
    pickupHubId: 'hub-airport',
    partnerId: 'partner-sambhaji-ev',
    partnerName: 'Sambhaji Premium Mobility',
    partnerRating: 4.92,
    partnerVerified: true,
    features: ['Honda Selectable Torque Control', 'Smartphone Voice Control', 'Dual ABS'],
    badge: 'Smooth Highway Tourer',
    isAvailable: true,
    tripsCompleted: 145,
    year: 2024
  },

  // ---------------- SCOOTERS 🛵 ----------------
  {
    id: 'scooter-activa-6g',
    name: 'Honda Activa 6G (Smart Key Edition)',
    category: 'scooter',
    subCategory: 'City Commuter',
    brand: 'Honda',
    image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 499,
    hourlyPrice: 45,
    rating: 4.85,
    reviewsCount: 320,
    transmission: 'Automatic (CVT)',
    fuelType: 'Petrol',
    seats: 2,
    engine: '109.5cc eSP Engine',
    mileage: '55 km/l',
    speedLimit: '80 km/h',
    securityDeposit: 1000,
    freeKmPerDay: 150,
    extraKmCharge: 3,
    location: 'Railway Station Road, Sambhajinagar',
    pickupHubId: 'hub-station',
    partnerId: 'partner-ajanta-moto',
    partnerName: 'Ajanta Moto Hub',
    partnerRating: 4.85,
    partnerVerified: true,
    features: ['Smart Key Remote', 'Combi Brake System (CBS)', 'Underseat Storage 18L', 'Helmet Included (1x)'],
    badge: 'Most Booked Scooter',
    isAvailable: true,
    tripsCompleted: 580,
    year: 2024
  },
  {
    id: 'scooter-ather-450x',
    name: 'Ather 450X Gen 3 (Electric)',
    category: 'scooter',
    subCategory: 'Smart EV Scooter',
    brand: 'Ather',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 649,
    hourlyPrice: 55,
    rating: 4.93,
    reviewsCount: 88,
    transmission: 'Automatic (EV)',
    fuelType: 'Electric',
    seats: 2,
    engine: '3.7 kWh Battery (6.4 kW Peak)',
    mileage: '110 km TrueRange/Charge',
    speedLimit: '90 km/h',
    securityDeposit: 1200,
    freeKmPerDay: 180,
    extraKmCharge: 3,
    location: 'CIDCO Connaught, Sambhajinagar',
    pickupHubId: 'hub-cidco',
    partnerId: 'partner-marathwada-wheels',
    partnerName: 'Marathwada Self-Drive Wheels',
    partnerRating: 4.9,
    partnerVerified: true,
    features: ['Google Maps Onboard', 'Warp Mode', 'Fast Charging (Ather Grid Sambhajinagar)', 'Zero Fuel Cost'],
    badge: 'Eco-Friendly Smart EV',
    isAvailable: true,
    tripsCompleted: 190,
    year: 2024
  },
  {
    id: 'scooter-tvs-jupiter-125',
    name: 'TVS Jupiter 125 Disc',
    category: 'scooter',
    subCategory: 'Family Scooter',
    brand: 'TVS',
    image: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 479,
    hourlyPrice: 40,
    rating: 4.76,
    reviewsCount: 140,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 2,
    engine: '124.8cc ETFi',
    mileage: '50 km/l',
    speedLimit: '80 km/h',
    securityDeposit: 1000,
    freeKmPerDay: 150,
    extraKmCharge: 3,
    location: 'MGM Campus & Jalna Road',
    pickupHubId: 'hub-mgm',
    partnerId: 'partner-deccan-cruisers',
    partnerName: 'Deccan Cruiser Fleet',
    partnerRating: 4.95,
    partnerVerified: true,
    features: ['Front Fuel Fill', 'Largest 33L Underseat Boot', 'Front Disc Brake', 'USB Mobile Charger'],
    badge: 'Best Boot Space',
    isAvailable: true,
    tripsCompleted: 310,
    year: 2024
  },

  // ---------------- CARS 🚗 ----------------
  {
    id: 'car-maruti-swift',
    name: 'Maruti Swift ZXi+ Dual Tone',
    category: 'car',
    subCategory: 'Hatchback',
    brand: 'Maruti Suzuki',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 1699,
    hourlyPrice: 140,
    rating: 4.87,
    reviewsCount: 210,
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 5,
    engine: '1.2L DualJet (90 PS)',
    mileage: '22 km/l',
    speedLimit: '120 km/h',
    securityDeposit: 3000,
    freeKmPerDay: 300,
    extraKmCharge: 9,
    location: 'Railway Station Road, Sambhajinagar',
    pickupHubId: 'hub-station',
    partnerId: 'partner-ajanta-moto',
    partnerName: 'Ajanta Moto Hub',
    partnerRating: 4.85,
    partnerVerified: true,
    features: ['Touchscreen Apple CarPlay/Android Auto', 'Rear Parking Camera', 'Automatic Climate Control', 'Cruise Control'],
    badge: 'Popular City Hatchback',
    isAvailable: true,
    tripsCompleted: 440,
    year: 2024
  },
  {
    id: 'car-hyundai-i20-auto',
    name: 'Hyundai i20 Asta (O) IVT Automatic',
    category: 'car',
    subCategory: 'Premium Hatchback',
    brand: 'Hyundai',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 2199,
    hourlyPrice: 180,
    rating: 4.9,
    reviewsCount: 165,
    transmission: 'Automatic (IVT)',
    fuelType: 'Petrol',
    seats: 5,
    engine: '1.2L Kappa IVT',
    mileage: '18 km/l',
    speedLimit: '120 km/h',
    securityDeposit: 3500,
    freeKmPerDay: 300,
    extraKmCharge: 10,
    location: 'CIDCO Connaught, Sambhajinagar',
    pickupHubId: 'hub-cidco',
    partnerId: 'partner-marathwada-wheels',
    partnerName: 'Marathwada Self-Drive Wheels',
    partnerRating: 4.9,
    partnerVerified: true,
    features: ['Sunroof', 'Bose 7-Speaker Sound', '10.25-inch Touchscreen', 'Air Purifier', '6 Airbags'],
    badge: 'Premium Automatic',
    isAvailable: true,
    tripsCompleted: 290,
    year: 2024
  },
  {
    id: 'car-tata-nexon-ev',
    name: 'Tata Nexon EV Empowered+ LR',
    category: 'car',
    subCategory: 'Electric Compact SUV',
    brand: 'Tata',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 2799,
    hourlyPrice: 230,
    rating: 4.94,
    reviewsCount: 95,
    transmission: 'Automatic (EV)',
    fuelType: 'Electric',
    seats: 5,
    engine: '40.5 kWh Long Range (143 PS)',
    mileage: '320 km Range/Charge',
    speedLimit: '120 km/h',
    securityDeposit: 4000,
    freeKmPerDay: 300,
    extraKmCharge: 9,
    location: 'Chikalthana Airport, Sambhajinagar',
    pickupHubId: 'hub-airport',
    partnerId: 'partner-sambhaji-ev',
    partnerName: 'Sambhaji Premium Mobility',
    partnerRating: 4.92,
    partnerVerified: true,
    features: ['Fast Charging Capable', '360° Camera', 'Ventilated Front Seats', 'Harman Audio', 'Zero Fuel Expenses'],
    badge: 'Clean Tech EV',
    isAvailable: true,
    tripsCompleted: 130,
    year: 2025
  },

  // ---------------- SUVS 🚙 ----------------
  {
    id: 'suv-mahindra-thar-4x4',
    name: 'Mahindra Thar 4x4 Hard Top (LX Diesel AT)',
    category: 'suv',
    subCategory: 'Off-Road SUV',
    brand: 'Mahindra',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 3499,
    hourlyPrice: 290,
    rating: 4.96,
    reviewsCount: 275,
    transmission: 'Automatic (6-Speed Torque Converter)',
    fuelType: 'Diesel',
    seats: 4,
    engine: '2.2L mHawk CRDe (130 PS, 300 Nm)',
    mileage: '13 km/l',
    speedLimit: '120 km/h',
    securityDeposit: 5000,
    freeKmPerDay: 300,
    extraKmCharge: 12,
    location: 'CIDCO Connaught, Sambhajinagar',
    pickupHubId: 'hub-cidco',
    partnerId: 'partner-marathwada-wheels',
    partnerName: 'Marathwada Self-Drive Wheels',
    partnerRating: 4.9,
    partnerVerified: true,
    features: ['4x4 Low/High Transfer Case', 'Hard Top AC', 'Adventure Statistics', 'Roll Cage', 'Apple CarPlay/Android Auto'],
    badge: 'Top Pick for Ajanta & Lonar Crater',
    isAvailable: true,
    tripsCompleted: 380,
    year: 2024
  },
  {
    id: 'suv-hyundai-creta',
    name: 'Hyundai Creta SX (O) Diesel',
    category: 'suv',
    subCategory: 'Midsize Luxury SUV',
    brand: 'Hyundai',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 2999,
    hourlyPrice: 245,
    rating: 4.92,
    reviewsCount: 180,
    transmission: 'Manual 6-Speed',
    fuelType: 'Diesel',
    seats: 5,
    engine: '1.5L U2 CRDi Diesel (116 PS)',
    mileage: '19 km/l',
    speedLimit: '120 km/h',
    securityDeposit: 4000,
    freeKmPerDay: 300,
    extraKmCharge: 11,
    location: 'MGM Campus & Jalna Road',
    pickupHubId: 'hub-mgm',
    partnerId: 'partner-deccan-cruisers',
    partnerName: 'Deccan Cruiser Fleet',
    partnerRating: 4.95,
    partnerVerified: true,
    features: ['Panoramic Sunroof', 'Ventilated Seats', 'ADAS Level 2 Safety', 'Bose Premium Audio'],
    badge: 'Highway Comfort Leader',
    isAvailable: true,
    tripsCompleted: 260,
    year: 2025
  },
  {
    id: 'suv-mahindra-scorpio-n',
    name: 'Mahindra Scorpio-N Z8L 4WD (7-Seater)',
    category: 'suv',
    subCategory: 'Large SUV',
    brand: 'Mahindra',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 3899,
    hourlyPrice: 320,
    rating: 4.94,
    reviewsCount: 135,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 7,
    engine: '2.2L mHawk Diesel (175 PS, 400 Nm)',
    mileage: '14 km/l',
    speedLimit: '120 km/h',
    securityDeposit: 5000,
    freeKmPerDay: 300,
    extraKmCharge: 14,
    location: 'Waluj MIDC Hub, Sambhajinagar',
    pickupHubId: 'hub-waluj',
    partnerId: 'partner-ellora-auto',
    partnerName: 'Ellora Heritage Auto Rentals',
    partnerRating: 4.8,
    partnerVerified: true,
    features: ['4XPLOR Intelligent Terrain Modes', 'Sony 12-Speaker 3D Sound', 'Captain Seats', 'Wireless Phone Charger'],
    badge: 'Best for Large Families',
    isAvailable: true,
    tripsCompleted: 210,
    year: 2024
  },

  // ---------------- VANS & MULTI-SEATERS 🚐 ----------------
  {
    id: 'van-maruti-ertiga',
    name: 'Maruti Ertiga ZXi Smart Hybrid (7-Seater)',
    category: 'van',
    subCategory: 'MPV / 7-Seater',
    brand: 'Maruti Suzuki',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 2599,
    hourlyPrice: 210,
    rating: 4.89,
    reviewsCount: 220,
    transmission: 'Manual',
    fuelType: 'Petrol / Hybrid',
    seats: 7,
    engine: '1.5L K15C Smart Hybrid',
    mileage: '20.5 km/l',
    speedLimit: '120 km/h',
    securityDeposit: 3500,
    freeKmPerDay: 300,
    extraKmCharge: 10,
    location: 'Railway Station Road, Sambhajinagar',
    pickupHubId: 'hub-station',
    partnerId: 'partner-ajanta-moto',
    partnerName: 'Ajanta Moto Hub',
    partnerRating: 4.85,
    partnerVerified: true,
    features: ['Spacious 3-Row Seating', 'Roof Mounted Rear AC Vents', 'Cruise Control', 'Luggage Roof Rack Available'],
    badge: 'Economical 7-Seater',
    isAvailable: true,
    tripsCompleted: 350,
    year: 2024
  },
  {
    id: 'van-force-urbania-luxury',
    name: 'Force Urbania Luxury Cruiser (10-Seater)',
    category: 'van',
    subCategory: 'Luxury Van',
    brand: 'Force Motors',
    image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1000&q=80'
    ],
    pricePerDay: 5499,
    hourlyPrice: 480,
    rating: 4.97,
    reviewsCount: 60,
    transmission: 'Manual',
    fuelType: 'Diesel',
    seats: 10,
    engine: '2.6L FM CR Mercedes-Derived (115 PS)',
    mileage: '11 km/l',
    speedLimit: '100 km/h',
    securityDeposit: 7500,
    freeKmPerDay: 300,
    extraKmCharge: 18,
    location: 'Chikalthana Airport, Sambhajinagar',
    pickupHubId: 'hub-airport',
    partnerId: 'partner-sambhaji-ev',
    partnerName: 'Sambhaji Premium Mobility',
    partnerRating: 4.92,
    partnerVerified: true,
    features: ['Executive Recliner Captain Seats', 'Individual AC & USB ports', 'Massive Luggage Space', 'ABS with ESP & Hill Hold'],
    badge: 'VIP Group & Tourist Tourer',
    isAvailable: true,
    tripsCompleted: 85,
    year: 2024
  }
];

export const CATEGORIES_META = [
  {
    id: 'all',
    name: 'All Vehicles',
    icon: 'Sparkles',
    count: VEHICLES_DATA.length,
    description: 'Explore entire verified fleet'
  },
  {
    id: 'bike',
    name: 'Bikes',
    icon: 'Bike',
    count: VEHICLES_DATA.filter(v => v.category === 'bike').length,
    tagline: 'Scooters, commuters & premium motorcycles',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    startingPrice: '₹899/day'
  },
  {
    id: 'scooter',
    name: 'Scooters',
    icon: 'Zap',
    count: VEHICLES_DATA.filter(v => v.category === 'scooter').length,
    tagline: 'Easy, affordable city rides & smart EVs',
    image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=600&q=80',
    startingPrice: '₹479/day'
  },
  {
    id: 'car',
    name: 'Cars',
    icon: 'Car',
    count: VEHICLES_DATA.filter(v => v.category === 'car').length,
    tagline: 'Hatchbacks, sedans & automatic city cars',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    startingPrice: '₹1,699/day'
  },
  {
    id: 'suv',
    name: 'SUVs',
    icon: 'Compass',
    count: VEHICLES_DATA.filter(v => v.category === 'suv').length,
    tagline: 'More space. More freedom & 4x4 power',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    startingPrice: '₹2,999/day'
  },
  {
    id: 'van',
    name: 'Vans / 7-Seaters',
    icon: 'Users',
    count: VEHICLES_DATA.filter(v => v.category === 'van').length,
    tagline: 'Spacious 7 to 10 seaters for Ajanta tours & family trips',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    startingPrice: '₹2,599/day'
  }
];

export const PHOTO_SLOTS_CONFIG = [
  { type: 'front', label: 'Front View' },
  { type: 'left', label: 'Left Side' },
  { type: 'right', label: 'Right Side' },
  { type: 'rear', label: 'Rear View' },
  { type: 'odometer', label: 'Odometer' }
];

const MARKETPLACE_STORAGE_KEY = 'torqo_marketplace_vehicles';

export function getMarketplaceVehicles() {
  try {
    const stored = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize any previously cached vehicles that might have broken URLs
        const sanitized = parsed.map(v => {
          const defaultRef = VEHICLES_DATA.find(d => d.id === v.id);
          if (v.image && v.image.includes('share.google') && defaultRef) {
            return { ...v, image: defaultRef.image, gallery: defaultRef.gallery || v.gallery };
          }
          return v;
        });
        return sanitized;
      }
    }
  } catch (error) {
    console.warn('Unable to load saved vehicle listings:', error);
  }
  return [...VEHICLES_DATA];
}

export function saveMarketplaceVehicles(vehicles) {
  localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(vehicles));
  return vehicles;
}

export function addNewVehicleListing(vehicle) {
  return saveMarketplaceVehicles([...getMarketplaceVehicles(), vehicle]);
}

export function updateVehicleListing(vehicleId, updates) {
  const vehicles = getMarketplaceVehicles().map(vehicle =>
    vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle
  );
  return saveMarketplaceVehicles(vehicles);
}

export function deleteVehicleListing(vehicleId) {
  return saveMarketplaceVehicles(
    getMarketplaceVehicles().filter(vehicle => vehicle.id !== vehicleId)
  );
}

export function refreshVehiclesData() {
  return getMarketplaceVehicles();
}
