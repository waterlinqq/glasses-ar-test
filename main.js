"use strict";

let THREECAMERA = null;

// callback: launched if a face is detected or lost
function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK:
function init_threeScene(spec) {
  spec.threeCanvasId = 'threeCanvas'; // enable 2 canvas mode
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);
  const gltfLoader = new THREE.GLTFLoader().setPath('./gltf/');

  gltfLoader.load('model.gltf', (gltf) => {
    const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    threeCube.frustumCulled = false;
    gltf.scene.scale.set(8,8,8)
    threeStuffs.faceObject.add(gltf.scene);

  })

   // CREATE A CUBE:
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshNormalMaterial();

  // CREATE THE CAMERA:
  THREECAMERA = JeelizThreeHelper.create_camera();
} // end init_threeScene()

// entry point:
function main(){
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  })
}

function init_faceFilter(videoSettings){
  JEELIZFACEFILTER.init({
    antialias: false,
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: './neuralNets/', // root of NN_DEFAULT.json file
    maxFacesDetected: 1,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      JeelizThreeHelper.render(detectState, THREECAMERA);
    }
  }); //end JEELIZFACEFILTER.init call
}