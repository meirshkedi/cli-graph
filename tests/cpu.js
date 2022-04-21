const os = require('os');
const processData = require("../index.js");

os.cpus().forEach((cpu, id) => id < 4 && processData(`--graph CPU_${id} bar ${cpu.model} ${cpu.speed}`));
setInterval(() => os.cpus().forEach((cpu, id) => id < 4 && processData(id + " " + cpu.times.user)), 1000);