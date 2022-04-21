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
        left[1] = ["─", "ABCD"[id], "┌"];
        left[2] = ["╞", "═", "╤"];
        left[8] = ["╘", "═", "╧"];

        // Format output
        output[1] += `─\x1b[32m${graph.name}\x1b[0m─┐`;
        output[2] += `${"═".repeat(graph.name.length + 2)}╧${"═".repeat(37 - graph.name.length)}╕`;
        output[8] += "═".repeat(40) + "╛";

        if (graph.type === "bar") {
            // Format bar graph
            var data = require("./graphs/bar")(graph.data, output, left);
            output = data.output;
            left = data.left;
        };

        // Format left side
        var width = Math.max(...left.map(value => value.join``.length - 2));
        left.forEach((value, index) => index > 0 && index < 9 && (left[index] = `${left[index][0]}${(index === 1 ? "─" : "═").repeat(width - left[index][1].length)}${left[index].slice(1).join``}`));
        left[1] = left[1].split``.reverse().join``.replace(/[a-z]+/i, "\x1b[32m$&\x1b[0m");
        for (var i = 0; i < 5; i++) left[i + 3] = left[i + 3].replace(/\d+/g, "\x1b[33m$&\x1b[0m");

        output[9] = graph.status;

        output = output.map((value, index) => left[index] + value);
        console.log(output.join`\n`);
    });
});

function processData(data) {
    console.clear();

    // Use arguments
    if (!data || data.includes("--exit") || data.includes("-e")) process.exit();
    else if (data.includes("--clear") || data.includes("-c")) {
        const args = data.split(/\s+/g).filter(arg => !arg.startsWith("-"));
        const item = args.shift();
        if (item) screen[parseInt(args.shift())].data = [];
    } else if (data.startsWith("--graph") || data.startsWith("-g")) {
        const args = data.split(/\s+/g).filter(arg => !arg.startsWith("-"));
        screen.push({
            name: args.shift() || "UNTITLED",
            type: args.shift() || "bar",
            status: args.join` `,
            data: [],
        });
    } else flow.emit("data", ...data?.split(/\s+/).map(value => parseFloat(value)));
}

function getInput() {
    line.question("", data => {
        processData(data);

        // Continue to get input
        getInput();
    });
};

// Start
console.clear();

if (process.argv.includes("--module") || process.argv.includes("-m")) {
    module.exports = processData;
} else getInput();