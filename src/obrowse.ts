import { webkit, firefox, chromium, BrowserType } from "playwright";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

interface Arguments {
  browser: string;
  url: string;
  resolution?: string | null;
  userAgent?: string;
  pdf?: string;
  format?: string; // This could be 'A4', 'Letter', etc., or custom dimensions
  landscape?: boolean;
}

const argv = yargs(hideBin(process.argv)).options({
  browser: {
    type: "string",
    demandOption: true,
    description: "Specify the browser to use (chrome, firefox, safari).",
  },
  url: {
    type: "string",
    demandOption: true,
    description: "The URL to open.",
  },
  resolution: {
    type: "string",
    optional: true,
    description: "Custom resolution for the browser window (e.g., '1280x720').",
  },
  userAgent: {
    type: "string",
    optional: true,
    description: "Custom User-Agent string to simulate different devices.",
  },
  pdf: {
    type: "string",
    optional: true,
    description: "Generate a PDF of the webpage (Chromium only).",
  },
  format: {
    type: "string",
    optional: true,
    description:
      "Specify the format for PDF generation (e.g., 'A4', 'Letter').",
  },
  landscape: {
    type: "boolean",
    default: false,
    description: "Generate PDF in landscape orientation (Chromium only).",
  },
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
  : [null, null];

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

  // Launch the browser. Always in headful mode to ensure the window opens.
  // The window is resizable, and the page content will respond to the size changes
  // if no resolution is specified.
  const launchBrowser = await browser.launch({ headless: false });

  const context = await launchBrowser.newContext({
    viewport: width && height ? { width, height } : null,
    userAgent: userAgent,
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });

  if (pdf) {
    // Generate PDF with specified or default settings
    await page.pdf({
      path: pdf,
      format: argv.format || "A4", // Use the format specified by the user or default to A4
      landscape, // Use the landscape option specified by the user
      printBackground: true, // Ensure background graphics are included
    });
    console.log(`PDF saved to ${pdf}`);
  } else {
    console.log(
      `Navigating to ${url} in ${browserType} with resolution ${width}x${height} and User-Agent: ${
        userAgent || "default"
      }`
    );
  }
})();
