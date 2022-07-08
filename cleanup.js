const { spawn } = require('node:child_process');

spawn('rm', ['-fr', 'node_modules'], { stdio: 'inherit' });
