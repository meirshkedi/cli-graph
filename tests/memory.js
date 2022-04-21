const os = require('os');
const processCommand = require("../index.js");

processCommand("--graph MEMORY bar data visualization test", "--width 0 100", "--height 0 20");
setInterval(() => processCommand(`0 ${os.totalmem() - os.freemem()}`), 1000);