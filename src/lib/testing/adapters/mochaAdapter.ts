import { spawn } from 'child_process';

export function runMochaTests(testPath: string) {
  return new Promise((resolve, reject) => {
    const mochaProcess = spawn('npx', ['mocha', testPath], { stdio: 'inherit' });

    mochaProcess.on('close', (code) => {
      if (code === 0) {
        resolve(`Mocha tests completed successfully.`);
      } else {
        reject(`Mocha tests failed with code ${code}.`);
      }
    });
  });
}
