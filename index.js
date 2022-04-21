const event = require("events");
const readline = require("readline");

const line = readline.createInterface({ input: process.stdin, output: process.stdout });

const screen = [];

const flow = new event.EventEmitter();

flow.on("data", (id, item) => {
    if (id > screen.length - 1) return console.log("\x1b[31mInvalid ID\u001b[0m");
    screen[id].data.push(item);

    // Clear the screen
    console.clear();

    screen.forEach((graph, id) => {
        if (!graph.data.length) return;
        var output = new Array(10).fill("");
        var left = new Array(10).fill([]);

        // Initiate left side
        left[1] = ["╤", "ABCD"[id], "╒"];
        left[2] = ["╞", "═", "╪"];
        left[8] = ["╘", "═", "╧"];

        // Format output
        output[1] += `═\x1b[32m${graph.name}\x1b[0m${"═".repeat(39 - graph.name.length)}╗`;
        output[2] += "═".repeat(40) + "╣";
        output[8] += "═".repeat(40) + "╝";

        if (graph.type === "bar") {
            // Format bar graph
            var data = require("./graphs/bar")(graph.data, output, left);
            output = data.output;
            left = data.left;
        };

        // Format left side
        var width = Math.max(...left.map(value => value.join``.length - 2));
        left.forEach((value, index) => index > 0 && index < 9 && (left[index] = `${left[index][0]}${"═".repeat(width - left[index][1].length)}${left[index].slice(1).join``}`));
        left[1] = left[1].split``.reverse().join``.replace(/[a-z]+/i, "\x1b[32m$&\x1b[0m");
        for (var i = 0; i < 5; i++) left[i + 3] = left[i + 3].replace(/\d+/g, "\x1b[33m$&\x1b[0m");

        output = output.map((value, index) => left[index] + value);
        console.log(output.join`\n`);
    });
});

function getInput() {
    line.question("", data => {
        console.clear();

        // Use arguments
        if (data.includes("--exit") || data.includes("-e")) process.exit();
        else if (data.includes("--clear") || data.includes("-c")) screen[0].data = [];
        else if (data.startsWith("--graph") || data.startsWith("-g")) {
            const args = data.split(/\s+/g).filter(arg => !arg.startsWith("-"));
            screen.push({
                name: args.shift(),
                type: args.shift(),
                data: [...args.map(value => parseInt(value))]
            });
        } else flow.emit("data", ...data.split(/\s+/).map(value => parseFloat(value)));

        // Continue to get input
        getInput();
    });
};

// Start
console.clear();
getInput();