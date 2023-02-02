import { loadModel } from './components/model/model.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { Clock,Vector3, Color, BackSide, SkeletonHelper, MeshBasicMaterial } from 'https://cdn.skypack.dev/three@v0.132.2';
import { GLTFExporter } from 'https://cdn.skypack.dev/three@v0.132.2/examples/jsm/exporters/GLTFExporter.js';
import { CCDIKSolver,CCDIKHelper} from './CCDIKSolver.js';

let camera;
let controls;
let renderer;
let scene;
let loop;
let mixer;
let clock;
let i = 0;
let IKSolver1, IKSolver2, IKSolver3, IKSolver4, IKSolver5, IKSolver6, IKSolver7;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer(); 
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    clock = new Clock();
    controls = createControls(camera, renderer.domElement);
    const { ambientLight, mainLight1, mainLight2, mainLight3, mainLight4, mainLight5, mainLight6 } = createLights();
    loop.updatables.push(controls);
    scene.add(ambientLight, mainLight1, mainLight2, mainLight3, mainLight4, mainLight5, mainLight6);
    const resizer = new Resizer(container, camera, renderer);  
  }

  async init() {
    const {modelData} = await loadModel('/assets/models/MousePoses.0002.fbx');
    let model = modelData;
    model.position.set(0, 0, 0);
    controls.target.copy(model.position);
    model.scale.set( 0.1, 0.1, 0.1 );
    scene.add(model);
    
    let rootbone = scene.getObjectByProperty('type', "Bone");
    let bones = []
  
    model.traverse((child)=>{
      if( child.material ) {
        child.material.side = BackSide;
       }
    })

    rootbone.traverse((child) =>{     
      
      //if((child.name=="c_spine02_jj" || child.name=="c_spine01_jj" || child.name=="c_spine04_jj" || child.name == "c_spine05_jj" || child.name == "l_humerus01_jj" || child.name == "r_humerus01_jj" || child.name == "c_head01_jj" || child.name == "r_ulna01_jj") && child.position.x!=0 && child.position.y!=0 && child.position.z!=0 )
      if(child.position.x!=0 && child.position.y!=0 && child.position.z!=0 )
        bones.push(child)
      
    });

    document.getElementById("joint-container").innerHTML = (bones.map((bone,index)=>(
      `<div class="joint-card">
          <div class="joint-title">Joint ${bone.name}</div>
          <div class="joint-input">
              <div class="label" for="">X</div>
              <input class="joint-input-X" type="number" step="0.05" placeholder="" value="${Math.round(bone.rotation.x * 100) / 100}">
          </div>
          <div class="joint-input">
              <div class="label" for="">Y</div>
              <input class="joint-input-Y" type="number" step="0.05" placeholder="" value="${Math.round(bone.rotation.y * 100) / 100}">
          </div>
          <div class="joint-input">
              <div class="label" for="">Z</div>
              <input class="joint-input-Z" type="number" step="0.05" placeholder="" value="${Math.round(bone.rotation.z * 100) / 100}">
          </div>
      </div>`
    )).join(" "));

    let inputx = document.getElementsByClassName("joint-input-X")
    let inputy = document.getElementsByClassName("joint-input-Y")
    let inputz = document.getElementsByClassName("joint-input-Z")
    for(let i = 0; i<inputx.length; i++ ){
      inputx[i].addEventListener("input",function(){
        bones[i].rotation.x = this.value
      })
      inputy[i].addEventListener("input",function(){
        bones[i].rotation.y = this.value
      })
      inputz[i].addEventListener("input",function(){
        bones[i].rotation.z = this.value
      })
    }


   
    const material = new MeshBasicMaterial({
      color: 0xff0000
    })

    let helper = new SkeletonHelper(model);
    helper.material = material    
    // helper.visible = true;
    scene.add(helper);

    document.getElementById("export-btn").addEventListener("click", function(){
      var exporter = new GLTFExporter();     
      const link = document.createElement( 'a' );
			link.style.display = 'none';
			document.body.appendChild( link ); 

      function save( blob, filename ) {

				link.href = URL.createObjectURL( blob );
				link.download = filename;
				link.click();
			}
      function saveString( text, filename ) { 
				save( new Blob( [ text ], { type: 'text/plain' } ), filename );

			}
       exporter.parse(//////////
       


        scene,
        function ( result ) {

          if ( result instanceof ArrayBuffer ) {

            saveArrayBuffer( result, 'scene.glb' );

          } else {

            const output = JSON.stringify( result, null, 2 );
            saveString( output, 'scene.gltf' );
          }

        },
        function ( error ) {
          console.log( 'An error happened during parsing', error );
        }
      );
    })


  }

  render() {
    controls.update();
    IKSolver1?.update();
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
