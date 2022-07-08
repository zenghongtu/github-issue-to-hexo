const { spawn } = require('node:child_process');

spawn('yarn', ['install', '--prod'], { stdio: 'inherit' });
