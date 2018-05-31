var GameState=function(a){State.call(this,a);this.gamepadIds=[];this.scene;this.camera;this.light;this.boxMesh=null;this.stoneMesh=null;this.groundMesh=null;this.boxArray=[];this.stoneArray=[];this.groundArray=[];this.groundId=0;this.boxId=0;this.stoneId=0;this.distancePosition=new BABYLON.Vector3(0,0,300);this.isRunning=true;this.timer=30;this.startTime=0;window.loadFileName=["ground2.babylon","box1.babylon","stone1.babylon"];window.loadCount=loadFileName.length};GameState.prototype=Object.create(State.prototype);GameState.prototype.constructor=GameState;GameState.prototype={_initScene:function(){var g=this;var e=new BABYLON.Scene(this.engine);e.enablePhysics(new BABYLON.Vector3(0,-60,0),new BABYLON.OimoJSPlugin());var h=new BABYLON.ArcRotateCamera("cameraArc",1,1,50,new BABYLON.Vector3(-10,20,-90),e);e.activeCamera=h;h.attachControl(this.engine.getRenderingCanvas());g.camera=h;var a=new BABYLON.DirectionalLight("dirLight2",new BABYLON.Vector3(-1,-2,1),e);a.position=new BABYLON.Vector3(200,400,200);a.intensity=1;var b=new BABYLON.HemisphericLight("HemiLight",new BABYLON.Vector3(0,1,0),e);b.intensity=0.6;var i=BABYLON.Mesh.CreateBox("skyBox",1000,e);var f=new BABYLON.StandardMaterial("skyBox",e);f.backFaceCulling=false;f.reflectionTexture=new BABYLON.CubeTexture("img/sea_textures/sea",e);f.reflectionTexture.coordinatesMode=BABYLON.Texture.SKYBOX_MODE;f.diffuseColor=new BABYLON.Color3(0,0,0);f.specularColor=new BABYLON.Color3(0,0,0);f.disableLighting=true;i.material=f;i.infiniteDistance=true;var c=BABYLON.Mesh.CreateGround("waterMesh",1000,1000,16,e,false);var d=new BABYLON.WaterMaterial("water",e,new BABYLON.Vector2(512,512));d.backFaceCulling=true;d.bumpTexture=new BABYLON.Texture("img/waterbump.png",e);d.windForce=-10;d.waveHeight=1;d.bumpHeight=0.5;d.windDirection=new BABYLON.Vector2(1,1);d.waterColor=new BABYLON.Color3(0,0,200);d.colorBlendFactor=0;d.addToRenderList(i);c.material=d;c.position=new BABYLON.Vector3(0,-20,0);console.log("start load ground");BABYLON.SceneLoader.ImportMesh("","model/",loadFileName[0],e,function(j){console.log("loaded ground");g.groundMesh=j[0];g.groundMesh.position=new BABYLON.Vector3(0,0,0);g.groundMesh.physicsImpostor=new BABYLON.PhysicsImpostor(g.groundMesh,BABYLON.PhysicsImpostor.BoxImpostor,{mass:0,restitution:0.02,friction:0.8});g.groundMesh.receiveShadows=true;g.importModelSuccess();console.log("loaded ground and success")});console.log("start load box");BABYLON.SceneLoader.ImportMesh("","model/",loadFileName[1],e,function(j){console.log("loaded box");g.boxMesh=j[0];g.boxMesh.position=new BABYLON.Vector3(30,0,0);g.boxMesh.physicsImpostor=new BABYLON.PhysicsImpostor(g.boxMesh,BABYLON.PhysicsImpostor.BoxImpostor,{mass:5,restitution:0.05,friction:0.6});g.boxMesh.receiveShadows=true;g.importModelSuccess();console.log("load ground and success")});console.log("start load stone");BABYLON.SceneLoader.ImportMesh("","model/",loadFileName[2],e,function(j){console.log("loaded stone");g.stoneMesh=j[0];g.stoneMesh.position=new BABYLON.Vector3(-30,0,0);g.stoneMesh.physicsImpostor=new BABYLON.PhysicsImpostor(g.stoneMesh,BABYLON.PhysicsImpostor.BoxImpostor,{mass:20,restitution:0.01,friction:0.4});g.stoneMesh.receiveShadows=true;g.importModelSuccess();console.log("load stone and success")});return e},importModelSuccess:function(){var a=this;console.log("count "+loadCount);loadCount--;if(loadCount==0){console.log("loaderAllSucess");console.log(a.boxArray.length);console.log(a.groundArray.length);console.log("boxA "+a.boxArray.length);console.log("groundA "+a.groundArray.length);console.log("stoneA "+a.stoneArray.length);a.createBoxObj(new BABYLON.Vector3(0,50,100));a.createBoxObj(new BABYLON.Vector3(0,100,100));a.createBoxObj(new BABYLON.Vector3(100,100,100));a.createGroundObj(new BABYLON.Vector3(0,0,0));a.createGroundObj(new BABYLON.Vector3(0,0,100));a.createGroundObj(new BABYLON.Vector3(0,0,200));a.createStoneObj(new BABYLON.Vector3(0,50,200));console.log(a.boxArray);console.log(a.groundArray);console.log("boxA "+a.boxArray.length);console.log("groundA "+a.groundArray.length);console.log("stoneA "+a.stoneArray.length);console.log("boxA "+a.boxArray.length);console.log("groundA "+a.groundArray.length);console.log("stoneA "+a.stoneArray.length)}this.startTime=new Date().getTime();return true},createArea:function(b){this.createGroundObj(b);var e=Math.floor(3*Math.random()+1);for(var d=0;d<e;d++){var a=b.clone();a.x+=Math.floor(100*Math.random()-50);a.y+=Math.floor(50*Math.random()+10);a.z+=Math.floor(100*Math.random()-50);this.createBoxObj(a)}var c=Math.floor(2*Math.random()+1);for(var d=0;d<c;d++){var a=b.clone();a.x+=Math.floor(100*Math.random()-50);a.y+=Math.floor(50*Math.random()+10);a.z+=Math.floor(100*Math.random()-50);this.createStoneObj(a)}return true},checkAllArray:function(a){this.removeOverflowObj(a,this.groundArray);this.removeOverflowObj(a,this.boxArray);this.removeOverflowObj(a,this.stoneArray)},removeOverflowObj:function(b,d){var a=d.length;for(var c=0;c<a;c++){if(d[c].position.y<-50||d[c].position.y>200){this.removeObj(d[c]);
d.splice(c,1);c--;a--}}for(var c=0;c<a;c++){if(d[c].position.x<-200||d[c].position.x>200){this.removeObj(d[c]);d.splice(c,1);c--;a--}}for(var c=0;c<a;c++){if(d[c].position.z<b.z-200){this.removeObj(d[c]);d.splice(c,1);c--;a--}}return true},removeObj:function(b){console.log("remove");console.log(b);b.physicsImpostor.dispose();var a=this.scene.removeMesh(b);this.scene.meshes[a].dispose();b.dispose()},createBoxObj:function(a){var b=this.boxMesh.clone();b.setAbsolutePosition(a);this.scene.addMesh(b);this.boxArray.push(b);return b},createStoneObj:function(a){var b=this.stoneMesh.clone(name);b.setAbsolutePosition(a);this.scene.addMesh(b);this.stoneArray.push(b);return b},createGroundObj:function(a){var b=this.groundMesh.clone();b.setAbsolutePosition(a);this.scene.addMesh(b);this.groundArray.push(b);return b},run:function(){this.scene=this._initScene();var a=new BABYLON.AssetsManager(this.scene);var b=this;a.onFinish=function(c){b._initGame();b.isReady=true;console.log("_this.isRunning "+b.isRunning);b.engine.runRenderLoop(function(){if(b.isRunning){b.scene.render()}})};a.load()},_initGame:function(){var e=this;var a=new Player(this.game,this.scene,this.gamepad);e.camera.setTarget(a.mesh,true,true);var d=0;this.scene.registerBeforeRender(function(){if(a.mesh.position.z+300>e.distancePosition.z){console.log("create area");e.createArea(e.distancePosition);e.distancePosition.z+=100}d++;if(d==10){e.checkAllArray(a.mesh.position);d=0}if(a.mesh.position.y<-50){b()}a.update()});function b(){e.isRunning=false;c(Math.floor(a.mesh.position.z))}function c(f){alert("Game over, your score is "+f)}}};