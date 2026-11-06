export const products = [
  {
    "id": "dinedesk",
    "name": "DineDesk",
    "subtitle": "Atelier Restaurant POS & Billing System",
    "category": "Restaurant POS and operations desktop software",
    "status": "Advanced beta / pre-production",
    "summary": "Sri is building DineDesk, an offline-resilient restaurant POS and operations application that connects billing, tables, kitchen tickets, inventory and staff workflows.",
    "audiences": [
      "Restaurant owners and managers",
      "Cashiers and billing staff",
      "Waitstaff and captains",
      "Kitchen chefs and station cooks"
    ],
    "venues": [
      "Restaurants",
      "Multi-branch operations",
      "QSR",
      "Cloud kitchens",
      "Cafes",
      "Bakeries"
    ],
    "features": [
      {
        "id": "pos",
        "title": "POS and quick billing",
        "description": "Catalog search, dine-in/takeaway/online order modes, tax and discount calculation, and receipt settlement."
      },
      {
        "id": "kds",
        "title": "Multi-station kitchen display",
        "description": "Station-routed KOT tickets, preparation timers, status updates, alerts and audited reprints."
      },
      {
        "id": "payments",
        "title": "Split billing and reconciliation",
        "description": "Multi-guest split settlement, credit-customer ledgers, payment-provider adapters and payout reconciliation."
      },
      {
        "id": "tables",
        "title": "Floor and table management",
        "description": "Floor layouts, occupancy states, table merge and transfer workflows."
      },
      {
        "id": "inventory",
        "title": "Inventory and recipe costing",
        "description": "Ingredient stock movements, recipe-based depletion, batch/expiry tracking, purchase orders and suppliers."
      },
      {
        "id": "staff",
        "title": "Staff and shifts",
        "description": "Role-based access, PIN sign-in, shift scheduling, staff notices and payroll workflows."
      }
    ],
    "contributions": [
      "Designed and implemented the React/TypeScript desktop client and Express/TypeScript/Prisma/SQLite backend.",
      "Engineered server-authoritative billing, duplicate-settlement safeguards, split-payment transactions and stock integrity.",
      "Built the Electron shell, ESC/POS receipt formatting, LAN printing and supported offline outbox workflows.",
      "Implemented authentication, session expiry, access control, audit history and automated test suites."
    ],
    "technologies": [
      "React 19",
      "TypeScript",
      "Vite",
      "Electron 44",
      "Node.js",
      "Express 4",
      "Prisma 6",
      "SQLite",
      "Lucide React",
      "ESC/POS",
      "TCP printing"
    ],
    "integrations": [
      "Razorpay",
      "Cashfree",
      "Paytm",
      "Meta WhatsApp Cloud API"
    ],
    "publicUrl": null,
    "distribution": "Private local/on-premise desktop application; owner reports macOS and Windows packaging.",
    "logo": "/static/media/assistant/dinedesk-logo.svg",
    "mediaIds": [
      "dinedesk-kitchen",
      "dinedesk-analytics"
    ],
    "boundaries": [
      "Pre-production: live merchant credentials and physical hardware field testing are outstanding according to the owner.",
      "Do not promise enterprise readiness, regulatory compliance or successful real-money processing from a local screenshot.",
      "Offline support is scoped to supported queued operations; the inspected outbox checks reject offline card/split/invalid/unsaved-order settlements.",
      "Swiggy/Zomato labels in example screens do not establish a live or certified partner integration; the desktop README explicitly states that partner adapters, rider updates and catalog sync are not implemented.",
      "Displayed sales, orders and customer examples are screenshot/demo data, not commercial traction."
    ]
  },
  {
    "id": "invoice-picker",
    "name": "Invoice Picker",
    "category": "Freelancer invoicing and finance web application",
    "status": "Production-ready beta, as reported by the owner",
    "summary": "Sri built Invoice Picker, a local-first invoicing and finance workspace for freelancers and small agencies, with invoice creation, expense tracking, client records and Firebase-backed sync.",
    "audiences": [
      "Freelancers",
      "Independent contractors",
      "Creative professionals",
      "Consultants",
      "Solo founders",
      "Small agencies"
    ],
    "features": [
      {
        "id": "invoices",
        "title": "Invoice creation and PDF export",
        "description": "Line items, discounts, tax breakdowns, freelance/business modes, custom signature styling and client-side PDF export."
      },
      {
        "id": "dashboard",
        "title": "Financial dashboard",
        "description": "Income/expense trends, cash-flow charts and unpaid-invoice tracking."
      },
      {
        "id": "expenses",
        "title": "Expense tracking",
        "description": "Expense categories, vendor information and payment-method records."
      },
      {
        "id": "clients",
        "title": "Client records and catalog",
        "description": "Billing details, tax identifiers, payment terms and reusable rates."
      },
      {
        "id": "sync",
        "title": "Local-first cloud sync",
        "description": "Firebase authentication, user-scoped browser caching and background Firestore persistence."
      }
    ],
    "contributions": [
      "Architected the single-page application, state model and hash router.",
      "Designed the warm parchment visual system and invoice layout.",
      "Built dashboard, invoices, expenses, clients, templates, history and settings controllers.",
      "Implemented the cache-first database layer and marketing/documentation pages.",
      "Authored automated functional checks and DOM integrity checks."
    ],
    "technologies": [
      "JavaScript ES modules",
      "HTML",
      "CSS",
      "Chart.js",
      "html2pdf.js",
      "jsPDF",
      "Firebase Auth",
      "Cloud Firestore",
      "Firebase Storage",
      "Vercel"
    ],
    "publicUrl": "https://invoicepicker.com",
    "alternateUrl": "https://invoiceflow-3cb61.web.app",
    "logo": "/static/media/assistant/invoice-picker-logo.png",
    "mediaIds": [
      "invoice-picker-template",
      "invoice-picker-dashboard"
    ],
    "boundaries": [
      "Both public URLs are owner-supplied. The web inspection tool could not access either URL; availability was not verified.",
      "The local code and screenshots use Invoice Picker as the current product name.",
      "Do not infer legal tax compliance, universal offline operation, current pricing or sub-60-second performance without further evidence.",
      "html2pdf.js usage establishes PDF export, not a guarantee that every PDF element is vector-based.",
      "The template uses example invoice data. The dashboard screenshot is an empty state, not revenue evidence.",
      "Marketing copy about accounts-payable capture/matching does not itself establish implemented OCR, matching or approval features."
    ]
  }
];

export const interests = [
  {"id":"travel","title":"Travel","fact":"Sri enjoys travelling.","mediaIds":[],"source":"Owner supplied, 5 November 2026"},
  {"id":"bike-rides","title":"Bike rides","fact":"Sri enjoys bike rides.","mediaIds":[],"source":"Owner supplied, 5 November 2026"},
  {"id":"gym","title":"Gym","fact":"Sri is interested in the gym and fitness.","mediaIds":[],"source":"Owner supplied, 5 November 2026"},
  {"id":"learning-technology","title":"Learning technology","fact":"Sri enjoys learning new technologies and building across frontend interfaces and backend services.","aliases":["laptop","macbook","workspace","developer workspace"],"mediaIds":["personal:developer-workspace","personal:mongodb-coffee"],"source":"Owner supplied, 5 November 2026"},
  {"id":"football","title":"Football","fact":"Sri enjoys watching football and playing on weekends.","mediaIds":["personal:lionel-messi"],"source":"Owner supplied, 5 November 2026"},
  {"id":"messi","title":"Lionel Messi","fact":"Sri likes Lionel Messi.","mediaIds":["personal:lionel-messi"],"source":"Owner supplied, 5 November 2026"},
  {"id":"cricket","title":"Cricket","fact":"Sri likes cricket. The MS Dhoni image represents that interest.","aliases":["dhoni","ms dhoni","mahi"],"mediaIds":["personal:cricket"],"source":"Owner supplied, 5 November 2026"},
  {"id":"f1","title":"Formula 1","fact":"Sri enjoys watching the Formula 1 series. His red racing-car image represents that interest.","mediaIds":["personal:formula-one"],"source":"Owner confirmed, 6 November 2026"},
  {"id":"mongodb-event","title":"MongoDB.local attendance","fact":"Sri has already attended MongoDB.local. His event photo shows a MongoDB.local cup beside an event sign. The event city and date have not been supplied.","aliases":["mongodb local","mongodb event","mongo db","mango dp","mango db","mongodb coffee"],"mediaIds":["personal:mongodb-coffee"],"source":"Owner confirmed attendance, 6 November 2026"},
  {"id":"naruto","title":"Naruto","fact":"Sri is a Naruto fan. The Naruto artwork represents his interest in anime; he has not specified a favourite character or story arc.","aliases":["anime","naruto fan"],"mediaIds":["personal:naruto"],"source":"Owner confirmed, 6 November 2026"},
  {"id":"basketball","title":"Basketball","fact":"Sri likes basketball.","mediaIds":["personal:basketball"],"source":"Owner supplied, 5 November 2026"}
];
