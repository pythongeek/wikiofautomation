/**
 * POST /api/webhooks/lemonsqueezy
 * Verifies Lemon Squeezy HMAC-SHA256 X-Signature and records orders + license entitlements in SQLite.
 */
import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { db } from '~/lib/db';
import { orders, entitlements } from '~/lib/db/schema';

export const prerender = false;

function getWebhookSecret(): string {
  return (
    (import.meta.env?.LEMONSQUEEZY_WEBHOOK_SECRET as string | undefined) ||
    process.env.LEMONSQUEEZY_WEBHOOK_SECRET ||
    ''
  );
}

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!secret || !signatureHeader) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(signatureHeader, 'utf8');
  if (digest.length !== signature.length) return false;
  return crypto.timingSafeEqual(digest, signature);
}

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();
  const signature = request.headers.get('x-signature');
  const secret = getWebhookSecret();

  if (!verifySignature(rawBody, signature, secret)) {
    return new Response(JSON.stringify({ error: 'Invalid Lemon Squeezy webhook signature' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const payload = JSON.parse(rawBody);
    const eventName: string = payload?.meta?.event_name || 'unknown';
    const customData = payload?.meta?.custom_data || {};
    const attrs = payload?.data?.attributes || {};

    const lemonOrderId = String(payload?.data?.id || attrs?.order_id || Date.now());
    const customerEmail = String(attrs?.user_email || attrs?.customer_email || customData?.email || 'buyer@wikiofautomation.com');
    const itemSlug = String(customData?.item_slug || attrs?.first_order_item?.product_name || 'enterprise-bundle')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-');
    const variantId = String(attrs?.first_order_item?.variant_id || attrs?.variant_id || '');
    const amountCents = Number(attrs?.total || attrs?.subtotal || 0);
    const currency = String(attrs?.currency || 'USD');
    const licenseKey = String(
      attrs?.key || customData?.license_key || `LSQ-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
    );

    if (eventName === 'order_created' || eventName === 'subscription_created') {
      await db
        .insert(orders)
        .values({
          lemon_order_id: lemonOrderId,
          buyer_email: customerEmail,
          item_slug: itemSlug,
          variant_id: variantId,
          amount_cents: amountCents,
          currency,
          status: 'paid',
          license_key: licenseKey,
        })
        .onConflictDoNothing();

      await db
        .insert(entitlements)
        .values({
          buyer_email: customerEmail,
          item_slug: itemSlug,
          license_key: licenseKey,
          is_active: 1,
        })
        .onConflictDoNothing();
    } else if (eventName === 'license_key_created') {
      await db
        .insert(entitlements)
        .values({
          buyer_email: customerEmail,
          item_slug: itemSlug,
          license_key: licenseKey,
          is_active: 1,
        })
        .onConflictDoNothing();
    }

    return new Response(
      JSON.stringify({ ok: true, event: eventName, item_slug: itemSlug, license_key: licenseKey }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  } catch (err) {
    console.error('[lemonsqueezy-webhook] Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to process webhook payload' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};

