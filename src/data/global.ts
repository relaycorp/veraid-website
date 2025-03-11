const PRODUCTION_URL = "https://veraid.net";

export const IS_PRODUCTION = import.meta.env.CF_PAGES_BRANCH === "main";

export function getSiteUrl(astroUrl: URL) {
  if (IS_PRODUCTION) {
    return PRODUCTION_URL;
  }

  return import.meta.env.CF_PAGES_URL ?? astroUrl.origin;
}
