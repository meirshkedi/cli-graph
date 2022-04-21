function bar(graph, output, left) {
    if (graph.data.length > graph.width) graph.data.shift();
    var data = new Array(graph.height).fill("");
    var lowest = Math.floor(Math.min(...graph.data));
    var highest = Math.floor(Math.max(...graph.data));
    var range = highest - lowest;
    var row = range / graph.height;
    graph.data.forEach(value => {
        var height = (value - lowest) / row;
        for (var i = 0; i < graph.height; i++) {
            if (i <= height) data[i] += "█";
            else data[i] += "┼";
        }
    });
    data.reverse().map(value => value.length < graph.width ? "┼".repeat(graph.width - value.length) + value : value).forEach((value, index) => {
        left[index + 2] = ["╞", (Math.round(row) * (data.length - index) + lowest).toString(), "╡"];
        output[index + 2] = value.replace(/█+/g, "\x1b[36m$&").replace(/┼+/g, "\x1b[35m$&") + "\x1b[0m│";
    });

    return { output, left };
}

module.exports = bar;