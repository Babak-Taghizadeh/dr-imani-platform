import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/articles", "/blogs", "/contact"],
        disallow: ["/signin", "/admin", "/api", "/_next"],
      },
      {
        userAgent: "SemrushBot",
        disallow: ["/"],
      },
    ],
    sitemap: "https://drimanisleepclinic.com/sitemap.xml",
    host: "drimanisleepclinic.com",
  };
}
