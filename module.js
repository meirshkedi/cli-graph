const screen = require("./index");
var graphs = 0;

class Graph {
    /**
     * @description Create a new graph to visualize in the console.
     * @param {{name:string,type:"bar"|"plot",width:number,heigh:number,status:string}} data - The graph information.
     */
    constructor (data) {
        this.id = graphs;
        this.name = data.name;
        this.type = data.type;
        this.width = data.width || 60;
        this.height = data.heigh || 20;
        this.status = data.status || "";

        screen.processCommand(`--graph ${this.name} ${this.type} --width ${this.width} --height ${this.height}`);
        if (this.status) this.setStatus(this.status);

        graphs++;
    };

    /**
     * @description Send data to the graph and update the visualization.
     * @param {number} data - The data to send to the graph.
     * @returns {Graph} This graph.
     */
    send(data) {
        screen.processCommand(`--context ${this.id} --data ${data}`);
        return this;
    };

    /**
     * @description Clear the graph of its previous data.
     * @returns {Graph} This graph.
     */
    clear() {
        screen.processCommand(`--context ${this.id} --clear`);
        return this;
    };

    /**
     * @description Set the width of the graph
     * @param {number} width - The width.
     * @returns {Graph} This graph.
     */
    setWidth(width) {
        screen.processCommand(`--context ${this.id} --width ${width}`);
        return this;
    };

    /**
     * @description Set the height of the graph
     * @param {number} height - The height.
     * @returns {Graph} This graph.
     */
    setHeight(height) {
        screen.processCommand(`--context ${this.id} --width ${height}`);
        return this;
    };

    /**
     * @description Set the status message of the graph.
     * @param {string} status - The status.
     * @returns {Graph} This graph.
     */
    setStatus(status) {
        screen.processCommand(`--context ${this.id} --status ${status}`);
        return this;
    };
};

class Command {
    constructor () {
        this.data = [];
    };

};

module.exports = { Graph, Command };