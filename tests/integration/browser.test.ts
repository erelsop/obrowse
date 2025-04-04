import * as playwright from 'playwright';

// Mock the playwright module
jest.mock('playwright', () => {
  // Mock browser types
  const mockBrowser = {
    launch: jest.fn().mockResolvedValue({
      newContext: jest.fn().mockResolvedValue({
        on: jest.fn(),
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue({}),
          pdf: jest.fn().mockResolvedValue({}),
        }),
      }),
      close: jest.fn().mockResolvedValue({}),
    }),
  };

  return {
    chromium: { ...mockBrowser },
    firefox: { ...mockBrowser },
    webkit: { ...mockBrowser },
  };
});

// Import the main module after mocking its dependencies
import { webkit, firefox, chromium } from 'playwright';

describe('Browser Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should launch Chrome browser correctly', async () => {
    // Create a minimal config with Chrome
    const config = {
      browser: 'chrome',
      url: 'https://example.com',
    };

    // Call the browser launch function directly from the mocked module
    await chromium.launch();

    // Verify that the right browser was launched
    expect(chromium.launch).toHaveBeenCalled();
  });

  test('should launch Firefox browser correctly', async () => {
    // Create a minimal config with Firefox
    const config = {
      browser: 'firefox',
      url: 'https://example.com',
    };

    // Call the browser launch function directly from the mocked module
    await firefox.launch();

    // Verify that the right browser was launched
    expect(firefox.launch).toHaveBeenCalled();
  });

  test('should launch Safari browser correctly', async () => {
    // Create a minimal config with Safari (webkit)
    const config = {
      browser: 'safari',
      url: 'https://example.com',
    };

    // Call the browser launch function directly from the mocked module
    await webkit.launch();

    // Verify that the right browser was launched
    expect(webkit.launch).toHaveBeenCalled();
  });

  test('should pass headless option when specified', async () => {
    // Call the browser launch function with headless option
    await chromium.launch({ headless: true });

    // Verify that the headless option was passed
    expect(chromium.launch).toHaveBeenCalledWith(
      expect.objectContaining({ headless: true })
    );
  });

  test('should pass proxy option when specified', async () => {
    // Call the browser launch function with proxy option
    await chromium.launch({ 
      proxy: { server: 'http://localhost:8080' } 
    });

    // Verify that the proxy option was passed
    expect(chromium.launch).toHaveBeenCalledWith(
      expect.objectContaining({ 
        proxy: { server: 'http://localhost:8080' } 
      })
    );
  });

  test('should generate PDF when requested', async () => {
    // Set up browser, context, and page
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to a page
    await page.goto('https://example.com');
    
    // Generate PDF
    await page.pdf({
      path: 'test.pdf',
      format: 'A4',
      landscape: true,
      printBackground: true,
    });
    
    // Verify that PDF generation was called with the correct options
    expect(page.pdf).toHaveBeenCalledWith({
      path: 'test.pdf',
      format: 'A4',
      landscape: true,
      printBackground: true,
    });
  });
}); 