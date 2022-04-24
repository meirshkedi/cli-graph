const os = require('os');
const Graph = require("../module").Graph;
const a = new Graph({ name: "MEMORY", type: "bar", width: 60, heigh: 10, status: "data visualization test" });
const b = new Graph({ name: "MEMORY", type: "plot", width: 60, heigh: 10, status: "data visualization test" });
setInterval(() => [a, b].forEach(g => g.send(os.totalmem() - os.freemem())), 1000);