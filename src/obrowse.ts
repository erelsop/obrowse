import { webkit, firefox, chromium, BrowserType } from "playwright";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

interface Arguments {
  browser: string;
  url: string;
  resolution?: string;
  userAgent?: string;
  pdf?: string;
  format?: string; // This could be 'A4', 'Letter', etc., or custom dimensions
  landscape?: boolean;
}

const argv = yargs(hideBin(process.argv)).options({
  browser: { type: "string", demandOption: true },
  url: { type: "string", demandOption: true },
  resolution: { type: "string", optional: true },
  userAgent: { type: "string", optional: true },
  pdf: { type: "string", optional: true },
  format: { type: "string", optional: true },
  landscape: { type: "boolean", default: false },
}).argv as Arguments;

const {
  browser: browserType,
  url,
  resolution,
  userAgent,
  pdf,
  landscape,
} = argv;

// Parse the resolution argument to extract width and height
const [width, height] = resolution
  ? resolution.split("x").map(Number)
  : [1280, 720];

(async () => {
  let browser: BrowserType<any>;
  if (pdf && browserType.toLowerCase() !== "chrome") {
    console.log("PDF generation is only supported in Chromium (chrome).");
    process.exit(1);
  }

  switch (browserType.toLowerCase()) {
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

  const launchBrowser = await browser.launch({ headless: pdf ? true : false });
  const context = await launchBrowser.newContext({
    viewport: { width, height },
    userAgent: userAgent,
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });

  if (pdf) {
    await page.pdf({
      path: pdf,
      format: argv.format || "A4", // Use the format specified in argv or default to 'A4'
      landscape: landscape, // Use the landscape flag from argv
      printBackground: true,
    });
    console.log(
      `PDF saved to ${pdf} in ${landscape ? "landscape" : "portrait"} mode.`
    );
  } else {
    console.log(
      `Navigating to ${url} in ${browserType} with resolution ${width}x${height} and User-Agent: ${
        userAgent || "default"
      }`
    );
  }

  await launchBrowser.close();
})();
