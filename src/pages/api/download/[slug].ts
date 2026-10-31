/**
 * GET /api/download/[slug]
 * Secure Vault Delivery Endpoint:
 * - Free marketplace items & free community n8n workflows stream immediately.
 * - Paid items & 120–246 node enterprise workflows require a verified Lemon Squeezy license key.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { db } from '~/lib/db';
import { entitlements } from '~/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import n8nCatalog from '~/data/n8n-catalog.json';

export const prerender = false;

interface ResolvedAsset {
  slug: string;
  title: string;
  pricing: 'free' | 'paid' | 'freemium';
  priceUsd: number;
  vaultRelPath: string;
}

async function resolveAsset(slug: string): Promise<ResolvedAsset | null> {
  // 1. Check marketplace content collection
  const mkt = await getCollection('marketplace');
  const foundMkt = mkt.find((item) => item.slug === slug);
  if (foundMkt) {
    const isFree = foundMkt.data.pricing === 'free';
    const vaultRelPath =
      foundMkt.data.vault_asset ||
      (isFree ? `free/workflows/${slug}.json` : `paid/workflows/${slug}.json`);
    return {
      slug,
      title: foundMkt.data.title,
      pricing: foundMkt.data.pricing,
      priceUsd: foundMkt.data.price_usd || (isFree ? 0 : 29),
      vaultRelPath,
    };
  }

  // 2. Check free workflows in n8n-catalog.json
  const foundFreeWf = n8nCatalog.free_workflows.find((w) => w.slug === slug);
  if (foundFreeWf) {
    return {
      slug,
      title: foundFreeWf.title,
      pricing: 'free',
      priceUsd: 0,
      vaultRelPath: foundFreeWf.vault_file,
    };
  }

  // 3. Check enterprise workflows in n8n-catalog.json
  const foundEntWf = n8nCatalog.enterprise_workflows.find((w) => w.slug === slug);
  if (foundEntWf) {
    return {
      slug,
      title: foundEntWf.title,
      pricing: 'paid',
      priceUsd: foundEntWf.price_usd || 49,
      vaultRelPath: foundEntWf.vault_file,
    };
  }

  return null;
}

async function isEntitled(licenseKey: string, slug: string): Promise<boolean> {
  if (!licenseKey) return false;
  const rows = await db
    .select()
    .from(entitlements)
    .where(and(eq(entitlements.license_key, licenseKey), eq(entitlements.is_active, 1)))
    .limit(5);

  for (const r of rows) {
    if (r.item_slug === slug || r.item_slug === 'all-access' || r.item_slug === 'verified-license') {
      return true;
    }
    // Keep Track: increase download count
    await db
      .update(entitlements)
      .set({ download_count: (r.download_count || 0) + 1 })
      .where(eq(entitlements.id, r.id));
    return true;
  }
  return false;
}

export const GET: APIRoute = async ({ params, request, url }) => {
  const slug = String(params.slug || '').trim();
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing asset slug' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const asset = await resolveAsset(slug);
  if (!asset) {
    return new Response(JSON.stringify({ error: `Asset '${slug}' not found in vault catalog.` }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Enforce Paid Gate for non-free assets
  if (asset.pricing !== 'free') {
    const licenseKey =
      url.searchParams.get('license') || request.headers.get('x-license-key') || '';
    const entitled = await isEntitled(licenseKey.trim(), slug);

    if (!entitled) {
      return new Response(
        JSON.stringify({
          error: 'Payment Required. This enterprise vault asset requires an active Lemon Squeezy license key.',
          slug: asset.slug,
          title: asset.title,
          price_usd: asset.priceUsd,
          checkout_url: `/store/checkout?item=${encodeURIComponent(asset.slug)}&title=${encodeURIComponent(asset.title)}&price=${asset.priceUsd}`,
        }),
        {
          status: 402,
          headers: { 'content-type': 'application/json' },
        },
      );
    }
  }

  // Locate file inside private-vault/
  const vaultRoot = path.resolve(process.cwd(), 'private-vault');
  const fullPath = path.resolve(vaultRoot, asset.vaultRelPath);

  // Prevent path traversal outside private-vault
  if (!fullPath.startsWith(vaultRoot) || !fs.existsSync(fullPath)) {
    return new Response(
      JSON.stringify({ error: 'Vault binary file not found on server storage.' }),
      { status: 404, headers: { 'content-type': 'application/json' } },
    );
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const ext = path.extname(fullPath).toLowerCase();
  const contentType =
    ext === '.json'
      ? 'application/json; charset=utf-8'
      : ext === '.zip'
      ? 'application/zip'
      : 'application/octet-stream';
  const fileName = path.basename(fullPath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'private, no-store',
    },
  });
};

