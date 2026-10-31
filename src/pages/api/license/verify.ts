/**
 * POST /api/license/verify
 * Verifies a Lemon Squeezy license key against local SQLite `entitlements` table
 * or Lemon Squeezy's public License Validation endpoint.
 */
import type { APIRoute } from 'astro';
import { db } from '~/lib/db';
import { entitlements } from '~/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const licenseKey = String(body?.license_key || '').trim();
    const itemSlug = String(body?.item_slug || '').trim();

    if (!licenseKey || licenseKey.length < 6) {
      return new Response(
        JSON.stringify({ valid: false, error: 'A valid Lemon Squeezy license key is required.' }),
        { status: 400, headers: { 'content-type': 'application/json' } },
      );
    }

    // 1. Check local SQLite entitlements table first
    const rows = await db
      .select()
      .from(entitlements)
      .where(and(eq(entitlements.license_key, licenseKey), eq(entitlements.is_active, 1)))
      .limit(1);

    if (rows.length > 0) {
      const ent = rows[0];
      if (!itemSlug || ent.item_slug === itemSlug || ent.item_slug === 'all-access') {
        return new Response(
          JSON.stringify({
            valid: true,
            license_key: licenseKey,
            item_slug: ent.item_slug,
            customer_email: ent.buyer_email,
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        );
      }
    }

    // 2. Fallback: Validate against Lemon Squeezy License API
    const lsRes = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ license_key: licenseKey }),
    }).catch(() => null);

    if (lsRes && lsRes.ok) {
      const lsData = await lsRes.json();
      if (lsData?.valid) {
        const email = String(lsData?.meta?.customer_email || 'verified@lemonsqueezy.com');
        await db
          .insert(entitlements)
          .values({
            buyer_email: email,
            item_slug: itemSlug || 'verified-license',
            license_key: licenseKey,
            is_active: 1,
          })
          .onConflictDoNothing();

        return new Response(
          JSON.stringify({
            valid: true,
            license_key: licenseKey,
            item_slug: itemSlug,
            customer_email: email,
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        );
      }
    }

    return new Response(
      JSON.stringify({ valid: false, error: 'License key not found or inactive.' }),
      { status: 403, headers: { 'content-type': 'application/json' } },
    );
  } catch (err) {
    console.error('[license-verify] Error:', err);
    return new Response(JSON.stringify({ valid: false, error: 'Failed to verify license key.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};

