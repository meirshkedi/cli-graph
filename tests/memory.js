const os = require('os');
const processData = require("../index.js");

processData("--graph MEMORY bar");
setInterval(() => processData(`0 ${os.totalmem() - os.freemem()}`), 1000);