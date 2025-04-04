import { Arguments } from "../args/args";

function verifyConfig(cfg: any): Arguments {
  // Define expected keys and their types
  const expectedConfig: Record<string, string> = {
    browser: 'string',
    url: 'string',
    resolution: 'string',
    userAgent: 'string',
    pdf: 'string',
    format: 'string',
    landscape: 'boolean',
    recordVideo: 'boolean',
    videoSize: 'string',
    videoDir: 'string',
    proxy: 'string',
    cfg: 'string',
    testFrame: 'string',
    testFile: 'string',
    headless: 'boolean',
  };

  // Collect errors for detailed feedback
  let errors: string[] = [];

  // Check for unexpected keys
  const configKeys = Object.keys(cfg);
  const unexpectedKeys = configKeys.filter(key => !(key in expectedConfig));
  if (unexpectedKeys.length > 0) {
    errors.push(`Unexpected keys found: ${unexpectedKeys.join(', ')}.`);
  }

  // Validate types of the provided keys
  configKeys.forEach(key => {
    const expectedType = expectedConfig[key];
    const actualType = typeof cfg[key];
    if (expectedType && actualType !== expectedType) {
      errors.push(`Expected '${key}' to be of type '${expectedType}', but got '${actualType}'.`);
    }

    // Special case for 'resolution' and 'videoSize' to check format 'WIDTHxHEIGHT'
    if ((key === 'resolution' || key === 'videoSize') && cfg[key] && !/^(\d+)x(\d+)$/.test(cfg[key])) {
      errors.push(`'${key}' should be in the format 'WIDTHxHEIGHT', e.g., '1280x720'.`);
    }
  });

  // Handle optional boolean values correctly by checking their existence rather than type only
  ['landscape', 'recordVideo', 'headless'].forEach(key => {
    if (cfg.hasOwnProperty(key) && typeof cfg[key] !== 'boolean') {
      errors.push(`Expected '${key}' to be of type 'boolean', but got '${typeof cfg[key]}'.`);
    }
  });

  if (errors.length > 0) {
    // Combine all errors into a single error message for clarity
    throw new Error(`Configuration file errors:\n- ${errors.join("\n- ")}`);
  }

  return cfg as Arguments;
}

export default verifyConfig;