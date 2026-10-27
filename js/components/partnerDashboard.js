/**
 * Rental Partner Portal Component for DriveMart
 */
import { PARTNERS_DATA } from '../data/partners.js';
import { VEHICLES_DATA } from '../data/vehicles.js';

export function renderPartnerDashboard(partner = PARTNERS_DATA[0], partnerVehicles = VEHICLES_DATA.filter(v => v.partnerId === partner.id)) {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Partner Header Bar -->
      <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            ${partner.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-extrabold text-white">${partner.name}</h1>
              <span class="badge-volt text-[10px]">Verified Host</span>
            </div>
            <p class="text-xs text-slate-400">
              Host: <strong class="text-slate-200">${partner.ownerName}</strong> • ${partner.address}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button id="add-vehicle-modal-btn" class="btn-primary text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Add New Vehicle</span>
          </button>
          <button id="partner-switch-customer-btn" class="btn-secondary text-xs sm:text-sm font-semibold">
            ← Switch to Customer View
          </button>
        </div>
      </div>

      <!-- Partner Navigation Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/10 scrollbar-none">
        <button data-partner-tab="overview" class="partner-tab-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 text-slate-950 shadow-md">
          📊 Dashboard Overview
        </button>
        <button data-partner-tab="vehicles" class="partner-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
          🚗 My Fleet (${partnerVehicles.length})
        </button>
        <button data-partner-tab="bookings" class="partner-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
          📅 Active Bookings (14)
        </button>
        <button data-partner-tab="earnings" class="partner-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
          💰 Earnings & Payouts
        </button>
        <button data-partner-tab="reviews" class="partner-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
          ⭐ Customer Reviews (${partner.reviewsCount})
        </button>
      </div>

      <!-- TAB 1: OVERVIEW TAB CONTENT -->
      <div id="partner-tab-content-overview" class="partner-tab-view space-y-8">
        
        <!-- 4 Core Metric KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- Monthly Revenue -->
          <div class="glass-card p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Revenue</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <i data-lucide="indian-rupee" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-white">₹${partner.monthlyRevenue.toLocaleString('en-IN')}</div>
            <div class="flex items-center gap-1 mt-2 text-xs text-emerald-400 font-semibold">
              <i data-lucide="trending-up" class="w-3.5 h-3.5"></i>
              <span>+18.4% vs last month</span>
            </div>
          </div>

          <!-- Total Bookings -->
          <div class="glass-card p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</span>
              <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <i data-lucide="calendar-check" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-white">142 Trips</div>
            <div class="flex items-center gap-1 mt-2 text-xs text-blue-400 font-semibold">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i>
              <span>Avg. Trip: 2.8 Days</span>
            </div>
          </div>

          <!-- Active Vehicles -->
          <div class="glass-card p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Vehicles</span>
              <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <i data-lucide="car" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-white">${partner.totalVehicles} Vehicles</div>
            <div class="flex items-center gap-1 mt-2 text-xs text-purple-400 font-semibold">
              <span>${partner.activeTrips} currently on road</span>
            </div>
          </div>

          <!-- Fleet Utilization -->
          <div class="glass-card p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fleet Utilization</span>
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <i data-lucide="pie-chart" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-white">${partner.fleetUtilization}%</div>
            <div class="flex items-center gap-1 mt-2 text-xs text-amber-400 font-semibold">
              <span>⭐ ${partner.rating} / 5.0 Rating</span>
            </div>
          </div>

        </div>

        <!-- Visual Analytics Chart Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Revenue Trends Chart -->
          <div class="glass-card p-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-base font-bold text-white">Monthly Earnings Trend (₹)</h3>
                <p class="text-xs text-slate-400">Past 6 months payout history</p>
              </div>
              <span class="badge-volt text-xs">2026 Live</span>
            </div>
            <div class="h-64 relative">
              <canvas id="partnerRevenueChart"></canvas>
            </div>
          </div>

          <!-- Category Utilization Breakdown -->
          <div class="glass-card p-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-base font-bold text-white">Vehicle Utilization by Category</h3>
                <p class="text-xs text-slate-400">Occupancy rates across Bikes, SUVs & Cars</p>
              </div>
              <span class="badge-amber text-xs">High Demand</span>
            </div>
            <div class="h-64 relative">
              <canvas id="partnerUtilizationChart"></canvas>
            </div>
          </div>

        </div>

        <!-- Pending Booking Requests Queue -->
        <div class="glass-card p-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-white">Live Booking Requests (Action Required)</h3>
              <p class="text-xs text-slate-400">Accept or reschedule incoming reservation requests</p>
            </div>
            <span class="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              3 Pending
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="text-slate-400 uppercase bg-slate-900/60 border-b border-white/5">
                <tr>
                  <th class="p-3">Booking ID</th>
                  <th class="p-3">Customer</th>
                  <th class="p-3">Vehicle</th>
                  <th class="p-3">Dates</th>
                  <th class="p-3">Payout Fare</th>
                  <th class="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr class="hover:bg-slate-900/40">
                  <td class="p-3 font-mono text-emerald-400 font-bold">TORQO-CSN-9921</td>
                  <td class="p-3 font-semibold text-white">Vikram Rathod (Pune)</td>
                  <td class="p-3">Mahindra Thar 4x4</td>
                  <td class="p-3">Mar 01 - Mar 03 (3 Days)</td>
                  <td class="p-3 font-bold text-white">₹9,240</td>
                  <td class="p-3 text-right space-x-2">
                    <button class="accept-booking-btn px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400">
                      Accept
                    </button>
                    <button class="px-3 py-1 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700">
                      Decline
                    </button>
                  </td>
                </tr>
                <tr class="hover:bg-slate-900/40">
                  <td class="p-3 font-mono text-emerald-400 font-bold">TORQO-CSN-9924</td>
                  <td class="p-3 font-semibold text-white">Neha Kulkarni (Mumbai)</td>
                  <td class="p-3">Royal Enfield Classic 350</td>
                  <td class="p-3">Mar 02 - Mar 04 (2 Days)</td>
                  <td class="p-3 font-bold text-white">₹2,110</td>
                  <td class="p-3 text-right space-x-2">
                    <button class="accept-booking-btn px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400">
                      Accept
                    </button>
                    <button class="px-3 py-1 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700">
                      Decline
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- TAB 2: MY FLEET / VEHICLES TAB CONTENT -->
      <div id="partner-tab-content-vehicles" class="partner-tab-view hidden space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white">Fleet Inventory & Live Rates</h2>
            <p class="text-xs text-slate-400">Manage daily rental prices, availability status, and maintenance</p>
          </div>
          <button id="add-vehicle-btn-2" class="btn-primary text-slate-950 text-xs font-bold flex items-center gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>List Vehicle</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${partnerVehicles.map(v => `
            <div class="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
              <div>
                <div class="relative h-40 rounded-lg overflow-hidden mb-3 bg-slate-950">
                  <img src="${v.image}" alt="${v.name}" class="w-full h-full object-cover"/>
                  <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${v.isAvailable ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'}">
                    ${v.isAvailable ? 'AVAILABLE' : 'ON TRIP'}
                  </span>
                </div>
                <h4 class="text-sm font-bold text-white">${v.name}</h4>
                <p class="text-xs text-slate-400">${v.category.toUpperCase()} • ${v.transmission} • ${v.fuelType}</p>
                
                <div class="mt-3 flex items-center justify-between text-xs py-2 border-t border-white/5">
                  <span class="text-slate-400">Daily Price</span>
                  <span class="text-base font-extrabold text-emerald-400">₹${v.pricePerDay}</span>
                </div>
              </div>

              <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                <button class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex-1">
                  Edit Price
                </button>
                <button class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex-1">
                  Calendar
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TAB 3: BOOKINGS TAB CONTENT -->
      <div id="partner-tab-content-bookings" class="partner-tab-view hidden space-y-6">
        <div class="glass-card p-6">
          <h2 class="text-lg font-bold text-white mb-4">Confirmed Trips & Key Handover Queue</h2>
          <p class="text-xs text-slate-400 mb-6">Verify customer driving license and perform return inspection checklist</p>
          
          <div class="space-y-4">
            <div class="glass-panel p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <i data-lucide="key" class="w-5 h-5"></i>
                </div>
                <div>
                  <div class="text-sm font-bold text-white">Trip #TORQO-CSN-8840 • Mahindra Thar 4x4</div>
                  <div class="text-xs text-slate-400">Rider: Avishkar Patil • Pickup: CIDCO Connaught Hub • Return: Today 8:00 PM</div>
                </div>
              </div>
              <button class="handover-inspection-btn btn-primary text-slate-950 text-xs font-bold px-4 py-2">
                Conduct Return Inspection →
              </button>
            </div>

            <div class="glass-panel p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <i data-lucide="clock" class="w-5 h-5"></i>
                </div>
                <div>
                  <div class="text-sm font-bold text-white">Trip #TORQO-CSN-8831 • Ather 450X Gen 3</div>
                  <div class="text-xs text-slate-400">Rider: Sagar Shinde • Pickup: Station Hub • Status: Active on Trip</div>
                </div>
              </div>
              <span class="badge-volt text-xs">On Trip (GPS Active)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: EARNINGS TAB CONTENT -->
      <div id="partner-tab-content-earnings" class="partner-tab-view hidden space-y-6">
        <div class="glass-card p-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <span class="text-xs text-slate-400">Available Payout Balance</span>
              <div class="text-3xl font-extrabold text-emerald-400">₹64,280</div>
              <p class="text-xs text-slate-400 mt-1">Platform Commission rate: 12% • Next automated payout: Friday</p>
            </div>
            <button id="instant-payout-btn" class="btn-primary text-slate-950 text-xs sm:text-sm font-bold px-6 py-3">
              Request Instant Bank Payout ⚡
            </button>
          </div>

          <div class="pt-6">
            <h3 class="text-sm font-bold text-white mb-4">Recent Settlements & Payout Log</h3>
            <div class="space-y-3 text-xs">
              <div class="glass-panel p-3 rounded-xl flex justify-between items-center text-slate-300">
                <div>
                  <span class="font-bold text-white block">Weekly Payout to HDFC Bank (A/C ***8812)</span>
                  <span class="text-[11px] text-slate-400">Reference: UTR-MH-2026-991204</span>
                </div>
                <div class="text-right">
                  <span class="text-emerald-400 font-bold block">+₹72,400</span>
                  <span class="text-[10px] text-slate-500">Credited on Feb 26, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: REVIEWS TAB CONTENT -->
      <div id="partner-tab-content-reviews" class="partner-tab-view hidden space-y-6">
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-white">Customer Reviews & Host Rating</h3>
              <p class="text-xs text-slate-400">Overall Host Score: <strong>4.9 / 5.0</strong> based on 420 verified rentals</p>
            </div>
            <div class="text-2xl font-black text-amber-400">★ 4.90</div>
          </div>

          <div class="space-y-4">
            <div class="p-4 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white text-xs">Pooja Jadhav</span>
                  <span class="text-amber-400 text-xs">★★★★★</span>
                </div>
                <span class="text-[10px] text-slate-400">Yesterday</span>
              </div>
              <p class="text-xs text-slate-300">"Vehicle was given in mint clean condition with full tank fuel. Handover at CIDCO took literally 2 minutes. Will definitely rent again for my Ellora trips!"</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

