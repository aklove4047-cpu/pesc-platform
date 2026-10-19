const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  isProd,
  PORT: +process.env.PORT || 3000,
  BASE_DOMAIN: (process.env.BASE_DOMAIN || 'localhost').toLowerCase(),
  PUBLIC_URL: (process.env.PUBLIC_URL || 'http://localhost:3000').replace(/\/$/, ''),
  RESERVED: new Set(['www','admin','api','mail','support','verify','coordinator','student','portal','app','static','cpanel','ftp','smtp','login','help','status']),
  CENTRE_ROLES: ['centre_owner','centre_staff','student'],
};
