import { defineMiddleware } from 'astro:middleware';
import { getSession } from '@/lib/auth/session';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  context.locals.session = null;

  // Public routes — no auth
  if (
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/admin/knowledge-graph') ||
    pathname.startsWith('/admin/overview') ||
    pathname.startsWith('/admin/content') ||
    pathname.startsWith('/admin/branding') ||
    pathname.startsWith('/admin/users') ||
    pathname.startsWith('/admin/creators') ||
    pathname.startsWith('/admin/revenue') ||
    pathname.startsWith('/admin/ada') ||
    pathname.startsWith('/admin/seo') ||
    pathname.startsWith('/admin/moderation') ||
    pathname.startsWith('/admin/analytics') ||
    pathname.startsWith('/admin/system') ||
    pathname.startsWith('/admin/logs') ||
    pathname === '/' ||
    pathname.startsWith('/wiki') ||
    pathname.startsWith('/marketplace') ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/news') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_astro') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return next();
  }

  // Protect /admin/*
  if (pathname.startsWith('/admin')) {
    const session = await getSession(context.cookies);
    if (!session) {
      return context.redirect('/admin/login');
    }
    context.locals.session = session;
  }

  return next();
});