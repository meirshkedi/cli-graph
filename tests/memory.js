const os = require('os');
const processData = require("../index.js");

processData("--graph MEMORY bar data visualization test", "--width 0 160", "--height 0 40");
setInterval(() => processData(`0 ${os.totalmem() - os.freemem()}`), 1000);