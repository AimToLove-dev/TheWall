const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");
const path = require("path");

// Base URL for your site
const baseUrl = "https://thewall.love";

// Define routes based on RootNavigator structure
const routes = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/wailing-wall", changefreq: "daily", priority: 0.9 },
  { url: "/testimonies", changefreq: "daily", priority: 0.9 },
  { url: "/login", changefreq: "monthly", priority: 0.7 },
  { url: "/signup", changefreq: "monthly", priority: 0.7 },
  { url: "/forgot-password", changefreq: "monthly", priority: 0.5 },
  // User routes are not included as they require authentication
];

async function generateSitemap() {
  const smStream = new SitemapStream({ hostname: baseUrl });

  // Add routes to sitemap
  routes.forEach((route) => {
    smStream.write(route);
  });

  // End the stream
  smStream.end();

  // Generate sitemap XML
  const sitemap = await streamToPromise(smStream);

  // Write sitemap to file
  const sitemapPath = path.join(
    __dirname,
    "..",
    "web-build-template",
    "sitemap.xml"
  );
  fs.writeFileSync(sitemapPath, sitemap.toString());

  console.log("Sitemap generated successfully at:", sitemapPath);
}

generateSitemap().catch((error) => {
  console.error("Error generating sitemap:", error);
  process.exit(1);
});
