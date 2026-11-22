export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export const SITE = {
  name: 'The Crossing',
  fullName: 'The Crossing Ministry at CFCC Hayward',
  tagline: 'Crossing generations and cultures together in Christ.',
  description:
    'The Crossing is the English-speaking, multiethnic ministry of Chinese For Christ Church of Hayward in the East Bay Area, CA. Join us Sundays at 9:30 AM.',
  serviceTime: 'Sundays at 9:30 AM',
  address: {
    street: '157 Smalley Ave',
    cityStateZip: 'Hayward, CA 94541',
    full: '157 Smalley Ave, Hayward, CA 94541',
    mapsQuery: 'https://maps.google.com/?q=157+Smalley+Ave+Hayward+CA+94541',
    mapsEmbed:
      'https://maps.google.com/maps?hl=en-US&ll=37.668326,-122.099152&output=embed&q=157+Smalley+Ave,+Hayward,+CA+94541&z=16',
  },
  phone: '510.581.1630',
  phoneHref: 'tel:+15105811630',
  email: 'church.office@cfcchayward.org',
  social: {
    youtube: 'https://www.youtube.com/@cfccofhayward',
    youtubeStreams: 'https://www.youtube.com/@cfccofhayward/streams',
    facebook: 'https://www.facebook.com/TheCrossingCFCC',
    instagram: 'https://www.instagram.com/thecrossingcfcc/',
  },
  podcasts: [
    { name: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/the-crossing-at-cfcc-hayward/id1483717891', primary: true },
    { name: 'Spotify', href: 'https://open.spotify.com/show/3YKYaEkeAwBN1XFQ9yfVx8?si=NRVcy05LTdSeRAh12f2brQ', primary: true },
    { name: 'Pocket Casts', href: 'https://pca.st/l6ozyis9', primary: false },
    { name: 'RSS Feed', href: 'https://feed.podbean.com/thecrossingatcfcc/feed.xml', primary: false },
  ],
  archiveLinks: {
    chineseSite: 'https://www.cfcchayward.org/',
  },
} as const;

export const NAV_ITEMS: NavItem[] = [
  {
    label: "I'm New",
    href: '/im-new',
    children: [
      { label: 'Plan Your Visit', href: '/im-new', description: 'FAQs, parking, and what to expect on Sunday' },
      { label: 'Our Church', href: '/im-new/our-church', description: 'Our story, vision, values, and by-laws' },
      { label: 'Our Beliefs', href: '/im-new/our-beliefs', description: 'Core Christian doctrines we hold' },
      { label: 'Our Staff', href: '/im-new/our-staff', description: 'Pastors, office staff, and deacons' },
      { label: 'Our Campus', href: '/im-new/our-campus', description: 'Parking lots and campus map' },
    ],
  },
  {
    label: 'Sermons',
    href: '/sermons',
  },
  {
    label: 'Events',
    href: '/events',
    children: [
      { label: 'Upcoming Events', href: '/events', description: 'Weekly gatherings, classes, and announcements' },
      { label: "Men's Retreat", href: '/events/mens-retreat', description: 'Annual retreat at Redwood Glen' },
    ],
  },
  {
    label: 'Get Connected',
    href: '/get-connected',
    children: [
      { label: 'All Ministries', href: '/get-connected', description: 'Find your place to grow and serve' },
      { label: 'Growth Groups', href: '/get-connected/growth-groups', description: 'Cross-generational home Bible studies' },
      { label: 'Children (The Rock)', href: '/get-connected/children', description: 'Nursery through 5th grade' },
      { label: 'Youth (Footprints)', href: '/get-connected/youth', description: 'Middle & High School ministry' },
      { label: 'Young Adults (Transparent)', href: '/get-connected/young-adults', description: 'College & career community' },
      { label: 'Mature Adults', href: '/get-connected/mature-adults', description: 'Fellowship and Bible study' },
      { label: 'Discipleship', href: '/get-connected/discipleship', description: 'Growing deeper in Christ' },
      { label: 'Serve & Volunteer', href: '/get-connected/serve', description: 'Join a Sunday or outreach team' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'All Resources', href: '/resources', description: 'Tools for spiritual growth and care' },
      { label: 'Christian Education', href: '/resources/ce', description: 'Sunday 11:15 AM workshops & classes' },
      { label: 'After-School Program', href: '/resources/after-school-program', description: 'Homework & tutoring ministry' },
      { label: 'Groceries & Care', href: '/resources/groceries', description: 'Bridging Grace & Food Bank' },
      { label: 'RightNow Media', href: '/resources/rightnow-media', description: 'Free video Bible study library' },
      { label: 'Audiobooks on Hoopla', href: '/resources/audiobooks-on-hoopla', description: 'Free Christian audiobooks' },
      { label: 'How to Practice Lent', href: '/resources/how-to-practice-lent', description: 'Seasonal devotional guide' },
    ],
  },
  {
    label: 'Contact Us',
    href: '/contact-us',
  },
];
