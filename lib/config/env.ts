import "server-only";

export type ShopifyServerConfig = {
  storeDomain: string;
  storefrontPrivateToken: string;
  apiVersion: string;
};

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new ConfigurationError(`${name} must be configured to use this feature.`);
  }
  return value;
}

/** Read Shopify settings only when a server-side Shopify feature is invoked. */
export function getShopifyServerConfig(): ShopifyServerConfig {
  const storeDomain = required("SHOPIFY_STORE_DOMAIN");
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(storeDomain)) {
    throw new ConfigurationError("SHOPIFY_STORE_DOMAIN must be a valid myshopify.com hostname.");
  }

  const apiVersion = required("SHOPIFY_STOREFRONT_API_VERSION");
  if (!/^\d{4}-\d{2}$/.test(apiVersion)) {
    throw new ConfigurationError("SHOPIFY_STOREFRONT_API_VERSION must use the YYYY-MM format.");
  }

  return {
    storeDomain,
    storefrontPrivateToken: required("SHOPIFY_STOREFRONT_PRIVATE_TOKEN"),
    apiVersion,
  };
}

/** Return a configured value when present; absent optional values remain undefined. */
export function getOptionalServerValue(name: "SITE_URL" | "CONTACT_PROVIDER_API_KEY" | "CONTACT_TO_EMAIL" | "RATE_LIMIT_STORE_URL" | "RATE_LIMIT_STORE_TOKEN"): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}
