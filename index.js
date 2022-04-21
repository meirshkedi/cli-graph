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
        var output = new Array(graph.height + 3).fill("");
        var left = new Array(graph.height + 3).fill([]);

        // Initiate left side
        left[0] = ["─", "ABCD"[id], "┌"];
        left[1] = ["╞", "═", "╤"];
        left[graph.height + 2] = ["╘", "═", "╧"];

        // Format output
        output[0] += `─\x1b[32m${graph.name}\x1b[0m─┐`;
        output[1] += `${"═".repeat(graph.name.length + 2)}╧${"═".repeat(graph.width - 3 - graph.name.length)}╕`;
        output[graph.height + 2] += "═".repeat(graph.width) + "╛";

        if (graph.type === "bar") {
            // Format bar graph
            var data = require("./graphs/bar")(graph, output, left);
            output = data.output;
            left = data.left;
        };

        // Format left side
        var width = Math.max(...left.map(value => value.join``.length - 2));
        left.forEach((value, index) => left[index] = `${left[index][0]}${(index === 0 ? "─" : "═").repeat(width - left[index][1].length)}${left[index].slice(1).join``}`);
        left[0] = left[0].split``.reverse().join``.replace(/[a-z]+/i, "\x1b[32m$&\x1b[0m");
        for (var i = 0; i < graph.height; i++) left[i + 2] = left[i + 2].replace(/\d+/g, "\x1b[33m$&\x1b[0m");

        output[0] += " " + graph.status;

        output = output.map((value, index) => left[index] + value);
        console.log(output.join`\n`);
    });
});

/**
 * @description Processes a command
 * @param  {...string} command - Command to process
 */
function processCommand(...command) {
    command.forEach(data => {
        console.clear();

        // Use arguments
        if (!data || data.includes("--exit") || data.includes("-e")) process.exit();
        else if (data.includes("--clear") || data.includes("-c")) {
            const args = data.split(/\s+/g).filter(arg => !arg.startsWith("-"));
            const item = args.shift();
            if (item) screen[item].data = [];
        } else if (data.includes("--width") || data.includes("-w")) {
            const args = data.split(/\s+/g).filter(arg => !arg.startsWith("-"));
            const item = args.shift();
            const width = parseInt(args.shift());
            if (item && width) screen[item].width = width;
        } else if (data.includes("--height") || data.includes("-h")) {
            const args = data.split(/\s+/g).filter(arg => !arg.startsWith("-"));
            const item = args.shift();
            const height = parseInt(args.shift());
            if (item && height) screen[item].height = height;
        } else if (data.startsWith("--graph") || data.startsWith("-g")) {
            const args = data.split(/\s+/g).filter(arg => !arg.startsWith("-"));
            screen.push({
                name: args.shift() || "UNTITLED",
                type: args.shift() || "bar",
                status: args.join` `,
                width: 40,
                height: 5,
                data: [],
            });
        } else flow.emit("data", ...data?.split(/\s+/).map(value => parseFloat(value)));
    });
};

/**
 * @description Starts the visualizer
 */
function getInput() {
    line.question("", data => {
        processCommand(data);

        // Continue the loop
        getInput();
    });
};

// Start
console.clear();

if (process.argv.includes("--module") || process.argv.includes("-m")) {
    module.exports = processCommand;
} else getInput();