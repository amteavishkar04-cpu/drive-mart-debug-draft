/**
 * DriveMart — India's Marketplace for Vehicle Rentals Core Application
 * Integrated with 5-View Actual Owner Bike Photo System & Verification Queue
 */
import { 
  VEHICLES_DATA, 
  CATEGORIES_META, 
  PHOTO_SLOTS_CONFIG,
  getMarketplaceVehicles, 
  saveMarketplaceVehicles, 
  addNewVehicleListing, 
  updateVehicleListing, 
  deleteVehicleListing,
  refreshVehiclesData
} from './data/vehicles.js';
import { PARTNERS_DATA, TESTIMONIALS_DATA } from './data/partners.js';
import { CITY_HUBS, TOURIST_DESTINATIONS, COMPARISON_DATA, FAQS_DATA } from './data/locations.js';
import { renderHeroSearch, initHeroSearchEvents } from './components/heroSearch.js';
import { renderVehicleCatalog, renderVehicleDetailModal, renderVehicleCard, getVehiclePrimaryPhoto, getVehiclePhotos } from './components/vehicleCatalog.js';
import { 
  renderBookingModal, 
  renderBookingStep1, 
  renderBookingStep2, 
  renderBookingStep3, 
  renderBookingStep4, 
  renderBookingSuccess 
} from './components/bookingModal.js';
import { renderPartnerDashboard } from './components/partnerDashboard.js';
import { renderAdminDashboard } from './components/adminDashboard.js';
import { renderSeoPage, SEO_PAGE_CONFIGS } from './components/seoPages.js';

// Application Global State
const state = {
  vehicles: refreshVehiclesData(),
  theme: localStorage.getItem('torqo_theme') || 'dark', // 'dark' | 'light'
  currentView: 'customer', // 'customer' | 'partner' | 'admin' | 'seo'
  activeSeoSlug: 'bike-rental-chhatrapati-sambhajinagar',
  selectedCategory: 'all',
  searchFilters: {
    query: '',
    category: 'all',
    transmission: 'all',
    fuel: 'all',
    location: 'all',
    maxPrice: 6000,
    sortBy: 'recommended',
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    deliveryMode: 'self'
  },
  activeBooking: {
    vehicleId: null,
    step: 1,
    pickupDate: '',
    returnDate: '',
    handoverMode: 'hub',
    deliveryAddress: '',
    addons: {
      pillionHelmet: false,
      zeroDep: true,
      phoneMount: false
    },
    kyc: {
      name: 'Avishkar Patil',
      phone: '+91 98220 98765',
      email: 'rider@drivemart.in',
      dlNumber: 'MH20 20210088912'
    },
    promoCode: '',
    payMethod: 'upi',
    grandTotal: 0
  },
  userBookings: loadUserBookings()
};

const USER_BOOKINGS_STORAGE_KEY = 'torqo_user_bookings';

export function loadUserBookings() {
  try {
    const stored = localStorage.getItem(USER_BOOKINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Unable to load bookings from storage:', e);
  }
  const tharVehicle = VEHICLES_DATA.find(v => v.id === 'suv-mahindra-thar-4x4') || VEHICLES_DATA[0];
  return [
    {
      bookingId: 'TORQO-CSN-8840',
      vehicle: tharVehicle,
      pickupDate: '2026-03-01',
      returnDate: '2026-03-03',
      grandTotal: 10497,
      status: 'Confirmed',
      kyc: { name: 'Avishkar Patil', dlNumber: 'MH20 20210088912' }
    }
  ];
}

export function saveUserBookings(bookings) {
  try {
    localStorage.setItem(USER_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.warn('Unable to save bookings to storage:', e);
  }
  return bookings;
}

// Safe Lucide icons initializer
export function renderIcons() {
  if (typeof window !== 'undefined' && typeof lucide !== 'undefined' && lucide && typeof lucide.createIcons === 'function') {
    try {
      lucide.createIcons();
    } catch (e) {
      console.warn('Lucide icons render warning:', e);
    }
  }
}

// Toast notification helper
export function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' 
    ? 'bg-emerald-500 text-slate-950 font-bold' 
    : (type === 'error' ? 'bg-red-500 text-white font-bold' : 'bg-slate-800 text-white border border-white/10');
  
  const iconName = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-triangle' : 'info');

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl ${bgColor} text-xs transition-all transform translate-y-2 opacity-0 duration-300 pointer-events-auto`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  renderIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/**
 * Apply Light / Dark Theme globally
 */
export function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('torqo_theme', theme);

  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
    document.documentElement.classList.remove('dark');
    document.body.classList.add('light-theme');
  } else {
    document.documentElement.classList.remove('light-theme');
    document.documentElement.classList.add('dark');
    document.body.classList.remove('light-theme');
  }
}

/**
 * Toggle Light / Dark Theme
 */
export function toggleTheme() {
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  showToast(`Switched to ${nextTheme === 'light' ? '☀️ Light' : '🌙 Dark'} Mode`, 'info');
}

/**
 * Client-Side Image Compression & Data URL Converter
 */
function compressAndReadFile(file, maxWidth = 1280, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) return reject('No file provided');
    if (!file.type.match(/image\/(jpeg|png|webp|jpg)/i)) {
      return reject('Only JPG, JPEG, PNG, and WEBP image formats are supported.');
    }
    if (file.size > 10 * 1024 * 1024) {
      return reject('Image exceeds maximum limit of 10 MB.');
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject('Could not load image file');
      img.src = readerEvent.target.result;
    };
    reader.onerror = () => reject('Could not read image file');
    reader.readAsDataURL(file);
  });
}

/**
 * Filter and Sort Vehicles based on active searchFilters
 */
function getFilteredVehicles() {
  const vehicles = state.vehicles;

  return vehicles.filter(vehicle => {
    // Category match
    if (state.searchFilters.category !== 'all' && vehicle.category !== state.searchFilters.category) {
      return false;
    }

    // Transmission match
    if (state.searchFilters.transmission !== 'all') {
      if (state.searchFilters.transmission === 'Automatic' && !vehicle.transmission.includes('Automatic') && !vehicle.transmission.includes('CVT')) {
        return false;
      }
      if (state.searchFilters.transmission === 'Manual' && !vehicle.transmission.includes('Manual')) {
        return false;
      }
    }

    // Fuel match
    if (state.searchFilters.fuel !== 'all' && vehicle.fuelType !== state.searchFilters.fuel) {
      return false;
    }

    // Location hub match
    if (state.searchFilters.location !== 'all' && vehicle.pickupHubId !== state.searchFilters.location) {
      return false;
    }

    // Max Price
    if (vehicle.pricePerDay > state.searchFilters.maxPrice) {
      return false;
    }

    // Search query match
    if (state.searchFilters.query.trim()) {
      const q = state.searchFilters.query.toLowerCase();
      const match = vehicle.name.toLowerCase().includes(q) ||
                    vehicle.brand.toLowerCase().includes(q) ||
                    vehicle.model.toLowerCase().includes(q) ||
                    vehicle.variant.toLowerCase().includes(q) ||
                    vehicle.category.toLowerCase().includes(q) ||
                    vehicle.location.toLowerCase().includes(q) ||
                    vehicle.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => {
    if (state.searchFilters.sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
    if (state.searchFilters.sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
    if (state.searchFilters.sortBy === 'rating') return b.rating - a.rating;
    if (state.searchFilters.sortBy === 'popular') return b.tripsCompleted - a.tripsCompleted;
    return 0; // recommended
  });
}

/**
 * Render Customer Homepage View
 */
function renderCustomerView() {
  const filteredVehicles = getFilteredVehicles();

  return `
    <!-- Top Hero Section -->
    ${renderHeroSearch()}

    <!-- Trust & Safety Section: 100% Genuine Owner Photos Guarantee -->
    <section class="py-12 border-y border-white/5 bg-slate-950/40 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-10">
          <div class="badge-volt mb-2">Authentic Marketplace</div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Actual Vehicle Photos Guarantee</h2>
          <p class="text-slate-400 text-xs sm:text-sm mt-1">
            Every bike listing displays 5 mandatory photos of the exact motorcycle you will ride in Sambhajinagar
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div class="glass-card p-6 text-left group">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i data-lucide="camera" class="w-6 h-6"></i>
            </div>
            <h3 class="text-base font-bold text-white mb-2">5-Angle Owner Photos</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Every owner must upload Front, Left, Right, Rear & Odometer photos. Zero generic stock photos.
            </p>
          </div>

          <div class="glass-card p-6 text-left group">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <h3 class="text-base font-bold text-white mb-2">Admin Photo Verification</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Every photo set is inspected to verify vehicle condition, clean mirrors, tyres, and authentic registration.
            </p>
          </div>

          <div class="glass-card p-6 text-left group">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i data-lucide="gauge" class="w-6 h-6"></i>
            </div>
            <h3 class="text-base font-bold text-white mb-2">Live Odometer Reading</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              See the exact meter reading and console before booking to ensure genuine low-km well-maintained rides.
            </p>
          </div>

          <div class="glass-card p-6 text-left group">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i data-lucide="check-circle-2" class="w-6 h-6"></i>
            </div>
            <h3 class="text-base font-bold text-white mb-2">Exact Match at Pickup</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              If the vehicle at the counter doesn't match the listing photos, get a 100% instant refund or free upgrade.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- Vehicle Categories Showcase -->
    <section class="py-14 sm:py-20 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div class="badge-volt mb-2">Verified Categories</div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
              Explore Available Fleet
            </h2>
            <p class="text-slate-400 text-xs sm:text-sm mt-1">
              Bikes, scooters, cars, and SUVs from verified rental hosts in Chhatrapati Sambhajinagar
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Bikes Card -->
          <div class="category-card glass-card overflow-hidden group cursor-pointer" data-category="bike">
            <div class="h-48 relative overflow-hidden bg-slate-950">
              <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80" alt="Bikes" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <span class="absolute top-3 left-3 text-2xl">🏍️</span>
              <span class="absolute bottom-3 right-3 text-xs font-bold text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-emerald-500/20">From ₹999/day</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Bikes</h3>
              <p class="text-xs text-slate-300 mt-1">Hunter 350, Classic 350, KTM Duke 250 & R15 V4 with verified owner photos</p>
            </div>
          </div>

          <!-- Scooters Card -->
          <div class="category-card glass-card overflow-hidden group cursor-pointer" data-category="scooter">
            <div class="h-48 relative overflow-hidden bg-slate-950">
              <img src="https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=600&q=80" alt="Scooters" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <span class="absolute top-3 left-3 text-2xl">🛵</span>
              <span class="absolute bottom-3 right-3 text-xs font-bold text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-emerald-500/20">From ₹479/day</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Scooters & EVs</h3>
              <p class="text-xs text-slate-300 mt-1">Activa 6G, Jupiter 125 & Ather 450X with verified dashboard images</p>
            </div>
          </div>

          <!-- Cars Card -->
          <div class="category-card glass-card overflow-hidden group cursor-pointer" data-category="car">
            <div class="h-48 relative overflow-hidden bg-slate-950">
              <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80" alt="Cars" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <span class="absolute top-3 left-3 text-2xl">🚗</span>
              <span class="absolute bottom-3 right-3 text-xs font-bold text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-emerald-500/20">From ₹1,699/day</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Cars</h3>
              <p class="text-xs text-slate-300 mt-1">Swift ZXi+, Hyundai i20 & Tata Nexon EV with verified interior photos</p>
            </div>
          </div>

          <!-- SUVs Card -->
          <div class="category-card glass-card overflow-hidden group cursor-pointer" data-category="suv">
            <div class="h-48 relative overflow-hidden bg-slate-950">
              <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80" alt="SUVs" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <span class="absolute top-3 left-3 text-2xl">🚙</span>
              <span class="absolute bottom-3 right-3 text-xs font-bold text-emerald-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-emerald-500/20">From ₹2,999/day</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">SUVs & 4x4</h3>
              <p class="text-xs text-slate-300 mt-1">Thar 4x4, Creta & Scorpio-N 7-Seater for Ajanta & Ellora trips</p>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Main Featured Vehicle Catalog with Filters -->
    ${renderVehicleCatalog(filteredVehicles)}

    <!-- How It Works -->
    <section class="py-16 sm:py-24 bg-slate-950/60 border-y border-white/5 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-14">
          <div class="badge-volt mb-2">Transparent Marketplace</div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white">How Photos & Bookings Work</h2>
          <p class="text-slate-400 text-xs sm:text-sm mt-1">
            Zero ambiguity. See the actual vehicle and odometer before you confirm
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div class="glass-card p-8 text-center relative group">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 text-2xl font-black group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Owner Uploads 5 Views</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every host submits front, side, rear and odometer photos of their actual bike before listing.
            </p>
          </div>

          <div class="glass-card p-8 text-center relative group">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 text-2xl font-black group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Admin Audits & Verifies</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our quality team inspects the 5 views to ensure vehicle integrity, tyre tread, and no generic stock images.
            </p>
          </div>

          <div class="glass-card p-8 text-center relative group">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 text-2xl font-black group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 class="text-xl font-bold text-white mb-2">You Ride That Exact Bike</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Scan your digital QR at pickup and collect the keys to the exact bike you inspected on your screen.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- Why Choose Us Comparison Matrix -->
    <section class="py-16 sm:py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="badge-volt mb-2">The Marketplace Advantage</div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Why Choose DriveMart</h2>
          <p class="text-slate-400 text-xs sm:text-sm mt-1">
            See how our actual-photo marketplace solves traditional rental headaches
          </p>
        </div>

        <div class="glass-card overflow-hidden rounded-3xl border border-white/10">
          <div class="grid grid-cols-12 bg-slate-900/90 p-4 sm:p-5 border-b border-white/10 font-bold text-xs uppercase tracking-wider">
            <div class="col-span-4 text-slate-400">Features</div>
            <div class="col-span-4 text-red-400">Traditional Rental Shops</div>
            <div class="col-span-4 text-emerald-400">DriveMart Marketplace</div>
          </div>

          <div class="divide-y divide-white/5 text-xs sm:text-sm">
            ${COMPARISON_DATA.map(item => `
              <div class="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-slate-900/40 transition-colors">
                <div class="col-span-4 font-bold text-white flex items-center gap-2">
                  <i data-lucide="${item.icon}" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                  <span>${item.feature}</span>
                </div>
                <div class="col-span-4 text-slate-400 pr-2">
                  <span class="text-red-400 font-bold mr-1">✕</span> ${item.traditional}
                </div>
                <div class="col-span-4 text-emerald-300 font-medium pl-2">
                  <span class="text-emerald-400 font-bold mr-1">✓</span> ${item.drivemart}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </section>

    <!-- City Section: Launching in Chhatrapati Sambhajinagar -->
    <section class="py-16 sm:py-24 bg-slate-950/70 border-y border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div class="max-w-2xl">
            <div class="badge-volt mb-2">Launch City</div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
              Launching in Chhatrapati Sambhajinagar
            </h2>
            <p class="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              From historical UNESCO cave corridors to modern DMIC industrial parks, we’ve covered every corner with fast pickup hubs and express drop-offs.
            </p>
          </div>

          <button id="city-explore-btn" class="btn-primary text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shrink-0">
            Explore Vehicles in Sambhajinagar →
          </button>
        </div>

        <!-- Hotspots & Tourist Routes Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Key City Hubs -->
          <div class="glass-card p-6 rounded-3xl">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i data-lucide="map-pin" class="w-5 h-5 text-emerald-400"></i>
              <span>Popular Hubs in Sambhajinagar</span>
            </h3>

            <div class="space-y-3">
              ${CITY_HUBS.map(hub => `
                <div class="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 flex items-center justify-between hover:border-emerald-500/30 transition-colors">
                  <div>
                    <h4 class="text-sm font-bold text-white">${hub.name}</h4>
                    <p class="text-xs text-slate-400">${hub.area} • ${hub.operatingHours}</p>
                  </div>
                  <span class="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Active Hub
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Tourist Road Trips -->
          <div class="glass-card p-6 rounded-3xl">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i data-lucide="compass" class="w-5 h-5 text-emerald-400"></i>
              <span>Curated Tourist Routes</span>
            </h3>

            <div class="space-y-3">
              ${TOURIST_DESTINATIONS.slice(0, 4).map(dest => `
                <div class="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 flex items-center gap-3.5 hover:border-emerald-500/30 transition-colors">
                  <img src="${dest.image}" alt="${dest.name}" class="w-14 h-14 rounded-lg object-cover bg-slate-950 shrink-0" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <h4 class="text-xs sm:text-sm font-bold text-white truncate">${dest.name}</h4>
                      <span class="text-[10px] text-amber-300 font-semibold shrink-0">${dest.distance}</span>
                    </div>
                    <p class="text-[11px] text-slate-400 truncate">${dest.description}</p>
                    <p class="text-[10px] text-emerald-400 font-semibold mt-0.5">Best Ride: ${dest.recommendedVehicle.split('/')[0]}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- For Rental Businesses & Partner Onboarding Pitch -->
    <section class="py-16 sm:py-24 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 relative">
          <div class="hero-glow-sphere -bottom-20 -right-20"></div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div class="lg:col-span-7 space-y-6">
              <div class="badge-volt">Partner With DriveMart</div>
              <h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Have vehicles to rent? <br class="hidden sm:inline" />
                <span class="gradient-text">List your actual bikes in 2 mins.</span>
              </h2>
              <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
                Join our verified marketplace. Take 5 photos of your bike (Front, Sides, Rear, Odometer), set your daily price, and get verified bookings from travelers across India.
              </p>

              <!-- Partner Benefits Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <i data-lucide="camera" class="w-4 h-4"></i>
                  </div>
                  <span class="text-xs sm:text-sm font-semibold text-slate-200">Easy 5-View Photo Upload</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <i data-lucide="trending-up" class="w-4 h-4"></i>
                  </div>
                  <span class="text-xs sm:text-sm font-semibold text-slate-200">Get 3x More Bookings</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <i data-lucide="wallet" class="w-4 h-4"></i>
                  </div>
                  <span class="text-xs sm:text-sm font-semibold text-slate-200">Weekly Digital Payouts</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                  </div>
                  <span class="text-xs sm:text-sm font-semibold text-slate-200">Build Verified Host Reputation</span>
                </div>
              </div>

              <!-- CTA -->
              <div class="pt-4 flex items-center gap-4 flex-wrap">
                <button id="become-partner-btn" class="btn-primary text-slate-950 font-bold px-8 py-3 rounded-xl shadow-xl">
                  Become a Rental Partner →
                </button>
                <button id="partner-demo-preview-btn" class="btn-secondary text-xs sm:text-sm font-semibold">
                  Launch Host Dashboard Demo
                </button>
              </div>
            </div>

            <!-- Partner Dashboard Mockup Preview -->
            <div class="lg:col-span-5">
              <div class="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-slate-950/80 shadow-2xl relative">
                <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span class="text-[10px] text-slate-400 font-mono ml-2">Host Portal • Live</span>
                  </div>
                  <span class="badge-volt text-[10px]">84% Occupancy</span>
                </div>

                <div class="space-y-3">
                  <div class="bg-slate-900/90 p-3 rounded-xl border border-white/5">
                    <span class="text-[10px] text-slate-400 block">Monthly Revenue</span>
                    <span class="text-2xl font-extrabold text-emerald-400">₹2,84,500</span>
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-slate-900/90 p-2.5 rounded-xl border border-white/5">
                      <span class="text-[10px] text-slate-400 block">Active Units</span>
                      <span class="font-bold text-white">18 Vehicles</span>
                    </div>
                    <div class="bg-slate-900/90 p-2.5 rounded-xl border border-white/5">
                      <span class="text-[10px] text-slate-400 block">Actual Photos</span>
                      <span class="font-bold text-emerald-400">100% Verified</span>
                    </div>
                  </div>

                  <div class="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center justify-between">
                    <span>⚡ New Booking: Royal Enfield Classic 350</span>
                    <span class="font-bold">₹2,110</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- Customer Reviews / Testimonials Section -->
    <section class="py-16 sm:py-20 bg-slate-950/40 border-y border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="badge-volt mb-2">Verified Renter Stories</div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Loved by Travelers & Locals</h2>
          <p class="text-slate-400 text-xs sm:text-sm mt-1">
            Real experiences from road trippers who explored Marathwada with DriveMart
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${TESTIMONIALS_DATA.map(t => `
            <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-1 text-amber-400 text-sm mb-3">
                  ${'★'.repeat(t.rating)}
                </div>
                <p class="text-xs text-slate-300 italic leading-relaxed mb-4">
                  "${t.comment}"
                </p>
              </div>

              <div class="pt-4 border-t border-white/5 flex items-center gap-3">
                <img src="${t.avatar}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover bg-slate-800" />
                <div class="min-w-0">
                  <h4 class="text-xs font-bold text-white truncate">${t.name}</h4>
                  <p class="text-[10px] text-slate-400 truncate">${t.role} (${t.city})</p>
                  <p class="text-[10px] text-emerald-400 font-semibold truncate mt-0.5">Rented: ${t.vehicle}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </section>

    <!-- Large Partner Banner CTA -->
    <section class="py-16 sm:py-20 relative">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="glass-card p-8 sm:p-14 rounded-3xl border border-emerald-500/30 glow-emerald">
          <div class="badge-volt mb-3">Scale Your Mobility Business</div>
          <h2 class="text-3xl sm:text-5xl font-black text-white mb-4">
            Ready to list your vehicles?
          </h2>
          <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Upload actual photos of your bikes and cars. Get discovered by thousands of customers with zero upfront cost.
          </p>
          <button id="cta-partner-btn" class="btn-primary text-slate-950 font-extrabold text-base px-8 py-4 rounded-xl shadow-2xl">
            List Your Fleet Today →
          </button>
        </div>
      </div>
    </section>
  `;
}

/**
 * Render Header & Navigation
 */
function renderHeader() {
  const isLight = state.theme === 'light';

  return `
    <header class="sticky top-0 z-50 glass-panel border-b border-white/10 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        <!-- Brand Logo -->
        <div class="flex items-center gap-6">
          <a href="#" id="brand-logo-btn" class="flex items-center gap-2.5 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-black tracking-tight text-white font-display"> DriveMart </span>
              <span class="text-[9px] uppercase tracking-widest text-emerald-400 font-bold -mt-1">Self-Drive Hub</span>
            </div>
          </a>

          <!-- City Selector Badge -->
          <div class="hidden md:flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 text-xs">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span class="text-white font-semibold">Chhatrapati Sambhajinagar</span>
            <span class="text-[10px] text-emerald-400 font-bold ml-1">● Live</span>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
          <button id="nav-vehicles-btn" class="hover:text-emerald-400 transition-colors">Vehicles</button>
          <button id="nav-how-it-works-btn" class="hover:text-emerald-400 transition-colors">How It Works</button>
          
          <!-- SEO Quick Dropdown -->
          <div class="relative group">
            <button class="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <span>Rentals</span>
              <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
            </button>
            <div class="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-xl p-2 shadow-2xl hidden group-hover:block z-50">
              <a href="#" class="seo-nav-link block p-2 rounded-lg hover:bg-slate-800 text-xs text-white" data-slug="bike-rental-chhatrapati-sambhajinagar">
                🏍️ Bike Rental Sambhajinagar
              </a>
              <a href="#" class="seo-nav-link block p-2 rounded-lg hover:bg-slate-800 text-xs text-white" data-slug="scooty-rental-chhatrapati-sambhajinagar">
                🛵 Scooty & EV Rental Sambhajinagar
              </a>
              <a href="#" class="seo-nav-link block p-2 rounded-lg hover:bg-slate-800 text-xs text-white" data-slug="car-rental-chhatrapati-sambhajinagar">
                🚗 Self-Drive Car Rental
              </a>
              <a href="#" class="seo-nav-link block p-2 rounded-lg hover:bg-slate-800 text-xs text-white" data-slug="self-drive-suv-sambhajinagar-ellora-ajanta">
                🚙 SUV Rental for Ajanta & Ellora
              </a>
            </div>
          </div>

          <button id="nav-partner-btn" class="hover:text-emerald-400 transition-colors">List Your Bike</button>
          <button id="nav-my-bookings-btn" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <i data-lucide="ticket" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span>My Bookings</span>
          </button>
        </nav>

        <!-- Role Persona Switcher, Theme Toggle & User Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          
          <!-- Light/Dark Mode Toggle Button -->
          <button 
            id="theme-toggle-btn" 
            class="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-bold"
            title="Toggle Light / Dark Theme"
          >
            <i data-lucide="${isLight ? 'moon' : 'sun'}" class="w-4 h-4 text-amber-400"></i>
            <span class="hidden md:inline">${isLight ? 'Dark' : 'Light'}</span>
          </button>

          <!-- Role Switcher Dropdown (Customer, Partner, Admin) -->
          <div class="relative">
            <select id="role-persona-select" class="bg-slate-800 text-xs sm:text-sm text-emerald-300 font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 outline-none cursor-pointer">
              <option value="customer" ${state.currentView === 'customer' ? 'selected' : ''}>👤 Customer View</option>
              <option value="partner" ${state.currentView === 'partner' ? 'selected' : ''}>🏢 Host Dashboard</option>
              <option value="admin" ${state.currentView === 'admin' ? 'selected' : ''}>👑 Admin Super-Console</option>
            </select>
          </div>

          <button id="nav-partner-cta-btn" class="hidden sm:inline-flex btn-primary text-slate-950 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl">
            List Your Bike
          </button>
        </div>

      </div>
    </header>
  `;
}

/**
 * Render Footer Component
 */
function renderFooter() {
  return `
    <footer class="bg-slate-950 border-t border-white/10 pt-16 pb-24 sm:pb-16 text-slate-400 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          <!-- Col 1: Brand Info -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-base">
                ⚡
              </div>
              <span class="text-xl font-black text-white font-display"> DriveMart </span>
            </div>
            <p class="text-slate-400 max-w-sm leading-relaxed">
              India's Marketplace for Vehicle Rentals — connecting verified local rental fleet operators with customers across India. Launched in Chhatrapati Sambhajinagar, Maharashtra.
            </p>
          </div>

          <!-- Col 2: Marketplace Fleet -->
          <div>
            <h4 class="text-white font-bold uppercase tracking-wider mb-4">Vehicles</h4>
            <ul class="space-y-2.5">
              <li><a href="#" class="footer-cat-link hover:text-emerald-400" data-cat="bike">🏍️ Hunter 350 & Classic 350</a></li>
              <li><a href="#" class="footer-cat-link hover:text-emerald-400" data-cat="scooter">🛵 Activa 6G & Ather EVs</a></li>
              <li><a href="#" class="footer-cat-link hover:text-emerald-400" data-cat="car">🚗 Swift, i20 & Nexon EV</a></li>
              <li><a href="#" class="footer-cat-link hover:text-emerald-400" data-cat="suv">🚙 Thar 4x4, Creta & Scorpio-N</a></li>
              <li><a href="#" class="footer-cat-link hover:text-emerald-400" data-cat="van">🚐 Maruti Ertiga 7-Seater</a></li>
            </ul>
          </div>

          <!-- Col 3: SEO Popular Hubs -->
          <div>
            <h4 class="text-white font-bold uppercase tracking-wider mb-4">Sambhajinagar Hubs</h4>
            <ul class="space-y-2.5">
              <li><a href="#" class="hover:text-emerald-400">Railway Station Hub</a></li>
              <li><a href="#" class="hover:text-emerald-400">CIDCO Connaught Place</a></li>
              <li><a href="#" class="hover:text-emerald-400">MGM & Jalna Road</a></li>
              <li><a href="#" class="hover:text-emerald-400">Chikalthana Airport (IXU)</a></li>
              <li><a href="#" class="hover:text-emerald-400">Waluj & Shendra DMIC</a></li>
            </ul>
          </div>

          <!-- Col 4: For Partners & Support -->
          <div>
            <h4 class="text-white font-bold uppercase tracking-wider mb-4">Partner & Legal</h4>
            <ul class="space-y-2.5">
              <li><a href="#" id="footer-partner-link" class="hover:text-emerald-400 font-semibold text-emerald-300">Become a Rental Partner</a></li>
              <li><a href="#" class="hover:text-emerald-400">Help Center & FAQs</a></li>
              <li><a href="#" class="hover:text-emerald-400">Terms & Conditions</a></li>
              <li><a href="#" class="hover:text-emerald-400">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        <div class="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 DriveMart Technologies Pvt. Ltd. All rights reserved.</p>
          <div class="flex items-center gap-4 text-[11px]">
            <span>⚡ Made with pride for Chhatrapati Sambhajinagar, Maharashtra, India</span>
          </div>
        </div>

      </div>
    </footer>

    <!-- Sticky Mobile Bottom Navigation Bar -->
    <div class="mobile-bottom-nav">
      <button id="mob-nav-home" class="flex flex-col items-center gap-1 text-emerald-400 font-bold text-[10px]">
        <i data-lucide="home" class="w-5 h-5"></i>
        <span>Home</span>
      </button>
      <button id="mob-nav-search" class="flex flex-col items-center gap-1 text-slate-400 font-medium text-[10px]">
        <i data-lucide="search" class="w-5 h-5"></i>
        <span>Search</span>
      </button>
      <button id="mob-nav-bookings" class="flex flex-col items-center gap-1 text-slate-400 font-medium text-[10px]">
        <i data-lucide="ticket" class="w-5 h-5"></i>
        <span>My Rides</span>
      </button>
      <button id="mob-theme-toggle" class="flex flex-col items-center gap-1 text-slate-400 font-medium text-[10px]">
        <i data-lucide="${state.theme === 'light' ? 'moon' : 'sun'}" class="w-5 h-5 text-amber-400"></i>
        <span>Theme</span>
      </button>
      <button id="mob-nav-partner" class="flex flex-col items-center gap-1 text-slate-400 font-medium text-[10px]">
        <i data-lucide="briefcase" class="w-5 h-5"></i>
        <span>Host</span>
      </button>
    </div>
  `;
}

/**
 * Main App Initializer
 */
export function initApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Apply saved theme at launch
  applyTheme(state.theme);

  function render() {
    state.vehicles = refreshVehiclesData();
    let mainContent = '';

    if (state.currentView === 'customer') {
      mainContent = renderCustomerView();
    } else if (state.currentView === 'partner') {
      const partnerVehicles = state.vehicles.filter(v => v.partnerId === PARTNERS_DATA[0].id || v.ownerId === PARTNERS_DATA[0].id);
      mainContent = renderPartnerDashboard(PARTNERS_DATA[0], partnerVehicles);
    } else if (state.currentView === 'admin') {
      mainContent = renderAdminDashboard();
    } else if (state.currentView === 'seo') {
      mainContent = renderSeoPage(state.activeSeoSlug);
    }

    appContainer.innerHTML = `
      ${renderHeader()}
      <main class="flex-1">
        ${mainContent}
      </main>
      ${renderFooter()}
      <div id="modal-container"></div>
      <div id="toast-container" class="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none"></div>
    `;

    renderIcons();
    attachEventListeners();

    // If on customer view, initialize Hero Search interactions
    if (state.currentView === 'customer') {
      initHeroSearchEvents((criteria) => {
        state.searchFilters = { ...state.searchFilters, ...criteria };
        updateCatalogGrid();
      });
    }

    // If on partner view, render Chart.js analytics charts
    if (state.currentView === 'partner') {
      initPartnerCharts();
    }
  }

  function updateCatalogGrid() {
    const gridContainer = document.getElementById('vehicles-grid-container');
    const emptyState = document.getElementById('no-vehicles-found');
    if (!gridContainer) return;

    const filtered = getFilteredVehicles();
    if (filtered.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      gridContainer.innerHTML = filtered.map(renderVehicleCard).join('');
      renderIcons();
      attachCardClickListeners();
    }
  }

  function initPartnerCharts() {
    const revCtx = document.getElementById('partnerRevenueChart');
    const utilCtx = document.getElementById('partnerUtilizationChart');
    const isLight = state.theme === 'light';
    const textColor = isLight ? '#475569' : '#94A3B8';
    const gridColor = isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.05)';

    if (revCtx && window.Chart) {
      new Chart(revCtx, {
        type: 'line',
        data: {
          labels: ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar (Proj)'],
          datasets: [{
            label: 'Monthly Net Payout (₹)',
            data: [180000, 210000, 265000, 240000, 284500, 310000],
            borderColor: '#00F59B',
            backgroundColor: 'rgba(0, 245, 155, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00F59B'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: { grid: { color: gridColor }, ticks: { color: textColor } }
          }
        }
      });
    }

    if (utilCtx && window.Chart) {
      new Chart(utilCtx, {
        type: 'doughnut',
        data: {
          labels: ['Bikes (92%)', 'SUVs & 4x4 (88%)', 'Hatchbacks (78%)', 'EV Scooters (84%)'],
          datasets: [{
            data: [35, 30, 20, 15],
            backgroundColor: ['#00F59B', '#10B981', '#3B82F6', '#F59E0B'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } }
          }
        }
      });
    }
  }

  function attachCardClickListeners() {
    // Quick View / View Details buttons
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vehicle = state.vehicles.find(v => v.id === btn.dataset.vehicleId);
        if (vehicle) openVehicleDetailModal(vehicle);
      });
    });

    // Book Vehicle buttons
    document.querySelectorAll('.book-vehicle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vehicle = state.vehicles.find(v => v.id === btn.dataset.vehicleId);
        if (vehicle) startBookingFlow(vehicle);
      });
    });
  }

  function attachEventListeners() {
    // Theme Toggle Handlers
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      toggleTheme();
      render();
    });

    document.getElementById('mob-theme-toggle')?.addEventListener('click', () => {
      toggleTheme();
      render();
    });

    // Brand Logo -> Go Home
    document.getElementById('brand-logo-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentView = 'customer';
      state.searchFilters.category = 'all';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Persona Selector Dropdown
    document.getElementById('role-persona-select')?.addEventListener('change', (e) => {
      state.currentView = e.target.value;
      render();
      showToast(`Switched view to ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });

    // Navigation Links
    document.getElementById('nav-vehicles-btn')?.addEventListener('click', () => {
      state.currentView = 'customer';
      render();
      document.getElementById('vehicle-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('nav-how-it-works-btn')?.addEventListener('click', () => {
      state.currentView = 'customer';
      render();
      window.scrollTo({ top: 900, behavior: 'smooth' });
    });

    document.getElementById('nav-partner-btn')?.addEventListener('click', () => {
      openAddVehicleModal();
    });

    document.getElementById('nav-partner-cta-btn')?.addEventListener('click', () => {
      openAddVehicleModal();
    });

    document.getElementById('nav-my-bookings-btn')?.addEventListener('click', () => {
      openMyBookingsModal();
    });

    // City Section Explore Button
    document.getElementById('city-explore-btn')?.addEventListener('click', () => {
      document.getElementById('vehicle-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Footer Category Links
    document.querySelectorAll('.footer-cat-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.dataset.cat;
        state.currentView = 'customer';
        state.searchFilters.category = cat;
        render();
        document.getElementById('vehicle-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        showToast(`Filtered by ${cat.toUpperCase()}`, 'info');
      });
    });

    // SEO Nav links
    document.querySelectorAll('.seo-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        state.currentView = 'seo';
        state.activeSeoSlug = link.dataset.slug;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Category Cards click in home
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.dataset.category;
        state.searchFilters.category = cat;
        render();
        document.getElementById('vehicle-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        showToast(`Filtered by ${cat.toUpperCase()}`, 'info');
      });
    });

    // Catalog Filter Controls
    const catalogSearchInput = document.getElementById('catalog-search-input');
    if (catalogSearchInput) {
      catalogSearchInput.value = state.searchFilters.query;
      catalogSearchInput.addEventListener('input', (e) => {
        state.searchFilters.query = e.target.value;
        updateCatalogGrid();
      });
    }

    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) {
      sortSelect.value = state.searchFilters.sortBy;
      sortSelect.addEventListener('change', (e) => {
        state.searchFilters.sortBy = e.target.value;
        updateCatalogGrid();
      });
    }

    // Category pills in catalog
    document.querySelectorAll('.catalog-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.searchFilters.category = btn.dataset.filterCategory;
        render();
        document.getElementById('vehicle-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Secondary filters
    document.getElementById('filter-transmission')?.addEventListener('change', (e) => {
      state.searchFilters.transmission = e.target.value;
      updateCatalogGrid();
    });

    document.getElementById('filter-fuel')?.addEventListener('change', (e) => {
      state.searchFilters.fuel = e.target.value;
      updateCatalogGrid();
    });

    document.getElementById('filter-location')?.addEventListener('change', (e) => {
      state.searchFilters.location = e.target.value;
      updateCatalogGrid();
    });

    const priceSlider = document.getElementById('filter-price-slider');
    const priceVal = document.getElementById('price-range-val');
    if (priceSlider) {
      priceSlider.value = state.searchFilters.maxPrice;
      priceSlider.addEventListener('input', (e) => {
        state.searchFilters.maxPrice = Number(e.target.value);
        if (priceVal) priceVal.textContent = `₹${e.target.value}/day`;
        updateCatalogGrid();
      });
    }

    document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
      state.searchFilters = {
        query: '',
        category: 'all',
        transmission: 'all',
        fuel: 'all',
        location: 'all',
        maxPrice: 6000,
        sortBy: 'recommended',
        pickupDate: state.searchFilters.pickupDate,
        returnDate: state.searchFilters.returnDate,
        deliveryMode: 'self'
      };
      render();
    });

    // Attach card click handlers
    attachCardClickListeners();

    // Partner Portal tab switching
    document.querySelectorAll('.partner-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.partnerTab;
        document.querySelectorAll('.partner-tab-btn').forEach(t => {
          t.classList.remove('active', 'bg-emerald-500', 'text-slate-950', 'shadow-md');
          t.classList.add('text-slate-300');
        });
        tab.classList.add('active', 'bg-emerald-500', 'text-slate-950', 'shadow-md');
        tab.classList.remove('text-slate-300');

        document.querySelectorAll('.partner-tab-view').forEach(view => view.classList.add('hidden'));
        document.getElementById(`partner-tab-content-${targetTab}`)?.classList.remove('hidden');
      });
    });

    document.getElementById('partner-switch-customer-btn')?.addEventListener('click', () => {
      state.currentView = 'customer';
      render();
    });

    document.getElementById('admin-switch-customer-btn')?.addEventListener('click', () => {
      state.currentView = 'customer';
      render();
    });

    document.getElementById('partner-demo-preview-btn')?.addEventListener('click', () => {
      state.currentView = 'partner';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('become-partner-btn')?.addEventListener('click', () => openAddVehicleModal());
    document.getElementById('cta-partner-btn')?.addEventListener('click', () => openAddVehicleModal());
    document.getElementById('footer-partner-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      openAddVehicleModal();
    });

    // Partner Dashboard Action Buttons
    document.getElementById('add-vehicle-modal-btn')?.addEventListener('click', () => openAddVehicleModal());
    document.getElementById('add-vehicle-btn-2')?.addEventListener('click', () => openAddVehicleModal());

    // Partner Manage Photos & Edit Vehicle Buttons
    document.querySelectorAll('.partner-manage-photos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vehicle = state.vehicles.find(v => v.id === btn.dataset.vehicleId);
        if (vehicle) openManagePhotosModal(vehicle);
      });
    });

    document.querySelectorAll('.partner-edit-vehicle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vehicle = state.vehicles.find(v => v.id === btn.dataset.vehicleId);
        if (vehicle) openEditVehicleModal(vehicle);
      });
    });

    document.querySelectorAll('.partner-delete-vehicle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vehicleId = btn.dataset.vehicleId;
        if (confirm(`Are you sure you want to delete listing ${vehicleId}? All associated uploaded photos will be permanently removed.`)) {
          deleteVehicleListing(vehicleId);
          showToast(`🗑️ Listing ${vehicleId} deleted successfully.`, 'info');
          render();
        }
      });
    });

    document.getElementById('instant-payout-btn')?.addEventListener('click', () => {
      showToast('⚡ Instant payout of ₹64,280 initiated to HDFC Bank A/C ***8812! Expected credit in 15 mins.', 'success');
    });

    // Admin Verification Actions
    document.querySelectorAll('.admin-verify-photos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vehicleId = btn.dataset.vehicleId;
        updateVehicleListing(vehicleId, { photoStatus: 'verified' });
        showToast(`✓ Photos for ${vehicleId} approved! Trust badge awarded.`, 'success');
        render();
      });
    });

    document.querySelectorAll('.admin-reject-photos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vehicleId = btn.dataset.vehicleId;
        updateVehicleListing(vehicleId, { 
          photoStatus: 'rejected',
          rejectionReason: 'Photo verification failed. Please upload clear photos of the actual vehicle.'
        });
        showToast(`⚠️ Photos rejected for ${vehicleId}. Feedback sent to owner.`, 'error');
        render();
      });
    });

    document.querySelectorAll('.admin-view-vehicle-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vehicle = state.vehicles.find(v => v.id === btn.dataset.vehicleId);
        if (vehicle) openVehicleDetailModal(vehicle);
      });
    });

    // Mobile Bottom Nav actions
    document.getElementById('mob-nav-home')?.addEventListener('click', () => {
      state.currentView = 'customer';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('mob-nav-search')?.addEventListener('click', () => {
      state.currentView = 'customer';
      render();
      document.getElementById('catalog-search-input')?.focus();
      document.getElementById('vehicle-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('mob-nav-bookings')?.addEventListener('click', () => openMyBookingsModal());
    document.getElementById('mob-nav-partner')?.addEventListener('click', () => {
      state.currentView = 'partner';
      render();
    });
  }

  /**
   * Interactive Vehicle Detail Modal with 5-View Gallery & Lightbox
   */
  function openVehicleDetailModal(vehicle) {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = renderVehicleDetailModal(vehicle);
    renderIcons();

    let photos = getVehiclePhotos(vehicle);

    let currentIndex = 0;
    const mainImg = document.getElementById('gallery-main-image');
    const labelEl = document.getElementById('gallery-active-label');
    const thumbBtns = document.querySelectorAll('.gallery-thumb-btn');

    function setActivePhoto(idx) {
      if (idx < 0) idx = photos.length - 1;
      if (idx >= photos.length) idx = 0;
      currentIndex = idx;
      const target = photos[currentIndex];

      if (mainImg) {
        mainImg.style.opacity = '0.4';
        setTimeout(() => {
          mainImg.src = target.url;
          mainImg.alt = `${vehicle.name} - ${target.label}`;
          mainImg.style.opacity = '1';
        }, 120);
      }

      if (labelEl) {
        labelEl.textContent = target.label;
      }

      thumbBtns.forEach((btn, i) => {
        if (i === currentIndex) {
          btn.classList.add('border-emerald-400', 'ring-2', 'ring-emerald-500/20');
          btn.classList.remove('border-white/10');
        } else {
          btn.classList.remove('border-emerald-400', 'ring-2', 'ring-emerald-500/20');
          btn.classList.add('border-white/10');
        }
      });
    }

    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.photoIndex);
        setActivePhoto(idx);
      });
    });

    document.getElementById('gallery-prev-btn')?.addEventListener('click', () => {
      setActivePhoto(currentIndex - 1);
    });

    document.getElementById('gallery-next-btn')?.addEventListener('click', () => {
      setActivePhoto(currentIndex + 1);
    });

    // Fullscreen Lightbox Zoom
    document.getElementById('gallery-zoom-btn')?.addEventListener('click', () => {
      openFullscreenLightbox(photos, currentIndex, vehicle.name);
    });

    document.getElementById('close-detail-modal')?.addEventListener('click', () => {
      modalContainer.innerHTML = '';
    });

    document.getElementById('modal-proceed-booking-btn')?.addEventListener('click', () => {
      modalContainer.innerHTML = '';
      startBookingFlow(vehicle);
    });
  }

  /**
   * Fullscreen Lightbox Image Viewer
   */
  function openFullscreenLightbox(photos, startIndex = 0, title = 'Vehicle Photo') {
    const lightbox = document.createElement('div');
    lightbox.id = 'torqo-lightbox';
    lightbox.className = 'fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-between p-4 sm:p-8 backdrop-blur-xl';
    
    let activeIdx = startIndex;

    function renderLightbox() {
      const ph = photos[activeIdx];
      lightbox.innerHTML = `
        <div class="w-full flex items-center justify-between text-white pb-4 border-b border-white/10">
          <div class="flex items-center gap-2">
            <span class="badge-volt text-xs">${ph.label}</span>
            <span class="text-sm font-bold text-white">${title}</span>
            <span class="text-xs text-slate-400">(${activeIdx + 1} of ${photos.length})</span>
          </div>
          <button id="close-lightbox-btn" class="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>

        <div class="relative flex-1 flex items-center justify-center w-full max-h-[80vh] my-4">
          <img src="${ph.url}" alt="${ph.label}" class="max-w-full max-h-full object-contain rounded-xl shadow-2xl"/>
          
          <button id="lightbox-prev-btn" class="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors border border-white/10">
            <i data-lucide="chevron-left" class="w-6 h-6"></i>
          </button>
          <button id="lightbox-next-btn" class="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors border border-white/10">
            <i data-lucide="chevron-right" class="w-6 h-6"></i>
          </button>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto max-w-xl pb-2">
          ${photos.map((p, i) => `
            <button class="w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${i === activeIdx ? 'border-emerald-400 scale-105' : 'border-white/20 opacity-60'}" data-idx="${i}">
              <img src="${p.url}" alt="${p.label}" class="w-full h-full object-cover"/>
            </button>
          `).join('')}
        </div>
      `;
      renderIcons();

      lightbox.querySelector('#close-lightbox-btn')?.addEventListener('click', () => lightbox.remove());
      lightbox.querySelector('#lightbox-prev-btn')?.addEventListener('click', () => {
        activeIdx = (activeIdx - 1 + photos.length) % photos.length;
        renderLightbox();
      });
      lightbox.querySelector('#lightbox-next-btn')?.addEventListener('click', () => {
        activeIdx = (activeIdx + 1) % photos.length;
        renderLightbox();
      });

      lightbox.querySelectorAll('[data-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          activeIdx = Number(btn.dataset.idx);
          renderLightbox();
        });
      });
    }

    renderLightbox();
    document.body.appendChild(lightbox);
  }

  /**
   * ADD BIKE MODAL WITH 5-VIEW MANDATORY PHOTO UPLOAD MATRIX
   */
  function openAddVehicleModal() {
    const modalContainer = document.getElementById('modal-container');
    
    // In-memory slot state for newly uploaded photos
    const uploadedSlots = {
      front: null,
      left: null,
      right: null,
      rear: null,
      odometer: null
    };

    let primarySlotType = 'front';

    function renderModalUI() {
      const allRequiredFilled = PHOTO_SLOTS_CONFIG.every(slot => uploadedSlots[slot.type] !== null);
      const uploadedCount = Object.values(uploadedSlots).filter(v => v !== null).length;

      modalContainer.innerHTML = `
        <div id="add-vehicle-modal" class="modal-backdrop active">
          <div class="modal-content relative p-6 sm:p-8 max-w-3xl">
            <button id="close-add-vehicle" class="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors z-20">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>

            <!-- Header -->
            <div class="mb-6 pb-4 border-b border-white/10">
              <div class="flex items-center gap-2">
                <span class="badge-volt text-xs">Owner Listing Portal</span>
                <span class="text-xs text-emerald-400 font-bold">5 Mandatory Photos Required</span>
              </div>
              <h2 class="text-2xl font-extrabold text-white mt-1">List Your Bike on DriveMart</h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Join our Sambhajinagar fleet. Upload clear photos of your actual bike to receive verified customer bookings.
              </p>
            </div>

            <form id="add-vehicle-form" class="space-y-6 text-xs">
              
              <!-- Vehicle Basic Specs -->
              <div>
                <h3 class="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <i data-lucide="info" class="w-4 h-4 text-emerald-400"></i>
                  <span>1. Vehicle Information</span>
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Make & Brand</label>
                    <input type="text" id="new-v-brand" required placeholder="e.g. Royal Enfield, Honda, Yamaha" class="custom-input" />
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Model Name</label>
                    <input type="text" id="new-v-model" required placeholder="e.g. Hunter 350, Activa 6G" class="custom-input" />
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Variant / Color</label>
                    <input type="text" id="new-v-variant" required placeholder="e.g. Dapper Ash, Smart Key" class="custom-input" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3">
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Category</label>
                    <select id="new-v-cat" class="custom-input">
                      <option value="bike">Bike (Motorcycle)</option>
                      <option value="scooter">Scooter / EV</option>
                      <option value="car">Car (Hatchback/Sedan)</option>
                      <option value="suv">SUV / 4x4</option>
                      <option value="van">Van / 7-Seater</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Model Year</label>
                    <input type="number" id="new-v-year" required min="2018" max="2026" value="2024" class="custom-input" />
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Daily Rent (₹/day)</label>
                    <input type="number" id="new-v-price" required min="100" max="20000" placeholder="999" class="custom-input" />
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Refundable Deposit (₹)</label>
                    <input type="number" id="new-v-deposit" required min="500" max="20000" placeholder="1500" class="custom-input" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Transmission</label>
                    <select id="new-v-trans" class="custom-input">
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic / CVT</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Fuel Type</label>
                    <select id="new-v-fuel" class="custom-input">
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric (EV)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-300 mb-1">Pickup Hub</label>
                    <select id="new-v-hub" class="custom-input">
                      ${CITY_HUBS.map(h => `<option value="${h.id}">${h.name}</option>`).join('')}
                    </select>
                  </div>
                </div>
              </div>

              <!-- PHOTO UPLOAD SECTION (MANDATORY 5 ACTUAL PHOTOS) -->
              <div class="pt-2 border-t border-white/10">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
                  <div>
                    <h3 class="text-sm font-bold text-white flex items-center gap-2">
                      <i data-lucide="camera" class="w-4 h-4 text-emerald-400"></i>
                      <span>2. Upload Your Bike Photos (5 Required Views)</span>
                    </h3>
                    <p class="text-slate-400 text-[11px]">
                      Add clear photos of the actual bike you are listing. These photos will be shown to customers.
                    </p>
                  </div>
                  <span class="text-xs font-bold px-3 py-1 rounded-xl ${allRequiredFilled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}">
                    ${uploadedCount} / 5 Views Uploaded
                  </span>
                </div>

                <!-- Guidelines Alert Box -->
                <div class="bg-slate-900/90 p-3 rounded-xl border border-white/5 text-[11px] text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  <div class="flex items-center gap-1.5 text-emerald-400">
                    <span>✓ Take photos of the actual bike you're listing.</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-emerald-400">
                    <span>✓ Make sure the entire bike is visible.</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-emerald-400">
                    <span>✓ Use good natural lighting.</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-amber-300">
                    <span>⚠️ Avoid blurry, stock, or heavily edited photos.</span>
                  </div>
                </div>

                <!-- 5 Slot Upload Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  ${PHOTO_SLOTS_CONFIG.map(slot => {
                    const dataUrl = uploadedSlots[slot.type];
                    const isPrimary = primarySlotType === slot.type;
                    
                    return `
                      <div class="glass-panel p-2.5 rounded-xl border ${dataUrl ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10'} flex flex-col justify-between space-y-2">
                        
                        <!-- Header / Label -->
                        <div class="flex items-center justify-between text-[10px]">
                          <span class="font-bold text-white">${slot.label}</span>
                          ${dataUrl ? '<span class="text-emerald-400 font-bold">✓ Ready</span>' : '<span class="text-red-400 font-bold">*Req</span>'}
                        </div>

                        <!-- Dropzone / Image Preview Stage -->
                        <div class="relative h-28 rounded-lg overflow-hidden bg-slate-950 border border-dashed ${dataUrl ? 'border-transparent' : 'border-white/20'} flex flex-col items-center justify-center p-2 text-center group cursor-pointer">
                          ${dataUrl ? `
                            <img src="${dataUrl}" alt="${slot.label}" class="w-full h-full object-cover"/>
                            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                              <label class="px-2 py-1 bg-emerald-500 text-slate-950 font-bold rounded text-[10px] cursor-pointer">
                                Replace
                                <input type="file" class="hidden slot-file-input" data-slot="${slot.type}" accept="image/jpeg,image/png,image/webp,image/jpg" />
                              </label>
                              <button type="button" class="remove-slot-photo-btn px-2 py-1 bg-red-500/80 text-white rounded text-[10px]" data-slot="${slot.type}">
                                Remove
                              </button>
                            </div>
                          ` : `
                            <label class="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-emerald-400 transition-colors">
                              <i data-lucide="camera" class="w-6 h-6 mb-1"></i>
                              <span class="text-[10px] font-semibold">Upload ${slot.label}</span>
                              <span class="text-[8px] text-slate-500">Tap / Camera</span>
                              <input type="file" class="hidden slot-file-input" data-slot="${slot.type}" accept="image/jpeg,image/png,image/webp,image/jpg" />
                            </label>
                          `}
                        </div>

                        <!-- Primary Cover Selector -->
                        ${dataUrl ? `
                          <label class="flex items-center gap-1.5 text-[10px] text-slate-300 cursor-pointer pt-1 border-t border-white/5">
                            <input type="radio" name="primary-cover-slot" value="${slot.type}" ${isPrimary ? 'checked' : ''} class="accent-emerald-500 primary-slot-radio" />
                            <span>${isPrimary ? '★ Cover Photo' : 'Set as Cover'}</span>
                          </label>
                        ` : `
                          <span class="text-[9px] text-slate-500 truncate">${slot.description}</span>
                        `}

                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Submit Button -->
              <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div class="text-[11px] text-slate-400">
                  ${allRequiredFilled 
                    ? '✓ All 5 photo views ready. Your listing will be submitted to Admin Verification Queue.' 
                    : `⚠️ Please upload all 5 required photos before submitting (${5 - uploadedCount} remaining).`}
                </div>

                <button 
                  type="submit" 
                  id="submit-new-vehicle-btn" 
                  class="btn-primary text-slate-950 font-extrabold px-8 py-3 rounded-xl text-sm shadow-xl ${allRequiredFilled ? '' : 'opacity-50 cursor-not-allowed'}"
                  ${allRequiredFilled ? '' : 'disabled'}
                >
                  Publish Bike Listing →
                </button>
              </div>

            </form>
          </div>
        </div>
      `;

      renderIcons();

      // Close handler
      document.getElementById('close-add-vehicle')?.addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });

      // File input change handlers
      document.querySelectorAll('.slot-file-input').forEach(input => {
        input.addEventListener('change', async (e) => {
          const file = e.target.files?.[0];
          const slotType = input.dataset.slot;
          if (file && slotType) {
            try {
              showToast(`Compressing & preparing ${slotType} view...`, 'info');
              const compressedDataUrl = await compressAndReadFile(file);
              uploadedSlots[slotType] = compressedDataUrl;
              renderModalUI();
              showToast(`✓ ${slotType.toUpperCase()} photo added successfully!`, 'success');
            } catch (err) {
              showToast(typeof err === 'string' ? err : 'Failed to upload photo', 'error');
            }
          }
        });
      });

      // Remove photo button handlers
      document.querySelectorAll('.remove-slot-photo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const slotType = btn.dataset.slot;
          if (slotType) {
            uploadedSlots[slotType] = null;
            renderModalUI();
          }
        });
      });

      // Cover radio handlers
      document.querySelectorAll('.primary-slot-radio').forEach(radio => {
        radio.addEventListener('change', (e) => {
          primarySlotType = e.target.value;
          renderModalUI();
        });
      });

      // Form submit handler
      document.getElementById('add-vehicle-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!allRequiredFilled) {
          showToast('⚠️ Please upload all 5 required photo views before publishing.', 'error');
          return;
        }

        const brand = document.getElementById('new-v-brand').value.trim();
        const model = document.getElementById('new-v-model').value.trim();
        const variant = document.getElementById('new-v-variant').value.trim();
        const category = document.getElementById('new-v-cat').value;
        const year = Number(document.getElementById('new-v-year').value);
        const pricePerDay = Number(document.getElementById('new-v-price').value);
        const securityDeposit = Number(document.getElementById('new-v-deposit').value);
        const transmission = document.getElementById('new-v-trans').value;
        const fuelType = document.getElementById('new-v-fuel').value;
        const pickupHubId = document.getElementById('new-v-hub').value;

        const hubObj = CITY_HUBS.find(h => h.id === pickupHubId) || CITY_HUBS[0];
        const uniqueListingId = `TORQO-BIKE-${Math.floor(10000 + Math.random() * 90000)}`;

        // Build 5 isolated photo objects
        const photosArray = PHOTO_SLOTS_CONFIG.map(slot => ({
          id: `photo-${uniqueListingId}-${slot.type}`,
          type: slot.type,
          label: slot.label,
          url: uploadedSlots[slot.type],
          isPrimary: primarySlotType === slot.type,
          uploadedAt: new Date().toISOString()
        }));

        const primaryPhotoObj = photosArray.find(p => p.isPrimary) || photosArray[0];

        const newListing = {
          id: uniqueListingId,
          ownerId: PARTNERS_DATA[0].id,
          brand,
          model,
          variant,
          name: `${brand} ${model} (${variant})`,
          category,
          subCategory: 'Owner Verified',
          year,
          fuelType,
          transmission,
          seats: category === 'bike' || category === 'scooter' ? 2 : (category === 'suv' ? 7 : 5),
          pricePerDay,
          hourlyPrice: Math.round(pricePerDay / 12),
          rating: 5.0,
          reviewsCount: 1,
          photoStatus: 'pending', // Awaiting admin photo verification
          primaryPhoto: primaryPhotoObj.url,
          photos: photosArray,
          engine: 'BS6 OBD-2 Compliant',
          mileage: category === 'bike' ? '42.0 km/l' : '20.0 km/l',
          speedLimit: '100 km/h',
          securityDeposit,
          freeKmPerDay: 250,
          extraKmCharge: 5,
          location: `${hubObj.name}, Sambhajinagar`,
          pickupHubId: hubObj.id,
          partnerId: PARTNERS_DATA[0].id,
          partnerName: PARTNERS_DATA[0].name,
          partnerRating: 4.9,
          partnerVerified: true,
          features: ['100% Actual Owner Photos', 'Free ISI Certified Helmet Included', '24/7 Roadside Assistance', 'Clean & Sanitized Vehicle'],
          badge: 'New Owner Listing',
          isAvailable: true,
          tripsCompleted: 0,
          createdAt: new Date().toISOString()
        };

        addNewVehicleListing(newListing);
        modalContainer.innerHTML = '';
        showToast(`🎉 ${newListing.name} listed with 5 actual photos! Status: Pending Admin Verification.`, 'success');
        render();
      });
    }

    renderModalUI();
  }

  /**
   * MANAGE PHOTOS MODAL (Edit / Replace photos for an existing bike)
   */
  function openManagePhotosModal(vehicle) {
    const modalContainer = document.getElementById('modal-container');
    let vehiclePhotos = Array.isArray(vehicle.photos) ? [...vehicle.photos] : [];

    function renderManageUI() {
      modalContainer.innerHTML = `
        <div id="manage-photos-modal" class="modal-backdrop active">
          <div class="modal-content relative p-6 sm:p-8 max-w-2xl">
            <button id="close-manage-photos" class="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors z-20">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>

            <div class="mb-6 pb-4 border-b border-white/10">
              <div class="flex items-center gap-2">
                <span class="badge-volt text-xs">Photo Management</span>
                <span class="text-xs font-mono text-emerald-400">${vehicle.id}</span>
              </div>
              <h2 class="text-xl font-extrabold text-white mt-1">Manage Actual Photos: ${vehicle.name}</h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Replace old photos with fresh shots, update odometer reading, or change the primary cover photo.
              </p>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${vehiclePhotos.map((ph, idx) => `
                  <div class="glass-panel p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3">
                    <img src="${ph.url}" alt="${ph.label}" class="w-20 h-16 object-cover rounded-lg bg-slate-950 border border-white/10 shrink-0"/>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-white text-xs">${ph.label}</span>
                        ${ph.isPrimary ? '<span class="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">PRIMARY</span>' : ''}
                      </div>
                      <span class="text-[10px] text-slate-400 block mt-0.5">${ph.type.toUpperCase()}</span>
                      
                      <div class="flex items-center gap-2 mt-2">
                        <label class="text-[10px] font-semibold text-emerald-400 hover:underline cursor-pointer">
                          Replace
                          <input type="file" class="hidden replace-existing-photo-input" data-index="${idx}" accept="image/jpeg,image/png,image/webp,image/jpg" />
                        </label>
                        ${!ph.isPrimary ? `
                          <button class="set-primary-photo-btn text-[10px] text-slate-300 hover:text-white" data-index="${idx}">
                            Set Primary
                          </button>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button id="save-photos-modal-btn" class="btn-primary text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs">
                  Save Changes ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      renderIcons();

      document.getElementById('close-manage-photos')?.addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });

      document.querySelectorAll('.replace-existing-photo-input').forEach(input => {
        input.addEventListener('change', async (e) => {
          const file = e.target.files?.[0];
          const idx = Number(input.dataset.index);
          if (file) {
            try {
              const newUrl = await compressAndReadFile(file);
              vehiclePhotos[idx].url = newUrl;
              vehiclePhotos[idx].uploadedAt = new Date().toISOString();
              renderManageUI();
              showToast(`✓ Photo ${vehiclePhotos[idx].label} updated!`, 'success');
            } catch (err) {
              showToast('Error uploading photo', 'error');
            }
          }
        });
      });

      document.querySelectorAll('.set-primary-photo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.index);
          vehiclePhotos.forEach((p, i) => {
            p.isPrimary = (i === idx);
          });
          renderManageUI();
        });
      });

      document.getElementById('save-photos-modal-btn')?.addEventListener('click', () => {
        const primary = vehiclePhotos.find(p => p.isPrimary) || vehiclePhotos[0];
        updateVehicleListing(vehicle.id, {
          photos: vehiclePhotos,
          primaryPhoto: primary.url,
          photoStatus: 'verified'
        });
        modalContainer.innerHTML = '';
        showToast('✓ Photos updated and saved successfully!', 'success');
        render();
      });
    }

    renderManageUI();
  }

  /**
   * EDIT VEHICLE DETAILS MODAL (Edit rates without touching photos)
   */
  function openEditVehicleModal(vehicle) {
    const modalContainer = document.getElementById('modal-container');
    
    modalContainer.innerHTML = `
      <div id="edit-vehicle-modal" class="modal-backdrop active">
        <div class="modal-content relative p-6 sm:p-8 max-w-xl">
          <button id="close-edit-vehicle" class="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <div class="mb-6">
            <span class="badge-volt text-xs mb-2">Edit Listing</span>
            <h2 class="text-xl font-bold text-white">${vehicle.brand} ${vehicle.model}</h2>
            <p class="text-xs text-slate-400 mt-1">Update rental pricing and availability without resetting photos</p>
          </div>

          <form id="edit-vehicle-form" class="space-y-4 text-xs">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-300 mb-1">Daily Rent Price (₹/day)</label>
                <input type="number" id="edit-v-price" required value="${vehicle.pricePerDay}" class="custom-input" />
              </div>
              <div>
                <label class="block font-semibold text-slate-300 mb-1">Security Deposit (₹)</label>
                <input type="number" id="edit-v-deposit" required value="${vehicle.securityDeposit}" class="custom-input" />
              </div>
              <div>
                <label class="block font-semibold text-slate-300 mb-1">Free km per Day</label>
                <input type="number" id="edit-v-km" required value="${vehicle.freeKmPerDay}" class="custom-input" />
              </div>
              <div>
                <label class="block font-semibold text-slate-300 mb-1">Availability</label>
                <select id="edit-v-avail" class="custom-input">
                  <option value="true" ${vehicle.isAvailable ? 'selected' : ''}>Available for Rent</option>
                  <option value="false" ${!vehicle.isAvailable ? 'selected' : ''}>On Trip / Maintenance</option>
                </select>
              </div>
            </div>

            <button type="submit" class="w-full btn-primary text-slate-950 font-bold py-3 rounded-xl text-sm shadow-xl">
              Save Listing Details →
            </button>
          </form>
        </div>
      </div>
    `;

    renderIcons();

    document.getElementById('close-edit-vehicle')?.addEventListener('click', () => {
      modalContainer.innerHTML = '';
    });

    document.getElementById('edit-vehicle-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const pricePerDay = Number(document.getElementById('edit-v-price').value);
      const securityDeposit = Number(document.getElementById('edit-v-deposit').value);
      const freeKmPerDay = Number(document.getElementById('edit-v-km').value);
      const isAvailable = document.getElementById('edit-v-avail').value === 'true';

      updateVehicleListing(vehicle.id, {
        pricePerDay,
        securityDeposit,
        freeKmPerDay,
        isAvailable
      });

      modalContainer.innerHTML = '';
      showToast(`✓ Updated details for ${vehicle.name}`, 'success');
      render();
    });
  }

  /**
   * My Bookings Drawer
   */
  function openMyBookingsModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
      <div id="my-bookings-modal" class="modal-backdrop active">
        <div class="modal-content relative p-6 sm:p-8 max-w-xl">
          <button id="close-my-bookings" class="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <i data-lucide="ticket" class="w-5 h-5"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">My Active & Past Bookings</h2>
              <p class="text-xs text-slate-400">Manage reservations, directions, and invoices</p>
            </div>
          </div>

          <div class="space-y-4">
            ${state.userBookings.map(b => `
              <div class="glass-panel p-4 rounded-xl border border-white/10 space-y-3 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-mono text-emerald-400 font-bold">${b.bookingId}</span>
                  <span class="badge-volt text-[10px]">${b.status}</span>
                </div>

                <div class="flex items-center gap-3">
                  <img src="${getVehiclePrimaryPhoto(b.vehicle)}" alt="${b.vehicle.name}" class="w-14 h-10 object-cover rounded-lg bg-slate-950"/>
                  <div>
                    <h4 class="text-sm font-bold text-white">${b.vehicle.name}</h4>
                    <p class="text-slate-400">${b.pickupDate} to ${b.returnDate}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-white/5">
                  <span class="text-slate-400">Total: <strong class="text-white">₹${b.grandTotal.toLocaleString('en-IN')}</strong></span>
                  <button class="view-booking-receipt-btn btn-secondary px-3 py-1 text-xs font-semibold" data-id="${b.bookingId}">
                    View Receipt
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    renderIcons();

    document.getElementById('close-my-bookings')?.addEventListener('click', () => {
      modalContainer.innerHTML = '';
    });

    document.querySelectorAll('.view-booking-receipt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const booking = state.userBookings.find(b => b.bookingId === btn.dataset.id);
        if (booking) {
          modalContainer.innerHTML = `
            <div class="modal-backdrop active">
              <div class="modal-content relative p-6 max-w-xl">
                <button id="close-single-receipt" class="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400">✕</button>
                ${renderBookingSuccess(booking)}
              </div>
            </div>
          `;
          renderIcons();
          document.getElementById('close-single-receipt')?.addEventListener('click', () => {
            modalContainer.innerHTML = '';
          });
          document.getElementById('finish-booking-btn')?.addEventListener('click', () => {
            modalContainer.innerHTML = '';
          });
        }
      });
    });
  }

  /**
   * 4-Step Booking Workflow
   */
  function startBookingFlow(vehicle) {
    state.activeBooking.vehicleId = vehicle.id;
    state.activeBooking.step = 1;
    state.activeBooking.pickupDate = state.searchFilters.pickupDate;
    state.activeBooking.returnDate = state.searchFilters.returnDate;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = renderBookingModal(vehicle, state.activeBooking);
    renderIcons();

    function updateStepUI() {
      const stepContent = document.getElementById('booking-step-content');
      if (!stepContent) return;

      for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`step-dot-${i}`);
        const line = document.getElementById(`step-line-${i}`);
        if (dot) {
          dot.className = `step-dot ${i === state.activeBooking.step ? 'active' : (i < state.activeBooking.step ? 'completed' : '')}`;
        }
        if (line) {
          line.className = `step-line ${i < state.activeBooking.step ? 'active' : ''}`;
        }
      }

      if (state.activeBooking.step === 1) {
        stepContent.innerHTML = renderBookingStep1(vehicle, state.activeBooking);
        renderIcons();

        const handoverRadios = document.querySelectorAll('input[name="handover-mode"]');
        const doorstepBox = document.getElementById('doorstep-address-box');
        handoverRadios.forEach(radio => {
          radio.addEventListener('change', (e) => {
            state.activeBooking.handoverMode = e.target.value;
            if (doorstepBox) {
              doorstepBox.classList.toggle('hidden', e.target.value !== 'doorstep');
            }
          });
        });

        document.getElementById('step-1-next-btn')?.addEventListener('click', () => {
          state.activeBooking.pickupDate = document.getElementById('book-pickup-date')?.value || state.activeBooking.pickupDate;
          state.activeBooking.returnDate = document.getElementById('book-return-date')?.value || state.activeBooking.returnDate;
          if (state.activeBooking.handoverMode === 'doorstep') {
            state.activeBooking.deliveryAddress = document.getElementById('doorstep-address-input')?.value || '';
          }
          state.activeBooking.step = 2;
          updateStepUI();
        });

      } else if (state.activeBooking.step === 2) {
        stepContent.innerHTML = renderBookingStep2(vehicle, state.activeBooking);
        renderIcons();

        document.getElementById('step-2-back-btn')?.addEventListener('click', () => {
          state.activeBooking.step = 1;
          updateStepUI();
        });

        document.getElementById('step-2-next-btn')?.addEventListener('click', () => {
          state.activeBooking.addons = {
            pillionHelmet: document.getElementById('addon-pillion-helmet')?.checked || false,
            zeroDep: document.getElementById('addon-insurance')?.checked || false,
            phoneMount: document.getElementById('addon-mount')?.checked || false
          };
          state.activeBooking.step = 3;
          updateStepUI();
        });

      } else if (state.activeBooking.step === 3) {
        stepContent.innerHTML = renderBookingStep3(vehicle, state.activeBooking);
        renderIcons();

        document.getElementById('step-3-back-btn')?.addEventListener('click', () => {
          state.activeBooking.step = 2;
          updateStepUI();
        });

        document.getElementById('step-3-next-btn')?.addEventListener('click', () => {
          state.activeBooking.kyc = {
            name: document.getElementById('kyc-name')?.value || 'Avishkar Patil',
            phone: document.getElementById('kyc-phone')?.value || '+91 98220 98765',
            email: document.getElementById('kyc-email')?.value || 'rider@drivemart.in',
            dlNumber: document.getElementById('kyc-dl')?.value || 'MH20 20210088912'
          };
          state.activeBooking.step = 4;
          updateStepUI();
        });

      } else if (state.activeBooking.step === 4) {
        stepContent.innerHTML = renderBookingStep4(vehicle, state.activeBooking);
        renderIcons();

        document.querySelectorAll('.pay-method-option').forEach(option => {
          option.addEventListener('click', () => {
            const radio = option.querySelector('input[name="pay-method"]');
            if (radio) {
              radio.checked = true;
              state.activeBooking.payMethod = radio.value;
              document.querySelectorAll('.pay-method-option').forEach(o => {
                o.classList.remove('border-emerald-500/40', 'text-emerald-400');
                o.classList.add('border-white/10', 'text-slate-300');
              });
              option.classList.add('border-emerald-500/40', 'text-emerald-400');
              option.classList.remove('border-white/10', 'text-slate-300');
            }
          });
        });

        document.getElementById('apply-promo-btn')?.addEventListener('click', () => {
          const promo = document.getElementById('promo-code-input')?.value.trim().toUpperCase();
          if (promo === 'SAMBHAJI200' || promo === 'EXPLORE10') {
            state.activeBooking.promoCode = promo;
            showToast(`Coupon ${promo} applied successfully!`, 'success');
            updateStepUI();
          } else {
            showToast('Invalid promo code. Try SAMBHAJI200', 'info');
          }
        });

        document.getElementById('step-4-back-btn')?.addEventListener('click', () => {
          state.activeBooking.step = 3;
          updateStepUI();
        });

        document.getElementById('confirm-pay-btn')?.addEventListener('click', (e) => {
          const grandTotal = Number(e.currentTarget.dataset.grandTotal);
          const newBooking = {
            bookingId: `TORQO-CSN-${Math.floor(1000 + Math.random() * 9000)}`,
            vehicle,
            pickupDate: state.activeBooking.pickupDate,
            returnDate: state.activeBooking.returnDate,
            grandTotal,
            status: 'Confirmed',
            kyc: state.activeBooking.kyc
          };

          state.userBookings.unshift(newBooking);

          if (typeof window.confetti === 'function') {
            window.confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }

          stepContent.innerHTML = renderBookingSuccess(newBooking);
          renderIcons();

          document.getElementById('whatsapp-share-btn')?.addEventListener('click', () => {
            showToast('WhatsApp confirmation receipt sent to ' + newBooking.kyc.phone, 'success');
          });

          document.getElementById('finish-booking-btn')?.addEventListener('click', () => {
            modalContainer.innerHTML = '';
            render();
          });
        });
      }
    }

    document.getElementById('close-booking-modal-btn')?.addEventListener('click', () => {
      modalContainer.innerHTML = '';
    });

    updateStepUI();
  }

  // Initial render
  render();
}

// Start application safely on DOM ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  initApp();
}
