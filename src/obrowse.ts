import { webkit, firefox, chromium, BrowserType } from "playwright";
import argv from "./args/args";
import CaseConverter from "./util/CaseConverter";
import loadConfig from "./util/loadConfig";
import verifyConfig from "./util/verifyConfig";

// Normalize argv keys to camelCase
const normalizedArgv = CaseConverter.convertKeys(
  argv,
  CaseConverter.toCamelCase
);

// Load the configuration file
const rawConfig = loadConfig(argv.cfg);

// Normalize keys to camelCase to match TypeScript interface expectations
const normalizedConfig = CaseConverter.convertKeys(
  rawConfig,
  CaseConverter.toCamelCase
);

// Verify the normalized configuration
const cfg = verifyConfig(normalizedConfig);

// Merge command-line arguments with the configuration, prioritizing command-line arguments
// Merge configurations with priority to command-line arguments
const mergedArgs = {
  ...cfg,
  ...normalizedArgv,
};

// Verify the `browser` and `url` arguments
if (!mergedArgs.browser || !mergedArgs.url) {
  console.error(
    "Both 'browser' and 'url' must be specified, either in the command line or the configuration file."
  );
  process.exit(1);
}

// console.log("Merged arguments:", mergedArgs);

// Parse the resolution argument to extract width and height
const [width, height] = mergedArgs.resolution
  ? mergedArgs.resolution.split("x").map(Number)
  : [undefined, undefined];

// Parse the videoSize argument to extract width and height
const [videoWidth, videoHeight] = mergedArgs.videoSize
  ? mergedArgs.videoSize.split("x").map(Number)
  : [undefined, undefined];

(async () => {
  let browser: BrowserType<any>;
  if (mergedArgs.pdf && mergedArgs.browser.toLowerCase() !== "chrome") {
    console.log("PDF generation is only supported in Chromium (chrome).");
    process.exit(1);
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
      process.exit(1);
  }

  const contextOptions: any = {
    viewport: width && height ? { width, height } : undefined,
    userAgent: mergedArgs.userAgent,
  };

  if (mergedArgs.recordVideo) {
    contextOptions.recordVideo = {
      dir: mergedArgs.videoDir || "./videos",
    };
    if (videoWidth && videoHeight) {
      contextOptions.recordVideo.size = {
        width: videoWidth,
        height: videoHeight,
      };
    }
  }

  const launchOptions: any = {
    headless: false,
    ...(mergedArgs.proxy ? { proxy: { server: mergedArgs.proxy } } : {}),
  };

  const launchBrowser = await browser.launch(launchOptions);
  const context = await launchBrowser.newContext(contextOptions);

  const page = await context.newPage();
  await page.goto(mergedArgs.url, { waitUntil: "networkidle" });

  if (mergedArgs.pdf) {
    await page.pdf({
      path: mergedArgs.pdf,
      format: mergedArgs.format || "A4",
      landscape: mergedArgs.landscape,
      printBackground: true,
    });
    console.log(`PDF saved to ${mergedArgs.pdf}`);
  } else {
    console.log(
      `Navigating to ${mergedArgs.url} in ${
        mergedArgs.browser
      } with resolution ${width ? width : "default"}x${
        height ? height : "default"
      } and User-Agent: ${mergedArgs.userAgent || "default"}`
    );
  }
})();
