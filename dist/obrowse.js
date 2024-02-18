'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const playwright_1 = require("playwright");
const yargs_1 = tslib_1.__importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).options({
    browser: { type: 'string', demandOption: true },
    url: { type: 'string', demandOption: true },
    resolution: { type: 'string' },
    userAgent: { type: 'string' },
    pdf: { type: 'string' },
}).argv;
const { browser: browserType, url, resolution, userAgent, pdf } = argv;
const [width, height] = resolution ? resolution.split('x').map(Number) : [1280, 720];
(async () => {
    let browser;
    switch (browserType.toLowerCase()) {
        case 'chrome':
            browser = playwright_1.chromium;
            break;
        default:
            process.exit(1);
    }
    const launchBrowser = await browser.launch({ headless: true }); // Ensure headless is true for PDF generation
    const context = await launchBrowser.newContext({
        viewport: { width, height },
        userAgent,
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    // PDF generation logic
    if (pdf) {
        await page.pdf({ path: pdf, format: 'A4' });
    }
    await launchBrowser.close();
})();
