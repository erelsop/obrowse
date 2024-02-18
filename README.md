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

   ```plaintext
   git clone https://github.com/erelsop/obrowse.git ~/src/obrowse
   cd ~/src/obrowse
   ```

2. **Install Dependencies:**

   Install `ts-node` globally to execute TypeScript files directly:

   ```plaintext
   npm install -g typescript && npm install -g ts-node
   ```

   Additionally, install Playwright and required browsers using the following commands:

   ```plaintext
   npm install
   npx playwright install
   ```

   To install system dependencies required for Playwright, run:

   ```plaintext
   npx playwright install-deps
   ```

3. **Global Access via Bash Function:**

   For convenient access to `obrowse` from anywhere in your terminal, you can define a Bash function in your `.bashrc` or `.zshrc` file:

   ```plaintext
   echo "obrowse() { (cd ~/src/obrowse && ts-node src/obrowse.ts \"\$@\") }" >> ~/.bashrc
   source ~/.bashrc
   ```

## Usage

### Basic Commands

Use `obrowse` followed by the desired command-line arguments to perform various tasks. Here are some basic commands:

- **Open a URL:**

  ```plaintext
  obrowse --browser chrome --url "https://example.com"
  ```

### Advanced Options

`obrowse` supports advanced options for customizing your browsing experience, including:

- **PDF Generation:** Generate PDFs of web pages with custom format and orientation.
- **Custom Resolution and User-Agent:** Simulate different devices by specifying custom resolutions and user-agent strings.
- **Browser Session Recording:** Record browser sessions into video files, useful for bug reporting and tutorials.
- **Proxy Support:** Specify a proxy server for the browser session, aiding in testing geo-specific content or privacy-focused browsing.
- **Configuration File Support:** Use a configuration file to save commonly used settings, streamlining the process of initiating browser sessions.

For detailed usage instructions and available options, refer to the command-line help accessible via `obrowse --help`.

### Configuration File

To use a configuration file, specify the path using the `--cfg` option. This allows you to predefine settings like browser type, URL, custom resolution, proxy settings, and more.

Example command with configuration file:

```plaintext
obrowse --cfg path/to/your/config.json
```

This simplifies repeated use cases and makes it easy to share configurations between team members or across projects.

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
```
