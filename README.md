# Open Browser (`obrowse`)

`obrowse` is a CLI tool designed to leverage the power of Playwright for automating web browsers with ease. It simplifies tasks such as opening web pages, generating PDFs, capturing screenshots, and more, directly from your terminal. Tailored for developers, testers, and content creators, `obrowse` aims to streamline the browser automation process, making it accessible and efficient for various use cases.

## Features

- Open web pages in Chrome, Firefox, or WebKit (Safari) with custom resolutions and user agents.
- Generate PDFs of web pages (currently supported in Chromium browsers).
- (Future Feature) Integrate with a Firefox extension to enable PDF generation across more browsers.
- Capture full-page screenshots (planned feature).
- Easily configurable through command line arguments or a configuration file.

## Installation on WSL2

Ensure you have WSL2 and Node.js installed on your system.

1. Clone the `obrowse` repository:
   '''
   git clone https://github.com/erelsop/obrowse.git ~/obrowse
   cd ~/obrowse
   '''

2. Install Playwright and required browsers:
   Playwright simplifies browser installation by managing compatible versions for testing.
   '''
   npm install
   npx playwright install
   '''
   To install specific browsers or system dependencies:
   '''
   npx playwright install webkit
   npx playwright install-deps chromium
   '''

3. (Optional) Global Access:
   For convenience, consider adding an alias to your `.bashrc` or `.zshrc` file for global access:
   '''
   echo "alias obrowse='npx ts-node ~/obrowse/src/obrowse.ts'" >> ~/.bashrc
   source ~/.bashrc
   '''

### Running the CLI Tool

After installation, you can run `obrowse` using the alias or directly with `npx ts-node src/obrowse.ts`, followed by your desired command-line arguments.

## Usage

- **Open a URL** in a specific browser:
  '''
  obrowse --browser chrome --url "https://example.com"
  '''

- **Generate a PDF** of a webpage (Chromium only):
  '''
  obrowse --browser chrome --url "https://example.com" --pdf "example.pdf"
  '''

- **Custom Resolution and User-Agent**:
  '''
  obrowse --browser firefox --url "https://example.com" --resolution "1920x1080" --userAgent "custom-user-agent-string"
  '''

## Contributing

Contributions are welcome! If you're interested in adding features, fixing bugs, or improving `obrowse`, please feel free to fork the repository, make your changes, and submit a pull request.

## License

`obrowse` is released under the MIT License. See the LICENSE file for more details.

# Helpful Tips

## Useful User-Agent Strings

Below are some User-Agent strings you can use with `obrowse` to simulate different devices and browsers. This can be particularly useful for testing how your web application responds to various clients.

### Desktop Browsers

- **Google Chrome on Windows 10**:
  '''
  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36
  '''

- **Mozilla Firefox on macOS**:
  '''
  Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:73.0) Gecko/20100101 Firefox/73.0
  '''

- **Safari on macOS**:
  '''
  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15
  '''

### Mobile Browsers

- **Google Chrome on Android**:
  '''
  Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.99 Mobile Safari/537.36
  '''

- **Safari on iPhone (iOS)**:
  '''
  Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1
  '''

- **Mozilla Firefox on Android**:
  '''
  Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0
  '''

### Tablets

- **Google Chrome on iPad (iOS)**:
  '''
  Mozilla/5.0 (iPad; CPU OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/80.0.3987.95 Mobile/15E148 Safari/604.1
  '''

- **Safari on iPad (iOS)**:
  '''
  Mozilla/5.0 (iPad; CPU OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1
  '''

Feel free to use these User-Agent strings to simulate different browsing environments with `obrowse`. This can be very useful for responsive design testing, SEO optimization, and ensuring compatibility across various devices and browsers.

