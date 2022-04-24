const chiled_process = require('child_process');

if (process.platform === "win32") {
    if (process.argv[2] === "test") console.log("Invalid test file");
    else chiled_process.execSync(`start node tests/${process.argv[2]}.js`);
} else chiled_process.execSync(`node tests/${process.argv[2]}.js`);
