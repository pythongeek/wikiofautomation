import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    let { url, rawHtml } = body;

    if (!url && !rawHtml) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid URL or HTML snippet.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let htmlText = rawHtml || '';
    let fetchedUrl = url || '';

    // If URL is provided, attempt to fetch real HTML
    if (url && !rawHtml) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      fetchedUrl = url;

      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'WikiOfAutomation-SchemaGapFinder/1.0 (+https://wikiofautomation.com)',
            'Accept': 'text/html,application/xhtml+xml',
          },
          signal: AbortSignal.timeout(6000),
        });
        if (res.ok) {
          htmlText = await res.text();
        } else {
          return new Response(
            JSON.stringify({ error: `Failed to fetch URL (Status HTTP ${res.status}).` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: `Network error fetching target URL: ${err.message || 'Timeout'}.` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Real parsing of JSON-LD <script type="application/ld+json">
    const jsonLdRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const foundSchemas: Array<{ type: string; raw: any }> = [];
    let match;

    while ((match = jsonLdRegex.exec(htmlText)) !== null) {
      try {
        const parsed = JSON.parse(match[1].trim());
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (item['@type']) foundSchemas.push({ type: String(item['@type']), raw: item });
          });
        } else if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
          parsed['@graph'].forEach((item: any) => {
            if (item['@type']) foundSchemas.push({ type: String(item['@type']), raw: item });
          });
        } else if (parsed['@type']) {
          foundSchemas.push({ type: String(parsed['@type']), raw: parsed });
        }
      } catch {
        // Continue parsing next block
      }
    }

    // Real OpenGraph tags extraction
    const ogTags: Record<string, string> = {};
    const ogRegex = /<meta\s+[^>]*property=["']og:([^"']+)["']\s+[^>]*content=["']([^"']+)["'][^>]*>/gi;
    let ogMatch;
    while ((ogMatch = ogRegex.exec(htmlText)) !== null) {
      ogTags[ogMatch[1]] = ogMatch[2];
    }

    // Real Title & Meta Description extraction
    const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(htmlText);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const descMatch = /<meta\s+[^>]*name=["']description["']\s+[^>]*content=["']([^"']+)["'][^>]*>/i.exec(htmlText);
    const description = descMatch ? descMatch[1].trim() : '';

    // Check schema coverage against AI & Search recommended schemas
    const existingTypes = foundSchemas.map((s) => s.type.toLowerCase());
    const schemaAudit = [
      {
        type: 'Organization',
        label: 'Publisher & Brand Entity (Organization)',
        present: existingTypes.some((t) => t.includes('organization') || t.includes('brand')),
        importance: 'Critical for AEO entity linking in Perplexity & ChatGPT',
        template: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': title || 'Your Company Name',
          'url': fetchedUrl,
          'logo': ogTags['image'] || 'https://example.com/logo.png',
        },
      },
      {
        type: 'Article',
        label: 'Article / TechArticle / NewsArticle',
        present: existingTypes.some((t) => t.includes('article')),
        importance: 'Required for Google Discover & LLM news synthesis',
        template: {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          'headline': title || 'Article Title Here',
          'description': description || 'Summary of article...',
          'url': fetchedUrl,
        },
      },
      {
        type: 'FAQPage',
        label: 'Frequently Asked Questions (FAQPage)',
        present: existingTypes.some((t) => t.includes('faqpage')),
        importance: 'Essential for Direct Answer Snippets in Perplexity & SearchGPT',
        template: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What is modern AI automation?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Modern AI automation combines deterministic workflow engines with LLM reasoning nodes.',
              },
            },
          ],
        },
      },
      {
        type: 'BreadcrumbList',
        label: 'Site Navigation (BreadcrumbList)',
        present: existingTypes.some((t) => t.includes('breadcrumblist')),
        importance: 'Helps crawlers map site hierarchy',
        template: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://example.com' },
            { '@type': 'ListItem', 'position': 2, 'name': title || 'Current Page', 'item': fetchedUrl },
          ],
        },
      },
      {
        type: 'SoftwareApplication',
        label: 'SoftwareApplication / WebApplication',
        present: existingTypes.some((t) => t.includes('softwareapplication') || t.includes('webapplication')),
        importance: 'Increases tool discovery in AI App stores',
        template: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': title || 'Automation Tool',
          'applicationCategory': 'DeveloperApplication',
          'operatingSystem': 'Web-based',
        },
      },
    ];

    const missingGaps = schemaAudit.filter((s) => !s.present);
    const presentSchemas = schemaAudit.filter((s) => s.present);

    return new Response(
      JSON.stringify({
        success: true,
        url: fetchedUrl,
        pageTitle: title,
        pageDescription: description,
        foundSchemaTypes: foundSchemas.map((s) => s.type),
        schemaAudit,
        missingCount: missingGaps.length,
        presentCount: presentSchemas.length,
        aeoReadinessScore: Math.round((presentSchemas.length / schemaAudit.length) * 100),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal analysis error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
