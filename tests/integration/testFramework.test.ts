import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { runJestTests } from '../../src/lib/testing/adapters/jestAdapter';
import { runMochaTests } from '../../src/lib/testing/adapters/mochaAdapter';
import handleTesting from '../../src/lib/testing/handleTesting';

// Mock child_process spawn
jest.mock('child_process', () => ({
  spawn: jest.fn()
}));

// Mock the fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
  rmSync: jest.fn()
}));

describe('Testing Framework Integration', () => {
  let mockChildProcess: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up mock child process with event emitters
    mockChildProcess = {
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          // Store the callback to trigger later
          mockChildProcess.closeCallback = callback;
        } else if (event === 'error') {
          // Store the error callback to trigger later
          mockChildProcess.errorCallback = callback;
        }
        return mockChildProcess;
      }),
      closeCallback: null,
      errorCallback: null,
      // Mock stdio properties
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() }
    };
    
    // Make spawn return our mock
    (spawn as jest.MockedFunction<typeof spawn>).mockReturnValue(mockChildProcess as any);
    
    // Mock fs.existsSync to return true
    (fs.existsSync as jest.MockedFunction<typeof fs.existsSync>).mockReturnValue(true);
  });
  
  test('should run Jest tests successfully', async () => {
    // Define a path to a test file
    const testFilePath = path.join('tests', 'sample.test.js');
    
    // Call to run Jest tests (returns a Promise)
    const resultPromise = runJestTests(testFilePath);
    
    // Simulate successful test completion
    mockChildProcess.closeCallback(0);
    
    // Await the promise result
    const result = await resultPromise;
    
    // Check that spawn was called correctly
    expect(spawn).toHaveBeenCalledWith('npx', ['jest', testFilePath], { stdio: 'inherit' });
    
    // Verify the result was successful
    expect(result).toContain('successfully');
  });
  
  test('should handle Jest test failures', async () => {
    // Define a path to a test file
    const testFilePath = path.join('tests', 'sample.test.js');
    
    // Call to run Jest tests
    const resultPromise = runJestTests(testFilePath);
    
    // Simulate test failure
    mockChildProcess.closeCallback(1);
    
    // Await the promise rejection
    await expect(resultPromise).rejects.toContain('failed');
    
    // Check that spawn was called correctly
    expect(spawn).toHaveBeenCalledWith('npx', ['jest', testFilePath], { stdio: 'inherit' });
  });

  test('should handle Jest process spawn errors', async () => {
    // Define a path to a test file
    const testFilePath = path.join('tests', 'sample.test.js');
    
    // Call to run Jest tests
    const resultPromise = runJestTests(testFilePath);
    
    // Simulate spawn error
    const error = new Error('Failed to spawn jest process');
    mockChildProcess.errorCallback(error);
    
    // Await the promise rejection
    await expect(resultPromise).rejects.toContain('Failed to start Jest');
  });
  
  test('should run Mocha tests successfully', async () => {
    // Define a path to a test file
    const testFilePath = path.join('tests', 'sample.test.js');
    
    // Call to run Mocha tests
    const resultPromise = runMochaTests(testFilePath);
    
    // Simulate successful test completion
    mockChildProcess.closeCallback(0);
    
    // Await the promise result
    const result = await resultPromise;
    
    // Check that spawn was called correctly
    expect(spawn).toHaveBeenCalledWith('npx', ['mocha', testFilePath], { stdio: 'inherit' });
    
    // Verify the result was successful
    expect(result).toContain('successfully');
  });
  
  test('should handle Mocha test failures', async () => {
    // Define a path to a test file
    const testFilePath = path.join('tests', 'sample.test.js');
    
    // Call to run Mocha tests
    const resultPromise = runMochaTests(testFilePath);
    
    // Simulate test failure
    mockChildProcess.closeCallback(1);
    
    // Await the promise rejection
    await expect(resultPromise).rejects.toContain('failed');
    
    // Check that spawn was called correctly
    expect(spawn).toHaveBeenCalledWith('npx', ['mocha', testFilePath], { stdio: 'inherit' });
  });

  test('should handle Mocha process spawn errors', async () => {
    // Define a path to a test file
    const testFilePath = path.join('tests', 'sample.test.js');
    
    // Call to run Mocha tests
    const resultPromise = runMochaTests(testFilePath);
    
    // Simulate spawn error
    const error = new Error('Failed to spawn mocha process');
    mockChildProcess.errorCallback(error);
    
    // Await the promise rejection
    await expect(resultPromise).rejects.toContain('Failed to start Mocha');
  });

  test('should handle non-existent test files for Jest', async () => {
    // Mock fs.existsSync to return false for this test
    (fs.existsSync as jest.MockedFunction<typeof fs.existsSync>).mockReturnValue(false);
    
    // Define a path to a non-existent test file
    const testFilePath = path.join('tests', 'nonexistent.test.js');
    
    // Call to run Jest tests
    await expect(runJestTests(testFilePath)).rejects.toContain('not found');
    
    // Verify that spawn was not called
    expect(spawn).not.toHaveBeenCalled();
  });

  test('should handle non-existent test files for Mocha', async () => {
    // Mock fs.existsSync to return false for this test
    (fs.existsSync as jest.MockedFunction<typeof fs.existsSync>).mockReturnValue(false);
    
    // Define a path to a non-existent test file
    const testFilePath = path.join('tests', 'nonexistent.test.js');
    
    // Call to run Mocha tests
    await expect(runMochaTests(testFilePath)).rejects.toContain('not found');
    
    // Verify that spawn was not called
    expect(spawn).not.toHaveBeenCalled();
  });
  
  test('should call the appropriate test runner in handleTesting', async () => {
    // Spy on the runJestTests function
    const jestSpy = jest.spyOn(require('../../src/lib/testing/adapters/jestAdapter'), 'runJestTests');
    const mochaSpy = jest.spyOn(require('../../src/lib/testing/adapters/mochaAdapter'), 'runMochaTests');
    
    // Mock both functions to resolve successfully
    jestSpy.mockResolvedValue('Jest tests completed successfully.');
    mochaSpy.mockResolvedValue('Mocha tests completed successfully.');
    
    // Test Jest integration
    await handleTesting('jest', 'test.js');
    expect(jestSpy).toHaveBeenCalledWith('test.js');
    
    // Test Mocha integration
    await handleTesting('mocha', 'test.js');
    expect(mochaSpy).toHaveBeenCalledWith('test.js');
    
    // Test case insensitivity
    await handleTesting('JeSt', 'test.js');
    expect(jestSpy).toHaveBeenCalledWith('test.js');
    
    // Reset the spies
    jestSpy.mockRestore();
    mochaSpy.mockRestore();
  });

  test('should handle unsupported testing framework', async () => {
    // Spy on console.error to verify the unsupported framework message
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Test with unsupported framework
    await handleTesting('unknown', 'test.js');
    
    // Verify the unsupported framework message was logged
    expect(consoleSpy).toHaveBeenCalledWith('❌ Unsupported testing framework: unknown');
    expect(consoleSpy).toHaveBeenCalledWith('Supported frameworks: jest, mocha');
    
    // Clean up
    consoleSpy.mockRestore();
  });

  test('should handle errors during test execution', async () => {
    // Spy on the runJestTests function to throw an error
    const jestSpy = jest.spyOn(require('../../src/lib/testing/adapters/jestAdapter'), 'runJestTests');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Mock the function to throw an error
    jestSpy.mockRejectedValue(new Error('Test execution failed'));
    
    // Test error handling
    await handleTesting('jest', 'test.js');
    
    // Verify error was logged with new format
    expect(consoleSpy).toHaveBeenCalledWith('❌ Test execution failed:');
    expect(consoleSpy).toHaveBeenCalledWith('   Error: Test execution failed');
    
    // Clean up
    jestSpy.mockRestore();
    consoleSpy.mockRestore();
  });
}); 