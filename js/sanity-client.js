// ============================================
// ITS SOBI - Sanity Client
// Headless CMS integration
// ============================================

const SANITY_CONFIG = {
  projectId: 'YOUR_PROJECT_ID', // Replace with actual project ID
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};

// Build Sanity API URL
function buildSanityUrl(query, params = {}) {
  const baseUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`;
  
  let url = `${baseUrl}?query=${encodeURIComponent(query)}`;
  
  // Add params
  Object.keys(params).forEach(key => {
    url += `&$${key}="${encodeURIComponent(params[key])}"`;
  });
  
  return url;
}

// Fetch from Sanity
async function sanityFetch(query, params = {}) {
  try {
    const url = buildSanityUrl(query, params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Sanity fetch failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return null;
  }
}

// Image URL builder
function sanityImageUrl(image, options = {}) {
  if (!image || !image.asset) return '';
  
  const {width, height, quality = 80, format = 'webp'} = options;
  
  // Extract image ID from asset reference
  const ref = image.asset._ref;
  const [, id, dimensions, extension] = ref.split('-');
  
  let url = `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${dimensions}.${extension}`;
  
  const params = [];
  if (width) params.push(`w=${width}`);
  if (height) params.push(`h=${height}`);
  params.push(`q=${quality}`);
  params.push(`fm=${format}`);
  params.push('fit=crop');
  params.push('auto=format');
  
  if (params.length) {
    url += '?' + params.join('&');
  }
  
  return url;
}

// GROQ Queries
const QUERIES = {
  // All projects
  projects: `*[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category->{name, "slug": slug.current},
    featuredImage,
    location,
    shortDescription,
    featured
  }`,
  
  // Single project by slug
  projectBySlug: `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category->{name, "slug": slug.current},
    featuredImage,
    location,
    client,
    year,
    description,
    gallery[]{
      _key,
      asset->{_id, url, metadata},
      alt,
      layout
    },
    "nextProject": *[_type == "project" && order > ^.order] | order(order asc)[0] {
      title,
      "slug": slug.current,
      featuredImage
    }
  }`,
  
  // Projects by category
  projectsByCategory: `*[_type == "project" && category->slug.current == $category] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category->{name, "slug": slug.current},
    featuredImage,
    location,
    shortDescription
  }`,
  
  // All categories
  categories: `*[_type == "category"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    image
  }`,
  
  // Site settings
  siteSettings: `*[_type == "siteSettings"][0] {
    siteName,
    siteTagline,
    siteDescription,
    heroImage,
    email,
    phone,
    location,
    instagram,
    linkedin,
    clientLogos[]{
      name,
      asset->{url}
    }
  }`,
  
  // About page
  about: `*[_type == "about"][0] {
    name,
    tagline,
    portrait,
    intro,
    approachTitle,
    approachText,
    values[]{
      icon,
      title,
      description
    },
    equipment[]{
      name,
      description
    },
    quote
  }`,
  
  // Featured projects for homepage
  featuredProjects: `*[_type == "project" && featured == true] | order(order asc)[0..5] {
    _id,
    title,
    "slug": slug.current,
    category->{name, "slug": slug.current},
    featuredImage,
    location
  }`,
};

// API methods
const SanityAPI = {
  async getProjects() {
    return sanityFetch(QUERIES.projects);
  },
  
  async getProject(slug) {
    return sanityFetch(QUERIES.projectBySlug, {slug});
  },
  
  async getProjectsByCategory(category) {
    return sanityFetch(QUERIES.projectsByCategory, {category});
  },
  
  async getCategories() {
    return sanityFetch(QUERIES.categories);
  },
  
  async getSiteSettings() {
    return sanityFetch(QUERIES.siteSettings);
  },
  
  async getAbout() {
    return sanityFetch(QUERIES.about);
  },
  
  async getFeaturedProjects() {
    return sanityFetch(QUERIES.featuredProjects);
  },
  
  // Helper to get image URL
  imageUrl: sanityImageUrl,
};

// Export for use
window.SanityAPI = SanityAPI;
window.sanityImageUrl = sanityImageUrl;

// Example usage:
// const projects = await SanityAPI.getProjects();
// const imageUrl = SanityAPI.imageUrl(project.featuredImage, {width: 800});
