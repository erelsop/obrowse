## Installation on WSL2

Ensure you have WSL2 and Node.js installed on your system. Node.js is a prerequisite for running `obrowse`. For instructions on installing Node.js, visit [Node.js official website](https://nodejs.org/).

1. Clone the `obrowse` repository:
   ```
   git clone https://github.com/erelsop/obrowse.git ~/src/obrowse
   cd ~/src/obrowse
   ```

2. Install `ts-node` globally to execute TypeScript files directly:
   ```
   npm install -g typescript && npm install -g ts-node
   ```

3. Install Playwright and required browsers:
   Playwright simplifies browser installation by managing compatible versions for testing.
   ```
   npm install
   npx playwright install
   ```
   Then, to install system dependencies:
   ```
   npx playwright install-deps
   ```

4. **Global Access via Bash Function**:
   To make `obrowse` easily accessible from anywhere in your terminal, you can define a function in your `.bashrc` or `.zshrc` file:
   ```
   echo "obrowse() { (cd ~/src/obrowse && ts-node src/obrowse.ts \"\$@\") }" >> ~/.bashrc
   source ~/.bashrc
   ```

### Running the CLI Tool

After installation and setup, you can run `obrowse` directly from any location in your terminal, followed by your desired command-line arguments.

## Usage

**Basic Commands:**

- **Open a URL** in a specific browser:
  ```
  obrowse --browser chrome --url "https://example.com"
  ```

**Advanced Options:**

- **Generate a PDF** of a webpage (Chromium only):
  ```
  obrowse --browser chrome --url "https://example.com" --pdf "example.pdf"
  ```

- **Custom Resolution and User-Agent**:
  ```
  obrowse --browser firefox --url "https://example.com" --resolution "1280x720" --userAgent "custom-user-agent-string"
  ```

- **PDF Generation with Custom Format and Orientation** (Chromium only):
  ```
  obrowse --browser chrome --url "https://example.com" --pdf "output.pdf" --format "A4" --landscape
  ```

This tool supports specifying a custom resolution (e.g., "1280x720") and a custom User-Agent string for simulating different devices. PDF generation features allow for specifying the output file path, and for Chromium browsers, additional options like paper format (`--format "A4"`) and orientation (`--landscape`) can be configured.

**Note:** PDF generation is supported exclusively in Chromium-based browsers (`chrome`). Ensure to use the `chrome` browser option when utilizing the PDF generation functionality.

## Contributing

Contributions are welcome! If you're interested in adding features, fixing bugs, or improving `obrowse`, please feel free to fork the repository, make your changes, and submit a pull request.

## License

`obrowse` is released under the MIT License. See the LICENSE file for more details.

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
