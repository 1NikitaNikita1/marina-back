// api/middleware/cors.js
module.exports = (req, res, next) => {
  const allowedOrigins = [
    'https://www.marynastrategy.com',
    'https://marina-form.vercel.app' // Додайте свій другий домен
  ];
  
  const origin = req.headers.origin;
  
  // Перевірка, чи дозволено походження
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Continue to the actual handler
  if (typeof next === 'function') {
    return next();
  } else {
    return res;
  }
};