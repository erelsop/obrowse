import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { resolve as pathResolve } from 'path';

export function runMochaTests(testPath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    // Check if test file exists
    const fullPath = pathResolve(testPath);
    if (!existsSync(fullPath)) {
      return reject(`Test file not found: ${testPath}`);
    }

    const mochaProcess = spawn('npx', ['mocha', testPath], { stdio: 'inherit' });

    mochaProcess.on('error', (error: Error) => {
      reject(`Failed to start Mocha: ${error.message}`);
    });

    mochaProcess.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(`Mocha tests completed successfully.`);
      } else {
        reject(`Mocha tests failed with code ${code}.`);
      }
    });
  });
}
