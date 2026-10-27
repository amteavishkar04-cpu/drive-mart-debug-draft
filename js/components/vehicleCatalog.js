/**
 * Vehicle Catalog & Interactive 5-View Gallery Component for DriveMart
 */
import { VEHICLES_DATA, CATEGORIES_META } from '../data/vehicles.js';
import { CITY_HUBS } from '../data/locations.js';

// Helper to get the primary photo or clean fallback
export function getVehiclePrimaryPhoto(vehicle) {
  if (!vehicle) return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80';
  if (vehicle.primaryPhoto) return vehicle.primaryPhoto;
  if (vehicle.primary_photo) return vehicle.primary_photo;
  if (Array.isArray(vehicle.photos) && vehicle.photos.length > 0) {
    const primary = vehicle.photos.find(p => p.isPrimary || p.is_primary);
    const photoObj = primary || vehicle.photos[0];
    return photoObj.url || photoObj.photo_url || null;
  }
  if (vehicle.image) return vehicle.image;
  if (Array.isArray(vehicle.gallery) && vehicle.gallery.length > 0) return vehicle.gallery[0];
  return 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80';
}

// Helper to get all vehicle photos in a standardized format
export function getVehiclePhotos(vehicle) {
  if (!vehicle) return [];
  if (Array.isArray(vehicle.photos) && vehicle.photos.length > 0) {
    return vehicle.photos.map((p, idx) => ({
      id: p.id || `photo-${vehicle.id}-${idx}`,
      type: p.type || 'photo',
      label: p.label || `Photo ${idx + 1}`,
      url: p.url || p.photo_url,
      isPrimary: Boolean(p.isPrimary || p.is_primary || idx === 0)
    }));
  }
  const urls = [];
  if (vehicle.primaryPhoto) urls.push(vehicle.primaryPhoto);
  if (vehicle.primary_photo && !urls.includes(vehicle.primary_photo)) urls.push(vehicle.primary_photo);
  if (vehicle.image && !urls.includes(vehicle.image)) urls.push(vehicle.image);
  if (Array.isArray(vehicle.gallery)) {
    vehicle.gallery.forEach(u => {
      if (u && !urls.includes(u)) urls.push(u);
    });
  }
  if (urls.length === 0) {
    urls.push('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80');
  }
  const labels = ['Front View', 'Side Profile', 'Cockpit & Controls', 'Rear Profile', 'Odometer / Engine'];
  const types = ['front', 'left', 'right', 'rear', 'odometer'];
  return urls.map((url, i) => ({
    id: `ph-${vehicle.id || 'v'}-${i}`,
    type: types[i] || 'detail',
    label: labels[i] || `View ${i + 1}`,
    url,
    isPrimary: i === 0
  }));
}

export function renderVehicleCard(vehicle) {
  const isElectric = vehicle.fuelType === 'Electric';
  const fuelIcon = isElectric ? '⚡ EV' : `⛽ ${vehicle.fuelType}`;
  const transmissionLabel = vehicle.transmission.split(' ')[0];
  const primaryImgUrl = getVehiclePrimaryPhoto(vehicle);
  const photos = getVehiclePhotos(vehicle);
  const photoCount = photos.length;
  const status = vehicle.photoStatus || (primaryImgUrl ? 'verified' : 'not_uploaded');

  // Photo verification trust badge markup
  let trustBadgeMarkup = '';
  if (status === 'verified') {
    trustBadgeMarkup = `
      <span class="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
        <i data-lucide="shield-check" class="w-3 h-3"></i>
        <span>✓ Actual Vehicle Photos</span>
      </span>
    `;
  } else if (status === 'pending') {
    trustBadgeMarkup = `
      <span class="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
        <i data-lucide="clock" class="w-3 h-3"></i>
        <span>⏳ Verification Pending</span>
      </span>
    `;
  } else if (status === 'rejected') {
    trustBadgeMarkup = `
      <span class="inline-flex items-center gap-1 bg-red-500/20 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
        <i data-lucide="alert-circle" class="w-3 h-3"></i>
        <span>⚠️ Photo Rejected</span>
      </span>
    `;
  } else {
    trustBadgeMarkup = `
      <span class="inline-flex items-center gap-1 bg-slate-800 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/5">
        <i data-lucide="camera-off" class="w-3 h-3"></i>
        <span>Photos Not Uploaded</span>
      </span>
    `;
  }

  return `
    <div class="glass-card overflow-hidden flex flex-col group relative" data-vehicle-id="${vehicle.id}">
      <!-- Vehicle Actual Image & Badges -->
      <div class="relative h-52 sm:h-56 overflow-hidden bg-slate-950">
        ${primaryImgUrl ? `
          <img 
            src="${primaryImgUrl}" 
            alt="${vehicle.name} - Actual Owner Photo" 
            loading="lazy" 
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ` : `
          <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-slate-500">
            <i data-lucide="camera-off" class="w-10 h-10 mb-2 opacity-50"></i>
            <span class="text-xs font-semibold">Photos not uploaded yet</span>
            <span class="text-[10px] text-slate-600 mt-0.5">Awaiting owner upload</span>
          </div>
        `}
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>
        
        <!-- Top Left Badges: Category & Actual Photo Badge -->
        <div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span class="badge-volt shadow-lg">
            ${vehicle.category.toUpperCase()}
          </span>
          ${trustBadgeMarkup}
        </div>

        <!-- Rating Pill Top Right -->
        <div class="absolute top-3 right-3 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 shadow-lg">
          <span class="text-amber-400 font-bold text-xs">⭐</span>
          <span class="text-white font-bold text-xs">${vehicle.rating}</span>
          <span class="text-slate-400 text-[10px]">(${vehicle.reviewsCount})</span>
        </div>

        <!-- Location Badge & Photo Count Bottom -->
        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-1 text-slate-300 bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded-md border border-white/10 truncate">
            <i data-lucide="map-pin" class="w-3 h-3 text-emerald-400 shrink-0"></i>
            <span class="truncate text-[11px]">${vehicle.location}</span>
          </div>
          ${photoCount > 0 ? `
            <span class="bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-300 border border-white/10 shrink-0">
              📸 ${photoCount} Photos
            </span>
          ` : ''}
        </div>
      </div>

      <!-- Card Body Content -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          <!-- Vehicle Title & SubCategory -->
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                ${vehicle.brand} ${vehicle.model}
              </h3>
              <p class="text-xs text-slate-400 font-medium">
                ${vehicle.variant} • ${vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)} • ${transmissionLabel} • ${vehicle.fuelType}
              </p>
            </div>
            <span class="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-white/5 shrink-0" title="Listing ID">
              ${vehicle.id}
            </span>
          </div>

          <!-- Specs Badges Grid -->
          <div class="grid grid-cols-3 gap-2 my-3 text-center text-xs">
            <div class="bg-slate-900/70 p-2 rounded-lg border border-white/5">
              <span class="text-slate-400 block text-[10px] uppercase">Transmission</span>
              <span class="text-slate-200 font-semibold truncate block">${transmissionLabel}</span>
            </div>
            <div class="bg-slate-900/70 p-2 rounded-lg border border-white/5">
              <span class="text-slate-400 block text-[10px] uppercase">Fuel</span>
              <span class="text-slate-200 font-semibold truncate block">${fuelIcon}</span>
            </div>
            <div class="bg-slate-900/70 p-2 rounded-lg border border-white/5">
              <span class="text-slate-400 block text-[10px] uppercase">Capacity</span>
              <span class="text-slate-200 font-semibold block">${vehicle.seats} Seats</span>
            </div>
          </div>

          <!-- Partner Info Pill -->
          <div class="flex items-center justify-between text-xs py-2 border-t border-white/5 text-slate-400 mb-2">
            <div class="flex items-center gap-1.5 truncate">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>
              <span class="truncate text-slate-300 font-medium">${vehicle.partnerName || 'Verified Host'}</span>
            </div>
            <span class="text-[11px] text-emerald-400 font-semibold shrink-0">✓ Verified Fleet</span>
          </div>
        </div>

        <!-- Pricing & Action Row -->
        <div class="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-extrabold text-white">₹${vehicle.pricePerDay.toLocaleString('en-IN')}</span>
              <span class="text-xs text-slate-400 font-medium">/day</span>
            </div>
            <div class="text-[11px] text-slate-500 font-medium">
              Free ${vehicle.freeKmPerDay} km/day • ₹${vehicle.securityDeposit} deposit
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button 
              class="quick-view-btn btn-secondary px-3 py-2 text-xs font-semibold"
              data-vehicle-id="${vehicle.id}"
            >
              View Photos
            </button>
            <button 
              class="book-vehicle-btn btn-primary px-4 py-2 text-xs sm:text-sm font-bold shadow-md"
              data-vehicle-id="${vehicle.id}"
            >
              Book Now
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function renderVehicleCatalog(vehicles = VEHICLES_DATA) {
  return `
    <section id="vehicle-catalog-section" class="py-12 sm:py-16 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div class="badge-volt mb-2">100% Genuine Owner Photos</div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
              Verified Self-Drive Fleet
            </h2>
            <p class="text-slate-400 text-sm sm:text-base mt-1">
              Every bike & car displays the exact 5-view photos uploaded by the local owner. No generic stock photos.
            </p>
          </div>

          <!-- Search Query & Sort Control -->
          <div class="flex items-center gap-3 flex-wrap">
            <div class="relative min-w-[220px]">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
              <input 
                type="text" 
                id="catalog-search-input" 
                placeholder="Search Hunter, Activa, Thar..." 
                class="w-full bg-slate-900 border border-white/10 text-white pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            <div class="relative">
              <select id="catalog-sort-select" class="bg-slate-900 border border-white/10 text-slate-200 px-3 py-2 rounded-xl text-xs sm:text-sm outline-none cursor-pointer focus:border-emerald-400">
                <option value="recommended">Featured & Verified</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Booked</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Filter Pills Bar -->
        <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          ${CATEGORIES_META.map(cat => `
            <button 
              data-filter-category="${cat.id}"
              class="catalog-category-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${cat.id === 'all' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/5'}"
            >
              ${cat.name}
            </button>
          `).join('')}
        </div>

        <!-- Secondary Multi-Filters Bar -->
        <div class="glass-panel p-4 rounded-2xl border border-white/10 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          <div>
            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Transmission</label>
            <select id="filter-transmission" class="w-full bg-slate-800 text-white p-2 rounded-lg border border-white/10 outline-none">
              <option value="all">All Transmissions</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic / CVT</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Fuel Type</label>
            <select id="filter-fuel" class="w-full bg-slate-800 text-white p-2 rounded-lg border border-white/10 outline-none">
              <option value="all">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">100% Electric (EV)</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Pickup Hub</label>
            <select id="filter-location" class="w-full bg-slate-800 text-white p-2 rounded-lg border border-white/10 outline-none">
              <option value="all">All Sambhajinagar Hubs</option>
              ${CITY_HUBS.map(h => `<option value="${h.id}">${h.name}</option>`).join('')}
            </select>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-[10px] uppercase font-bold text-slate-400">Max Budget</label>
              <span id="price-range-val" class="text-emerald-400 font-bold text-[11px]">₹6,000/day</span>
            </div>
            <input 
              type="range" 
              id="filter-price-slider" 
              min="400" 
              max="6000" 
              step="100" 
              value="6000" 
              class="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

        </div>

        <!-- Vehicle Cards Grid -->
        <div id="vehicles-grid-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${vehicles.map(renderVehicleCard).join('')}
        </div>

        <!-- Empty State Message -->
        <div id="no-vehicles-found" class="hidden text-center py-16 glass-card p-8 rounded-3xl">
          <div class="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <i data-lucide="compass" class="w-8 h-8"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">No Vehicles Match Your Selected Filters</h3>
          <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Try adjusting your category, price range, or pickup location to explore more available rides in Chhatrapati Sambhajinagar.
          </p>
          <button id="reset-filters-btn" class="btn-secondary text-xs sm:text-sm font-semibold">
            Reset All Filters
          </button>
        </div>

      </div>
    </section>
  `;
}

/**
 * Modal to display detailed vehicle specs & interactive 5-view actual photo gallery
 */
export function renderVehicleDetailModal(vehicle) {
  const photos = getVehiclePhotos(vehicle);
  const primaryPhoto = photos.find(p => p.isPrimary) || photos[0];
  const photoStatus = vehicle.photoStatus || 'verified';

  return `
    <div id="vehicle-detail-modal" class="modal-backdrop active">
      <div class="modal-content relative p-4 sm:p-8 max-w-4xl">
        
        <!-- Close Button -->
        <button id="close-detail-modal" class="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors z-20">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Column 1: Interactive 5-View Photo Gallery (7 Cols) -->
          <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            <!-- Main Photo Stage -->
            <div class="relative rounded-2xl overflow-hidden bg-slate-950 border border-white/10 aspect-[4/3] group flex items-center justify-center">
              <img 
                id="gallery-main-image" 
                src="${primaryPhoto.url}" 
                alt="${vehicle.name} - ${primaryPhoto.label}" 
                class="w-full h-full object-cover transition-all duration-300"
              />
              
              <!-- Floating Photo Slot Label -->
              <div class="absolute top-3 left-3 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 shadow-lg">
                <span id="gallery-active-label" class="text-emerald-400">${primaryPhoto.label || 'Front View'}</span>
                <span class="text-slate-500">•</span>
                <span class="text-[10px] text-slate-300">Owner Upload</span>
              </div>

              <!-- Fullscreen Zoom Button -->
              <button 
                id="gallery-zoom-btn" 
                class="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 backdrop-blur text-slate-300 hover:text-white hover:bg-slate-800 border border-white/10 transition-colors shadow-lg"
                title="View Fullscreen"
              >
                <i data-lucide="maximize-2" class="w-4 h-4"></i>
              </button>

              <!-- Left/Right Nav Arrows -->
              <button 
                id="gallery-prev-btn" 
                class="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 backdrop-blur text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors border border-white/10 opacity-80 group-hover:opacity-100"
              >
                <i data-lucide="chevron-left" class="w-4 h-4"></i>
              </button>
              <button 
                id="gallery-next-btn" 
                class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 backdrop-blur text-white hover:bg-emerald-500 hover:text-slate-950 transition-colors border border-white/10 opacity-80 group-hover:opacity-100"
              >
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
              </button>

              <!-- Unique Listing ID Badge -->
              <div class="absolute bottom-2 left-2 bg-slate-950/90 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 border border-white/10">
                Listing ID: <span class="text-emerald-400 font-bold">${vehicle.id}</span>
              </div>
            </div>
            
            <!-- 5-Slot Thumbnail Selector Bar -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Actual Bike Photos (${photos.length} Views)
                </span>
                <span class="text-[11px] text-emerald-400 font-semibold">
                  ✓ Verified Authentic
                </span>
              </div>

              <div id="gallery-thumbnails-container" class="grid grid-cols-5 gap-2">
                ${photos.map((ph, idx) => `
                  <button 
                    class="gallery-thumb-btn relative rounded-xl overflow-hidden border-2 transition-all aspect-[4/3] bg-slate-900 ${ph.isPrimary || idx === 0 ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-white/10 hover:border-white/40'}"
                    data-photo-url="${ph.url}"
                    data-photo-label="${ph.label}"
                    data-photo-index="${idx}"
                  >
                    <img src="${ph.url}" alt="${ph.label}" class="w-full h-full object-cover"/>
                    <div class="absolute inset-x-0 bottom-0 bg-slate-950/90 text-[9px] font-bold text-slate-200 py-0.5 truncate px-1 text-center">
                      ${ph.label.split(' ')[0]}
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Verification Notice Box -->
            <div class="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/20 flex items-start gap-3">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <i data-lucide="shield-check" class="w-4 h-4"></i>
              </div>
              <div class="text-xs">
                <div class="font-bold text-white">100% Exact Vehicle Guarantee</div>
                <div class="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                  The photos shown are of the actual vehicle registered under ID <strong class="text-slate-300">${vehicle.id}</strong>. What you see is exactly what you get at pickup.
                </div>
              </div>
            </div>

          </div>

          <!-- Column 2: Specs, Pricing & Booking CTA (5 Cols) -->
          <div class="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            <div>
              <!-- Vehicle Title & Status -->
              <div class="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                <span>${vehicle.brand}</span>
                <span>•</span>
                <span>Year ${vehicle.year}</span>
                <span>•</span>
                <span class="badge-volt text-[10px]">${vehicle.category.toUpperCase()}</span>
              </div>
              
              <h2 class="text-2xl font-extrabold text-white mb-1">${vehicle.brand} ${vehicle.model}</h2>
              <p class="text-xs text-slate-400 mb-4">${vehicle.variant} • ${vehicle.subCategory || 'Standard'}</p>

              <!-- Pricing Highlight Box -->
              <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl mb-4">
                <div class="flex items-baseline justify-between">
                  <div>
                    <span class="text-xs text-slate-400 block">Daily Rent</span>
                    <span class="text-3xl font-extrabold text-emerald-400">₹${vehicle.pricePerDay.toLocaleString('en-IN')}</span>
                    <span class="text-xs text-slate-400 font-medium"> / 24 hrs</span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-slate-400 block">Security Deposit</span>
                    <span class="text-base font-bold text-white">₹${vehicle.securityDeposit}</span>
                    <span class="text-[10px] text-emerald-300 block">100% Refundable</span>
                  </div>
                </div>
              </div>

              <!-- Key Specs Grid -->
              <div class="grid grid-cols-2 gap-2 text-xs mb-4">
                <div class="bg-slate-900/90 p-2.5 rounded-xl border border-white/5">
                  <span class="text-slate-400 block text-[10px] uppercase">Transmission</span>
                  <span class="font-bold text-white">${vehicle.transmission}</span>
                </div>
                <div class="bg-slate-900/90 p-2.5 rounded-xl border border-white/5">
                  <span class="text-slate-400 block text-[10px] uppercase">Fuel Type</span>
                  <span class="font-bold text-white">${vehicle.fuelType}</span>
                </div>
                <div class="bg-slate-900/90 p-2.5 rounded-xl border border-white/5">
                  <span class="text-slate-400 block text-[10px] uppercase">Free Distance</span>
                  <span class="font-bold text-white">${vehicle.freeKmPerDay} km/day</span>
                </div>
                <div class="bg-slate-900/90 p-2.5 rounded-xl border border-white/5">
                  <span class="text-slate-400 block text-[10px] uppercase">Mileage / Range</span>
                  <span class="font-bold text-white">${vehicle.mileage}</span>
                </div>
              </div>

              <!-- Included Features -->
              <div class="bg-slate-900/60 p-3 rounded-xl border border-white/5 mb-4">
                <h4 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Included In This Rental</h4>
                <ul class="space-y-1.5 text-xs text-slate-200">
                  ${(vehicle.features || ['Free ISI Certified Helmet Included', '24/7 Roadside Towing Support', 'Full Insurance Coverage']).map(f => `
                    <li class="flex items-center gap-2">
                      <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>
                      <span class="truncate">${f}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <!-- Host Info -->
              <div class="bg-slate-900/80 p-3 rounded-xl border border-white/5 mb-2 flex items-center justify-between">
                <div>
                  <div class="text-[10px] text-slate-400">Host Partner</div>
                  <div class="text-xs font-bold text-white">${vehicle.partnerName || 'Verified Host'}</div>
                </div>
                <div class="text-right text-[11px] text-slate-400">
                  <i data-lucide="map-pin" class="w-3 h-3 inline text-emerald-400"></i>
                  <span>${vehicle.location}</span>
                </div>
              </div>
            </div>

            <!-- Booking CTA -->
            <button 
              id="modal-proceed-booking-btn" 
              class="w-full btn-primary text-slate-950 font-extrabold py-3.5 text-center rounded-xl shadow-xl flex items-center justify-center gap-2"
              data-vehicle-id="${vehicle.id}"
            >
              <i data-lucide="zap" class="w-4 h-4"></i>
              <span>Book This Exact Ride →</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  `;
}
