export const ACCOUNT_PASSWORD_MIN_LENGTH = 8;
export const CHANNEL_PASSWORD_MIN_LENGTH = 8;

export function isAccountPasswordValid(password: string): boolean {
  return password.length >= ACCOUNT_PASSWORD_MIN_LENGTH;
}

export function isChannelPasswordValid(password: string): boolean {
  return password.length >= CHANNEL_PASSWORD_MIN_LENGTH;
}

export function generateChannelInviteCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_");
}
