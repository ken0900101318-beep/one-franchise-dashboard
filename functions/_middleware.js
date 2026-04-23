// 反向代理：/store-order* 和 /api/store-order/* 轉發到 Railway 後端
// 讓店家訂貨功能可以用 join.onegame.tw 網域，同時不影響加盟站本體
const RAILWAY_ORIGIN = 'https://one-management-v3-web-production.up.railway.app';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  const shouldProxy =
    path === '/store-order' ||
    path.startsWith('/store-order/') ||
    path.startsWith('/api/store-order/');

  if (!shouldProxy) return context.next();

  const target = RAILWAY_ORIGIN + path + url.search;
  const proxyReq = new Request(target, context.request);
  proxyReq.headers.set('X-Forwarded-Host', url.host);
  proxyReq.headers.set('X-Forwarded-Proto', 'https');

  return fetch(proxyReq);
}
