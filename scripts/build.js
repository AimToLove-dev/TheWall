const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Starting SEO-optimized build process...");

// Step 1: Run Expo export
console.log("📦 Running Expo export...");
execSync("npx expo export", { stdio: "inherit" });

// Step 2: Generate sitemap
console.log("🗺️ Generating sitemap...");
execSync("node scripts/generate-sitemap.js", { stdio: "inherit" });

// Step 3: Copy sitemap and robots.txt to the dist folder
console.log("📋 Copying sitemap and robots.txt to distribution folder...");
const sitemapSource = path.join(__dirname, "..", "web-build-template", "sitemap.xml");
const sitemapDest = path.join(__dirname, "..", "dist", "sitemap.xml");
const robotsSource = path.join(__dirname, "..", "robots.txt");
const robotsDest = path.join(__dirname, "..", "dist", "robots.txt");

fs.copyFileSync(sitemapSource, sitemapDest);
fs.copyFileSync(robotsSource, robotsDest);

// Step 4: Post-process the HTML to inject SEO tags
console.log("🔧 Injecting SEO metadata into HTML...");

// Path to the generated index.html
const indexPath = path.join(__dirname, "..", "dist", "index.html");

// Read the HTML file
let htmlContent = fs.readFileSync(indexPath, "utf-8");

// Define SEO metadata
const seoMetadata = {
  title: "The Wall - A Holy Revolution for the LGBTQ+ Community",
  description:
    "The Wall is a holy revolution that provides a place to love, pray for, and evangelize the LGBTQ+ community through our Wailing Wall and Testimony Wall initiatives.",
  image:
    "https://firebasestorage.googleapis.com/v0/b/thewall-3de3b.firebasestorage.app/o/preview.png?alt=media&token=f2c6b0d6-1f62-4451-adad-d22373a9c50c", // Updated to thewall.love domain
  url: "https://thewall.love", // Updated to thewall.love domain
};

// Create the SEO meta tags
const seoTags = `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${seoMetadata.title}" />
    <meta name="description" content="${seoMetadata.description}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${seoMetadata.url}" />
    <meta property="og:title" content="${seoMetadata.title}" />
    <meta property="og:description" content="${seoMetadata.description}" />
    <meta property="og:image" content="${seoMetadata.image}" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${seoMetadata.url}" />
    <meta property="twitter:title" content="${seoMetadata.title}" />
    <meta property="twitter:description" content="${seoMetadata.description}" />
    <meta property="twitter:image" content="${seoMetadata.image}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${seoMetadata.url}" />
`;

// Insert the SEO tags right after the title tag
htmlContent = htmlContent.replace(
  /<title>.*<\/title>/,
  `<title>${seoMetadata.title}</title>\n    ${seoTags}`
);

// Write the modified HTML back to the file
fs.writeFileSync(indexPath, htmlContent, "utf-8");

console.log("✅ Build completed with SEO metadata and sitemap generated!");
console.log("🔍 Your site is now ready for crawlers and link previews.");

// Optional: Deploy to Firebase
if (process.argv.includes("--deploy")) {
  console.log("🔥 Deploying to Firebase...");
  execSync("firebase deploy --only hosting", { stdio: "inherit" });
  console.log("🚀 Deployment complete!");
}
