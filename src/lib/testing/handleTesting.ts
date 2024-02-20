import { runJestTests } from './adapters/jestAdapter';
import { runMochaTests } from './adapters/mochaAdapter';

export async function handleTesting(framework: string, testPath: string) {
  console.log('Running tests in OpenBrowse...');
  try {
    switch (framework.toLowerCase()) {
      case 'jest':
        await runJestTests(testPath);
        break;
      case 'mocha':
        await runMochaTests(testPath);
        break;
      default:
        console.log('Unsupported testing framework. Please use Jest or Mocha.');
    }
  } catch (error) {
    console.error('Error running tests:', error);
  }
  console.log('Tests completed in OpenBrowse.');
}

export default handleTesting;