const fs = require("fs");
const path = require("path");

const sourceDir = path.resolve(
  __dirname,
  "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts"
);
const destDir = path.resolve(__dirname, "dist/assets/fonts");

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy each font file from the source directory to the destination directory
fs.readdirSync(sourceDir).forEach((file) => {
  const sourceFile = path.join(sourceDir, file);
  const destFile = path.join(destDir, file);
  fs.copyFileSync(sourceFile, destFile);
  console.log(`Copied ${file} to ${destDir}`);
});

console.log("Font files copied successfully!");
