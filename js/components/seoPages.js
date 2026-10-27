/**
 * Programmatic Dedicated SEO Pages Component for DriveMart
 */
import { VEHICLES_DATA, getMarketplaceVehicles } from '../data/vehicles.js';
import { CITY_HUBS, TOURIST_DESTINATIONS, FAQS_DATA } from '../data/locations.js';
import { renderVehicleCard } from './vehicleCatalog.js';

export const SEO_PAGE_CONFIGS = {
  'bike-rental-chhatrapati-sambhajinagar': {
    title: 'Best Bike Rental in Chhatrapati Sambhajinagar | Starting ₹999/day | DriveMart',
    h1: 'Self-Drive Bike Rental in Chhatrapati Sambhajinagar',
    metaDesc: 'Rent Royal Enfield Classic 350, Hunter 350, KTM Duke 250 & Yamaha R15 V4 in Sambhajinagar. Zero hidden charges, free helmet, pickup at Railway Station, CIDCO & Airport.',
    category: 'bike',
    heroTagline: 'Ride through history. Cruise to Daulatabad Fort, Ellora Caves & Khuldabad on iconic motorcycles.',
    highlights: ['Free ISI Certified Helmet', 'Unlimited Roadside Assistance', 'Instant Station Pickup', 'Doorstep Delivery Available']
  },
  'scooty-rental-chhatrapati-sambhajinagar': {
    title: 'Affordable Scooty Rental in Sambhajinagar | Activa & Ather EV @ ₹479/day',
    h1: 'Scooter & EV Rental in Chhatrapati Sambhajinagar',
    metaDesc: 'Rent Honda Activa 6G, TVS Jupiter & Ather 450X EV scooter in Sambhajinagar. Best mileage, easy booking, instant pickup in Connaught Place, MGM & Railway Station.',
    category: 'scooter',
    heroTagline: 'Zip through the city effortlessly. Ideal for local shopping, food crawls & daily commutes.',
    highlights: ['55+ km/l High Mileage', 'Zero Fuel Cost EV Options', 'Largest Underseat Storage', 'Instant Digital KYC']
  },
  'car-rental-chhatrapati-sambhajinagar': {
    title: 'Self-Drive Car Rental in Chhatrapati Sambhajinagar | Hatchbacks, Sedans & Automatics',
    h1: 'Self-Drive Car Rental in Chhatrapati Sambhajinagar',
    metaDesc: 'Rent Maruti Swift, Hyundai i20 & Tata Nexon EV for self-drive in Sambhajinagar. 100% verified cars, comprehensive insurance, zero surge pricing.',
    category: 'car',
    heroTagline: 'Unmatched comfort and privacy for family trips, business meetings & Ajanta Caves exploration.',
    highlights: ['Automatic & Manual Options', 'Fastag Pre-installed', 'Doorstep Airport Delivery', 'Full Comprehensive Insurance']
  },
  'self-drive-suv-sambhajinagar-ellora-ajanta': {
    title: 'Self-Drive SUV Rental in Sambhajinagar | Thar 4x4, Creta & Scorpio-N',
    h1: 'Self-Drive SUV & 4x4 Rental for Ajanta & Ellora',
    metaDesc: 'Rent Mahindra Thar 4x4, Scorpio-N & Hyundai Creta in Sambhajinagar. Perfect for Lonar Crater, Ajanta Caves day trips, and rugged road trips.',
    category: 'suv',
    heroTagline: 'Conquer the Deccan roads with power, high ground clearance, and spacious 4WD capability.',
    highlights: ['4x4 Off-Road Ready', 'Panoramic Sunroofs', 'Spacious 7-Seater Options', 'Inter-city Travel Permit']
  }
};

export function renderSeoPage(slug = 'bike-rental-chhatrapati-sambhajinagar') {
  const config = SEO_PAGE_CONFIGS[slug] || SEO_PAGE_CONFIGS['bike-rental-chhatrapati-sambhajinagar'];
  const filteredVehicles = getMarketplaceVehicles().filter(v => v.category === config.category);

  return `
    <div class="py-8 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
          <a href="#" class="seo-breadcrumb-home hover:text-emerald-400">Home</a>
          <span>/</span>
          <a href="#" class="hover:text-emerald-400">Chhatrapati Sambhajinagar</a>
          <span>/</span>
          <span class="text-white font-medium">${config.h1}</span>
        </nav>

        <!-- SEO Hero Header Banner -->
        <div class="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 mb-12 relative overflow-hidden">
          <div class="hero-glow-sphere -top-20 -right-20"></div>
          
          <div class="max-w-3xl relative z-10">
            <div class="badge-volt mb-3">📍 Chhatrapati Sambhajinagar Mobility</div>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              ${config.h1}
            </h1>
            <p class="text-base sm:text-lg text-slate-300 mb-6 leading-relaxed">
              ${config.heroTagline}
            </p>

            <!-- Highlights Chips -->
            <div class="flex items-center gap-2 flex-wrap mb-6">
              ${config.highlights.map(h => `
                <div class="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-slate-200">
                  <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i>
                  <span>${h}</span>
                </div>
              `).join('')}
            </div>

            <button id="seo-hero-book-btn" class="btn-primary text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg">
              Explore Available ${config.category.toUpperCase()} Fleet ↓
            </button>
          </div>
        </div>

        <!-- Available Category Fleet Grid -->
        <div class="mb-16">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-extrabold text-white">Top Rated ${config.category.toUpperCase()} Listings</h2>
              <p class="text-xs text-slate-400">Instant reservation with partner verified assurance</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filteredVehicles.map(renderVehicleCard).join('')}
          </div>
        </div>

        <!-- Popular Pickup Hubs in Sambhajinagar -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl mb-16">
          <h2 class="text-xl sm:text-2xl font-bold text-white mb-2">
            Popular Pickup & Drop Hubs in Sambhajinagar
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mb-6">
            Collect your vehicle at prime transit points or opt for hotel doorstep delivery
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${CITY_HUBS.map(hub => `
              <div class="bg-slate-900/70 p-4 rounded-xl border border-white/5 space-y-1.5">
                <div class="flex items-center gap-2">
                  <i data-lucide="map-pin" class="w-4 h-4 text-emerald-400"></i>
                  <h4 class="text-sm font-bold text-white">${hub.name}</h4>
                </div>
                <p class="text-xs text-slate-300">${hub.description}</p>
                <div class="text-[11px] text-slate-500 font-medium">🕒 ${hub.operatingHours}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tourist Itineraries & Road Trips from Sambhajinagar -->
        <div class="mb-16">
          <div class="badge-volt mb-2">Weekend Escapes</div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Top Self-Drive Road Trips from Sambhajinagar
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mb-8">
            Experience Maharashtra's UNESCO world heritage and scenic Deccan highways
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${TOURIST_DESTINATIONS.slice(0, 3).map(dest => `
              <div class="glass-card overflow-hidden rounded-2xl flex flex-col">
                <div class="h-44 relative bg-slate-950">
                  <img src="${dest.image}" alt="${dest.name}" class="w-full h-full object-cover" />
                  <span class="absolute top-3 left-3 badge-volt text-[10px]">${dest.tag}</span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="text-base font-bold text-white mb-1">${dest.name}</h3>
                    <p class="text-xs text-emerald-400 font-semibold mb-2">🚗 ${dest.distance} • ${dest.travelTime}</p>
                    <p class="text-xs text-slate-300 leading-relaxed">${dest.description}</p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
                    <strong>Recommended:</strong> ${dest.recommendedVehicle}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- FAQs with Microdata Schema -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl">
          <h2 class="text-xl sm:text-2xl font-bold text-white mb-6">
            Frequently Asked Questions — ${config.h1}
          </h2>

          <div class="space-y-4">
            ${FAQS_DATA.slice(0, 4).map((faq, i) => `
              <div class="border border-white/5 bg-slate-900/60 p-4 rounded-xl">
                <h4 class="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <i data-lucide="help-circle" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                  <span>${faq.question}</span>
                </h4>
                <p class="text-xs text-slate-300 leading-relaxed pl-6">
                  ${faq.answer}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;
}
