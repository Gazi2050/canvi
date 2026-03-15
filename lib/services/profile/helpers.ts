export function providerLabel(provider: string): string {
  if (provider === "oauth_google") return "Google"
  return provider
}
