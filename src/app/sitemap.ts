import type { MetadataRoute } from "next";

const today = ((): Date => {
  const d = new Date();
  // Colombia TimeZone (UTC-5)
  d.setUTCHours(-5);
  return d;
})();

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [""].map(route => ({
    url: `quickchess.vercel.app/${route}`,
    lastModified: today.toISOString().split("T")[0],
    priority: route ? 0.8 : 1,
  }));

  return [...routes].sort((a, b) => (b.priority || 0) - (a.priority || 0));
}
