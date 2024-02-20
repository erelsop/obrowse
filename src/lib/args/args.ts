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
}

const argv = yargs(hideBin(process.argv)).options({
  browser: {
    type: "string",
    optional: true,
    description:
      "The browser to use. Supported browsers: `chrome`, `firefox`, `safari`.",
  },
  url: {
    type: "string",
    optional: true,
    description: "The URL to open in the browser.",
  },
  resolution: {
    type: "string",
    optional: true,
    description: "The resolution to use. Example: 1920x1080.",
  },
  userAgent: {
    type: "string",
    optional: true,
    description: "The user agent to use.",
  },
  pdf: {
    type: "string",
    optional: true,
    description: "The path to save the PDF file.",
  },
  format: {
    type: "string",
    optional: true,
    description: "The format of the PDF. Example: A4, Letter, etc.",
  },
  landscape: {
    type: "boolean",
    optional: true,
    description: "Whether to use landscape orientation for the PDF.",
  },
  recordVideo: {
    type: "boolean",
    optional: true,
    description: "Whether to record a video of the browser session.",
  },
  videoDir: {
    type: "string",
    optional: true,
    description: "The directory to save the video.",
  },
  videoSize: {
    type: "string",
    optional: true,
    description: "The size of the video. Example: 1280x720.",
  },
  proxy: {
    type: "string",
    optional: true,
    description: "The proxy server to use.",
  },
  cfg: {
    type: "string",
    optional: true,
    description: "Path to the configuration file.",
  },
  testFrame: {
    type: "string",
    optional: true,
    description: "The testing framework to use (`jest` or `mocha`)"
  },
  testFile: {
    type: "string",
    optional: true,
    description: "The path to the test file."
  }
}).argv as Arguments;

export default argv;
