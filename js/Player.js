var Player = function(game, scene, gamepad,shadowGenerator) {

    this.game = game;
    this.scene = scene;
    this.gamepad = gamepad;
    this.shadowGenerator = shadowGenerator;
    this.mesh;
    this.body;
    this.heavy = 2;

    /*this.mesh = BABYLON.Mesh.CreateBox("playerbox", 8, this.scene);
    this.mesh.position.y = 8;
    this.mesh.scaling.y = 2;*/
    //this.scene.removeMesh(this.mesh);

    //this.mesh = this.box;

    //临时代替用
    //this.mesh = BABYLON.Mesh.CreateBox("player", 8, this.scene);

    //this.mesh.position.y = 5;
    //this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass:2, friction:0.8, restitution:0.02});

    //Sphere physics
    this.mesh = BABYLON.Mesh.CreateSphere("player", 16, 10, this.scene);
    this.mesh.position.y = 8;
    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.SphereImpostor, {mass:2, friction:0, restitution:0.0});
    scene.removeMesh(this.mesh);

    //Hero
    var _this = this;
    BABYLON.SceneLoader.ImportMesh("", "model/pphero18/", "pphero31.babylon", scene, function (newMeshes, particleSystems, skeletons) {
        //this.mesh2.rotation.y = Math.PI/2;
        //this.scene.removeMesh(this.mesh);
        //this.mesh = newMeshes2[0];
        //console.log(this.mesh);
        //console.log(this.box);
        //this.mesh.dispose();
        _this.body = newMeshes[0];
        var skeleton = skeletons[0];
        //newMeshes2[0].rotation.y = Math.PI;
        //newMeshes2[0].scaling = new BABYLON.Vector3(0.3,0.3,0.3);
        _this.body.rotation.y = Math.PI;
        _this.body.scaling = new BABYLON.Vector3(0.3,0.3,0.3);
        scene.beginAnimation(skeletons[0], 0, 24, true, 1.0);
        _this.shadowGenerator.addShadowCaster(_this.body);

        //var runske = scene.beginWeightedAnimation(skeleton, 0, 24, 1.0, true);
        
        scene.registerAfterRender(function(){
            var tposition = _this.mesh.getAbsolutePosition().clone();
            tposition.y -= 5;
            tposition.z -= 1;
            _this.body.setAbsolutePosition(tposition);
            //console.log("raftera");
            //console.log(_this.body.position);
        });

        //Babylon 3.2版本可用
        //var runske = scene.beginWeightedAnimation(skeleton, 0, 24, 1.0, true);
        //var standske = scene.beginWeightedAnimation(skeleton[0], 25, 26, 0, true);
        //var jumpshe = scene.beginWeightedAnimation(skeleton[0], 27, 28, 0, true);

        //this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass:2, friction:0.8, restitution:0.02});
    });
    //this.mesh2.rotation.y = Math.PI/2;


    // var texture1 = new BABYLON.Texture("img/ball.jpg", scene);
    // //texture.hasAlpha = true;

    // var mat_nor = new BABYLON.StandardMaterial("mat_nor", scene);
    // mat_nor.diffuseTexture = texture1;
    // mat_nor.backFaceCulling = false;
    // mat_nor.specularPower = 256;
    // mat_nor.diffuseColor = new BABYLON.Color3(50,50,50);

    // this.mesh.material = mat_nor;

    //var mat_rfl = new BABYLON.StandardMaterial();
    ////material.refractionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    //mat_rfl.reflectionTexture = new BABYLON.CubeTexture("img/sea_textures/sea", scene);
    //mat_rfl.diffuseColor = new BABYLON.Color3(0, 0, 0);
    ////material.invertRefractionY = false;
    ////material.indexOfRefraction = 0.98;
    //mat_rfl.specularPower = 128;

    //this.mesh.material = mat_rfl;


    this.leftPoint = new BABYLON.Vector3(0,0,0);
    this.rightPoint = new BABYLON.Vector3(0,0,0);
    this.downPoint = new BABYLON.Vector3(0,0,0);
    this.fwpoint = new BABYLON.Vector3(0,0,0);
    //this.box = BABYLON.Mesh.CreateBox("player", 5, this.scene);
    //this.box.position.y = 2;
    //this.body = this.box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass:1, friction:0.001, restitution:1.5});
    

    var matos = new BABYLON.StandardMaterial("matos", this.scene);
    //matos.diffuseColor = BABYLON.Color3.Green();
    //this.mesh.material = matos;

    // Movement directions : top, bot, left, right
    this.mvtDirection = [0,0,0,0];

    //玩家速度
    this.speed = 5;
    this.moveEnergy = 5;


    var _this = this;
    //this.scene.registerBeforeRender(function() {   
    //    _this.update();
    //});

    //状态
    this.moveForward = 0; 
    this.moveBackward = 0;
    this.moveRight = 0;
    this.moveLeft = 0;
    this.direction_z = 0;
    this.direction_x = 0; 
    this.jump = 0;
    this.vyCount = 0;

    this.canjump = 2;


    window.addEventListener("keyup", function(evt) {
        _this.keyUp(evt.keyCode);
    });

    window.addEventListener("keydown", function(evt) {
        _this.keyDown(evt.keyCode);
    });

};

Player.DIRECTIONS = {
    ZQSD : {
        TOP     : 90,
        BOT     : 83,
        LEFT    : 81,
        RIGHT   : 68
    },
    QWSD : {
        TOP     : 87,
        BOT     : 83,
        LEFT    : 65,
        RIGHT   : 68
    }
};

Player.ACTIONS = {
    FIRE : {
        TOP     : 38,
        BOT     : 40,
        LEFT    : 37,
        RIGHT   : 39
    }
};

Player.prototype = {

    update : function() {
        this.judgeState();
        this.move();
        // this.leftPoint = this.mesh.position.clone();
        // this.leftPoint.x -= 10;

        // this.rightPoint = this.mesh.position.clone();
        // this.rightPoint.x += 10;

        //this.downPoint = this.mesh.position.clone();
        //this.downPoint.z -= 10;

        // this.fwPoint = this.mesh.position.clone();
        // this.fwPoint.y -= 10;
    },

    /**
     * Store the player direction.
     * Two directions are available : the movement direction
     * and the firing direction.
     * @private
     */
    _chooseDirection : function(direction, value) {
        this.mvtDirection[direction] = value;
    },

    /*loadHero : function(){

    },*/

    judgeState : function(){
        var vy = Math.floor(this.mesh.physicsImpostor.getLinearVelocity().y/5);

        //console.log("vy"+vy);
        if(vy == 0){
            this.vyCount--;
        }
        if(this.vyCount==0){
            this.canjump = 2;
        }
    },

    move : function() {

        var s = 2;
        
        this.direction_z = this.moveForward - this.moveBackward;
        this.direction_x = this.moveRight - this.moveLeft;
        //this.direction_y = this.jump;

        var velovity = this.mesh.physicsImpostor.getLinearVelocity().clone();

        //模拟阻力
        velovity.z -= velovity.z*0.1;
        velovity.x -= velovity.x*0.1;
        velovity.y -= 3;
        
        //更新速度
        if(this.direction_z != 0){
            //this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, this.direction_z*s), this.mesh.position);
            velovity.z += this.direction_z*10;
            //this.mesh.physicsImpostor.setLinearVelocity(velovity);
        }
        if(this.direction_x != 0){
            //this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(this.direction_x*s, 0, 0), this.mesh.position);
            //velovity.x += direction_x*5;
            velovity.x += this.direction_x*5;
        }
        if(this.jump>0){
            //this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,5,0), this.mesh.position);
            velovity.y = 100;
            //this.mesh.physicsImpostor.setLinearVelocity(velovity);
            //this.direction_y = 0;
            this.jump = 0;
            this.vyCount = 2;
        }

        //返回赋值
        this.mesh.physicsImpostor.setLinearVelocity(velovity);
        
        //0.5+(velovity.x>0? 1:-1)*10;

        /*if(velovity.x!=0){
            x=x/2;
        }*/


        /*if (this.mvtDirection[0] != 0) {
            this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,0,s), this.mesh.position);
        }
        if (this.mvtDirection[1] != 0) {
            this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,0,-s), this.mesh.position);
        }
        if (this.mvtDirection[2] != 0) {
            this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(-s,0,0), this.mesh.position);
        }
        if (this.mvtDirection[3] != 0) {
            this.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(s,0,0), this.mesh.position);
        }*/
        //console.log("x: "+this.mesh.position.x+" y: "+this.mesh.position.y+" z: "+this.mesh.position.z);
        //this.body.body.linearVelocity.scaleEqual(0.92);
        //this.body.body.angularVelocity.scaleEqual(0);
    },

    keyDown : function(keycode){
        switch (keycode) {
        case 87://W
            this.moveForward = 1;
            //console.log("W");
            break;
        case 83://S
            this.moveBackward = 1;
            break;
        case 65://A
            this.moveLeft = 1;
            break;
        case 68://D
            this.moveRight = 1;
            break;
        case 32://space
            if(this.canjump>0){
                this.jump = 1;
                this.canjump--;
            }
            break;
        case 69:
            if(this.heavy == 2){
                this.mesh.physicsImpostor.setMass(500);
                this.heavy = 500;
            }else {
                this.mesh.physicsImpostor.setMass(2);
                this.heavy = 2;
            }
            break;

        }
        
    },

    keyUp : function(keycode) {
        switch (keycode) {
        case 87://W
        //console.log("W");
            this.moveForward = 0;
            break;
        case 83://S
            this.moveBackward = 0;
            break;
        case 65://A
            this.moveLeft = 0;
            break;
        case 68://D
            this.moveRight = 0;
            break;
        case 32://space
            this.jump = 0;
            break;
        }
    },

    destroy : function() {
        this.mesh.dispose();
    }
};