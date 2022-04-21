const event = require("events");
const readline = require("readline");

const line = readline.createInterface({ input: process.stdin, output: process.stdout });

const screen = [
    {
        name: "TEST of BAR graph",
        type: "bar",
        data: []
    }
];

const flow = new event.EventEmitter();

flow.on("data", (id, item) => {
    screen[id].data.push(item);

    // Clear the screen
    console.clear();

    var output = new Array(10).fill("");
    var left = new Array(10).fill([]);

    // Format left side
    left[1] = ["╤", "A", "╒"];
    left[2] = ["╞", "═", "╪"];
    left[8] = ["╘", "═", "╧"];

    // Format output
    output[1] += `═\x1b[32m${screen[0].name}\x1b[0m${"═".repeat(39 - screen[0].name.length)}╗`;
    output[2] += "═".repeat(40) + "╣";
    output[8] += "═".repeat(40) + "╝";
    if (screen[0].type === "bar") {
        if (screen[0].data.length > 40) screen[0].data.shift();
        var data = new Array(5).fill("");
        var lowest = Math.floor(Math.min(...screen[0].data));
        var highest = Math.floor(Math.max(...screen[0].data));
        var range = highest - lowest;
        var row = range / 5;
        screen[0].data.forEach((value, index) => {
            var height = Math.floor((value - lowest) / row);
            for (var i = 0; i < 5; i++) {
                if (i <= height) data[i] += "█";
                else data[i] += " ";
            }
        });
        data.reverse().map(value => value.length < 40 ? " ".repeat(40 - value.length) + value : value).forEach((value, index) => {
            left[index + 3] = ["╞", (Math.round(row) * (data.length - index)).toString(), "╡"];
            output[index + 3] = "\x1b[36m" + value + "\u001b[0m║";
        });
    };

    //
    var width = Math.max(...left.map(value => value.join``.length - 2));
    left.forEach((value, index) => index > 0 && index < 9 && (left[index] = `${left[index][0]}${"═".repeat(width - left[index][1].length)}${left[index].slice(1).join``}`));
    left[1] = left[1].split``.reverse().join``.replace(/[a-z]+/i, "\x1b[32m$&\x1b[0m");
    for (var i = 0; i < 5; i++) left[i + 3] = left[i + 3].replace(/\d+/g, "\x1b[33m$&\x1b[0m");

    output = output.map((value, index) => left[index] + value);
    console.log(output.join`\n`);
});

function getInput() {
    line.question("", data => {
        if (data === "exit") process.exit();
        flow.emit("data", 0, ...data.split(/\s+/).map(value => Number.isNaN(value) ? 0 : parseFloat(value)));
        getInput();
    });
};

// Start
console.clear();

// Input loop
getInput();