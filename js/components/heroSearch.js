/**
 * Hero Section & Interactive Search Engine Component — DriveMart
 */
import { CITY_HUBS } from '../data/locations.js';
import { CATEGORIES_META } from '../data/vehicles.js';

export function renderHeroSearch() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);
  const formattedDayAfter = dayAfter.toISOString().split('T')[0];

  return `
    <div class="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      <!-- Glow background spheres -->
      <div class="hero-glow-sphere hero-glow-right"></div>
      <div class="hero-glow-sphere hero-glow-left"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Top Status Pill -->
        <div class="flex items-center justify-center mb-6">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-emerald-500/30 text-xs font-semibold text-emerald-400 animate-pulse-subtle">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>⚡ Live in Chhatrapati Sambhajinagar • 20+ Verified Hubs</span>
          </div>
        </div>

        <!-- Headline & Subheadline -->
        <div class="text-center max-w-3xl mx-auto mb-10">
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Drive<span class="gradient-text">Mart</span>
          </h1>
          <p class="text-xl sm:text-2xl font-semibold text-emerald-400 mb-4 tracking-wide">
            India's Marketplace for Vehicle Rentals.
          </p>
          <p class="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Discover and book self-drive <span class="text-white font-medium">bikes, scooters, cars and SUVs</span> from trusted local rental businesses near you in Sambhajinagar.
          </p>
        </div>

        <!-- Hero Search Widget Box -->
        <div class="max-w-5xl mx-auto glass-panel p-4 sm:p-6 rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 relative">
          
          <!-- Mode Selector Tabs (Self Pickup vs Doorstep Delivery) -->
          <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-5 flex-wrap gap-3">
            <div class="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-white/5">
              <button id="search-tab-self" class="search-mode-tab active px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-emerald-500 text-slate-950 shadow-md">
                📍 Self Pickup Hub
              </button>
              <button id="search-tab-delivery" class="search-mode-tab px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-slate-300 hover:text-white">
                🚀 Doorstep Delivery
              </button>
            </div>

            <!-- Quick City Indicator -->
            <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span class="text-slate-200 font-medium">Sambhajinagar (Aurangabad), MH</span>
            </div>
          </div>

          <!-- Search Inputs Grid -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            
            <!-- Location Selection -->
            <div class="md:col-span-4 bg-slate-900/90 rounded-xl p-3 border border-white/10 focus-within:border-emerald-400 transition-colors">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400"></i>
                Pickup Location / Hub
              </label>
              <select id="hero-location-select" class="w-full bg-transparent text-white font-medium text-sm sm:text-base outline-none cursor-pointer">
                <option value="all" class="bg-slate-900 text-white">All Sambhajinagar Hubs</option>
                ${CITY_HUBS.map(hub => `
                  <option value="${hub.id}" class="bg-slate-900 text-white">${hub.name} (${hub.area})</option>
                `).join('')}
              </select>
            </div>

            <!-- Start Date & Time -->
            <div class="md:col-span-3 bg-slate-900/90 rounded-xl p-3 border border-white/10 focus-within:border-emerald-400 transition-colors">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-emerald-400"></i>
                Pickup Date & Time
              </label>
              <div class="flex items-center gap-2">
                <input type="date" id="hero-pickup-date" value="${formattedTomorrow}" class="w-full bg-transparent text-white text-sm font-medium outline-none cursor-pointer [color-scheme:dark]">
                <select id="hero-pickup-time" class="bg-slate-800 text-xs text-emerald-300 font-semibold rounded px-2 py-1 outline-none">
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                </select>
              </div>
            </div>

            <!-- Return Date & Time -->
            <div class="md:col-span-3 bg-slate-900/90 rounded-xl p-3 border border-white/10 focus-within:border-emerald-400 transition-colors">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <i data-lucide="calendar-check" class="w-3.5 h-3.5 text-emerald-400"></i>
                Return Date & Time
              </label>
              <div class="flex items-center gap-2">
                <input type="date" id="hero-return-date" value="${formattedDayAfter}" class="w-full bg-transparent text-white text-sm font-medium outline-none cursor-pointer [color-scheme:dark]">
                <select id="hero-return-time" class="bg-slate-800 text-xs text-emerald-300 font-semibold rounded px-2 py-1 outline-none">
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="06:00 PM" selected>06:00 PM</option>
                  <option value="09:00 PM">09:00 PM</option>
                </select>
              </div>
            </div>

            <!-- CTA Search Button -->
            <div class="md:col-span-2 flex items-stretch">
              <button id="hero-search-btn" class="w-full btn-primary text-slate-950 font-bold text-base rounded-xl flex items-center justify-center gap-2 py-3 md:py-0">
                <i data-lucide="search" class="w-5 h-5"></i>
                <span>Search</span>
              </button>
            </div>

          </div>

          <!-- Quick Category Filters Row -->
          <div class="mt-5 pt-4 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
            <div class="text-xs text-slate-400 font-medium flex items-center gap-1">
              <span>Quick Categories:</span>
            </div>
            <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <button data-cat="all" class="hero-quick-cat active px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all hover:bg-emerald-500/30">
                ✨ All Fleet
              </button>
              <button data-cat="bike" class="hero-quick-cat px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-all">
                🏍️ Bikes (₹899+)
              </button>
              <button data-cat="scooter" class="hero-quick-cat px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-all">
                🛵 Scooters (₹479+)
              </button>
              <button data-cat="car" class="hero-quick-cat px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-all">
                🚗 Cars (₹1,699+)
              </button>
              <button data-cat="suv" class="hero-quick-cat px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-all">
                🚙 SUVs (₹2,999+)
              </button>
              <button data-cat="van" class="hero-quick-cat px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-all">
                🚐 Vans (₹2,599+)
              </button>
            </div>
          </div>

        </div>

        <!-- Key Marketplace Highlights Bar -->
        <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-center max-w-4xl mx-auto">
          <div class="glass-panel p-3 rounded-xl border border-white/5 flex items-center justify-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
            <span class="text-xs font-semibold text-slate-300">100% Verified Partners</span>
          </div>
          <div class="glass-panel p-3 rounded-xl border border-white/5 flex items-center justify-center gap-2">
            <i data-lucide="banknote" class="w-4 h-4 text-emerald-400"></i>
            <span class="text-xs font-semibold text-slate-300">Transparent Zero-Surge</span>
          </div>
          <div class="glass-panel p-3 rounded-xl border border-white/5 flex items-center justify-center gap-2">
            <i data-lucide="hard-hat" class="w-4 h-4 text-emerald-400"></i>
            <span class="text-xs font-semibold text-slate-300">Free Certified Helmets</span>
          </div>
          <div class="glass-panel p-3 rounded-xl border border-white/5 flex items-center justify-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
            <span class="text-xs font-semibold text-slate-300">Instant Refund Deposit</span>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function initHeroSearchEvents(onSearchCallback) {
  const searchBtn = document.getElementById('hero-search-btn');
  const catButtons = document.querySelectorAll('.hero-quick-cat');
  const modeTabs = document.querySelectorAll('.search-mode-tab');

  let selectedCategory = 'all';
  let deliveryMode = 'self';

  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modeTabs.forEach(t => {
        t.classList.remove('active', 'bg-emerald-500', 'text-slate-950', 'shadow-md');
        t.classList.add('text-slate-300');
      });
      tab.classList.add('active', 'bg-emerald-500', 'text-slate-950', 'shadow-md');
      tab.classList.remove('text-slate-300');
      deliveryMode = tab.id === 'search-tab-delivery' ? 'delivery' : 'self';
    });
  });

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => {
        b.classList.remove('active', 'bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/30');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      btn.classList.add('active', 'bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/30');
      btn.classList.remove('bg-slate-800', 'text-slate-300');
      selectedCategory = btn.dataset.cat;
      
      if (onSearchCallback) {
        onSearchCallback({
          category: selectedCategory,
          location: document.getElementById('hero-location-select')?.value || 'all',
          pickupDate: document.getElementById('hero-pickup-date')?.value,
          returnDate: document.getElementById('hero-return-date')?.value,
          deliveryMode
        });
      }
    });
  });

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const location = document.getElementById('hero-location-select')?.value || 'all';
      const pickupDate = document.getElementById('hero-pickup-date')?.value;
      const returnDate = document.getElementById('hero-return-date')?.value;

      if (onSearchCallback) {
        onSearchCallback({
          category: selectedCategory,
          location,
          pickupDate,
          returnDate,
          deliveryMode
        });
      }

      // Smooth scroll to catalog
      const catalogEl = document.getElementById('vehicle-catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
