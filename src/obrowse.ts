import { webkit, firefox, chromium, BrowserType } from 'playwright';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

interface Arguments {
  browser: string; // Add browser option to specify the browser to use (e.g., "chrome", "firefox", "safari")
  url: string; // Add URL option to specify the page to navigate to
  resolution?: string; // Add resolution option to specify viewport size (e.g., "1280x720")
  userAgent?: string; // Add User-Agent option to specify custom User-Agent
  pdf?: string; // Add PDF option to specify output file
  format?: string; // Add format option for PDF generation (e.g., "A4", "Letter")
  landscape?: boolean; // Add landscape option for PDF generation
}

// Parse command line arguments
const argv = yargs(hideBin(process.argv)).options({
  browser: { type: 'string', demandOption: true },
  url: { type: 'string', demandOption: true },
  resolution: { type: 'string', optional: true },
  userAgent: { type: 'string', optional: true },
  pdf: { type: 'string', optional: true },
  format: { type: 'string', optional: true },
  landscape: { type: 'boolean', default: false },
}).argv as Arguments;


const { browser: browserType, url, resolution, userAgent, pdf } = argv;

// Parse the resolution argument to extract width and height
const [width, height] = resolution ? resolution.split('x').map(Number) : [1280, 720];

(async () => {
  let browser: BrowserType<any>;
  // Ensure Chromium is used for PDF generation
  if (pdf && browserType.toLowerCase() !== 'chrome') {
    console.log("PDF generation is only supported in Chromium (chrome).");
    process.exit(1);
  }

  switch (browserType.toLowerCase()) {
    case 'chrome':
      browser = chromium;
      break;
    case 'firefox':
      browser = firefox;
      break;
    case 'safari':
      browser = webkit;
      break;
    default:
      console.log("Unsupported browser. Supported browsers: chrome, firefox, safari.");
      process.exit(1);
  }

  const launchBrowser = await browser.launch({ headless: pdf ? true : false }); // Launch in headless mode if generating a PDF
  const context = await launchBrowser.newContext({
    viewport: { width, height },
    userAgent: userAgent,
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  if (pdf) {
    // Generate PDF with specified or default settings
    await page.pdf({
      path: pdf,
      format: 'A4', // Default format; consider adding CLI options for custom formats
      printBackground: true, // Ensure background graphics are included
    });
    console.log(`PDF saved to ${pdf}`);
  } else {
    console.log(`Navigating to ${url} in ${browserType} with resolution ${width}x${height} and User-Agent: ${userAgent || 'default'}`);
  }

  await launchBrowser.close();
})();
