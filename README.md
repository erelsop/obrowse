# OpenBrowse (obrowse)

## Introduction

OpenBrowse, or `obrowse`, is a command-line interface (CLI) tool designed to simplify web browsing tasks directly from your terminal. Whether you need to open specific URLs, generate PDFs of webpages, simulate different browsing environments, or record browser sessions, `obrowse` provides a convenient solution. While primarily designed for WSL2 (Windows Subsystem for Linux 2), `obrowse` is expected to work seamlessly in any Unix-like environment.

## Installation

### Prerequisites

Before installing `obrowse`, ensure you have the following prerequisites:

- **WSL2 (Windows Subsystem for Linux 2):** `obrowse` is primarily designed for use within a WSL2 environment, but will likely function as expected in any Unix-like environment.
- **Node.js:** Node.js is required to run the `obrowse` CLI tool. If you haven't already installed Node.js, you can download and install it from the [Node.js official website](https://nodejs.org/).

### Installation Steps

1. **Clone the Repository:**

   Begin by cloning the `obrowse` repository to your local machine:

   ```bash
   git clone https://github.com/erelsop/obrowse.git ~/src/obrowse
   cd ~/src/obrowse
   ```

2. **Install Dependencies:**

   Install `ts-node` globally to execute TypeScript files directly from the command line:

   ```bash
   npm install -g typescript && npm install -g ts-node
   ```

   Then install all project dependencies, including local development dependencies:

   ```bash
   npm install
   npm run install-browsers
   ```

   To install system dependencies required for Playwright, run:

   ```bash
   npm run install-deps
   ```

   If you want to build the project for distribution, use:

   ```bash
   npm run build
   ```

3. **Global Access via Bash Function:**

   For convenient access to `obrowse` from anywhere in your terminal, you can define a Bash function in your `.bashrc` or `.zshrc` file:

   ```bash
   echo "obrowse() { (cd ~/src/obrowse && ts-node src/obrowse.ts \"\$@\") }" >> ~/.bashrc
   source ~/.bashrc
   ```

## Usage

### Basic Commands

Use `obrowse` followed by the desired command-line arguments to perform various tasks. Here are some basic commands:

- **Open a URL:**

  ```bash
  obrowse --browser chrome --url "https://example.com"
  ```

### Advanced Options

`obrowse` supports advanced options for customizing your browsing experience, including:

- **PDF Generation:** Generate PDFs of web pages with custom format and orientation.
- **Custom Resolution and User-Agent:** Simulate different devices by specifying custom resolutions and user-agent strings.
- **Browser Session Recording:** Record browser sessions into video files, useful for bug reporting and tutorials.
- **Proxy Support:** Specify a proxy server for the browser session, aiding in testing geo-specific content or privacy-focused browsing.
- **Configuration File Support:** Use a configuration file to save commonly used settings, streamlining the process of initiating browser sessions.
- **Headless Mode:** Run browsers in headless mode without a visible UI, useful for CI/CD environments and automated testing.
- **Integrated Testing:** Run automated browser tests using Jest or Mocha directly through the CLI. This feature allows users to specify a testing framework and test files for automated testing alongside their web browsing tasks.

For detailed usage instructions and available options, refer to the command-line help accessible via `obrowse --help`.

### Integrated Testing with Jest and Mocha

`obrowse` now supports integrated testing, allowing users to run automated tests for their web applications using Jest and Mocha directly through the CLI. This feature simplifies the process of setting up and executing browser-based tests, making it easier to incorporate into your development workflow.

#### Setting Up Tests

To utilize the testing functionality, ensure your tests are prepared in either Jest or Mocha. Specify the testing framework and the test file path using the `--testFrame` and `--testFile` command-line arguments, respectively.

##### For Jest:

Ensure Jest is installed in your project, and write your tests as you normally would. For example:

```javascript
const { chromium } = require('playwright');

describe('Google Page Test with Jest', () => {
  it('should open google.com and check the title', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://google.com');
    expect(await page.title()).toBe('Google');
    await browser.close();
  });
});
```

##### For Mocha:

For Mocha users, ensure Mocha and Chai are included in your project for testing and assertions. When writing Mocha tests, it's important to note that tests using ES Module syntax should use the `.mjs` extension or configure Mocha to work with ES Module syntax in `.js` files:

```javascript
import { expect } from 'chai';
import { chromium } from 'playwright';

describe('Google Page Test with Mocha', function() {
  it('should open google.com and check the title', async function() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://google.com');
    const title = await page.title();
    expect(title).to.equal('Google');
    await browser.close();
  });
});
```

#### Running Tests

To run your tests through `obrowse`, use the following command, replacing `<framework>` with either `jest` or `mocha`, and `<path_to_test_file>` with the path to your test file:

```bash
obrowse --testFrame <framework> --testFile <path_to_test_file>
```

Example using Jest:

```bash
obrowse --testFrame jest --testFile "./tests/googleJest.test.js"
```

Example using Mocha:

```bash
obrowse --testFrame mocha --testFile "./tests/googleMocha.test.mjs"
```

### Running Tests

The project includes a comprehensive test suite to verify functionality. To run the tests:

```bash
# Build the project first
npm run build

# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only end-to-end tests
npm run test:e2e

# Generate test coverage report
npm run test:coverage
```

#### Test Coverage

The test suite includes:

1. **Unit Tests**:
   - Configuration file handling and validation
   - Case conversion functionality
   - Argument parsing
   - Configuration loading and verification

2. **Integration Tests**: 
   - Browser functionality validation (launching, headless mode, proxy)
   - PDF generation capabilities
   - Test framework integration (Jest and Mocha adapters)

3. **End-to-End Tests**:
   - CLI functionality validation
   - Configuration file handling
   - Error reporting

All tests are written using Jest with TypeScript, following the naming convention `*.test.ts`.

## Contributing

Contributions to `obrowse` are welcome! If you're interested in adding features, fixing bugs, or improving the tool, please feel free to fork the repository, make your changes, and submit a pull request.

## License