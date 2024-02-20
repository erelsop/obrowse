import { spawn } from 'child_process';

export function runJestTests(testPath: string) {
  return new Promise((resolve, reject) => {
    const jestProcess = spawn('npx', ['jest', testPath], { stdio: 'inherit' });

    jestProcess.on('close', (code) => {
      if (code === 0) {
        resolve(`Jest tests completed successfully.`);
      } else {
        reject(`Jest tests failed with code ${code}.`);
      }
    });
  });
}
