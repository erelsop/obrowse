import { webkit, firefox, chromium, BrowserType } from "playwright";
import argv from "./lib/args/args";
import CaseConverter from "./lib/util/CaseConverter";
import loadConfig from "./lib/util/loadConfig";
import verifyConfig from "./lib/util/verifyConfig";
import handleTesting from "./lib/testing/handleTesting";

// Add some helpful startup info
console.log(`🌐 OpenBrowse v${require('../package.json').version} - Linux Browser Automation Tool\n`);

// Normalize argv keys to camelCase
const normalizedArgv = CaseConverter.convertKeys(
  argv,
  CaseConverter.toCamelCase
);

let mergedArgs: any = {};

// Load the configuration file
if (argv.cfg) {
  console.log(`📄 Loading configuration from: ${argv.cfg}`);
  const rawConfig = loadConfig(argv.cfg, argv);

  // Normalize keys to camelCase to match TypeScript interface expectations
  const normalizedConfig = CaseConverter.convertKeys(
    rawConfig,
    CaseConverter.toCamelCase
  );

  // Verify the normalized configuration
  const cfg = verifyConfig(normalizedConfig);

  // Merge command-line arguments with the configuration, prioritizing command-line arguments
  // Merge configurations with priority to command-line arguments
  mergedArgs = {
    ...cfg,
    ...normalizedArgv,
  };
  console.log(`✅ Configuration loaded successfully`);
} else {
  mergedArgs = normalizedArgv;
}

// Enhanced validation with better error messages
if (!mergedArgs.browser || !mergedArgs.url) {
  console.error(`❌ Error: Missing required arguments\n`);
  console.error(`Both 'browser' and 'url' must be specified.`);
  console.error(`\nExamples:`);
  console.error(`  obrowse --browser chrome --url https://example.com`);
  console.error(`  obrowse --cfg config.json`);
  console.error(`\nFor help: obrowse --help`);
  process.exit(1);
}

// Validate URL format
try {
  new URL(mergedArgs.url);
} catch (error) {
  console.error(`❌ Error: Invalid URL format: ${mergedArgs.url}`);
  console.error(`Please provide a valid URL (e.g., https://example.com)`);
  process.exit(1);
}

// Validate resolution format if provided
if (mergedArgs.resolution && !/^\d+x\d+$/.test(mergedArgs.resolution)) {
  console.error(`❌ Error: Invalid resolution format: ${mergedArgs.resolution}`);
  console.error(`Resolution must be in format WIDTHxHEIGHT (e.g., 1920x1080)`);
  process.exit(1);
}

// Validate video size format if provided
if (mergedArgs.videoSize && !/^\d+x\d+$/.test(mergedArgs.videoSize)) {
  console.error(`❌ Error: Invalid video size format: ${mergedArgs.videoSize}`);
  console.error(`Video size must be in format WIDTHxHEIGHT (e.g., 1280x720)`);
  process.exit(1);
}

// Show what we're about to do
console.log(`🚀 Starting browser automation:`);
console.log(`   Browser: ${mergedArgs.browser}`);
console.log(`   URL: ${mergedArgs.url}`);
if (mergedArgs.resolution) console.log(`   Resolution: ${mergedArgs.resolution}`);
if (mergedArgs.headless) console.log(`   Mode: Headless`);
if (mergedArgs.pdf) console.log(`   PDF Output: ${mergedArgs.pdf}`);
if (mergedArgs.recordVideo) console.log(`   Video Recording: Enabled`);
if (mergedArgs.proxy) console.log(`   Proxy: ${mergedArgs.proxy}`);
if (mergedArgs.testFrame && mergedArgs.testFile) {
  console.log(`   Testing: ${mergedArgs.testFrame} (${mergedArgs.testFile})`);
}
console.log('');

(async () => {
  let launchBrowser: any;
  
  try {
    // Process termination handlers
    const handleTermination = async () => {
      console.log("\n⏹️  Received termination signal. Cleaning up...");
      if (launchBrowser) {
        await launchBrowser.close().catch(() => {});
      }
      console.log("✅ Cleanup complete. Goodbye!");
      process.exit(0);
    };

    // Add event listeners for signals
    process.on('SIGINT', handleTermination);
    process.on('SIGTERM', handleTermination);
    
    // Prepare browser tasks
    const browserTasks = (async () => {
      let browser: BrowserType<any>;
      if (mergedArgs.pdf && mergedArgs.browser.toLowerCase() !== "chrome") {
        console.error("⚠️  PDF generation is only supported in Chrome/Chromium.");
        console.error("Please use --browser chrome for PDF output.");
        return;
      }

      console.log(`🔧 Launching ${mergedArgs.browser}...`);

      switch (mergedArgs.browser.toLowerCase()) {
        case "chrome":
          browser = chromium;
          break;
        case "firefox":
          browser = firefox;
          break;
        case "safari":
          browser = webkit;
          break;
        default:
          console.error(`❌ Unsupported browser: ${mergedArgs.browser}`);
          console.error("Supported browsers: chrome, firefox, safari");
          return;
      }

      const contextOptions: any = {
        viewport: mergedArgs.resolution
          ? {
              width: parseInt(mergedArgs.resolution.split("x")[0]),
              height: parseInt(mergedArgs.resolution.split("x")[1]),
            }
          : undefined,
        userAgent: mergedArgs.userAgent,
      };

      if (mergedArgs.recordVideo) {
        contextOptions.recordVideo = {
          dir: mergedArgs.videoDir || "./videos",
          size: mergedArgs.videoSize
            ? {
                width: parseInt(mergedArgs.videoSize.split("x")[0]),
                height: parseInt(mergedArgs.videoSize.split("x")[1]),
              }
            : undefined,
        };
        console.log(`📹 Video recording enabled (${mergedArgs.videoDir || "./videos"})`);
      }

      const launchOptions: any = {
        headless: mergedArgs.headless === true,
        ...(mergedArgs.proxy ? { proxy: { server: mergedArgs.proxy } } : {}),
      };

      launchBrowser = await browser.launch(launchOptions);
      const context = await launchBrowser.newContext(contextOptions);

      // Listen for the 'close' event on the context
      context.on("close", () => {
        console.log("\n🔒 Browser context closed. Exiting...");
        process.exit(0);
      });

      const page = await context.newPage();
      console.log(`🌐 Navigating to ${mergedArgs.url}...`);
      
      await page.goto(mergedArgs.url, { 
        waitUntil: "networkidle",
        timeout: 30000  // 30 second timeout
      });

      if (mergedArgs.pdf) {
        console.log(`📄 Generating PDF...`);
        await page.pdf({
          path: mergedArgs.pdf,
          format: mergedArgs.format || "A4",
          landscape: !!mergedArgs.landscape,
          printBackground: true,
        });
        console.log(`✅ PDF saved to: ${mergedArgs.pdf}`);
      } else {
        console.log(`✅ Page loaded successfully!`);
        if (!mergedArgs.headless) {
          console.log(`👀 Browser window is open. Press Ctrl+C to close.`);
        }
      }
    })();

    const testingTasks =
      mergedArgs.testFrame && mergedArgs.testFile
        ? handleTesting(mergedArgs.testFrame, mergedArgs.testFile)
        : Promise.resolve("No testing tasks specified.");

    // Wait for both sets of tasks to complete
    await Promise.all([browserTasks, testingTasks]);
  } catch (error: any) {
    console.error(`\n❌ An error occurred:`);
    if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
      console.error(`Cannot resolve URL: ${mergedArgs.url}`);
      console.error(`Please check the URL and your internet connection.`);
    } else if (error.message.includes('TimeoutError')) {
      console.error(`Page load timeout (30s) exceeded for: ${mergedArgs.url}`);
      console.error(`Try a different URL or check your connection.`);
    } else if (error.message.includes('browserType.launch')) {
      console.error(`Failed to launch ${mergedArgs.browser} browser.`);
      console.error(`Make sure Playwright browsers are installed: npm run install-browsers`);
    } else {
      console.error(error.message);
    }
    console.error(`\nFor help: obrowse --help`);
    
    if (launchBrowser) {
      await launchBrowser.close().catch(() => {});
    }
    process.exit(1);
  }
})();
