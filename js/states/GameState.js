var GameState = function(game) {
    State.call(this, game);

    // All gamepad id currently connected
    this.gamepadIds = [];
    this.scene;
    this.camera;
    this.light;
    //this.shadowGenerator;

    this.boxMesh = null;
    this.stoneMesh = null;

    this.groundMesh = null;
    this.waterMesh = null;
    this.water_wi = 0;

    this.skybox = null;

    this.boxArray = [];
    this.stoneArray = [];
    this.groundArray = [];
    this.waterArray = [];

    this.distancePosition = new BABYLON.Vector3(0,0,300);
    this.waterdisPosition = new BABYLON.Vector3(0,-20,0);

    this.isRunning = true;
    this.timer = 30;
    this.startTime = 0;
    this.facetan_text = new BABYLON.GUI.TextBlock();
    this.buttonJump = BABYLON.GUI.Button.CreateSimpleButton("butJump", "Jump");

    window.loadFileName = ["ground2.babylon","box1.babylon","stone1.babylon"];
    window.loadCount = loadFileName.length;

};


GameState.prototype = Object.create(State.prototype);
GameState.prototype.constructor = GameState;


GameState.prototype = {

    //场景初始化
    _initScene : function(){

        var _this = this;

        var scene = new BABYLON.Scene(this.engine);
        scene.enablePhysics(new BABYLON.Vector3(0, -60, 0), new BABYLON.OimoJSPlugin());


        // Camera attached to the canvas
        /*var camera = new BABYLON.FreeCamera("cameraFree", new BABYLON.Vector3(0, 30, -30), scene);
        camera.setTarget(new BABYLON.Vector3(0,0,0));
        camera.attachControl(this.engine.getRenderingCanvas());
        _this.camera = camera;*/

        var camera2 = new BABYLON.ArcRotateCamera("cameraArc",1, 1, 50, new BABYLON.Vector3(-10, 20, -90), scene);
        //camera2.setTarget(new BABYLON.Vector3(0,0,0));
        //camera2.position = new BABYLON.Vector3(0,200,0);
        
        scene.activeCamera = camera2;
        camera2.attachControl(this.engine.getRenderingCanvas());
        _this.camera = camera2;

        // Hemispheric light to light the scene
        //var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), scene);
        //var light = new BABYLON.PointLight("lightPoint", new BABYLON.Vector3(20, 20, 100), scene);
        //light.groundColor = BABYLON.Color3.(255,255,255);
        //light.intensity = 0.9;
        var light2 = new BABYLON.DirectionalLight("dirLight2", new BABYLON.Vector3(-1, -2, 0.6), scene);
        light2.position = new BABYLON.Vector3(40, 80, 0);
        light2.intensity = 1.0;

        var hemiLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
        hemiLight.intensity = 0.6;

        var music = new BABYLON.Sound("Music", "music/house.mp3", scene, null, { loop: true, autoplay: true });

        //终点线dinish_line
        var f_lineMesh = new BABYLON.Mesh.CreateBox("finishLine", 100, scene);
        f_lineMesh.position.z = 5000+10;
        f_lineMesh.scaling = new BABYLON.Vector3(1, 0.001, 0.2);

        var f_lineMaterial = new BABYLON.StandardMaterial("finishLineMat", scene);
        //f_lineMaterial.diffuseColor = new BABYLON.Vector3(250, 0, 0);
        f_lineMesh.material = f_lineMaterial;


        // var light2shadow = new BABYLON.DirectionalLight("dLight2Shadow", new BABYLON.Vector3(-1, -2, 1), scene);
        // light2.position = new BABYLON.Vector3(20, 40, 20);

        //阴影代理
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
        _this.shadowGenerator = shadowGenerator;
        //console.log("shadow");
        //console.log(_this.shadowGenerator);
        //shadowGenerator.addShadowCaster(torus);
        shadowGenerator.useExponentialShadowMap = true;

        //skybox
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/sea_textures/sea", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        this.skybox = skybox;

        //water
        var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 1000, 1000, 16, scene, false);
        var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(512, 512));
        water.backFaceCulling = true;
        water.bumpTexture = new BABYLON.Texture("img/waterbump.png", scene);
        water.windForce = -10;
        water.waveHeight = 1.0;
        water.bumpHeight = 0.5;
        water.windDirection = new BABYLON.Vector2(1, 1);
        water.waterColor = new BABYLON.Color3(0, 0, 200);
        water.colorBlendFactor = 0.0;
        water.addToRenderList(skybox);
        waterMesh.material = water;
        waterMesh.position = new BABYLON.Vector3(0,-20,0);
        this.waterMesh = waterMesh;
        this.waterdisPosition = new BABYLON.Vector3(0, -20, 0);
        //this.waterArray.push(waterMesh);

        //var waterblueMesh = BABYLON.Mesh.createBox("waterblue", scene);
        //var waterblue = BABYLON.Material("");

        //景深/雾化
        //fog
        //scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        //scene.fogColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        //scene.fogDensity = 0.0005;

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        //gui分数显示文本域
        //this.facetan_text = new BABYLON.GUI.TextBlock();
        this.facetan_text.text = "score:0";
        this.facetan_text.color = "black";
        //this.facetan_text.color = "black";
        this.facetan_text.fontSize = 20;
        this.facetan_text.fontWeight = 20;
        this.facetan_text.width = "300px";
        this.facetan_text.height = "60px";

        //this.facetan_text.background = "green";
        advancedTexture.addControl(this.facetan_text); 
        //this.facetan_text.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.facetan_text.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        //var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Jump");
        this.buttonJump.width = "80px";
        this.buttonJump.height = "60px";
        this.buttonJump.color = "white";
        this.buttonJump.cornerRadius = 10;
        this.buttonJump.background = "black";
        this.buttonJump.alpha = 0.5;
        // this,buttonJump.onPointerUpObservable.add(function() {
        //     circle.scaleX += 0.1;
        // });
        advancedTexture.addControl(this.buttonJump);
        this.buttonJump.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;


        //模型导入
        console.log("start load ground");
        BABYLON.SceneLoader.ImportMesh("", "model/", loadFileName[0], scene, function(groundMeshes){
            console.log("loaded ground");
            //var ground = groundMeshes[0];
            //groundMeshes[0].physicsImpostor = new BABYLON.PhysicsImpostor(groundMeshes[0], BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution:0.1, friction:0.5});
            _this.groundMesh = groundMeshes[0];
            _this.groundMesh.position = new BABYLON.Vector3(0,0,0);
            _this.groundMesh.physicsImpostor = new BABYLON.PhysicsImpostor(_this.groundMesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution:0.02, friction:0.8});
            _this.groundMesh.receiveShadows = true;
            //_this.groundArray.push(_this.groundMesh);
            //console.log("groundA "+_this.groundArray.length);
            //scene.removeMesh(ground);
            _this.importModelSuccess();
            console.log("loaded ground and success");
        });

        console.log("start load box");
        BABYLON.SceneLoader.ImportMesh("", "model/", loadFileName[1], scene, function (boxMeshes) {
            console.log("loaded box")
            //var box = boxMeshes[0];
            //box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {mass:5, restitution:0.05, friction:0.6});
            _this.boxMesh = boxMeshes[0];
            _this.boxMesh.position = new BABYLON.Vector3(30,0,0);
            _this.boxMesh.physicsImpostor = new BABYLON.PhysicsImpostor(_this.boxMesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass:5, restitution:0.05, friction:0.6});
            _this.boxMesh.receiveShadows = true;
            //_this.shadowGenerator.addShadowCaster(_this.boxMesh);
            //_this.boxArray.push(_this.boxMesh);
            //console.log("boxA "+_this.boxArray.length);
            //_this.boxId++;      
            _this.importModelSuccess();
            console.log("load ground and success");  
        });

        console.log("start load stone");
        BABYLON.SceneLoader.ImportMesh("", "model/", loadFileName[2], scene, function(stoneMeshes){
            console.log("loaded stone");
            //stoneMeshes[0].physicsImpostor = new BABYLON.PhysicsImpostor(stoneMeshes[0], BABYLON.PhysicsImpostor.BoxImpostor, {mass:20, restitution:0.01, friction:0.4});
            _this.stoneMesh = stoneMeshes[0];
            _this.stoneMesh.position = new BABYLON.Vector3(-30,0,0);
            _this.stoneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(_this.stoneMesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass:20, restitution:0.01, friction:0.4});
            _this.stoneMesh.receiveShadows = true;
            //_this.stoneArray.push(_this.stoneMesh);
            _this.importModelSuccess();
            console.log("load stone and success");
        });

        // Ground creation
        /*var ground = BABYLON.Mesh.CreateGround("ground", 500, 500, 1, scene);
        ground.receiveShadows = true;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution:0.5, friction:0.1});*/

        //ground.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass:0, restitution:0.5, friction:0.1});

        /*var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = BABYLON.Color3.FromInts(121,189,224);*/

        /*var mur = BABYLON.Mesh.CreateBox("box", 1.0, scene);
        mur.scaling = new BABYLON.Vector3(50,10,1);
        mur.position.z = -10;
        //mur.material = mat;
        mur.physicsImpostor = new BABYLON.PhysicsImpostor(mur,BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution:0.5, friction:0.1});*/
        //mur.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass:0, restitution:0.5, friction:0.1});

        //_this.createBoxObj(new BABYLON.Vector3(0,50,100));
        
        return scene;
    },

    //完部模型加载完毕后
    importModelSuccess : function(){
        var _this = this;
        console.log("count " + loadCount);
        loadCount--;

        if(loadCount == 0){
            console.log("loaderAllSucess");

            //console.log(_this.shadowGenerator);

            console.log(_this.boxArray.length);
            console.log(_this.groundArray.length);
            console.log("boxA "+_this.boxArray.length);
            console.log("groundA "+_this.groundArray.length);
            console.log("stoneA "+_this.stoneArray.length);

            _this.createBoxObj(new BABYLON.Vector3(0,50,100));
            //console.log(box3);
            //console.log("box3 over");

            //console.log("box4");
            //_this.createBoxObj(new BABYLON.Vector3(0,100,100));
            _this.createBoxObj(new BABYLON.Vector3(100,100,100));

            //console.log("box5 over");
            _this.createGroundObj(new BABYLON.Vector3(0,0,0));

            //console.log("box5 over");
            _this.createGroundObj(new BABYLON.Vector3(0,0,100));

            _this.createGroundObj(new BABYLON.Vector3(0,0,200));
            _this.createStoneObj(new BABYLON.Vector3(0,50,200));

            console.log(_this.boxArray);
            console.log(_this.groundArray);
            console.log("boxA "+_this.boxArray.length);
            console.log("groundA "+_this.groundArray.length);
            console.log("stoneA "+_this.stoneArray.length);
            
            //_this.scene.removeMesh(_this.boxMesh);
            //_this.scene.removeMesh(_this.stoneMesh);
            //_this.scene.removeMesh(_this.groundMesh);
            //console.log("remove");
            //_this.removeObj(_this.groundArray[0]);
            //_this.scene.removeMesh(_this.groundArray[0]);
            //_this.groundArray.splice(0,1);
            //_this.scene.removeMesh(_this.boxArray[0]);
            //_this.boxArray.splice(0,1);
            //_this.scene.removeMesh(_this.stoneArray[0]);
            //_this.stoneArray.splice(0,1);
            //console.log("remove success");

            console.log("boxA "+_this.boxArray.length);
            console.log("groundA "+_this.groundArray.length);
            console.log("stoneA "+_this.stoneArray.length);
        }
        //_this.timerCount();
        this.startTime = new Date().getTime();
        return true;
    },

    //水面延展
    createWaterObj : function(position){
        // var waterMesh = BABYLON.Mesh.CreateGround("waterMesh"+this.water_wi, 1000, 1000, 16, this.scene, false);
        // this.water_wi++;
        // var water = new BABYLON.WaterMaterial("water", this.scene, new BABYLON.Vector2(512, 512));
        // water.backFaceCulling = true;
        // water.bumpTexture = new BABYLON.Texture("img/waterbump.png", this.scene);
        // water.windForce = -10;
        // water.waveHeight = 1.0;
        // water.bumpHeight = 0.5;
        // water.windDirection = new BABYLON.Vector2(1, 1);
        // water.waterColor = new BABYLON.Color3(0, 0, 200);
        // water.colorBlendFactor = 0.0;
        // water.addToRenderList(this.skybox);
        // waterMesh.material = water;

        var waterclone = this.waterMesh.clone();
        waterclone.position = position.clone();
        waterclone.material.addToRenderList(this.skybox);
        this.waterArray.push(waterclone);

        //waterMesh.position = position;
        //this.waterArray.push(waterMesh);

        console.log("create water"); 
        var len = this.waterArray.length;
        // for(var i=0; i<len; i++){
        //     console.log("now water"+this.waterArray[i]);
        // }
    },

    //区域延展
    createArea : function(corePosition){

        this.createGroundObj(corePosition);

        //(100*Math.Random())
        var n_box = Math.floor(3*Math.random()+1);
        for(var i=0;i<n_box;i++){
            var position = corePosition.clone();
            position.x += Math.floor(100*Math.random()-50);
            position.y += Math.floor(50*Math.random()+10);
            position.z += Math.floor(100*Math.random()-50);
            this.createBoxObj(position);
        }

        var n_stone = Math.floor(2*Math.random()+1);
        for(var i=0;i<n_stone;i++){
            var position = corePosition.clone();
            position.x += Math.floor(100*Math.random()-50);
            position.y += Math.floor(50*Math.random()+10);
            position.z += Math.floor(100*Math.random()-50);
            this.createStoneObj(position);
        }
        return true;
    },

    //检查障碍物数组 超边界移除
    checkAllArray : function(position){
        this.removeOverflowObj(position, this.groundArray);
        this.removeOverflowObj(position, this.boxArray);
        this.removeOverflowObj(position, this.stoneArray);
        //this.removeOverflowWater(position, this.waterArray);
    },

    //移除超边界水
    removeOverflowWater : function(position,array){
        //console.log("rewater");
        var len = array.length;
        for(var i=0; i<len; i++){
            if(array[i].position.z <= position.z){
                console.log("positionz"+position.z);
                console.log("arrposition"+array[i].position.z);
                this.scene.removeMesh(array[i]);
                array.splice(i,1);
                i--;
                len--; 
            }
        }
    },

    //移除数组中超边界物体
    removeOverflowObj : function(position,array){
        var len = array.length;
        //y
        for(var i=0; i<len; i++){
            if(array[i].position.y < -50 || array[i].position.y > 200 ){
                this.removeObj(array[i]);
                array.splice(i,1);
                i--;
                len--;
            }
        }

        //x
        for(var i=0; i<len; i++){
            if(array[i].position.x < -200 || array[i].position.x > 200 ){
                this.removeObj(array[i]);
                array.splice(i,1);
                i--;
                len--;
            }
        }

        //z
        for(var i=0; i<len; i++){
            if(array[i].position.z < position.z-200){
                this.removeObj(array[i]);
                array.splice(i,1);
                i--;
                len--;
            }
        }

        return true;
    },

    //移除物体(mesh)
    //关闭物理
    //removeMesh无法移除克隆生成物体，获取返回位置后调用销毁方法
    removeObj : function(mesh){
        //console.log("remove");
        //console.log(mesh);
        //this.shadowGenerator.removeShadowCaster(mesh);
        //mesh.physicsImpostor.dispose();
        if(mesh.physicsImpostor != null){
            mesh.physicsImpostor.dispose();
        }
        var meshNum = this.scene.removeMesh(mesh);
        this.scene.meshes[meshNum].dispose();
        mesh.dispose();
    },

    //对应位置创建箱子
    createBoxObj : function(position){
        //console.log(this.boxMesh);
        //console.log(this.boxArray);
        //console.log("in createbox");
        var cloneMesh = this.boxMesh.clone();
        //cloneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(cloneMesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass:5, restitution:0.1, friction:0.6});
        //console.log(cloneMesh);
        
        cloneMesh.setAbsolutePosition(position);
        //console.log("position");
        //console.log(cloneMesh.position);
        this.scene.addMesh(cloneMesh);

        //this.shadowGenerator.addShadowCaster(cloneMesh);
        //console.log("shadow");
        //console.log(this.shadowGenerator);

        //console.log("scene add success");
        this.boxArray.push(cloneMesh);
        //console.log(this.boxArray);
        return cloneMesh;
    },

    // createWaterObj : function(position){
    //     console.log("create water");
    //     var cloneMesh = this.waterMesh.clone();
    //     cloneMesh.setAbsolutePosition(position);
    //     this.scene.addMesh(cloneMesh);
    //     this.waterArray.push(cloneMesh);
    //     return cloneMesh;
    // },

    createStoneObj : function(position){
        var cloneMesh = this.stoneMesh.clone(name);
        cloneMesh.setAbsolutePosition(position);
        this.scene.addMesh(cloneMesh);
        //this.shadowGenerator.addShadowCaster(cloneMesh);
        //cloneMesh.position = position;
        //cloneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(cloneMesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass:5, restitution:0.1, friction:0.6});
        this.stoneArray.push(cloneMesh);
        return cloneMesh;
    },

    createGroundObj : function(position){
        //console.log("in create ground");
        var cloneMesh = this.groundMesh.clone();
        //console.log("clone");
        cloneMesh.setAbsolutePosition(position);
        //console.log("set poistion");
        this.scene.addMesh(cloneMesh);
        //console.log("add scene");

        //cloneMesh.position = position;
        //cloneMesh.physicsImpostor = new BABYLON.PhysicsImpostor(cloneMesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass:5, restitution:0.1, friction:0.6});
        this.groundArray.push(cloneMesh);
        //console.log("add array");
        return cloneMesh;
    },

    /**
     * Run the current state
     */
    /*_loaderEXModel : function(){
        BABYLON.SceneLoader.ImportMesh("", "model/", "box1.babylon", this.scene,function (boxMeshes) {
           // Set the target of the camera to the first imported mesh
           var box = boxMeshes[0];
           boxMesh = box.clone();
           this.scene.removeMesh(box);
           console.log();
        });
        
        BABYLON.SceneLoader.ImportMesh("", "model/", "ground1.babylon", this.scene, function(groundMeshes){
            var ground = groundMeshes[0];
            groundMesh = ground.clone();
            ground.position.y = -10;
        });
        BABYLON.SceneLoader.ImportMesh("", "model/", "stone1.babylon", this.scene, function(stoneMeshes){
            var stone = stoneMeshes[0];
            stoneMesh = stone.clone();
            this.scene.removeMesh(stone);
        });  
    },*/

    run : function() {

        this.scene = this._initScene();

        // The loader
        var loader =  new BABYLON.AssetsManager(this.scene);

        //    var meshTask = this.loader.addMeshTask("skull task", "", "./assets/", "block02.babylon");
        //    meshTask.onSuccess = this._initMesh;

        var _this = this;

        /*var modelLoader = new BABYLON.AssetsManager(_this._loaderEXModel());
        modelLoader.onFinish = function(tasks){
            // Init the game
            _this._initGame();
            console.log(_this.libModel);
            // The state is ready to be played
            _this.isReady = true;
            _this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        },*/
     
        loader.onFinish = function (tasks) {
            //modelLoader.load();
           // _this._loaderEXModel();

            // Init the game
            //console.log(_this.boxMesh);
            //console.log(_this.boxMesh);
            //console.log(_this.boxMesh);

            //_this.createGroundObj(new BABYLON.Vector3(0,0,0));
            //_this.createBoxObj(new BABYLON.Vector3(0,100,0));

            _this._initGame();

            // The state is ready to be played
            _this.isReady = true;
            console.log("_this.isRunning "+_this.isRunning);

            _this.engine.runRenderLoop(function () {
                if(_this.isRunning){
                    _this.scene.render();
                }
            });
        };
        loader.load();
    },

    /*timerCount : function(){  
        console.log("timer"+this.timer); 
        this.timer--;
        document.getElementById("timer").innerText = this.timer;
        if(this.timer>0){   
            setTimeout(this.timerCount(),3000);
        }
    },*/


//####################################################################################################################
    _initGame : function() {
        var _this = this;
        var player = new Player(this.game, this.scene, this.gamepad, this.shadowGenerator);

        //_this.createBoxObj(new BABYLON.Vector3(0,50,100));
        _this.camera.setTarget(player.mesh, true, true);
        //_this.shadowGenerator.addShadowCaster(player.body);
        //_this.camera.rotation = new BABYLON.Vector3(0,10,0);
        //_this.camera.position = new BABYLON.Vector3(0, 20, -40);
        //console.log(_this.boxArray);
        
        // if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        //     player.moveForward = 1;
        // } else {
        //     ;
        // }


        //帧运算
        var flashCount = 0;
        this.scene.registerBeforeRender(function(){
            //console.log(_this.boxArray);
            //console.log(_this.camera.position);

            
            //新物质生成
            if(player.mesh.position.z+300 > _this.distancePosition.z){
                console.log("create area");
                _this.createArea(_this.distancePosition);
                _this.distancePosition.z += 100;
            }
            if(player.mesh.position.z > _this.waterdisPosition.z){
                _this.waterdisPosition.z += 1000;
               // _this.createWaterObj(_this.waterdisPosition);
            }

            //移除物体扫描 10帧周期
            flashCount++;
            if(flashCount == 10){
                _this.facetan_text.text = "score:" + Math.floor(player.mesh.position.z);
                _this.checkAllArray(player.mesh.position);
                flashCount = 0;
            }

            //跳跃状态判断
            _this.buttonJump.onPointerUpObservable.add(function(){
                if(player.canjump>0){
                    player.jump = 1;
                    player.canjump--;
                }
            });

            //gameover
            //timerover
            /*if(_this.startTime != 0){
                console.log("startTime"+_this.startTime);
                var nowTime = new Date().getTime();
                var subTime = 30 - Math.floor((nowTime - _this.startTime)/1000);
                if(subTime <= 0){
                    gameover();
                }
                document.getElementById("timer").innerText = subTime;
            }*/

            //越界或到达终点
            if(player.mesh.position.y<-50){
                gameover();
            }
            if(player.mesh.position.z>=5000){
                gameover();
            }

            // player.downPoint = player.mesh.position.clone();
            // player.downPoint.y -= 6;
            

            //player.canjump=0;
            // var gi=0,bi=0,si=0;
            // //console.log(player.downPoint.y);
            // while(player.canjump==0 && gi<_this.groundArray.length){
            //     //console.log(gi);
            //     //console.log(_this.groundArray[gi].position.y);
            //     if(_this.groundArray[gi].intersectsPoint(player.downPoint)){
            //         console.log("have obj down");
            //         player.canjump==1;
            //     }
            //     gi++;
            // }
            // while(z==0 && bi<_this.boxArray.length){
            //     if(_this.boxArray[bi].intersectsPoint(player.downPoint)){
            //         z==1;
            //     }
            //     bi++;
            // }
            // while(z==0 && si<_this.stoneArray.length){
            //     if(_this.stoneArray[si].intersectsPoint(player.downPoint)){
            //         z==1;
            //     }
            //     si++;
            // }
            

            //console.log(player.canjump);
            //console.log(player.mesh.position.y);
            //console.log(player.downPoint.y);
            
            player.update();
        });

        /*this.scene.registerAfterRender(function(){
            console.log("body : "+player.body);
            if(player.body!=undefined){
                player.body.setAbsolutePosition(player.mesh.getAbsolutePosition().clone());
                console.log(player.body.position);
            }
        });*/

        function gameover(){
            _this.isRunning = false;
            showScore(Math.floor(player.mesh.position.z));
        }

        function showScore(score){
            alert("Game over, your score is "+score);   
        }

    }
};
