# DriveMart — India's Marketplace for Vehicle Rentals ⚡

> Modern, premium, tech-focused self-drive vehicle rental marketplace connecting verified local rental fleet operators with customers in **Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, India**.

![DriveMart Banner](https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

* **🏍️ Multi-Category Verified Fleet**:
  * **Bikes**: Royal Enfield Hunter 350, Classic 350, Yamaha YZF-R15 V4, KTM Duke 250
  * **Scooters**: Honda Activa 6G, Ather 450X Gen 3 (EV), TVS Jupiter 125
  * **Cars**: Maruti Suzuki Swift ZXi+, Hyundai i20 Asta IVT, Tata Nexon EV
  * **SUVs & 4x4**: Mahindra Thar 4x4, Hyundai Creta SX, Mahindra Scorpio-N (7-Seater)
  * **Vans**: Maruti Suzuki Ertiga ZXi Smart Hybrid
* **⚡ Smart Search Engine**: Local Sambhajinagar hub pickup auto-detection (Railway Station, CIDCO Connaught, MGM Jalna Rd, Airport, Waluj MIDC) with live dates and doorstep delivery option.
* **🛡️ 4-Step Instant Booking**:
  1. Trip details & Handover method
  2. Add-ons & protection gear (Free ISI helmet, Pillion helmet, Zero-Dep waiver, Phone mount)
  3. Instant digital KYC (Driving license & Aadhaar)
  4. Transparent fare breakdown + simulated UPI / Cards / NetBanking payment
  5. Booking Confirmed pass with QR code, WhatsApp sharing, and PDF invoice printing.
* **🏢 Rental Partner Portal**: Live KPI metrics (Revenue ₹2.84L, 84% utilization), Chart.js trend charts, Fleet inventory manager, and 1-click booking request management.
* **👑 Admin Super-Console**: Marketplace GMV tracking (₹18.45L), 12% commission ledger, and partner/vehicle KYC verification tables.
* **🌓 Light & Dark Theme**: 1-click persistent theme toggle across all views.
* **📍 Programmatic SEO**: Dedicated landing pages for Sambhajinagar bike, scooter, car, and SUV rentals with Schema.org `AutoRental` JSON-LD microdata.

---

## 🚀 Getting Started

### Run Locally:
No heavy dependencies or build steps required. Simply open `index.html` in any modern web browser or serve it via Python / Ruby / any static HTTP server:

```bash
# Using Ruby (built into macOS)
ruby -run -ehttpd . -p8000

# Using Python 3
python3 -m http.server 8000
```

Then visit: `http://localhost:8000/`

### Deploying to Vercel

The frontend can be deployed to Vercel as a static site, but `server.js` is a
long-running Node HTTP server and cannot run as a Vercel deployment entrypoint.
The `/api` features (login, bookings, and admin endpoints) therefore require a
separate Node host or a rewrite to a serverless API implementation. Do not use
`npm start` as the Vercel build command.

---

## 📂 Project Structure

```
├── index.html                  # Main application entry point & Schema.org JSON-LD
├── css/
│   └── styles.css              # Design system, glassmorphism, animations, Dark & Light theme
├── js/
│   ├── app.js                  # Main controller, router, and reactive state manager
│   ├── components/
│   │   ├── heroSearch.js       # Interactive hero search widget
│   │   ├── vehicleCatalog.js   # Vehicle cards & detail specs modal
│   │   ├── bookingModal.js     # 4-step reservation and payment flow
│   │   ├── partnerDashboard.js # Host analytics & fleet manager
│   │   ├── adminDashboard.js   # Master platform console
│   │   └── seoPages.js         # Dedicated SEO city landing pages
│   └── data/
│       ├── vehicles.js         # Verified vehicle fleet database
│       ├── partners.js         # Host operators & verified reviews
│       └── locations.js        # Sambhajinagar hubs & tourist routes
└── README.md
```

---

## 📄 License
© 2026 DriveMart Technologies Pvt. Ltd. All rights reserved.
