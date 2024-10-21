import { SiteConfig, SiteConfigSchema } from "./schema";
import { readYAML } from "./utils";

export const DefaultSiteConfig: SiteConfig = {
  title: "My iTELL Site",
  description: "My iTELL site description",
  footer: "My iTELL site footer",
  latex: false,
  favicon: "favicon.ico",
};

export const getSiteConfig = async (
  configPath: string
): Promise<SiteConfig> => {
  let configData: unknown;
  try {
    configData = await readYAML(configPath);
  } catch (e) {
    console.warn("site config not found, fallback to default configurations");
    return DefaultSiteConfig;
  }
  const configParsed = SiteConfigSchema.safeParse(configData);
  if (!configParsed.success) {
    console.warn(
      "site config is not valid\n",
      configParsed.error,
      "\nfallback to default configurations when necessary"
    );
  }
  if (!(configData instanceof Object)) {
    return DefaultSiteConfig;
  } else {
    return { ...DefaultSiteConfig, ...configData };
  }
};
