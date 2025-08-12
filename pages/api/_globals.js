// /pages/api/_globals.js

if (!global._transports) {
  global._transports = {};
}
if (!global._servers) {
  global._servers = {};
}

export const transports = global._transports;
export const servers = global._servers;
