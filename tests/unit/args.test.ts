import * as yargs from 'yargs';

// We'll mock the yargs module to test the args functionality
jest.mock('yargs/yargs', () => {
  return jest.fn().mockImplementation(() => {
    return {
      usage: jest.fn().mockReturnThis(),
      example: jest.fn().mockReturnThis(),
      options: jest.fn().mockReturnThis(),
      help: jest.fn().mockReturnThis(),
      version: jest.fn().mockReturnThis(),
      strict: jest.fn().mockReturnThis(),
      showHelpOnFail: jest.fn().mockReturnThis(),
      epilogue: jest.fn().mockReturnThis(),
      argv: {
        browser: 'chrome',
        url: 'https://example.com'
      }
    };
  });
});

describe('Arguments Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should provide browser and url arguments', () => {
    // Import the module under test after setting up the mock
    const args = require('../../src/lib/args/args').default;
    
    // Check that it returns the expected values from our mock
    expect(args.browser).toBe('chrome');
    expect(args.url).toBe('https://example.com');
  });
  
  test('should export the Arguments interface', () => {
    // Since TypeScript interfaces are removed during compilation,
    // we can't directly test for their existence at runtime.
    // Instead, let's check that the module exists and exports what we expect
    const ArgsModule = require('../../src/lib/args/args');
    
    expect(ArgsModule).toBeDefined();
    expect(typeof ArgsModule.default).toBe('object');
  });
  
  test('should define all expected options and setup methods', () => {
    const mockUsage = jest.fn().mockReturnThis();
    const mockExample = jest.fn().mockReturnThis();
    const mockOptions = jest.fn().mockReturnThis();
    const mockHelp = jest.fn().mockReturnThis();
    const mockVersion = jest.fn().mockReturnThis();
    const mockStrict = jest.fn().mockReturnThis();
    const mockShowHelpOnFail = jest.fn().mockReturnThis();
    const mockEpilogue = jest.fn().mockReturnThis();
    
    const mockYargs = {
      usage: mockUsage,
      example: mockExample,
      options: mockOptions,
      help: mockHelp,
      version: mockVersion,
      strict: mockStrict,
      showHelpOnFail: mockShowHelpOnFail,
      epilogue: mockEpilogue,
      argv: {}
    };
    
    (yargs as jest.MockedFunction<any>).mockReturnValue(mockYargs);
    
    // Re-import to trigger the call with our new mock
    jest.isolateModules(() => {
      require('../../src/lib/args/args');
    });
    
    // Check that all setup methods were called
    expect(mockUsage).toHaveBeenCalled();
    expect(mockExample).toHaveBeenCalled();
    expect(mockOptions).toHaveBeenCalled();
    expect(mockHelp).toHaveBeenCalled();
    expect(mockVersion).toHaveBeenCalled();
    expect(mockStrict).toHaveBeenCalled();
    expect(mockShowHelpOnFail).toHaveBeenCalled();
    expect(mockEpilogue).toHaveBeenCalled();
    
    // Get the options call arguments (the options definition)
    const optionsCall = mockOptions.mock.calls[0];
    const optionsObj = optionsCall[0];
    
    // Verify that all expected options are present
    expect(optionsObj).toHaveProperty('browser');
    expect(optionsObj).toHaveProperty('url');
    expect(optionsObj).toHaveProperty('resolution');
    expect(optionsObj).toHaveProperty('userAgent');
    expect(optionsObj).toHaveProperty('pdf');
    expect(optionsObj).toHaveProperty('format');
    expect(optionsObj).toHaveProperty('landscape');
    expect(optionsObj).toHaveProperty('recordVideo');
    expect(optionsObj).toHaveProperty('videoDir');
    expect(optionsObj).toHaveProperty('videoSize');
    expect(optionsObj).toHaveProperty('proxy');
    expect(optionsObj).toHaveProperty('cfg');
    expect(optionsObj).toHaveProperty('testFrame');
    expect(optionsObj).toHaveProperty('testFile');
    expect(optionsObj).toHaveProperty('headless');
  });
}); 