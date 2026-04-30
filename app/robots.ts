import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/internal/*', '/api/internal/*'],
      },
    ],
    sitemap: 'https://www.targetedadvisors.ca/sitemap.xml',
  }
}
