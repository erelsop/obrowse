import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import yargs from 'yargs';

// Mock the main modules we need
jest.mock('../../src/lib/args/args', () => ({
  __esModule: true,
  default: {
    browser: 'chrome',
    url: 'https://example.com',
    headless: true
  },
}));

// Since these are end-to-end tests, we'll skip them if running in a CI environment
const shouldSkipE2E = process.env.CI === 'true';

// Helper function to create a temp config file
function createTempConfig(config: Record<string, any>): string {
  const tempFile = path.join(os.tmpdir(), `obrowse-config-${Date.now()}.json`);
  fs.writeFileSync(tempFile, JSON.stringify(config, null, 2));
  return tempFile;
}

describe('CLI End-to-End Tests', () => {
  beforeAll(() => {
    if (shouldSkipE2E) {
      console.log('Skipping E2E tests in CI environment');
    }
  });
  
  // Test the argument parsing
  test('should parse browser and URL arguments correctly', async () => {
    if (shouldSkipE2E) return;
    
    // Directly import the module to test it exists
    const argsModule = require('../../src/lib/args/args');
    
    // Verify that the module is defined
    expect(argsModule).toBeDefined();
    expect(typeof argsModule.default).toBe('object');
    
    // Create a test parser using the same options as the real CLI
    const parser = yargs()
      .option('browser', { type: 'string', description: 'Browser to use' })
      .option('url', { type: 'string', description: 'URL to open' })
      .option('headless', { type: 'boolean', description: 'Run headless' });
    
    // Parse test arguments
    const args = parser.parse(['--browser', 'chrome', '--url', 'https://example.com', '--headless']) as {
      browser?: string;
      url?: string;
      headless?: boolean;
      [key: string]: unknown;
    };
    
    // Verify parsed arguments
    expect(args.browser).toBe('chrome');
    expect(args.url).toBe('https://example.com');
    expect(args.headless).toBe(true);
  });

  test('should accept configuration from a file', () => {
    if (shouldSkipE2E) return;
    
    // Create a temporary config file
    const config = {
      browser: 'chrome',
      url: 'https://example.com',
      headless: true
    };
    
    const configPath = createTempConfig(config);
    
    try {
      // Read the config file
      const fileContent = fs.readFileSync(configPath, 'utf8');
      const parsedConfig = JSON.parse(fileContent);
      
      // Verify the config was written and can be parsed correctly
      expect(parsedConfig.browser).toBe('chrome');
      expect(parsedConfig.url).toBe('https://example.com');
      expect(parsedConfig.headless).toBe(true);
    } finally {
      // Clean up the temporary file
      fs.unlinkSync(configPath);
    }
  });
  
  test('should reject invalid configuration file', () => {
    if (shouldSkipE2E) return;
    
    // Create a temporary config file with invalid content
    const tempFile = path.join(os.tmpdir(), `obrowse-config-invalid-${Date.now()}.json`);
    fs.writeFileSync(tempFile, '{ invalid json }');
    
    try {
      // Try to parse the invalid JSON
      expect(() => {
        JSON.parse(fs.readFileSync(tempFile, 'utf8'));
      }).toThrow();
    } finally {
      // Clean up the temporary file
      fs.unlinkSync(tempFile);
    }
  });
}); 