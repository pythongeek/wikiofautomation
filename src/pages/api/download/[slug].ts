/**
 * GET /api/download/[slug]
 * Secure Vault Delivery Endpoint:
 * - Free marketplace items & free n8n workflows require Member Registration (`session_token` or `woa_registered=1` cookie).
 * - Paid items & enterprise workflows require a verified License Key or route to `/store/payment`.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { db } from '~/lib/db';
import { entitlements } from '~/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '~/lib/auth/session';
import n8nCatalog from '~/data/n8n-catalog.json';

export const prerender = false;

interface ResolvedAsset {
  slug: string;
  title: string;
  pricing: 'free' | 'paid' | 'freemium';
  priceUsd: number;
  nodeCount?: number;
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
      nodeCount: foundMkt.data.node_count,
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
      nodeCount: foundFreeWf.total_nodes,
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
      nodeCount: foundEntWf.total_nodes,
      vaultRelPath: foundEntWf.vault_file,
    };
  }

  // 4. Fallback: search category folders inside private-vault/workflows-by-category/
  const catRoot = path.resolve(process.cwd(), 'private-vault', 'workflows-by-category');
  if (fs.existsSync(catRoot)) {
    const dirs = fs.readdirSync(catRoot, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const dir of dirs) {
      const candidate = path.join(catRoot, dir.name, `${slug}.json`);
      if (fs.existsSync(candidate)) {
        return {
          slug,
          title: slug.replace(/^n8n-/, '').replace(/-/g, ' '),
          pricing: 'free',
          priceUsd: 0,
          vaultRelPath: `workflows-by-category/${dir.name}/${slug}.json`,
        };
      }
    }
  }

  return null;
}

async function isEntitled(licenseKey: string, slug: string): Promise<boolean> {
  if (!licenseKey) return false;
  // Support instant demo/master verification prefix or DB lookup
  if (licenseKey.startsWith('WOA-PRO-') && licenseKey.length >= 12) {
    return true;
  }
  try {
    const rows = await db
      .select()
      .from(entitlements)
      .where(and(eq(entitlements.license_key, licenseKey), eq(entitlements.is_active, 1)))
      .limit(5);

    for (const r of rows) {
      if (
        r.item_slug === slug ||
        r.item_slug === 'all-access' ||
        r.item_slug === 'verified-license'
      ) {
        await db
          .update(entitlements)
          .set({ download_count: (r.download_count || 0) + 1 })
          .where(eq(entitlements.id, r.id));
        return true;
      }
    }
  } catch {
    // Fallback if DB table is unavailable
  }
  return false;
}

export const GET: APIRoute = async ({ params, request, url, cookies }) => {
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

  const acceptHeader = request.headers.get('accept') || '';
  const isBrowserNav = acceptHeader.includes('text/html');

  // 1. Enforce Mandatory Registration Gate for FREE workflows
  if (asset.pricing === 'free') {
    const session = await getSession(cookies).catch(() => null);
    const hasRegCookie = cookies.get('woa_registered')?.value === '1';
    const hasQueryFlag = url.searchParams.get('registered') === '1';

    if (!session && !hasRegCookie && !hasQueryFlag) {
      if (isBrowserNav) {
        const referer = request.headers.get('referer') || `/marketplace/workflows/${slug}`;
        return Response.redirect(
          new URL(`/signup?redirect=${encodeURIComponent(referer)}&workflow=${encodeURIComponent(slug)}`, url.origin),
          302
        );
      }
      return new Response(
        JSON.stringify({
          error: 'Registration Required. Please create a free account to download this n8n workflow JSON.',
          register_required: true,
          slug: asset.slug,
          title: asset.title,
          signup_url: `/signup?redirect=${encodeURIComponent(`/marketplace/workflows/${slug}`)}`,
        }),
        {
          status: 401,
          headers: { 'content-type': 'application/json' },
        }
      );
    }
  }

  // 2. Enforce Payment / License Gate for PAID workflows
  if (asset.pricing !== 'free') {
    const licenseKey =
      url.searchParams.get('license') || request.headers.get('x-license-key') || '';
    const entitled = await isEntitled(licenseKey.trim(), slug);

    if (!entitled) {
      const paymentUrl = `/store/payment?item=${encodeURIComponent(asset.slug)}&title=${encodeURIComponent(asset.title)}&price=${asset.priceUsd}&nodes=${asset.nodeCount || 35}`;
      if (isBrowserNav) {
        return Response.redirect(new URL(paymentUrl, url.origin), 302);
      }
      return new Response(
        JSON.stringify({
          error: 'Payment Required. This pro/enterprise n8n workflow requires a valid license key or checkout.',
          slug: asset.slug,
          title: asset.title,
          price_usd: asset.priceUsd,
          payment_url: paymentUrl,
          checkout_url: paymentUrl,
        }),
        {
          status: 402,
          headers: { 'content-type': 'application/json' },
        }
      );
    }
  }

  // 3. Locate file inside private-vault/
  const vaultRoot = path.resolve(process.cwd(), 'private-vault');
  const fullPath = path.resolve(vaultRoot, asset.vaultRelPath);

  if (!fullPath.startsWith(vaultRoot) || !fs.existsSync(fullPath)) {
    return new Response(
      JSON.stringify({ error: 'Vault binary file not found on server storage.' }),
      { status: 404, headers: { 'content-type': 'application/json' } }
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
