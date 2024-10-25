import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './ThreeJSGraph.css';

const ThreeJSGraph = ({ data }) => {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data.length === 0) return;

    const mountNode = mountRef.current; // Store mountRef.current in a stable variable

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountNode.appendChild(renderer.domElement);

    // Orbit controls for zoom and pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.maxDistance = 500;
    controls.minDistance = 10;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50).normalize();
    scene.add(ambientLight, directionalLight);

    // Colors and graph lines
    const colorArray = [0x00ff00, 0xff0000, 0x0000ff, 0xffff00];
    data.forEach(({ startNode, endNode }, index) => {
      const startX = (startNode * Math.random() * 2) - 30;
      const startY = (startNode * Math.random() * 2) - 30;
      const startZ = (startNode * Math.random() * 2) - 30;
      const endX = (endNode * Math.random() * 2) - 30;
      const endY = (endNode * Math.random() * 2) - 30;
      const endZ = (endNode * Math.random() * 2) - 30;

      const material = new THREE.LineBasicMaterial({ color: colorArray[index % colorArray.length] });
      const points = [new THREE.Vector3(startX, startY, startZ), new THREE.Vector3(endX, endY, endZ)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });

    // Camera setup
    camera.position.set(0, 50, 100);
    controls.update();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    setIsLoading(false);

    // Custom white axes for X, Y, and Z
    const createAxis = (start, end) => {
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geometry, material);
    };
    // X, Y, Z axes
    scene.add(createAxis([-50, 0, 0], [50, 0, 0]));
    scene.add(createAxis([0, -50, 0], [0, 50, 0]));
    scene.add(createAxis([0, 0, -50], [0, 0, 50]));

    // Cleanup function
    return () => {
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [data]);

  return (
    <div className="graph-container">
      {isLoading && <div className="loading-spinner">Loading 3D Graph...</div>}
      <div ref={mountRef} className="three-js-mount"></div>
    </div>
  );
};

export default ThreeJSGraph;
