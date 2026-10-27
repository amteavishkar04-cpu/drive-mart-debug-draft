/**
 * Chhatrapati Sambhajinagar Hubs, Tourist Routes, and City Guide
 */
export const CITY_HUBS = [
  {
    id: 'hub-cidco',
    name: 'CIDCO Connaught Place',
    area: 'Central Business District',
    description: 'Prime hub near shopping centers, cafes, and hotels',
    address: 'Connaught Place Commercial Area, CIDCO N-4, Sambhajinagar',
    popularVehicles: ['Thar 4x4', 'Royal Enfield Classic 350', 'Hyundai i20', 'Ather 450X'],
    operatingHours: '6:00 AM - 11:00 PM',
    deliveryAvailable: true,
    mapCoord: { lat: 19.8762, lng: 75.3433 }
  },
  {
    id: 'hub-station',
    name: 'Railway Station Road',
    area: 'Transit & Hotel Zone',
    description: 'Instant pickup for train arrivals (Nagpur, Mumbai, Pune, Delhi lines)',
    address: 'Station Road, Opp. Central Railway Station Exit, Sambhajinagar',
    popularVehicles: ['Activa 6G', 'Swift', 'Hunter 350', 'Ertiga 7-Seater'],
    operatingHours: '24/7 Round the Clock',
    deliveryAvailable: true,
    mapCoord: { lat: 19.8631, lng: 75.3195 }
  },
  {
    id: 'hub-mgm',
    name: 'MGM & Jalna Road',
    area: 'Educational & Health District',
    description: 'Near MGM Campus, Seven Hills, and Jalna Highway link',
    address: 'Jalna Road, Near MGM Sports Complex, Sambhajinagar',
    popularVehicles: ['KTM Duke 250', 'Jupiter 125', 'Creta SX', 'Pulsar NS200'],
    operatingHours: '7:00 AM - 10:30 PM',
    deliveryAvailable: true,
    mapCoord: { lat: 19.8705, lng: 75.3621 }
  },
  {
    id: 'hub-airport',
    name: 'Chikalthana Airport Area',
    area: 'Aviation & Shendra DMIC Hub',
    description: 'VIP meet-and-greet pickup right at Sambhajinagar Airport (IXU) terminal exit',
    address: 'Chikalthana Airport Rd, MIDC Industrial Area, Sambhajinagar',
    popularVehicles: ['Force Urbania', 'Nexon EV', 'Honda CB350', 'Scorpio-N'],
    operatingHours: '5:30 AM - 11:30 PM',
    deliveryAvailable: true,
    mapCoord: { lat: 19.8628, lng: 75.3981 }
  },
  {
    id: 'hub-waluj',
    name: 'Waluj MIDC Hub',
    area: 'Auto Industrial Belt',
    description: 'Convenient pickup for industrial executives, engineers & western bypass',
    address: 'Pandharpur main square, Waluj MIDC, Sambhajinagar',
    popularVehicles: ['Yamaha MT-15', 'Scorpio-N 4WD', 'Swift'],
    operatingHours: '8:00 AM - 9:00 PM',
    deliveryAvailable: true,
    mapCoord: { lat: 19.8392, lng: 75.2415 }
  },
  {
    id: 'hub-prozone',
    name: 'Prozone Mall & API Corner',
    area: 'Retail & Entertainment Hub',
    description: 'Shopping zone pickup with dedicated valet parking handover',
    address: 'Chikalthana Bypass Road, API Corner, Sambhajinagar',
    popularVehicles: ['Hyundai i20', 'Ather 450X', 'Classic 350'],
    operatingHours: '9:00 AM - 10:00 PM',
    deliveryAvailable: true,
    mapCoord: { lat: 19.8722, lng: 75.3789 }
  }
];

export const TOURIST_DESTINATIONS = [
  {
    id: 'dest-ellora',
    name: 'Ellora Caves & Kailasa Temple',
    unesco: true,
    distance: '30 km from city center',
    travelTime: '45 mins',
    tag: 'UNESCO World Heritage',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    description: 'Monumental rock-cut temples, including the world-famous monolithic Kailasa Temple (Cave 16) carved top-down from a single basalt rock.',
    recommendedVehicle: 'Royal Enfield Classic 350 / Thar 4x4',
    tip: 'Combine with Grishneshwar Jyotirlinga (1 km away) and Khuldabad. Scenic ghat drive via Daulatabad.'
  },
  {
    id: 'dest-daulatabad',
    name: 'Daulatabad Fort (Devgiri)',
    unesco: false,
    distance: '15 km from city center',
    travelTime: '25 mins',
    tag: 'Medieval Citadel',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Impregnable 12th-century hill fortress featuring the mysterious dark labyrinth (Andhari), moats, and panoramic hilltop views of the Deccan plateau.',
    recommendedVehicle: 'KTM Duke / Yamaha MT-15 / Swift',
    tip: 'Visit in the early morning or sunset for cool weather and photogenic light over the outer ramparts.'
  },
  {
    id: 'dest-ajanta',
    name: 'Ajanta Caves (UNESCO)',
    unesco: true,
    distance: '102 km via Solapur-Dhule NH52',
    travelTime: '1 hr 50 mins (Smooth 4-lane highway)',
    tag: 'Ancient Buddhist Masterpiece',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: '30 rock-cut Buddhist cave monuments dating from 2nd century BCE, famous for murals depicting the Jataka tales.',
    recommendedVehicle: 'Mahindra Scorpio-N / Hyundai Creta / Ertiga 7-Seater',
    tip: 'Caves are closed on Mondays. The newly upgraded 4-lane expressway from Sambhajinagar makes this an effortless self-drive day trip.'
  },
  {
    id: 'dest-bibi-ka-maqbara',
    name: 'Bibi Ka Maqbara & Panchakki',
    unesco: false,
    distance: '5 km within city',
    travelTime: '12 mins',
    tag: 'Tomb of the Lady',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    description: 'Known as the "Taj of the Deccan", built by Prince Azam Shah in memory of his mother Rabia-ul-Daurani with exquisite white marble dome and charbagh gardens.',
    recommendedVehicle: 'Honda Activa 6G / Ather 450X EV / Hyundai i20',
    tip: 'Perfect evening stroll destination. Try Sambhajinagar\'s famous Naan Qalia nearby.'
  },
  {
    id: 'dest-lonar',
    name: 'Lonar Meteorite Crater Lake',
    unesco: false,
    distance: '140 km from Sambhajinagar',
    travelTime: '2 hrs 45 mins',
    tag: 'Geological Wonder',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'One of the world\'s only hyper-velocity meteorite impact craters in basalt rock, creating a rare soda-saline lake surrounded by ancient temples and wildlife.',
    recommendedVehicle: 'Mahindra Thar 4x4 / Creta Diesel AT',
    tip: 'Ideal 1-day adventure drive. Take the Jalna-Sultanpur highway for the smoothest stretch.'
  }
];

export const COMPARISON_DATA = [
  {
    feature: 'Price Transparency',
    traditional: 'Hidden charges, unexpected cleaning fees & manual deposit hassles',
    drivemart: '100% upfront pricing with zero hidden fees. Instant digital deposit refund',
    icon: 'ShieldCheck'
  },
  {
    feature: 'Vehicle Availability',
    traditional: 'Call 5 different shops, unverified availability & last minute cancellations',
    drivemart: 'Live real-time inventory from 20+ verified Sambhajinagar rental fleets',
    icon: 'CalendarCheck'
  },
  {
    feature: 'Vehicle Condition & Hygiene',
    traditional: 'Unknown condition, old models, high risk of highway breakdowns',
    drivemart: 'Certified 20-point inspected fleet (<2 years old) with full insurance & clean sanitization',
    icon: 'Sparkles'
  },
  {
    feature: 'Booking & Handover Speed',
    traditional: '30-minute manual paperwork, physical ledger signatures, cash-only',
    drivemart: '2-minute paperless digital KYC (DigiLocker / Aadhaar) and instant QR key handover',
    icon: 'Zap'
  },
  {
    feature: 'Support & Assistance',
    traditional: 'No roadside support if you get stuck near Ajanta / Ellora ghats',
    drivemart: '24/7 Roadside Assistance (RSA) across Marathwada region with SOS helpline',
    icon: 'Headphones'
  }
];

export const FAQS_DATA = [
  {
    question: 'What documents are required to rent a self-drive bike or car in Sambhajinagar?',
    answer: 'You only need two valid documents: 1) Original Government Driving License (LMV for cars, MCWG for motorcycles/scooters) and 2) Government Photo ID (Aadhaar Card, Passport, or Voter ID). Verification is completed digitally in 60 seconds.'
  },
  {
    question: 'Is security deposit refundable, and how soon is it credited back?',
    answer: 'Yes, 100% of the security deposit is refundable. As soon as the rental partner completes the digital vehicle return checklist (verifying fuel level and no major damage), the deposit is instantly credited back to your original bank account or UPI within 2 to 4 hours.'
  },
  {
    question: 'Can I pick up a vehicle at Sambhajinagar Railway Station and return it at Chikalthana Airport?',
    answer: 'Yes! DriveMart supports flexible inter-hub drop-offs between our partner hubs across Chhatrapati Sambhajinagar (Railway Station, CIDCO, MGM, Airport, and Waluj) for a nominal convenience fee.'
  },
  {
    question: 'Are fuel and helmets included with the rental?',
    answer: 'All bike and scooter rentals include 1 certified ISI standard helmet for free (pillion helmet can be added for ₹49/day). Vehicles are provided with a minimum fuel level to reach the nearest fuel station, and you return with the same level.'
  },
  {
    question: 'How do I visit Ellora and Ajanta Caves with a DriveMart self-drive vehicle?',
    answer: 'Ellora is just 30 km away via Daulatabad on NH 752H (ideal for Royal Enfield or Thar). Ajanta Caves is 102 km via the newly widened 4-lane NH 52 (approx 1 hr 45 min drive). All DriveMart vehicles have state permits and toll tag options.'
  },
  {
    question: 'How can local rental businesses join DriveMart as partners?',
    answer: 'Local vehicle rental operators can click "Become a Partner", upload Shop Act / GSTIN license, register their fleet with RC documents, and start receiving digital bookings within 24 hours with zero upfront listing fees!'
  }
];
