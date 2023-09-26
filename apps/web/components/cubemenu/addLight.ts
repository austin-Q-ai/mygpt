import * as THREE from "three";

export default function addLight(scene: any) {
  // Light
  const light = new THREE.DirectionalLight(0xffffff, 2.7);
  light.position.z = 0;
  light.position.y = 0;
  light.position.x = 50;
  scene.add(light);
  const light2 = new THREE.DirectionalLight(0xffffff, 3);
  light2.position.z = 0;
  light2.position.x = -50;
  light2.position.y = 0;
  scene.add(light2);
  const light3 = new THREE.DirectionalLight(0xffffff, 3);
  light3.position.z = 0;
  light3.position.x = 0;
  light3.position.y = 50;
  scene.add(light3);
  const light5 = new THREE.DirectionalLight(0xffffff, 3);
  light5.position.z = 0;
  light5.position.x = 0;
  light5.position.y = -50;
  scene.add(light5);
  const light6 = new THREE.DirectionalLight(0xffffff, 4);
  light6.position.z = 50;
  light6.position.x = 0;
  light6.position.y = 0;
  scene.add(light6);
  const light7 = new THREE.DirectionalLight(0xffffff, 4);
  light7.position.z = -50;
  light7.position.x = 0;
  light7.position.y = 0;
  scene.add(light7);
}
