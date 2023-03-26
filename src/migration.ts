import { exec } from 'child_process';

const command = `yarn typeorm migration:create ./src/migrations/${process.argv[4]}`;

(() =>
  exec(command, (error, stdout, stderr) => {
    if (error !== null) {
      console.error(stderr);
    }
    console.log(stdout);
  }))();
