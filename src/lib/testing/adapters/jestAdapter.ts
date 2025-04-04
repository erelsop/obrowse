import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { resolve as pathResolve } from 'path';

export function runJestTests(testPath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    // Check if test file exists
    const fullPath = pathResolve(testPath);
    if (!existsSync(fullPath)) {
      return reject(`Test file not found: ${testPath}`);
    }

    const jestProcess = spawn('npx', ['jest', testPath], { stdio: 'inherit' });

    jestProcess.on('error', (error: Error) => {
      reject(`Failed to start Jest: ${error.message}`);
    });

    jestProcess.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(`Jest tests completed successfully.`);
      } else {
        reject(`Jest tests failed with code ${code}.`);
      }
    });
  });
}
