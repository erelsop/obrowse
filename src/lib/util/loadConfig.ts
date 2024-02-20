import fs from "fs";

// Function to load and parse the configuration file
function loadConfig(filePath: string | undefined, args: any) {
  try {
    if (!filePath) {
      console.error("No configuration file provided.");
      process.exit(1);
    }
    const configFileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(configFileContent);
  } catch (error) {
    console.error("Error loading configuration file:", error);
    process.exit(1);
  }
}

export default loadConfig;