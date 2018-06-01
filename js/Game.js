var VERSION = 1.0,
    AUTHOR = "temechon@pixelcodr.com";

// The function onload is loaded when the DOM has been loaded
document.addEventListener("DOMContentLoaded", function () {
    new Game('renderCanvas');
}, false);


Game = function(canvasId) {

    var canvas          = document.getElementById(canvasId);
    this.engine         = new BABYLON.Engine(canvas, true);

    this.currentStateId = 0;
    this.currentState   = null;

    // Contains all players. Each object is a player object
    this.players        = [];

    this.runNextState();



};

/**
 * The games states.
 */
Game.STATES = [
    { // The starting state
        title:"Player select",
        create:function(game) {
            return new GameState(game);
        }
    }
];


Game.prototype = {

    runNextState : function() {

        // The starting state of the game
        this.currentState = Game.STATES[this.currentStateId].create(this);

        // Create the starting scene
        this.currentState.run();

    },

    /**
     * Add a player into the game
     * @param gamepad The gamepad used by the player
     */
    addPlayer : function(gamepad) {
        var player = new Player(this, this.currentState.scene, gamepad);
        this.players[gamepad.id] = player;
    },

    /**
     * Removes a player from the game
     * @param gamepad The disconnected gamepad
     */
    removePlayer : function(scene, gamepad) {
        this.players[gamepad.id].destroy();
    }
};