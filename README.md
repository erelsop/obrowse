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

   Install `ts-node` globally to execute TypeScript files directly:

   ```bash
   npm install -g typescript && npm install -g ts-node
   ```

   Additionally, install Playwright and required browsers using the following commands:

   ```bash
   npm install
   npx playwright install
   ```

   To install system dependencies required for Playwright, run:

   ```bash
   npx playwright install-deps
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

### Note on File Extensions for Tests

When writing tests with Mocha in projects that use ES Modules, your test files might need to use the `.mjs` extension to be correctly recognized as ES Modules by Node.js. This requirement depends on your project's configuration and how ES Modules are set up. If your tests are written as ES Modules, ensure to name your test files with `.mjs` extensions or configure your project to support ES Module syntax in `.js` files. This guidance ensures compatibility and proper execution of your tests.

#### Configuration File

To use a configuration file, specify the path using the `--cfg` option. This allows you to predefine settings like browser type, URL, custom resolution, proxy settings, and more.

This simplifies repeated use cases and makes it easy to share configurations between team members or across projects.

#### Configuration File Schema

The configuration file allows you to predefine settings for `obrowse`, making it easier to manage and reuse configurations. The file should be in JSON format and can include any of the following properties:

```plaintext
{
  "browser": "chrome | firefox | safari",
  "url": "https://example.com",
  "resolution": "WIDTHxHEIGHT", // Example: "1920x1080"
  "userAgent": "custom user agent string",
  "pdf": "path/to/output.pdf",
  "format": "A4 | Letter | etc.", // PDF format
  "landscape": true | false, // PDF orientation
  "recordVideo": true | false, // Enables or disables video recording
  "videoSize": "WIDTHxHEIGHT", // Example: "1280x720"
  "videoDir": "path/to/videos", // Directory to save videos
  "proxy": "http://localhost:8080", // Proxy server URL
  "testFrame": "jest | mocha" // Test framework to use
  "testFile": "path/to/testFile.js"
}
```

- **`browser`**: Specifies the browser to use. Accepted values are `chrome`, `firefox`, or `safari`.
- **`url`**: The URL to navigate to in the browser session.
- **`resolution`**: Sets the browser window's resolution. Format should be `widthxheight` (e.g., `"1920x1080"`).
- **`userAgent`**: Allows setting a custom User-Agent string.
- **`pdf`**: If specified, `obrowse` will generate a PDF of the page at the provided URL. The value should be the path where the PDF is saved.
- **`format`**: Defines the PDF format. Common values include `A4`, `Letter`, etc.
- **`landscape`**: Sets the orientation of the PDF to landscape (`true`) or portrait (`false`).
- **`recordVideo`**: Enables recording of the browser session into a video file when set to `true`.
- **`videoSize`**: Specifies the size of the video recording. Format should be `widthxheight` (e.g., `"1280x720"`).
- **`videoDir`**: The directory where video recordings are saved.
- **`proxy`**: Sets a proxy server for the browser session.
- **`testFrame`**: Specifies the testing framework to use for integrated testing. Accepted values are `jest` or `mocha`.
- **`testFile`**: The path to the test file to be executed. This allows for automated testing alongside web browsing tasks, streamlining the testing process for web applications.

Please ensure your configuration file matches this schema to avoid errors. You can specify the path to your configuration file when running `obrowse` with the `--cfg` option.

Example command using a configuration file:

```bash
obrowse --cfg "path/to/your/config.json"
```

## Contributing

Contributions to `obrowse` are welcome! If you're interested in adding features, fixing bugs, or improving the tool, please feel free to fork the repository, make your changes, and submit a pull request.

## License

`obrowse` is released under the MIT License. For detailed information, see the LICENSE file included in the repository.

# Helpful Tips

## Useful User-Agent Strings

Below are some User-Agent strings you can use with `obrowse` to simulate different devices and browsers. This can be particularly useful for testing how your web application responds to various clients.

### Desktop Browsers

- **Google Chrome on Windows 10**:

```

Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36

```

- **Mozilla Firefox on macOS**:

```

Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:73.0) Gecko/20100101 Firefox/73.0

```

- **Safari on macOS**:
```

Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15

```

### Mobile Browsers

- **Google Chrome on Android**:

```

Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36

```

- **Safari on iPhone (iOS)**:

```

Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1

```

- **Mozilla Firefox on Android**:
```

Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0

```

### Tablets

- **Google Chrome on iPad (iOS)**:

```

Mozilla/5.0 (iPad; CPU OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/80.0.3987.95 Mobile/15E148 Safari/604.1

```

- **Safari on iPad (iOS)**:
```

Mozilla/5.0 (iPad; CPU OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1

```

Feel free to use these User-Agent strings to simulate different browsing environments with `obrowse`. This can be very useful for responsive design testing, SEO optimization, and ensuring compatibility across various devices and browsers.
