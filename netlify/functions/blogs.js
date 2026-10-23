// Server-side proxy for public microCMS blog content. Node 18+ on Netlify.
const ID = /^[a-zA-Z0-9_-]{1,128}$/;
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return {statusCode:405,headers:{Allow:'GET'},body:'Method Not Allowed'};
  const key = process.env.MICROCMS_API_KEY;
  const domain = process.env.MICROCMS_SERVICE_DOMAIN || 'depart';
  if (!key || !/^[a-zA-Z0-9-]+$/.test(domain)) return {statusCode:503,body:'Blog service unavailable'};
  const query = event.queryStringParameters || {};
  const id = query.id || '';
  if (id && !ID.test(id)) return {statusCode:400,body:'Invalid article ID'};
  const limit = Math.min(100,Math.max(1,Number.parseInt(query.limit,10)||10));
  const orders = query.orders === '-publishedAt' ? '-publishedAt' : '-publishedAt';
  const url = new URL(`https://${domain}.microcms.io/api/v1/blogs${id ? '/'+encodeURIComponent(id) : ''}`);
  if (!id) {url.searchParams.set('limit',String(limit));url.searchParams.set('orders',orders);}
  try {
    const upstream = await fetch(url,{headers:{'X-MICROCMS-API-KEY':key}});
    if (!upstream.ok) return {statusCode:upstream.status === 404 ? 404 : 502,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify({error:'Could not load blog'})};
    const data = await upstream.json();
    return {statusCode:200,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=60'},body:JSON.stringify(data)};
  } catch (_) {return {statusCode:502,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'Could not load blog'})};}
};
