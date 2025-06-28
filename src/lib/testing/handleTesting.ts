import { runJestTests } from './adapters/jestAdapter';
import { runMochaTests } from './adapters/mochaAdapter';

export async function handleTesting(framework: string, testPath: string) {
  console.log(`🧪 Starting ${framework.toUpperCase()} test execution...`);
  console.log(`   Test file: ${testPath}`);
  
  try {
    switch (framework.toLowerCase()) {
      case 'jest':
        console.log('   Framework: Jest');
        await runJestTests(testPath);
        break;
      case 'mocha':
        console.log('   Framework: Mocha');
        await runMochaTests(testPath);
        break;
      default:
        console.error(`❌ Unsupported testing framework: ${framework}`);
        console.error('Supported frameworks: jest, mocha');
        return;
    }
  } catch (error: any) {
    console.error(`❌ Test execution failed:`);
    console.error(`   ${error}`);
    console.error(`\nTroubleshooting:`);
    console.error(`   - Ensure the test file exists: ${testPath}`);
    console.error(`   - Check that ${framework} is installed in your project`);
    console.error(`   - Verify the test file syntax is correct`);
    return;
  }
  console.log(`✅ Test execution completed successfully!`);
}

export default handleTesting;