/**
 * Verified Rental Partners Database - Chhatrapati Sambhajinagar
 */
export const PARTNERS_DATA = [
  {
    id: 'partner-marathwada-wheels',
    name: 'Marathwada Self-Drive Wheels',
    ownerName: 'Sanjay Patil',
    rating: 4.9,
    reviewsCount: 420,
    address: 'Shop 14, Commercial Complex, CIDCO Connaught Place, Sambhajinagar',
    phone: '+91 98230 45891',
    email: 'contact@marathwadawheels.in',
    hubLocations: ['CIDCO Connaught', 'Prozone Mall Hub'],
    totalVehicles: 18,
    activeTrips: 14,
    monthlyRevenue: 284500,
    fleetUtilization: 84,
    isVerified: true,
    joinedDate: 'Jan 2024',
    badge: 'Top Rated Host',
    responseRate: '99%',
    avgResponseTime: '5 mins',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
    verificationDetails: {
      gstin: '27AABCU9603R1ZM',
      shopAct: 'MH-CSN-2023-88912',
      panVerified: true,
      bankAccountLinked: true
    }
  },
  {
    id: 'partner-ajanta-moto',
    name: 'Ajanta Moto Hub',
    ownerName: 'Ramesh Kulkarni',
    rating: 4.85,
    reviewsCount: 310,
    address: 'Near Central Railway Station, Station Road, Sambhajinagar',
    phone: '+91 94222 18902',
    email: 'rentals@ajantamotohub.com',
    hubLocations: ['Railway Station Road', 'Railway Colony'],
    totalVehicles: 14,
    activeTrips: 11,
    monthlyRevenue: 215000,
    fleetUtilization: 78,
    isVerified: true,
    joinedDate: 'Mar 2024',
    badge: 'Station Pickup Express',
    responseRate: '98%',
    avgResponseTime: '8 mins',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80',
    verificationDetails: {
      gstin: '27BDCPA4401L1ZT',
      shopAct: 'MH-CSN-2023-55102',
      panVerified: true,
      bankAccountLinked: true
    }
  },
  {
    id: 'partner-deccan-cruisers',
    name: 'Deccan Cruiser Fleet',
    ownerName: 'Aditya Deshmukh',
    rating: 4.95,
    reviewsCount: 260,
    address: 'Opp. MGM Medical College, Jalna Road, Sambhajinagar',
    phone: '+91 98810 77621',
    email: 'rides@deccancruisers.com',
    hubLocations: ['MGM Campus', 'Jalna Road', 'Seven Hills'],
    totalVehicles: 12,
    activeTrips: 10,
    monthlyRevenue: 248000,
    fleetUtilization: 88,
    isVerified: true,
    joinedDate: 'Nov 2023',
    badge: 'Premium Fleet Leader',
    responseRate: '100%',
    avgResponseTime: '3 mins',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verificationDetails: {
      gstin: '27AALCD8891K1Z2',
      shopAct: 'MH-CSN-2023-11209',
      panVerified: true,
      bankAccountLinked: true
    }
  },
  {
    id: 'partner-ellora-auto',
    name: 'Ellora Heritage Auto Rentals',
    ownerName: 'Ganesh Shinde',
    rating: 4.8,
    reviewsCount: 190,
    address: 'Waluj MIDC main square, Pandharpur-Waluj road, Sambhajinagar',
    phone: '+91 97631 99245',
    email: 'info@elloraautorentals.in',
    hubLocations: ['Waluj MIDC', 'Bajajnagar'],
    totalVehicles: 10,
    activeTrips: 7,
    monthlyRevenue: 172000,
    fleetUtilization: 72,
    isVerified: true,
    joinedDate: 'Feb 2024',
    badge: 'Industrial & Tourist Specialist',
    responseRate: '96%',
    avgResponseTime: '12 mins',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verificationDetails: {
      gstin: '27CDEPS7712M1Z8',
      shopAct: 'MH-CSN-2024-00431',
      panVerified: true,
      bankAccountLinked: true
    }
  },
  {
    id: 'partner-sambhaji-ev',
    name: 'Sambhaji Premium Mobility',
    ownerName: 'Pooja Jadhav',
    rating: 4.92,
    reviewsCount: 145,
    address: 'Airport Exit Ring Road, Chikalthana, Sambhajinagar',
    phone: '+91 99220 33410',
    email: 'support@sambhajiev.in',
    hubLocations: ['Chikalthana Airport', 'Shendra DMIC'],
    totalVehicles: 8,
    activeTrips: 6,
    monthlyRevenue: 195000,
    fleetUtilization: 80,
    isVerified: true,
    joinedDate: 'Apr 2024',
    badge: 'Airport Fast Track & EV Hub',
    responseRate: '99%',
    avgResponseTime: '4 mins',
    logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    verificationDetails: {
      gstin: '27AABCS3102N1Z4',
      shopAct: 'MH-CSN-2024-99120',
      panVerified: true,
      bankAccountLinked: true
    }
  }
];

export const TESTIMONIALS_DATA = [
  {
    id: 'rev-1',
    name: 'Aniket Sharma',
    city: 'Pune',
    role: 'Software Architect & Weekend Traveler',
    rating: 5,
    date: 'February 2026',
    vehicle: 'Mahindra Thar 4x4',
    partner: 'Marathwada Self-Drive Wheels',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    comment: 'Booked a Thar for our weekend road trip to Ellora and Daulatabad Fort. The pickup from CIDCO was seamless in under 3 minutes with digital KYC verification. Super clean vehicle and zero hidden charges!'
  },
  {
    id: 'rev-2',
    name: 'Priyanka Deshmukh',
    city: 'Mumbai',
    role: 'Solo Heritage Explorer',
    rating: 5,
    date: 'January 2026',
    vehicle: 'Royal Enfield Classic 350',
    partner: 'Ajanta Moto Hub',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    comment: 'Arrived at Sambhajinagar Railway Station at 7 AM. The Royal Enfield was ready right outside the station. Cruising to Ajanta Caves on the new highway was pure bliss. 100% trustworthy marketplace!'
  },
  {
    id: 'rev-3',
    name: 'Rahul & Meera Varma',
    city: 'Bangalore',
    role: 'Family Vacationers',
    rating: 5,
    date: 'February 2026',
    vehicle: 'Hyundai Creta Automatic',
    partner: 'Deccan Cruiser Fleet',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    comment: 'Airport pickup option at Chikalthana was a lifesaver with two kids. Creta was spotless, panoramic sunroof was fantastic for the Daulatabad ghats, and deposit refund was credited back within 2 hours of vehicle return.'
  },
  {
    id: 'rev-4',
    name: 'Dr. Swapnil Chavan',
    city: 'Chhatrapati Sambhajinagar',
    role: 'Local Resident & Doctor',
    rating: 5,
    date: 'January 2026',
    vehicle: 'Ather 450X EV Scooter',
    partner: 'Marathwada Self-Drive Wheels',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    comment: 'When my car was in the service center, I rented the Ather 450X for 3 days. Super convenient for hospital commutes in Connaught and Cannaught market. DriveMart is changing how Sambhajinagar moves!'
  }
];
