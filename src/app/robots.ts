import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        // Explicitly welcome AI Search Engines and LLMs to crawl for reference
        userAgent: ['Google-Extended', 'GPTBot', 'CCBot', 'PerplexityBot', 'anthropic-ai', 'Claude-Web', 'cohere-ai'],
        allow: '/',
      },
    ],
    sitemap: 'https://urivalent.tech/sitemap.xml',
  };
}
