/**
 * Admin Super-Console Component for DriveMart Marketplace
 * Master Platform Operations & 5-View Photo Verification Queue
 */
import { PARTNERS_DATA } from '../data/partners.js';
import { VEHICLES_DATA, getMarketplaceVehicles } from '../data/vehicles.js';
import { getVehiclePrimaryPhoto } from './vehicleCatalog.js';

export function renderAdminDashboard() {
  const allVehicles = getMarketplaceVehicles();
  const totalVehicles = allVehicles.length;
  const totalPartners = PARTNERS_DATA.length;
  const totalBookings = 1840;
  const totalGMV = 1845000;
  const netCommission = Math.round(totalGMV * 0.12);

  const pendingVerificationList = allVehicles.filter(v => v.photoStatus === 'pending');
  const verifiedList = allVehicles.filter(v => v.photoStatus === 'verified' || !v.photoStatus);

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Admin Header Bar -->
      <div class="glass-panel p-6 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="badge-volt text-xs">Marketplace Master Console</span>
            <span class="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">SuperAdmin</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">DriveMart Platform Operations</h1>
          <p class="text-xs text-slate-400">Launch Region: Chhatrapati Sambhajinagar • 5-View Photo Verification & Host Management</p>
        </div>

        <div class="flex items-center gap-3">
          <button id="admin-switch-customer-btn" class="btn-secondary text-xs sm:text-sm font-semibold">
            ← Switch to Customer View
          </button>
        </div>
      </div>

      <!-- 8 Key Platform Metric Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        
        <!-- GMV -->
        <div class="glass-card p-4">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Gross Merchandise Value (GMV)</span>
          <div class="text-xl sm:text-2xl font-extrabold text-emerald-400">₹${(totalGMV / 100000).toFixed(2)} Lakhs</div>
          <span class="text-[10px] text-emerald-300 font-semibold">↑ +24% MoM</span>
        </div>

        <!-- Platform Commission -->
        <div class="glass-card p-4">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Net Platform Commission (12%)</span>
          <div class="text-xl sm:text-2xl font-extrabold text-white">₹${(netCommission / 100000).toFixed(2)} Lakhs</div>
          <span class="text-[10px] text-slate-400 font-semibold">Net Platform Revenue</span>
        </div>

        <!-- Total Bookings -->
        <div class="glass-card p-4">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Trips Completed</span>
          <div class="text-xl sm:text-2xl font-extrabold text-white">${totalBookings.toLocaleString('en-IN')}</div>
          <span class="text-[10px] text-blue-400 font-semibold">99.4% Fulfillment Rate</span>
        </div>

        <!-- Total Active Fleet -->
        <div class="glass-card p-4">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Listed Fleet</span>
          <div class="text-xl sm:text-2xl font-extrabold text-white">${totalVehicles} Vehicles</div>
          <span class="text-[10px] text-purple-400 font-semibold">Across 6 Categories</span>
        </div>

        <!-- Active Partners -->
        <div class="glass-card p-4">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Active Verified Partners</span>
          <div class="text-xl sm:text-2xl font-extrabold text-white">${totalPartners} Hosts</div>
          <span class="text-[10px] text-amber-400 font-semibold">Sambhajinagar Operators</span>
        </div>

        <!-- Registered Customers -->
        <div class="glass-card p-4">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total Registered Users</span>
          <div class="text-xl sm:text-2xl font-extrabold text-white">4,820 Riders</div>
          <span class="text-[10px] text-emerald-400 font-semibold">DigiLocker KYC Verified</span>
        </div>

        <!-- Pending Photo Verification Count -->
        <div class="glass-card p-4 ${pendingVerificationList.length > 0 ? 'border-amber-500/50 bg-amber-500/5' : ''}">
          <span class="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">Photo Verification Queue</span>
          <div class="text-xl sm:text-2xl font-extrabold ${pendingVerificationList.length > 0 ? 'text-amber-300' : 'text-slate-300'}">
            ${pendingVerificationList.length} Pending
          </div>
          <span class="text-[10px] text-slate-400 font-semibold">5-view photo inspection</span>
        </div>

        <!-- Verified Photo Ratio -->
        <div class="glass-card p-4">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Actual Photos Compliance</span>
          <div class="text-xl sm:text-2xl font-extrabold text-emerald-400">100%</div>
          <span class="text-[10px] text-emerald-300 font-semibold">Zero generic stock images</span>
        </div>

      </div>

      <!-- SECTION: 5-VIEW PHOTO VERIFICATION QUEUE (CRITICAL WORKFLOW) -->
      <div class="glass-card p-6 rounded-3xl border border-white/10 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="badge-volt text-xs">Admin Quality Control</span>
              <span class="text-xs text-slate-400 font-mono">Manual Verification Pipeline</span>
            </div>
            <h2 class="text-xl font-extrabold text-white mt-1">📸 Actual Bike Photo Verification Queue</h2>
            <p class="text-xs text-slate-400">
              Inspect all 5 mandatory views (Front, Left, Right, Rear, Odometer) before approving listings for customer search.
            </p>
          </div>

          <span class="text-xs font-bold px-3 py-1.5 rounded-xl ${pendingVerificationList.length > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
            ${pendingVerificationList.length > 0 ? `⚠️ ${pendingVerificationList.length} Listings Awaiting Review` : '✓ All Photos Verified'}
          </span>
        </div>

        ${pendingVerificationList.length === 0 ? `
          <div class="text-center py-10 bg-slate-900/40 rounded-2xl border border-white/5 space-y-2">
            <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 class="text-sm font-bold text-white">Verification Queue is Clear!</h3>
            <p class="text-xs text-slate-400 max-w-sm mx-auto">
              All owner-submitted bike photos have been verified. Newly listed bikes will appear here instantly for review.
            </p>
          </div>
        ` : `
          <div class="space-y-6">
            ${pendingVerificationList.map(v => {
              const photos = Array.isArray(v.photos) ? v.photos : [];
              return `
                <div class="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-4" data-pending-id="${v.id}">
                  
                  <!-- Vehicle Header Info -->
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-extrabold text-white">${v.brand} ${v.model} (${v.variant || 'Standard'})</span>
                        <span class="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-white/10">${v.id}</span>
                        <span class="badge-volt text-[9px]">${v.category.toUpperCase()}</span>
                      </div>
                      <p class="text-xs text-slate-400 mt-0.5">
                        Owner/Host: <strong class="text-slate-200">${v.partnerName || 'Owner'}</strong> • ₹${v.pricePerDay}/day • Location: ${v.location}
                      </p>
                    </div>

                    <!-- Action Controls -->
                    <div class="flex items-center gap-2">
                      <button 
                        class="admin-verify-photos-btn btn-primary text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
                        data-vehicle-id="${v.id}"
                      >
                        <i data-lucide="check-circle" class="w-4 h-4"></i>
                        <span>Approve & Verify All 5 Photos ✓</span>
                      </button>
                      <button 
                        class="admin-reject-photos-btn px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-colors"
                        data-vehicle-id="${v.id}"
                      >
                        Reject ✕
                      </button>
                    </div>
                  </div>

                  <!-- 5 Mandatory Photos Grid Preview -->
                  <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    ${photos.map(ph => `
                      <div class="space-y-1.5 text-center">
                        <div class="relative h-28 rounded-xl overflow-hidden bg-slate-950 border border-white/10 group">
                          <img src="${ph.url}" alt="${ph.label}" class="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                          <span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${ph.isPrimary ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900/90 text-white'}">
                            ${ph.isPrimary ? 'PRIMARY' : ph.type.toUpperCase()}
                          </span>
                        </div>
                        <span class="text-[11px] font-bold text-slate-300 block">${ph.label}</span>
                      </div>
                    `).join('')}
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

      <!-- Table: All Listed Vehicles in Marketplace -->
      <div class="glass-card p-6 rounded-3xl border border-white/10">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base font-bold text-white">Full Marketplace Inventory & Actual Photos</h3>
            <p class="text-xs text-slate-400">All registered vehicles with isolated photo sets and verification status</p>
          </div>
          <span class="badge-volt text-xs">${allVehicles.length} Total Vehicles</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="text-slate-400 uppercase bg-slate-900/60 border-b border-white/5">
              <tr>
                <th class="p-3">Primary Photo</th>
                <th class="p-3">Vehicle Details</th>
                <th class="p-3">Category</th>
                <th class="p-3">Daily Rent</th>
                <th class="p-3">Photos Count</th>
                <th class="p-3">Verification Status</th>
                <th class="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${allVehicles.map(v => {
                const primaryImg = getVehiclePrimaryPhoto(v);
                const photoCount = Array.isArray(v.photos) ? v.photos.length : 0;
                const status = v.photoStatus || 'verified';
                
                return `
                  <tr class="hover:bg-slate-900/40">
                    <td class="p-3">
                      <div class="w-14 h-10 rounded-lg overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                        ${primaryImg ? `<img src="${primaryImg}" alt="${v.name}" class="w-full h-full object-cover"/>` : '<span class="text-[9px] text-slate-500">No Photo</span>'}
                      </div>
                    </td>
                    <td class="p-3">
                      <div class="font-bold text-white">${v.brand} ${v.model}</div>
                      <div class="text-[10px] font-mono text-slate-400">${v.id} • ${v.partnerName || 'Owner'}</div>
                    </td>
                    <td class="p-3 uppercase font-mono text-slate-300">${v.category}</td>
                    <td class="p-3 font-bold text-emerald-400">₹${v.pricePerDay}/day</td>
                    <td class="p-3">
                      <span class="font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        ${photoCount} Views
                      </span>
                    </td>
                    <td class="p-3">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${status === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : (status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30')}">
                        ${status.toUpperCase()}
                      </span>
                    </td>
                    <td class="p-3 text-right space-x-2">
                      <button 
                        class="admin-view-vehicle-modal-btn px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-white/10"
                        data-vehicle-id="${v.id}"
                      >
                        Inspect 5 Views
                      </button>
                      ${status === 'pending' ? `
                        <button 
                          class="admin-verify-photos-btn px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                          data-vehicle-id="${v.id}"
                        >
                          Verify ✓
                        </button>
                      ` : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}
