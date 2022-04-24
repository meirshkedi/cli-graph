const os = require('os');
const Graph = require("../module").Graph;
const graph = new Graph({ name: "MEMORY", type: "bar", width: 100, heigh: 20, status: "data visualization test" });

setInterval(() => graph.send(os.totalmem() - os.freemem()), 1000);