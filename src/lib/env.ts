/**
 * Runtime env access for admin/backend code.
 *
 * Astro inlines `import.meta.env.PUBLIC_*` at build time. For server-only
 * secrets (ADMIN_PASSWORD_HASH, DB paths, LLM keys), we read from process.env,
 * falling back to default seeded admin credentials if unconfigured.
 */
export const env = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'tsnion@gmail.com',
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || '$argon2id$v=19$m=19456,t=2,p=1$2wdOuvatX6tkOIO/xo0sKw$uS2Ck2sKD47jKrYsmD44d0LvzCRbIGNdMXv7Ytxal7U',
  DB_PATH: process.env.DB_PATH || '/tmp/admin.db',
  LLM_MODEL: process.env.LLM_MODEL || 'minimax/MiniMax-M3',
  LLM_API_URL: process.env.LLM_API_URL || 'https://api.minimax.io/v1',
  LLM_API_KEY: process.env.LLM_API_KEY || 'sk-cp-9_VnYYpS_2tAbRPFfwhm9D2QCVpSvWQGzrE6LkmjgWeCntsT9B_0JzUMDVTIjrxRB-9blk1ZL9SVYW8uDXi8uydEvCLZNVn2B08rEBPkR6l-95ii7hW4jWQ',
  SITE_URL: process.env.SITE_URL || 'https://wikiofautomation.com',
  PUBLIC_SITE_URL: import.meta.env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://wikiofautomation.com',
};

export function isAdminAuthConfigured(): boolean {
  return !!(env.ADMIN_EMAIL && env.ADMIN_PASSWORD_HASH);
}