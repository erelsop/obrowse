import fs from "fs";

// Function to load and parse the configuration file
function loadConfig(filePath: string | undefined, args: any) {
  try {
    if (!filePath) {
      console.error("❌ No configuration file provided.");
      console.error("Usage: obrowse --cfg <config-file.json>");
      process.exit(1);
    }
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Configuration file not found: ${filePath}`);
      console.error(`\nExample config file:`);
      console.error(`{`);
      console.error(`  "browser": "chrome",`);
      console.error(`  "url": "https://example.com",`);
      console.error(`  "headless": true`);
      console.error(`}`);
      process.exit(1);
    }
    
    const configFileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(configFileContent);
  } catch (error: any) {
    if (error.message.includes('Unexpected token')) {
      console.error(`❌ Invalid JSON in configuration file: ${filePath}`);
      console.error(`Please check the JSON syntax. Common issues:`);
      console.error(`  - Missing quotes around strings`);
      console.error(`  - Trailing commas`);
      console.error(`  - Unclosed brackets or braces`);
    } else {
      console.error(`❌ Error loading configuration file: ${error.message}`);
    }
    process.exit(1);
  }
}

export default loadConfig;