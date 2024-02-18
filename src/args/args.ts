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
 */
export interface Arguments {
  browser: string;
  url: string;
  resolution?: string;
  userAgent?: string;
  pdf?: string;
  format?: string; // This could be 'A4', 'Letter', etc., or custom dimensions
  landscape?: boolean;
  recordVideo?: boolean;
  videoSize?: string;
  videoDir?: string;
  proxy?: string;
  cfg?: string;
}

const argv = yargs(hideBin(process.argv)).options({
  browser: { type: "string", optional: true },
  url: { type: "string", optional: true },
  resolution: { type: "string", optional: true },
  userAgent: { type: "string", optional: true },
  pdf: { type: "string", optional: true },
  format: { type: "string", optional: true },
  landscape: { type: "boolean", optional: true },
  recordVideo: { type: "boolean", optional: true },
  videoDir: { type: "string", optional: true },
  videoSize: { type: "string", optional: true },
  proxy: { type: "string", optional: true },
  cfg: { type: "string", demandOption: true, description: "Path to the configuration file." },
}).argv as Arguments;

export default argv;
