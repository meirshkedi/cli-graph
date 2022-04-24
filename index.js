const event = require("events");
const readline = require("readline");

const line = readline.createInterface({ input: process.stdin, output: process.stdout });

const screen = [];

const flow = new event.EventEmitter();

flow.on("update", (id, item) => {
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
        output[graph.height + 2] += `\x1b[33m${graph.width}\x1b[0m${"═".repeat(graph.width - graph.width.toString().length - 1)}\x1b[33m0\x1b[0m╛`;

        if (graph.type === "bar") {
            // Format bar graph
            var data = require("./graphs/bar")(graph, output, left);
            output = data.output;
            left = data.left;
        } else if (graph.type === "plot") {
            // Format line graph
            var data = require("./graphs/plot")(graph, output, left);
            output = data.output;
            left = data.left;
        } else console.log("\x1b[31mInvalid graph type\u001b[0m");

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


var context;
/**
 * @description Processes a command
 * @param  {...string} command - Command to process
 */
function processCommand(...command) {
    command.forEach(data => {
        data = data.split(/\s+/g);
        const commands = [];
        data.forEach(item => item.startsWith("--") ? commands.push({ flag: item.slice(2), args: [] }) : commands[commands.length - 1].args.push(item));

        commands.forEach(item => {
            if (item.flag === "exit") process.exit();
            else if (item.flag === "graph") {
                screen.push({
                    name: item.args[0],
                    type: item.args[1],
                    width: 60,
                    height: 20,
                    status: "",
                    data: []
                });

                // Set context
                context = screen.length - 1;
            } else if (item.flag === "context") context = parseInt(item.args[0]);
            else if (item.flag === "clear") screen[context].data = [];
            else if (item.flag === "width") screen[context].width = parseInt(item.args[0]);
            else if (item.flag === "height") screen[context].height = parseInt(item.args[0]);
            else if (item.flag === "status") screen[context].status = item.args.join` `;
            else if (item.flag === "data") flow.emit("update", context, item.args[0]);
        });
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

module.exports = { context, processCommand };
getInput();