import { useRouter } from "next/router";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

import { useLocale } from "@calcom/lib/hooks/useLocale";

import { AIPage } from "./screens/AI";
import { CoordonneesPage } from "./screens/coordonnees";
import { ServicesPage } from "./screens/services";
import { TimeTokenPage } from "./screens/timetoken";

interface MicroCardsProps {
  userId?: number | undefined;
}

const MicroCards: React.FC<MicroCardsProps> = (props: MicroCardsProps) => {
  const router = useRouter();
  const { t } = useLocale();

  const sceneRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const aiRef = useRef<HTMLDivElement>(null);
  const coordonneesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const timetokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sceneElement = sceneRef.current;

    const sizes: {
      width: number;
      height: number;
    } = {
      width: sceneElement?.clientWidth || 0,
      height: sceneElement?.clientHeight || 0,
    };

    console.log(sizes);

    if (!sceneElement) return;

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.z = 1000;

    // Create renderer
    const renderer = new CSS3DRenderer();
    const handleResize = () => {
      renderer.setSize(
        window.innerWidth <= 425 ? window.innerWidth - 20 : window.innerWidth === 1024 ? 450 : 500,
        sizes.height - 20
      );
    };

    window.addEventListener("resize", handleResize);
    renderer.setSize(
      window.innerWidth <= 425 ? window.innerWidth - 20 : window.innerWidth === 1024 ? 450 : 500,
      sizes.height - 20
    );
    sceneElement.appendChild(renderer.domElement);

    // Create OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = true;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 2;
    controls.update();

    const unit = 250;

    // Add CSS3DObject
    {
      const elem = aiRef?.current as HTMLDivElement;
      console.log(elem);
      // elem.style.backgroundColor = "#ff0000";
      elem.style.width = "500px";
      elem.style.height = "900px";
      // elem.innerHTML = "<a href='#'>Hello, world!</a><br /><button>Add</button>";
      const obj = new CSS3DObject(elem);
      obj.position.set(0, 0, unit);
      scene.add(obj);
    }
    {
      const elem = coordonneesRef?.current as HTMLDivElement;
      // elem.style.backgroundColor = "#ff00ff";
      elem.style.width = "500px";
      elem.style.height = "900px";
      // elem?.innerHTML = "Hello, world!";
      const obj = new CSS3DObject(elem);
      obj.rotation.y = Math.PI / 2;
      obj.position.set(unit, 0, 0);
      scene.add(obj);
    }
    {
      const elem = servicesRef?.current as HTMLDivElement;
      // elem.style.backgroundColor = "#ffff00";
      elem.style.width = "500px";
      elem.style.height = "900px";
      // elem.innerHTML = "Hello, world!";
      const obj = new CSS3DObject(elem);
      obj.rotation.y = Math.PI;
      obj.position.set(0, 0, -unit);
      scene.add(obj);
    }
    {
      const elem = timetokenRef?.current as HTMLDivElement;
      // elem.style.backgroundColor = "#0000ff";
      elem.style.width = "500px";
      elem.style.height = "900px";
      // elem.innerHTML = "Hello, world!";
      const obj = new CSS3DObject(elem);
      obj.rotation.y = -Math.PI / 2;
      obj.position.set(-unit, 0, 0);
      scene.add(obj);
    }
    {
      const elem = document.createElement("div");
      elem.style.backgroundColor = "#ffffff";
      elem.style.width = "500px";
      elem.style.height = "500px";
      const obj = new CSS3DObject(elem);
      obj.rotation.x = Math.PI / 2;
      obj.position.set(0, 450, 0);
      scene.add(obj);
    }
    {
      const elem = document.createElement("div");
      elem.style.backgroundColor = "#ffffff";
      elem.style.width = "500px";
      elem.style.height = "500px";
      const obj = new CSS3DObject(elem);
      obj.rotation.x = Math.PI / 2;
      obj.position.set(0, -450, 0);
      scene.add(obj);
    }

    // Animation function
    const animate = () => {
      // Render scene with camera
      renderer.render(scene, camera);

      // Update orbitcontrols
      controls.update();

      // Call animate() again on the next frame
      requestRef.current = requestAnimationFrame(animate);
    };

    // Call animate() to start the animation loop
    requestRef.current = requestAnimationFrame(animate);

    // Clean up function
    return () => {
      // Stop the animation loop when the component is unmounted
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const randamUserId = -1;

  return (
    <div className="h-full w-full">
      <div ref={sceneRef} className="flex h-full w-full items-center justify-center" />
      <div>
        <CoordonneesPage ref={aiRef} userId={props.userId || randamUserId} />
        <AIPage ref={coordonneesRef} userId={props.userId || randamUserId} />
        <TimeTokenPage ref={servicesRef} userId={props.userId || randamUserId} />
        <ServicesPage ref={timetokenRef} userId={props.userId || randamUserId} />
      </div>
    </div>
  );
};

export default MicroCards;
