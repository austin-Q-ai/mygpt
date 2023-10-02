import { useRouter } from "next/router";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { useLocale } from "@calcom/lib/hooks/useLocale";

import addLight from "./addLight";
import generateTexture from "./generateTexture";

type NavigationItemType = {
  name: string;
  href: string;
};

const navigation: NavigationItemType[] = [
  {
    name: "insights",
    href: "/insights",
  },
  {
    name: "event_types_page_title",
    href: "/event-types",
  },
  {
    name: "timetokens_wallet",
    href: "/timetokens-wallet",
  },
  {
    name: "teams",
    href: "/teams",
  },
  {
    name: "bookings",
    href: "/bookings/upcoming",
  },
  {
    name: "availability",
    href: "/availability",
  },
];

export const CubeMenu: React.FC = () => {
  const router = useRouter();
  const { t } = useLocale();

  const sceneRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const sceneElement = sceneRef.current;

    const sizes: {
      width: number;
      height: number;
    } = {
      width: window.innerWidth > 768 ? window.innerWidth * 0.3 : window.innerWidth * 0.9,
      height: window.innerHeight * 0.75,
    };

    let mousemove = false;

    if (!sceneElement) return;

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.x = -20;
    camera.position.y = 15;
    camera.position.z = 25;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    sceneElement.appendChild(renderer.domElement);

    addLight(scene);

    // Create cube
    const geometry = new THREE.BoxGeometry(15, 15, 15);
    const material = generateTexture(
      navigation.map((item) => {
        return t(item.name);
      })
    );
    // const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Create OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.update();

    // Add raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Animation function
    const animate = () => {
      // Render scene with camera
      renderer.render(scene, camera);

      // Update orbitcontrols
      controls.update();

      // Call animate() again on the next frame
      requestRef.current = requestAnimationFrame(animate);
    };

    // Mouse move event listener
    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouse.x = (event.offsetX / sizes.width) * 2 - 1;
      mouse.y = -(event.offsetY / sizes.height) * 2 + 1;

      mousemove = true;
      //   raycaster.setFromCamera(mouse, camera);
      //   const intersects = raycaster.intersectObject(cube);

      //   if (intersects.length > 0) {
      //     const face = intersects[0].face; // this is the face being hovered
      //     console.log("You rolled over the cube face with color index: ", face.materialIndex);
      //   }
    };

    // Mouse up event listener
    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault();

      if (mousemove) return;

      mouse.x = (event.offsetX / sizes.width) * 2 - 1;
      mouse.y = -(event.offsetY / sizes.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cube);

      if (intersects.length > 0) {
        const face = intersects[0].face; // this is the face being hovered
        console.log("You rolled over the cube face with color index: ", navigation[face.materialIndex].href);
        router.push(navigation[face.materialIndex].href);
      }
    };

    // Mouse down event listener
    const handleMouseDown = (event: MouseEvent) => {
      mousemove = false;
    };

    // Call animate() to start the animation loop
    requestRef.current = requestAnimationFrame(animate);

    renderer.domElement.addEventListener("pointermove", handleMouseMove);
    renderer.domElement.addEventListener("pointerdown", handleMouseDown);
    renderer.domElement.addEventListener("pointerup", handleMouseUp);

    // Clean up function
    return () => {
      // Stop the animation loop when the component is unmounted
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      renderer.domElement.removeEventListener("pointermove", handleMouseMove);
      renderer.domElement.removeEventListener("pointerdown", handleMouseDown);
      renderer.domElement.removeEventListener("pointerup", handleMouseUp);
    };
  }, []);

  return <div ref={sceneRef} className="flex w-full items-center justify-center" />;
};
