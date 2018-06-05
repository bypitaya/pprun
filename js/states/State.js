var State = function(game) {
    this.game    = game;
    this.engine  = game.engine;
    this.assets  = [];
    this.scene   = null;
    this.isReady = false;

};

State.prototype = {

    
    run : function() {},

    _initScene : function() {
        return null;
    },
    _initGame : function() {},
    _initMesh : function(task) {
        for (var i=0; i<task.loadedMeshes.length; i++ ){
            var mesh = task.loadedMeshes[i];
            mesh.isVisible = false;
        }
        this.assets[task.name] = task.loadedMeshes;
    }


};