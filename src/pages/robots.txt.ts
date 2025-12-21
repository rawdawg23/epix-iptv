import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const [serviceInfoEntries, siteConfigEntries] = await Promise.all([
    getCollection('service-info'),
    getCollection('site-config').catch(() => []),
  ]);
  
  const serviceInfo = serviceInfoEntries[0];
  const siteConfig = siteConfigEntries[0]?.data;
  const baseURL = siteConfig?.siteUrl || serviceInfo?.data?.siteUrl || import.meta.env.PUBLIC_SITE_URL || 'https://example.com';

  const robots = `# Robots.txt for ${siteConfig?.brandName || 'IPTV Service'}
# Generated automatically

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /.well-known/
Disallow: /thank-you
Disallow: /*?*

# Search engine specific rules
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

# Sitemap location
Sitemap: ${baseURL}/sitemap.xml

# Host declaration
Host: ${baseURL}`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
