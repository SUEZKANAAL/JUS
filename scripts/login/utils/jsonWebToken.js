// scripts/login/utils/jsonWebToken.js

export function parseJsonWebToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
}
