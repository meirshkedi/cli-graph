const os = require('os');
const processCommand = require("../index.js");

os.cpus().forEach((cpu, id) => id < 4 && processCommand(`--graph CPU_${id} bar ${cpu.model} ${cpu.speed}`));
setInterval(() => os.cpus().forEach((cpu, id) => id < 4 && processCommand(id + " " + cpu.times.user)), 1000);