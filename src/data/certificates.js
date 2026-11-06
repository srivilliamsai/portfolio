// Titles and dates transcribed from the three owner-selected certificate documents.
export const certificates = [
  {
    "id": "google-professional-cloud-developer",
    "title": "Professional Cloud Developer",
    "issuer": "Google Cloud",
    "kind": "Professional certification",
    "category": "Cloud & data",
    "issued": "27 October 2026",
    "validUntil": "2028-10-27",
    "note": null,
    "width": 2200,
    "height": 1700,
    "src": "/static/media/certificates/google-professional-cloud-developer.jpg",
    "thumbnail": "/static/media/certificates/google-professional-cloud-developer-thumb.jpg"
  },
  {
    "id": "mongodb-associate-developer",
    "title": "MongoDB Certified Associate Developer",
    "issuer": "MongoDB",
    "kind": "Associate certification",
    "category": "Cloud & data",
    "issued": "24 July 2026",
    "validUntil": null,
    "note": null,
    "width": 2200,
    "height": 1702,
    "src": "/static/media/certificates/mongodb-associate-developer.jpg",
    "thumbnail": "/static/media/certificates/mongodb-associate-developer-thumb.jpg"
  },
  {
    "id": "claude-architect-foundations",
    "title": "Claude Certified Architect — AI",
    "issuer": "Anthropic",
    "kind": "Foundations certificate",
    "category": "AI",
    "issued": "15 March 2026",
    "validUntil": "2026-09-15",
    "note": "Validity shown on document: 15 March–15 September 2026.",
    "width": 2200,
    "height": 1700,
    "src": "/static/media/certificates/claude-architect-foundations.jpg",
    "thumbnail": "/static/media/certificates/claude-architect-foundations-thumb.jpg"
  }
];

export const certificateCategories = ['All', 'Cloud & data', 'AI'];
export const filterCertificates = (category = 'All') => category === 'All' ? certificates : certificates.filter((certificate) => certificate.category === category);
