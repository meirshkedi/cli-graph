function bar(items, output, left) {
    if (items.length > 40) items.shift();
    var data = new Array(5).fill("");
    var lowest = Math.floor(Math.min(...items));
    var highest = Math.floor(Math.max(...items));
    var range = highest - lowest;
    var row = range / 5;
    items.forEach((value, index) => {
        var height = Math.floor((value - lowest) / row);
        for (var i = 0; i < 5; i++) {
            if (i <= height) data[i] += "█";
            else data[i] += "┼";
        }
    });
    data.reverse().map(value => value.length < 40 ? "┼".repeat(40 - value.length) + value : value).forEach((value, index) => {
        left[index + 3] = ["╞", (Math.round(row) * (data.length - index)).toString(), "╡"];
        output[index + 3] = value.replace("█", "\x1b[36m█").replace("┼", "\x1b[35m┼") + "\x1b[0m│";
    });

    return { output, left };
}

module.exports = bar;