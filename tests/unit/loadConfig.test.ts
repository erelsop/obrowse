import fs from 'fs';
import loadConfig from '../../src/lib/util/loadConfig';

// Mock the fs module
jest.mock('fs', () => ({
  readFileSync: jest.fn()
}));

// Mock the process.exit function
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`Process.exit(${code})`);
});

describe('loadConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should load and parse a valid configuration file', () => {
    // Set up mock return value for readFileSync
    const mockConfig = {
      browser: 'chrome',
      url: 'https://example.com',
      headless: true
    };
    
    (fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>)
      .mockReturnValue(JSON.stringify(mockConfig));
    
    // Call the function with a mock file path
    const result = loadConfig('config.json', {});
    
    // Verify readFileSync was called with the correct path
    expect(fs.readFileSync).toHaveBeenCalledWith('config.json', 'utf8');
    
    // Verify the result matches our mock config
    expect(result).toEqual(mockConfig);
  });
  
  test('should exit the process when no configuration file is provided', () => {
    // Call the function with undefined filePath
    expect(() => {
      loadConfig(undefined, {});
    }).toThrow('Process.exit(1)');
    
    // Verify that process.exit was called with code 1
    expect(mockExit).toHaveBeenCalledWith(1);
  });
  
  test('should exit the process when there is an error reading the file', () => {
    // Set up mock to throw an error
    (fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>)
      .mockImplementation(() => {
        throw new Error('File not found');
      });
    
    // Call the function with a mock file path
    expect(() => {
      loadConfig('config.json', {});
    }).toThrow('Process.exit(1)');
    
    // Verify that process.exit was called with code 1
    expect(mockExit).toHaveBeenCalledWith(1);
  });
  
  test('should exit the process when the file contains invalid JSON', () => {
    // Set up mock to return invalid JSON
    (fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>)
      .mockReturnValue('{ invalid: json }');
    
    // Call the function with a mock file path
    expect(() => {
      loadConfig('config.json', {});
    }).toThrow('Process.exit(1)');
    
    // Verify that process.exit was called with code 1
    expect(mockExit).toHaveBeenCalledWith(1);
  });
}); 