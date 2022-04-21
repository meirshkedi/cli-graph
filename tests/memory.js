const os = require('os');
const processCommand = require("../index.js");

processCommand("--graph MEMORY bar data visualization test", "--width 1 100", "--height 1 20");
setInterval(() => processCommand(`1 ${os.totalmem() - os.freemem()}`), 1000);