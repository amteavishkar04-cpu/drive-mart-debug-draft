/**
 * Multi-Step Customer Booking Flow Component for DriveMart
 */
import { VEHICLES_DATA } from '../data/vehicles.js';
import { CITY_HUBS } from '../data/locations.js';
import { getVehiclePrimaryPhoto } from './vehicleCatalog.js';

export function renderBookingModal(vehicle, searchState = {}) {
  const pickupDate = searchState.pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const returnDate = searchState.returnDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const primaryImg = getVehiclePrimaryPhoto(vehicle) || vehicle.primaryPhoto || vehicle.image;

  return `
    <div id="booking-modal-backdrop" class="modal-backdrop active">
      <div class="modal-content relative p-4 sm:p-8 max-w-3xl">
        
        <!-- Modal Header with Close -->
        <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-bold text-white">Instant Vehicle Reservation</h2>
              <p class="text-xs text-slate-400">Guaranteed instant confirmation • 100% verified fleet</p>
            </div>
          </div>
          
          <button id="close-booking-modal-btn" class="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Stepper Progress Bar -->
        <div class="flex items-center justify-between mb-8 px-2 sm:px-6">
          <div class="flex items-center flex-col gap-1">
            <div id="step-dot-1" class="step-dot active">1</div>
            <span class="text-[10px] sm:text-xs font-semibold text-slate-300">Trip Info</span>
          </div>
          <div id="step-line-1" class="step-line"></div>
          
          <div class="flex items-center flex-col gap-1">
            <div id="step-dot-2" class="step-dot">2</div>
            <span class="text-[10px] sm:text-xs font-semibold text-slate-400">Add-ons</span>
          </div>
          <div id="step-line-2" class="step-line"></div>

          <div class="flex items-center flex-col gap-1">
            <div id="step-dot-3" class="step-dot">3</div>
            <span class="text-[10px] sm:text-xs font-semibold text-slate-400">Rider KYC</span>
          </div>
          <div id="step-line-3" class="step-line"></div>

          <div class="flex items-center flex-col gap-1">
            <div id="step-dot-4" class="step-dot">4</div>
            <span class="text-[10px] sm:text-xs font-semibold text-slate-400">Payment</span>
          </div>
        </div>

        <!-- Selected Vehicle Summary Header -->
        <div class="glass-panel p-3 sm:p-4 rounded-xl border border-white/5 mb-6 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${primaryImg}" alt="${vehicle.name}" class="w-16 h-12 object-cover rounded-lg bg-slate-900 border border-white/10" />
            <div>
              <h4 class="text-sm font-bold text-white">${vehicle.name}</h4>
              <p class="text-xs text-slate-400">${vehicle.category.toUpperCase()} • ${vehicle.transmission} • ${vehicle.partnerName || 'Verified Host'}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-base font-extrabold text-emerald-400">₹${vehicle.pricePerDay.toLocaleString('en-IN')}</span>
            <span class="text-[10px] text-slate-400 block">per day</span>
          </div>
        </div>

        <!-- Dynamic Step Containers -->
        <div id="booking-step-content">
          <!-- Rendered via JS -->
        </div>

      </div>
    </div>
  `;
}

/**
 * Step 1: Trip details & Handover method
 */
export function renderBookingStep1(vehicle, state) {
  const isDoorstep = state.handoverMode === 'doorstep';

  return `
    <div class="space-y-4">
      <h3 class="text-base font-bold text-white flex items-center gap-2">
        <i data-lucide="map-pin" class="w-4 h-4 text-emerald-400"></i>
        Choose Dates & Pickup Location in Sambhajinagar
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Pickup Date</label>
          <input type="date" id="book-pickup-date" value="${state.pickupDate}" class="custom-input [color-scheme:dark]">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Return Date</label>
          <input type="date" id="book-return-date" value="${state.returnDate}" class="custom-input [color-scheme:dark]">
        </div>
      </div>

      <!-- Handover Mode -->
      <div class="pt-2">
        <label class="block text-xs font-semibold text-slate-300 mb-2">Handover Method</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="cursor-pointer border ${!isDoorstep ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-slate-900/60'} p-3 rounded-xl flex items-start gap-3 transition-colors">
            <input type="radio" name="handover-mode" value="hub" ${!isDoorstep ? 'checked' : ''} class="mt-1 accent-emerald-500">
            <div>
              <span class="text-sm font-bold text-white block">Self-Pickup at Partner Hub</span>
              <span class="text-xs text-slate-300">Free • Instant QR counter pickup</span>
              <span class="text-[11px] text-emerald-400 block mt-1">📍 ${vehicle.location}</span>
            </div>
          </label>

          <label class="cursor-pointer border ${isDoorstep ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-slate-900/60'} p-3 rounded-xl flex items-start gap-3 hover:border-white/20 transition-colors">
            <input type="radio" name="handover-mode" value="doorstep" ${isDoorstep ? 'checked' : ''} class="mt-1 accent-emerald-500">
            <div>
              <span class="text-sm font-bold text-white block">Doorstep Delivery</span>
              <span class="text-xs text-slate-300">+₹149 delivery charge in city limits</span>
              <span class="text-[11px] text-slate-400 block mt-1">Delivered to Hotel / Railway Station / Home</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Doorstep Address Field -->
      <div id="doorstep-address-box" class="${isDoorstep ? '' : 'hidden'} pt-2">
        <label class="block text-xs font-semibold text-slate-300 mb-1">Delivery Address in Sambhajinagar</label>
        <input type="text" id="doorstep-address-input" value="${state.deliveryAddress || ''}" placeholder="e.g. Hotel Lemon Tree, CIDCO / MGM Gate 2" class="custom-input" />
      </div>

      <!-- Continue CTA -->
      <div class="pt-4 flex justify-end">
        <button id="step-1-next-btn" class="btn-primary text-slate-950 font-bold px-6 py-2.5 rounded-xl">
          Continue to Add-ons →
        </button>
      </div>
    </div>
  `;
}

/**
 * Step 2: Addons and gear
 */
export function renderBookingStep2(vehicle, state) {
  const isBike = vehicle.category === 'bike' || vehicle.category === 'scooter';

  return `
    <div class="space-y-4">
      <h3 class="text-base font-bold text-white flex items-center gap-2">
        <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
        Customize Your Ride & Protection
      </h3>

      <div class="space-y-3">
        
        <!-- Helmet 1 (Free) -->
        <div class="glass-panel p-3 rounded-xl border border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <i data-lucide="hard-hat" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-sm font-bold text-white block">Rider Helmet (ISI Certified)</span>
              <span class="text-xs text-slate-400">Sanitized, scratch-free visor included</span>
            </div>
          </div>
          <span class="badge-volt text-xs font-bold">FREE (INCLUDED)</span>
        </div>

        <!-- Pillion Helmet -->
        ${isBike ? `
          <label class="glass-panel p-3 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer hover:border-emerald-500/30">
            <div class="flex items-center gap-3">
              <input type="checkbox" id="addon-pillion-helmet" ${state.addons?.pillionHelmet ? 'checked' : ''} class="w-4 h-4 accent-emerald-500">
              <div>
                <span class="text-sm font-bold text-white block">Extra Pillion Helmet</span>
                <span class="text-xs text-slate-400">For co-passenger safety (Mandatory on highways)</span>
              </div>
            </div>
            <span class="text-xs font-bold text-white">+₹49 / day</span>
          </label>
        ` : ''}

        <!-- Zero Dep Damage Waiver -->
        <label class="glass-panel p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between cursor-pointer hover:border-emerald-500/40">
          <div class="flex items-center gap-3">
            <input type="checkbox" id="addon-insurance" ${state.addons?.zeroDep ? 'checked' : ''} class="w-4 h-4 accent-emerald-500">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-white">Zero-Dep Shield & Roadside Assistance</span>
                <span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
              </div>
              <span class="text-xs text-slate-400">Caps your accident liability to ₹0 for minor scratches + 24/7 towing</span>
            </div>
          </div>
          <span class="text-xs font-bold text-emerald-400">+₹99 / day</span>
        </label>

        <!-- Phone Mount & Fast Charger -->
        <label class="glass-panel p-3 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer hover:border-emerald-500/30">
          <div class="flex items-center gap-3">
            <input type="checkbox" id="addon-mount" ${state.addons?.phoneMount ? 'checked' : ''} class="w-4 h-4 accent-emerald-500">
            <div>
              <span class="text-sm font-bold text-white block">Claw Mobile Mount & 20W Fast Charger</span>
              <span class="text-xs text-slate-400">Vibration dampening holder for Google Maps navigation</span>
            </div>
          </div>
          <span class="text-xs font-bold text-white">+₹29 / day</span>
        </label>

      </div>

      <!-- Action Navigation -->
      <div class="pt-4 flex justify-between items-center">
        <button id="step-2-back-btn" class="btn-secondary text-xs sm:text-sm font-semibold">
          ← Back
        </button>
        <button id="step-2-next-btn" class="btn-primary text-slate-950 font-bold px-6 py-2.5 rounded-xl">
          Continue to Rider KYC →
        </button>
      </div>
    </div>
  `;
}

/**
 * Step 3: Rider KYC verification
 */
export function renderBookingStep3(vehicle, state) {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <i data-lucide="user-check" class="w-4 h-4 text-emerald-400"></i>
          Rider Details & Instant Digital KYC
        </h3>
        <span class="badge-volt text-[11px]">DigiLocker Compliant</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name (as on DL)</label>
          <input type="text" id="kyc-name" value="${state.kyc?.name || 'Avishkar Patil'}" class="custom-input" placeholder="e.g. Ramesh Deshmukh">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Mobile Number (+91 WhatsApp)</label>
          <input type="tel" id="kyc-phone" value="${state.kyc?.phone || '+91 98220 98765'}" class="custom-input" placeholder="+91 98000 00000">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address (for Tax Invoice)</label>
          <input type="email" id="kyc-email" value="${state.kyc?.email || 'rider@torqo.in'}" class="custom-input" placeholder="you@domain.com">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Driving License Number</label>
          <input type="text" id="kyc-dl" value="${state.kyc?.dlNumber || 'MH20 20210088912'}" class="custom-input uppercase" placeholder="e.g. MH20 20210001234">
        </div>
      </div>

      <!-- Verified badge simulator -->
      <div class="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/30 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <i data-lucide="check" class="w-4 h-4"></i>
        </div>
        <div>
          <span class="text-xs font-bold text-white block">Instant Verification Active</span>
          <span class="text-[11px] text-slate-400">Zero physical paperwork required at the counter. Just scan QR and ride!</span>
        </div>
      </div>

      <!-- Action Navigation -->
      <div class="pt-4 flex justify-between items-center">
        <button id="step-3-back-btn" class="btn-secondary text-xs sm:text-sm font-semibold">
          ← Back
        </button>
        <button id="step-3-next-btn" class="btn-primary text-slate-950 font-bold px-6 py-2.5 rounded-xl">
          Review & Pay →
        </button>
      </div>
    </div>
  `;
}

/**
 * Step 4: Transparent Price Breakdown & Payment Gateway Simulation
 */
export function renderBookingStep4(vehicle, state) {
  const pickup = new Date(state.pickupDate);
  const drop = new Date(state.returnDate);
  const diffTime = Math.abs(drop - pickup);
  const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const baseFare = vehicle.pricePerDay * days;
  
  let addonTotal = 0;
  if (state.addons?.pillionHelmet) addonTotal += 49 * days;
  if (state.addons?.zeroDep) addonTotal += 99 * days;
  if (state.addons?.phoneMount) addonTotal += 29 * days;
  if (state.handoverMode === 'doorstep') addonTotal += 149;

  const discount = state.promoCode === 'SAMBHAJI200' ? 200 : (state.promoCode === 'EXPLORE10' ? Math.round(baseFare * 0.1) : 0);
  const gst = Math.round((baseFare + addonTotal - discount) * 0.18);
  const refundableDeposit = vehicle.securityDeposit;
  const grandTotal = (baseFare + addonTotal - discount + gst + refundableDeposit);

  return `
    <div class="space-y-4">
      <h3 class="text-base font-bold text-white flex items-center gap-2">
        <i data-lucide="receipt" class="w-4 h-4 text-emerald-400"></i>
        Fare Summary & Transparent Breakdown
      </h3>

      <!-- Price Breakdown Card -->
      <div class="glass-panel p-4 rounded-xl border border-white/10 space-y-2 text-xs">
        
        <div class="flex justify-between text-slate-300">
          <span>Base Rental Fare (${days} days × ₹${vehicle.pricePerDay})</span>
          <span class="font-bold text-white">₹${baseFare.toLocaleString('en-IN')}</span>
        </div>

        ${addonTotal > 0 ? `
          <div class="flex justify-between text-slate-300">
            <span>Add-ons & Protection</span>
            <span class="font-bold text-white">+₹${addonTotal.toLocaleString('en-IN')}</span>
          </div>
        ` : ''}

        ${discount > 0 ? `
          <div class="flex justify-between text-emerald-400 font-semibold">
            <span>Coupon Discount (${state.promoCode})</span>
            <span>-₹${discount.toLocaleString('en-IN')}</span>
          </div>
        ` : ''}

        <div class="flex justify-between text-slate-400">
          <span>GST (18%)</span>
          <span>₹${gst.toLocaleString('en-IN')}</span>
        </div>

        <div class="flex justify-between text-amber-300 py-1.5 border-t border-white/5 font-semibold">
          <span>Refundable Security Deposit (Returned on drop-off)</span>
          <span>₹${refundableDeposit.toLocaleString('en-IN')}</span>
        </div>

        <div class="flex justify-between text-white text-base font-extrabold pt-2 border-t border-white/10">
          <span>Total Payable Amount</span>
          <span class="text-emerald-400 text-lg font-extrabold">₹${grandTotal.toLocaleString('en-IN')}</span>
        </div>

      </div>

      <!-- Promo Code Input -->
      <div class="flex gap-2">
        <input 
          type="text" 
          id="promo-code-input" 
          placeholder="Promo code (Try: SAMBHAJI200)" 
          value="${state.promoCode || ''}" 
          class="custom-input uppercase text-xs"
        />
        <button id="apply-promo-btn" class="btn-secondary px-4 text-xs font-bold whitespace-nowrap">
          Apply
        </button>
      </div>

      <!-- Payment Method Selection -->
      <div class="pt-2">
        <label class="block text-xs font-semibold text-slate-300 mb-2">Select Instant Payment Method</label>
        <div class="grid grid-cols-3 gap-2 text-xs text-center font-bold">
          <label class="pay-method-option p-3 bg-slate-900/90 rounded-xl border ${state.payMethod === 'upi' || !state.payMethod ? 'border-emerald-500/40 text-emerald-400' : 'border-white/10 text-slate-300'} cursor-pointer flex flex-col items-center gap-1 transition-colors">
            <input type="radio" name="pay-method" value="upi" ${state.payMethod === 'upi' || !state.payMethod ? 'checked' : ''} class="hidden">
            <span>⚡ UPI / QR</span>
            <span class="text-[10px] text-slate-400 font-normal">GPay / PhonePe / Paytm</span>
          </label>
          <label class="pay-method-option p-3 bg-slate-900/90 rounded-xl border ${state.payMethod === 'card' ? 'border-emerald-500/40 text-emerald-400' : 'border-white/10 text-slate-300'} cursor-pointer flex flex-col items-center gap-1 transition-colors">
            <input type="radio" name="pay-method" value="card" ${state.payMethod === 'card' ? 'checked' : ''} class="hidden">
            <span>💳 Cards</span>
            <span class="text-[10px] text-slate-400 font-normal">Credit / Debit Card</span>
          </label>
          <label class="pay-method-option p-3 bg-slate-900/90 rounded-xl border ${state.payMethod === 'netbanking' ? 'border-emerald-500/40 text-emerald-400' : 'border-white/10 text-slate-300'} cursor-pointer flex flex-col items-center gap-1 transition-colors">
            <input type="radio" name="pay-method" value="netbanking" ${state.payMethod === 'netbanking' ? 'checked' : ''} class="hidden">
            <span>🏦 NetBanking</span>
            <span class="text-[10px] text-slate-400 font-normal">All Major Indian Banks</span>
          </label>
        </div>
      </div>

      <!-- Action Navigation -->
      <div class="pt-4 flex justify-between items-center">
        <button id="step-4-back-btn" class="btn-secondary text-xs sm:text-sm font-semibold">
          ← Back
        </button>
        <button 
          id="confirm-pay-btn" 
          class="btn-primary text-slate-950 font-bold px-8 py-3 rounded-xl shadow-xl flex items-center gap-2"
          data-grand-total="${grandTotal}"
        >
          <i data-lucide="lock" class="w-4 h-4"></i>
          <span>Pay ₹${grandTotal.toLocaleString('en-IN')} & Confirm Ride</span>
        </button>
      </div>

    </div>
  `;
}

/**
 * Booking Confirmed Success Screen
 */
export function renderBookingSuccess(booking) {
  return `
    <div id="printable-receipt" class="text-center py-4 space-y-5">
      
      <!-- Celebration Icon -->
      <div class="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl border border-emerald-500/40">
        <i data-lucide="party-popper" class="w-10 h-10"></i>
      </div>

      <div>
        <span class="badge-volt text-xs font-bold">RESERVATION CONFIRMED</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          Booking Confirmed 🎉
        </h2>
        <p class="text-xs sm:text-sm text-slate-300 mt-1">
          Your ride is ready. Booking Reference: <strong class="text-emerald-400 font-mono font-bold">${booking.bookingId}</strong>
        </p>
      </div>

      <!-- Confirmation Receipt Box -->
      <div class="glass-panel p-5 rounded-2xl border border-white/10 text-left max-w-lg mx-auto space-y-3 text-xs">
        
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span class="text-slate-400 block text-[10px]">Vehicle</span>
            <span class="text-sm font-bold text-white">${booking.vehicle.name}</span>
          </div>
          <span class="badge-amber font-mono">${booking.vehicle.category.toUpperCase()}</span>
        </div>

        <div class="grid grid-cols-2 gap-3 pb-3 border-b border-white/10">
          <div>
            <span class="text-slate-400 block text-[10px]">Pickup Date & Hub</span>
            <span class="font-bold text-white">${booking.pickupDate}</span>
            <span class="text-slate-400 block text-[11px]">${booking.vehicle.location}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">Return Date</span>
            <span class="font-bold text-white">${booking.returnDate}</span>
            <span class="text-slate-400 block text-[11px]">Same Hub Handover</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pb-3 border-b border-white/10">
          <div>
            <span class="text-slate-400 block text-[10px]">Host Partner</span>
            <span class="font-bold text-emerald-400">${booking.vehicle.partnerName}</span>
            <span class="text-slate-400 block text-[11px]">📞 Contact: +91 98230 45891</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">Rider KYC</span>
            <span class="font-bold text-white">${booking.kyc.name}</span>
            <span class="text-slate-400 block text-[11px]">DL: ${booking.kyc.dlNumber}</span>
          </div>
        </div>

        <div class="flex justify-between items-center pt-1 text-sm font-bold text-white">
          <span>Amount Paid (Incl. Deposit)</span>
          <span class="text-emerald-400 text-base">₹${booking.grandTotal.toLocaleString('en-IN')}</span>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-center gap-3 flex-wrap pt-2">
        <button onclick="window.print()" class="btn-secondary text-xs sm:text-sm font-semibold flex items-center gap-2">
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span>Print / PDF Invoice</span>
        </button>
        <button id="whatsapp-share-btn" class="bg-[#25D366] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 hover:opacity-90">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>WhatsApp Details</span>
        </button>
        <button id="finish-booking-btn" class="btn-primary text-slate-950 font-bold px-6 py-2 rounded-xl text-xs sm:text-sm">
          Done
        </button>
      </div>

    </div>
  `;
}
