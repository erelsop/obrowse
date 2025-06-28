import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

/**
 * @interface Arguments
 * @description This interface is used to define the expected arguments for the CLI.
 * @property {string} browser - The browser to use. Supported browsers: chrome, firefox, safari.
 * @property {string} url - The URL to open in the browser.
 * @property {string} resolution - The resolution to use. Example: 1920x1080.
 * @property {string} userAgent - The user agent to use.
 * @property {string} pdf - The path to save the PDF file.
 * @property {string} format - The format of the PDF. Example: A4, Letter, etc.
 * @property {boolean} landscape - Whether to use landscape orientation for the PDF.
 * @property {boolean} recordVideo - Whether to record a video of the browser session.
 * @property {string} videoSize - The size of the video. Example: 1280x720.
 * @property {string} videoDir - The directory to save the video.
 * @property {string} proxy - The proxy server to use.
 * @property {string} cfg - The path to the configuration file.
 * @property {string} testFrame - The testing framework to use (`jest` or `mocha`)
 * @property {string} testFile - The path to the test file.
 * @property {boolean} headless - Whether to run the browser in headless mode.
 */
export interface Arguments {
  browser: "chrome" | "firefox" | "safari";
  url: string; 
  resolution?: string;
  userAgent?: string;
  pdf?: string; 
  format?: string; 
  landscape?: boolean;
  recordVideo?: boolean;
  videoSize?: string;
  videoDir?: string;
  proxy?: string;
  cfg?: string;
  testFrame?: "jest" | "mocha";
  testFile?: string;
  headless?: boolean;
}

const argv = yargs(hideBin(process.argv))
  .usage('Usage: obrowse [options]')
  .example('obrowse --browser chrome --url https://example.com', 'Open example.com in Chrome')
  .example('obrowse --browser chrome --url https://example.com --headless --pdf report.pdf', 'Generate PDF in headless mode')
  .example('obrowse --cfg config.json', 'Use configuration file')
  .example('obrowse --browser chrome --url https://example.com --testFrame jest --testFile tests/e2e.test.js', 'Run tests alongside browsing')
  .options({
  browser: {
    type: "string",
    optional: true,
    description: "Browser to use",
    choices: ["chrome", "firefox", "safari"],
  },
  url: {
    type: "string",
    optional: true,
    description: "URL to open in the browser",
  },
  resolution: {
    type: "string",
    optional: true,
    description: "Browser resolution (format: WIDTHxHEIGHT)",
    defaultDescription: "Browser default",
  },
  userAgent: {
    type: "string",
    optional: true,
    description: "Custom user agent string",
    defaultDescription: "Browser default",
  },
  pdf: {
    type: "string",
    optional: true,
    description: "Path to save PDF file (Chrome only)",
  },
  format: {
    type: "string",
    optional: true,
    description: "PDF page format",
    choices: ["A4", "A3", "A2", "A1", "A0", "Letter", "Legal", "Tabloid", "Ledger"],
    defaultDescription: "A4",
  },
  landscape: {
    type: "boolean",
    optional: true,
    description: "Use landscape orientation for PDF",
    defaultDescription: "false",
  },
  recordVideo: {
    type: "boolean",
    optional: true,
    description: "Record browser session as video",
    defaultDescription: "false",
  },
  videoDir: {
    type: "string",
    optional: true,
    description: "Directory to save recorded videos",
    defaultDescription: "./videos",
  },
  videoSize: {
    type: "string",
    optional: true,
    description: "Video resolution (format: WIDTHxHEIGHT)",
    defaultDescription: "Browser resolution",
  },
  proxy: {
    type: "string",
    optional: true,
    description: "Proxy server URL (e.g., http://localhost:8080)",
  },
  cfg: {
    type: "string",
    optional: true,
    description: "Path to JSON configuration file",
  },
  testFrame: {
    type: "string",
    optional: true,
    description: "Testing framework to use",
    choices: ["jest", "mocha"],
  },
  testFile: {
    type: "string",
    optional: true,
    description: "Path to test file to run",
  },
  headless: {
    type: "boolean",
    optional: true,
    description: "Run browser in headless mode (no GUI)",
    defaultDescription: "false",
  }
})
.help()
.version()
.strict()
.showHelpOnFail(true, 'Specify --help for available options')
.epilogue(`
Examples:
  Basic usage:
    obrowse --browser chrome --url https://google.com
  
  Generate PDF:
    obrowse --browser chrome --url https://example.com --headless --pdf report.pdf --format A4 --landscape
  
  Record session:
    obrowse --browser firefox --url https://example.com --recordVideo --videoDir ./recordings
  
  With proxy:
    obrowse --browser chrome --url https://example.com --proxy http://localhost:8080
  
  Run tests:
    obrowse --browser chrome --url https://myapp.com --testFrame jest --testFile tests/e2e.test.js
  
  Using config file:
    obrowse --cfg config.json

For more information, visit: https://github.com/erelsop/obrowse
`)
.argv as Arguments;

export default argv;
