import * as yargs from 'yargs';

// We'll mock the yargs module to test the args functionality
jest.mock('yargs/yargs', () => {
  return jest.fn().mockImplementation(() => {
    return {
      options: jest.fn().mockReturnThis(),
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
  
  test('should define all expected options', () => {
    const mockOptions = jest.fn().mockReturnThis();
    const mockYargs = {
      options: mockOptions,
      argv: {}
    };
    
    (yargs as jest.MockedFunction<any>).mockReturnValue(mockYargs);
    
    // Re-import to trigger the call with our new mock
    jest.isolateModules(() => {
      require('../../src/lib/args/args');
    });
    
    // Check that all required options were defined
    expect(mockOptions).toHaveBeenCalled();
    
    // Get the first call arguments (the options definition)
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