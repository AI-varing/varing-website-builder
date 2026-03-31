#!/usr/bin/env node
/**
 * Push 15 court-ordered listings to Storyblok CMS.
 *
 * Usage: node scripts/push-court-ordered-listings.js
 *
 * Reads credentials from .env.local in the project root.
 */

const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const TOKEN = env.STORYBLOK_MANAGEMENT_TOKEN;
const SPACE_ID = env.STORYBLOK_SPACE_ID;
const API_BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`;

const LISTINGS = [
  {
    address: '1156 Fremont St',
    city: 'Coquitlam',
    subarea: 'Northeast Coquitlam',
    status: 'Active',
    price: '2250000',
    image: 'https://www.varinggroup.com/wp-content/uploads/1156-Fremont-St_development-land-varing-website-560x380.png',
    featured: false,
  },
  {
    address: '26899 + 26963 Old Yale Rd',
    city: 'Langley',
    subarea: 'Aldergrove',
    status: 'Active',
    price: '3950000',
    image: 'https://www.varinggroup.com/wp-content/uploads/26899-26963-Old-Yale-Rd_development-land-varing-website-560x380.png',
    featured: false,
  },
  {
    address: '10556 + 10566 140 St',
    city: 'Surrey',
    subarea: 'Guildford + 104A Ave',
    status: 'Active',
    price: '2299000',
    image: 'https://www.varinggroup.com/wp-content/uploads/10556-10566-140-St_development-land-varing-website-560x380.png',
    featured: false,
  },
  {
    address: '17111 + 17101 80 Ave',
    city: 'Surrey',
    subarea: 'Fleetwood',
    status: 'Active',
    price: '12899000',
    image: 'https://www.varinggroup.com/wp-content/uploads/17111-17101-80-Ave_development-land-varing-website-560x380.png',
    featured: true,
  },
  {
    address: '18493 Fraser Hwy',
    city: 'Surrey',
    subarea: 'Clayton Sky Train Corridor',
    status: 'Reduced',
    price: '4900000',
    image: 'https://www.varinggroup.com/wp-content/uploads/18493-Fraser-Hwy_development-land-varing-website-560x380.png',
    featured: false,
  },
  {
    address: '9341 177 St',
    city: 'Surrey',
    subarea: 'Anniedale-Tynehead',
    status: 'Reduced',
    price: '5950000',
    image: 'https://www.varinggroup.com/wp-content/uploads/9341-177-St_development-land-varing-website-560x380.png',
    featured: false,
  },
  {
    address: '23638 Dewdney Trunk Rd',
    city: 'Maple Ridge',
    subarea: 'Cottonwood',
    status: 'Active',
    price: '5250000',
    image: 'https://www.varinggroup.com/wp-content/uploads/23638-Dewdney-Trunk-Rd_development-land-varing-website-560x380.png',
    featured: false,
  },
  {
    address: '3352 200 St',
    city: 'Langley',
    subarea: 'Booth - Brookswood',
    status: 'Active',
    price: '6200000',
    image: 'https://www.varinggroup.com/wp-content/uploads/3352-200-St_development-land-for-sale-560x380.png',
    featured: false,
  },
  {
    address: '13698 113 Ave',
    city: 'Surrey',
    subarea: 'Bolivar Heights Infill',
    status: 'Active',
    price: '2485000',
    image: 'https://www.varinggroup.com/wp-content/uploads/13698-113-Ave_development-land-varing-website-560x380.png',
    featured: false,
  },
  {
    address: '2301-2337 152 St',
    city: 'Surrey',
    subarea: 'Semiahmoo Town Centre',
    status: 'Active',
    price: '8850000',
    image: 'https://www.varinggroup.com/wp-content/uploads/2301-2337-152-St_development-land-varing-website-560x380.png',
    featured: false,
  },
  {
    address: '3338 200 St',
    city: 'Langley',
    subarea: 'Booth - Brookswood',
    status: 'Firm',
    price: '',
    image: 'https://www.varinggroup.com/wp-content/uploads/Court_3338-200-St-Firm-560x380.png',
    featured: false,
  },
  {
    address: '4272 176 St',
    city: 'Surrey',
    subarea: 'South Surrey',
    status: 'Sold',
    price: '',
    image: 'https://www.varinggroup.com/wp-content/uploads/Court_4272-176-St-Sold-560x380.png',
    featured: false,
  },
  {
    address: '9010 156A St',
    city: 'Surrey',
    subarea: 'Fleetwood Tynehead',
    status: 'Sold',
    price: '',
    image: 'https://www.varinggroup.com/wp-content/uploads/Court_9010-156A-St-Sold-560x380.png',
    featured: false,
  },
  {
    address: '15738 North Bluff Rd',
    city: 'White Rock',
    subarea: 'North Bluff Corridor',
    status: 'Sold',
    price: '',
    image: 'https://www.varinggroup.com/wp-content/uploads/Court_15738-North-Sold-560x380.png',
    featured: false,
  },
  {
    address: '14318 60 Ave',
    city: 'Surrey',
    subarea: 'South Newton',
    status: 'Sold',
    price: '',
    image: 'https://www.varinggroup.com/wp-content/uploads/Court_14318-60-Ave-Sold-560x380.png',
    featured: false,
  },
];

function makeSlug(address) {
  return address.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').replace(/^-+/, '');
}

async function apiCall(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': TOKEN,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function getListingsFolder() {
  const data = await apiCall('/stories?with_slug=listings&is_folder=1');
  return data.stories?.[0]?.id;
}

async function getExistingListings() {
  const data = await apiCall('/stories?starts_with=listings/&per_page=100');
  return data.stories || [];
}

async function deleteStory(storyId) {
  const url = `${API_BASE}/stories/${storyId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': TOKEN },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete ${storyId} failed ${res.status}: ${text}`);
  }
  return true;
}

async function createListing(listing, folderId) {
  const slug = makeSlug(listing.address);

  const content = {
    component: 'listing',
    address: listing.address,
    city: listing.city,
    province: 'BC',
    price: listing.price || '',
    status: listing.status,
    propertyType: 'Development Land',
    lotSize: '',
    buildingArea: '',
    mlsNumber: '',
    description: `Court-ordered ${listing.status === 'Sold' ? 'sale completed' : 'development land listing'} in ${listing.subarea}, ${listing.city}.`,
    featured: listing.featured,
    ctaLabel: 'Send Inquiry',
    images: [
      { filename: listing.image, id: null, alt: listing.address, name: '', title: '' }
    ],
  };

  const body = {
    story: {
      name: listing.address,
      slug,
      parent_id: folderId,
      content,
    },
    publish: 1,
  };

  const data = await apiCall('/stories', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return data.story;
}

async function main() {
  console.log('Fetching listings folder...');
  const folderId = await getListingsFolder();
  if (!folderId) {
    console.error('No "listings" folder found in Storyblok!');
    process.exit(1);
  }
  console.log('Listings folder ID:', folderId);

  // Check existing listings
  console.log('\nChecking existing listings...');
  const existing = await getExistingListings();
  console.log(`Found ${existing.length} existing listing(s)`);

  // Build a set of existing slugs for duplicate detection
  const existingSlugs = new Set(existing.map(s => s.slug));

  // Delete existing listings that match our slugs (to replace with updated versions)
  const targetSlugs = new Set(LISTINGS.map(l => makeSlug(l.address)));
  const toDelete = existing.filter(s => targetSlugs.has(s.slug));

  if (toDelete.length > 0) {
    console.log(`\nDeleting ${toDelete.length} existing listing(s) that will be replaced:`);
    for (const s of toDelete) {
      console.log(`  Deleting: ${s.name} (${s.slug})`);
      await deleteStory(s.id);
      // Storyblok rate limit: ~3 req/sec for management API
      await new Promise(r => setTimeout(r, 400));
    }
  }

  // Also delete any with timestamp-appended slugs (from the extract-listing route)
  const tsAppended = existing.filter(s => {
    const base = s.slug.replace(/-[a-z0-9]+$/, '');
    return targetSlugs.has(base) && !targetSlugs.has(s.slug);
  });
  if (tsAppended.length > 0) {
    console.log(`\nDeleting ${tsAppended.length} timestamp-appended duplicate(s):`);
    for (const s of tsAppended) {
      console.log(`  Deleting: ${s.name} (${s.slug})`);
      await deleteStory(s.id);
      await new Promise(r => setTimeout(r, 400));
    }
  }

  // Create all 15 listings
  console.log(`\nCreating ${LISTINGS.length} listings...`);
  let created = 0;
  let failed = 0;

  for (const listing of LISTINGS) {
    const slug = makeSlug(listing.address);
    try {
      const story = await createListing(listing, folderId);
      created++;
      console.log(`  [${created}/${LISTINGS.length}] Created: ${story.name} -> /listings/${story.slug}`);
    } catch (err) {
      failed++;
      console.error(`  FAILED: ${listing.address} (${slug}): ${err.message}`);
    }
    // Rate limit
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\nDone! Created: ${created}, Failed: ${failed}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
