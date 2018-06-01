var State = function(game) {
    // The game object
    this.game    = game;

    // The game engine
    this.engine  = game.engine;

    // Contains all loaded assets needed for this state
    this.assets  = [];

    // The state scene
    this.scene   = null;

    // True if the state is ready to be played or not.
    this.isReady = false;

};

State.prototype = {

    /**
     * The function used to create the scene for this state
     */
    run : function() {},

    /**
     * Function used to handle a key press
     */
    handleKeyUp : function(keycode) {},

    /**
     * Function used to handle a key down
     */
    handleKeyDown : function(keycode) {},

    /**
     * Creates the scene for this state : physics (if any), camera and lights
     * @returns {BABYLON.Scene}
     * @private
     */
    _initScene : function() {
        return null;
    },

    /**
     * Init the game by positioning the assets in the scene, enabe interactions...
     * @private
     */
    _initGame : function() {},

    /**
     * Initialize a mesh once it has been loaded. Store it in the asset array and set it not visible.
     * @param task
     * @private
     */
    _initMesh : function(task) {
        for (var i=0; i<task.loadedMeshes.length; i++ ){
            var mesh = task.loadedMeshes[i];
            mesh.isVisible = false;
        }
        this.assets[task.name] = task.loadedMeshes;
    }


};