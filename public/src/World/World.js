import { loadModel } from './components/model/model.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { AnimationMixer, Clock } from 'https://cdn.skypack.dev/three@v0.132.2';

let camera;
let controls;
let renderer;
let scene;
let loop;
let mixer;
let clock;
let i = 0;
class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    clock = new Clock();
    controls = createControls(camera, renderer.domElement);
    const { ambientLight, mainLight } = createLights();
    loop.updatables.push(controls);
    scene.add(ambientLight, mainLight);
    const resizer = new Resizer(container, camera, renderer);  
  }

  async init() {
    const {modelData} = await loadModel('/assets/models/MousePose.fbx');
    let model = modelData;
    model.position.set(0, 0, 0);
    controls.target.copy(model.position);
    model.scale.set( 0.1, 0.1, 0.1 );
    scene.add(model);
    let rootbone = scene.getObjectByProperty('type', "Bone");
    let bones = []
    rootbone.traverse((child) =>{
      if(child.position.x!==0 || child.position.y!==0 || child.position.z!==0)
      bones.push(child)
    });
    
    document.getElementById("joint-container").innerHTML = (bones.map((bone,index)=>(
      `<div class="joint-card">
          <div class="joint-title">Joint ${index + 1}</div>
          <div class="joint-input">
              <div class="label" for="">X</div>
              <input class="joint-input-X" type="number" placeholder="" value="${bone.position.x}">
          </div>
          <div class="joint-input">
              <div class="label" for="">Y</div>
              <input class="joint-input-Y" type="number" placeholder="" value="${bone.position.y}">
          </div>
          <div class="joint-input">
              <div class="label" for="">Z</div>
              <input class="joint-input-Z" type="number" placeholder="" value="${bone.position.z}">
          </div>
      </div>`
    )).join(" "));

    let inputx = document.getElementsByClassName("joint-input-X")
    let inputy = document.getElementsByClassName("joint-input-Y")
    let inputz = document.getElementsByClassName("joint-input-Z")
    for(let i = 0; i<inputx.length; i++ ){
      inputx[i].addEventListener("input",function(){
        bones[i].position.x = this.value
      })
      inputy[i].addEventListener("input",function(){
        bones[i].position.y = this.value
      })
      inputz[i].addEventListener("input",function(){
        bones[i].position.z = this.value
      })
    }
  }

  render() {
    controls.update();
    renderer.render( scene, camera );
  }

  start() {
    loop.start()
  }

  stop() {
    loop.stop();
  }

}
export { World };
