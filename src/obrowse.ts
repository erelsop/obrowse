import { webkit, firefox, chromium, BrowserType } from "playwright";
import argv from "./lib/args/args";
import CaseConverter from "./lib/util/CaseConverter";
import loadConfig from "./lib/util/loadConfig";
import verifyConfig from "./lib/util/verifyConfig";
import handleTesting from "./lib/testing/handleTesting";

// Normalize argv keys to camelCase
const normalizedArgv = CaseConverter.convertKeys(
  argv,
  CaseConverter.toCamelCase
);

let mergedArgs: any = {};

// Load the configuration file
if (argv.cfg) {
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
} else {
  mergedArgs = normalizedArgv;
}

// Verify the `browser` and `url` arguments
if (!mergedArgs.browser || !mergedArgs.url) {
  console.error(
    "Both 'browser' and 'url' must be specified, either in the command line or the configuration file."
  );
  process.exit(1);
}

(async () => {
  try {
    // Prepare browser tasks
    const browserTasks = (async () => {
      let browser: BrowserType<any>;
      if (mergedArgs.pdf && mergedArgs.browser.toLowerCase() !== "chrome") {
        console.log("PDF generation is only supported in Chromium (chrome).");
        return;
      }

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
          console.log(
            "Unsupported browser. Supported browsers: chrome, firefox, safari."
          );
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
      }

      const launchOptions: any = {
        headless: false,
        ...(mergedArgs.proxy ? { proxy: { server: mergedArgs.proxy } } : {}),
      };

      const launchBrowser = await browser.launch(launchOptions);
      const context = await launchBrowser.newContext(contextOptions);

      // Listen for the 'close' event on the context
      context.on("close", () => {
        console.log("\nBrowser context closed. Exiting...");
        process.exit(0);
      });

      const page = await context.newPage();
      await page.goto(mergedArgs.url, { waitUntil: "networkidle" });

      if (mergedArgs.pdf) {
        await page.pdf({
          path: mergedArgs.pdf,
          format: mergedArgs.format || "A4",
          landscape: !!mergedArgs.landscape,
          printBackground: true,
        });
        console.log(`PDF saved to ${mergedArgs.pdf}`);
      } else {
        console.log(
          `Navigating to ${mergedArgs.url} in ${
            mergedArgs.browser
          } with resolution ${
            mergedArgs.resolution || "default"
          } and User-Agent: ${mergedArgs.userAgent || "default"}`
        );
      }
    })();

    const testingTasks =
      mergedArgs.testFrame && mergedArgs.testFile
        ? handleTesting(mergedArgs.testFrame, mergedArgs.testFile)
        : Promise.resolve("No testing tasks specified.");

    // Wait for both sets of tasks to complete
    await Promise.all([browserTasks, testingTasks]);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
