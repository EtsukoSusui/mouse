// import { GLTFLoader } from 'https://cdn.skypack.dev/three@v0.132.2/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'https://cdn.skypack.dev/three@v0.132.2/examples/jsm/loaders/DRACOLoader.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three@v0.132.2/examples/jsm/loaders/FBXLoader.js';

// https://unpkg.com/three@0.145.x/examples
async function loadModel(url) {
  //const dracoLoader = new DRACOLoader();
  //const loader = new GLTFLoader();
  const loader = new FBXLoader();
  // dracoLoader.setDecoderPath( 'https://unpkg.com/three@0.145.x/examples/js/libs/draco/gltf/' );
  // loader.setDRACOLoader( dracoLoader );
  const data = await Promise.all([
    loader.loadAsync(url)
  ]);
  let modelData = data[0]
  return {
    modelData
  };
}

export { loadModel };