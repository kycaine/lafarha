"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0xffffff, 0); 
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf4ebd8, 0.04); // Sand storm fog

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 3, 14);
    camera.lookAt(0, 0, 0);

    // ── Lighting ──────────────────────────────────────────────────────────────
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
    hemiLight.color.setHSL(0.1, 0.2, 0.9);
    hemiLight.groundColor.setHSL(0.095, 0.5, 0.5);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffeeba, 1.2);
    dirLight.position.set(-15, 8, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    scene.add(dirLight);

    // ── Desert Terrain (Plane) ────────────────────────────────────────────────
    const SEGS = 80; // Resolution
    const SIZE = 40;
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGS, SEGS);
    geo.rotateX(-Math.PI / 2);

    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const count = posAttr.count;
    const origPos = new Float32Array(posAttr.array);

    const mat = new THREE.MeshStandardMaterial({
      color: 0xd2b48c, // Sand color
      roughness: 1.0,
      metalness: 0.05,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -2;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);

    // ── Dust Particles ────────────────────────────────────────────────────────
    const dustCount = 800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
        dustPos[i] = (Math.random() - 0.5) * SIZE;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
        color: 0xffeedd,
        size: 0.06,
        transparent: true,
        opacity: 0.5,
        blending: THREE.NormalBlending
    });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    scene.add(dustSystem);

    // ── Mouse influence ───────────────────────────────────────────────────────
    let targetMX = 0;
    let targetMY = 0;
    let currentMX = 0;
    let currentMY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetMY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      currentMX += (targetMX - currentMX) * 0.03;
      currentMY += (targetMY - currentMY) * 0.03;

      // Animate dunes (shifting sands)
      for (let i = 0; i < count; i++) {
        const ox = origPos[i * 3];
        const oz = origPos[i * 3 + 2];

        // Combine waves for organic dunes moving very slowly
        const wave1 = Math.sin(ox * 0.15 + oz * 0.1 + t * 0.1) * 1.8;
        const wave2 = Math.sin(ox * 0.08 - oz * 0.15 + t * 0.08) * 1.5;
        const wave3 = Math.cos(ox * 0.3 + oz * 0.2 + t * 0.15) * 0.4;

        posAttr.setY(i, wave1 + wave2 + wave3);
      }
      posAttr.needsUpdate = true;
      // Recompute normals so lighting reacts to the shifting sand
      geo.computeVertexNormals();

      // Animate dust particles to simulate desert wind
      const positions = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
          positions[i * 3] -= 0.06; // Wind blowing left
          positions[i * 3 + 2] += 0.02; // Drifting slightly forward
          
          // Reset particles that blow out of bounds
          if (positions[i * 3] < -SIZE/2) {
              positions[i * 3] = SIZE/2;
              positions[i * 3 + 1] = (Math.random() - 0.5) * 6; // Height variation
              positions[i * 3 + 2] = (Math.random() - 0.5) * SIZE;
          }
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Subtle camera drift
      camera.position.x += (currentMX * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (3 + currentMY * 0.8 - camera.position.y) * 0.02;
      camera.lookAt(0, -1, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    >
      {/* Optional: Add a smooth fade at the bottom so it blends with white background seamlessly */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent opacity-100 z-10 pointer-events-none" />
    </div>
  );
}
