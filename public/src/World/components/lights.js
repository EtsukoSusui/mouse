import { DirectionalLight, HemisphereLight } from 'https://cdn.skypack.dev/three@v0.132.2';

function createLights() {
  const ambientLight = new HemisphereLight(
    'white',
    'darkslategrey',
    100,
  );

  const mainLight = new DirectionalLight('white', 4);
  mainLight.position.set(100, 100, 100);

  return { ambientLight, mainLight };
}

export { createLights };
