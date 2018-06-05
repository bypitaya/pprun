var VERSION = 1.0;

document.addEventListener("DOMContentLoaded", function () {
    new Game('renderCanvas');
}, false);


Game = function(canvasId) {

    var canvas          = document.getElementById(canvasId);
    this.engine         = new BABYLON.Engine(canvas, true);

    this.currentStateId = 0;
    this.currentState   = null;

    this.players        = [];

    this.runNextState();



};

Game.STATES = [
    {
        title:"Player select",
        create:function(game) {
            return new GameState(game);
        }
    }
];


Game.prototype = {

    runNextState : function() {

        this.currentState = Game.STATES[this.currentStateId].create(this);
        this.currentState.run();

    },


    addPlayer : function(gamepad) {
        var player = new Player(this, this.currentState.scene, gamepad);
        this.players[gamepad.id] = player;
    },

    removePlayer : function(scene, gamepad) {
        this.players[gamepad.id].destroy();
    }
};