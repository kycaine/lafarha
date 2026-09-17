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
    renderer.setClearColor(0x000000, 0); // transparent
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 4.5, 10);
    camera.lookAt(0, 0, 0);

    // ── Wave plane ────────────────────────────────────────────────────────────
    const SEGS = 120; // resolution
    const SIZE = 22;
    const geo  = new THREE.PlaneGeometry(SIZE, SIZE, SEGS, SEGS);
    geo.rotateX(-Math.PI / 2); // lay flat

    // Store original y positions (all 0 before displacement)
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const count   = posAttr.count;
    const origPos = new Float32Array(posAttr.array);

    // ── Material — subtle gold wireframe ──────────────────────────────────────
    const mat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      wireframe: true,
      transparent: true,
      opacity: 0.10,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Second layer — slightly thicker lines, lower opacity, slightly smaller
    const geo2  = new THREE.PlaneGeometry(SIZE * 0.7, SIZE * 0.7, SEGS >> 1, SEGS >> 1);
    geo2.rotateX(-Math.PI / 2);
    const posAttr2 = geo2.attributes.position as THREE.BufferAttribute;
    const count2   = posAttr2.count;
    const origPos2 = new Float32Array(posAttr2.array);
    const mat2  = new THREE.MeshBasicMaterial({
      color: 0x8b6914,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const mesh2 = new THREE.Mesh(geo2, mat2);
    mesh2.position.y = -0.1;
    scene.add(mesh2);

    // ── Mouse influence ───────────────────────────────────────────────────────
    let targetMX = 0; // -1 to 1
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

      // Smooth mouse follow
      currentMX += (targetMX - currentMX) * 0.03;
      currentMY += (targetMY - currentMY) * 0.03;

      // Displace vertices of layer 1
      for (let i = 0; i < count; i++) {
        const ox = origPos[i * 3];
        const oz = origPos[i * 3 + 2];

        // Multi-wave displacement: main wave + ripple + mouse push
        const wave1 = Math.sin(ox * 0.45 + t * 0.55) * 0.55;
        const wave2 = Math.cos(oz * 0.40 + t * 0.42) * 0.40;
        const wave3 = Math.sin((ox + oz) * 0.30 + t * 0.32) * 0.30;

        // Mouse proximity bulge — vertices near mouse cursor rise slightly
        const dx = ox / (SIZE / 2) - currentMX * 0.8;
        const dz = oz / (SIZE / 2) + currentMY * 0.5;
        const dist  = Math.sqrt(dx * dx + dz * dz);
        const mouse = Math.exp(-dist * dist * 1.4) * 1.2;

        posAttr.setY(i, wave1 + wave2 + wave3 + mouse);
      }
      posAttr.needsUpdate = true;

      // Displace vertices of layer 2 — slower, offset phase
      for (let i = 0; i < count2; i++) {
        const ox = origPos2[i * 3];
        const oz = origPos2[i * 3 + 2];
        const wave1 = Math.sin(ox * 0.35 + t * 0.38 + 1.2) * 0.60;
        const wave2 = Math.cos(oz * 0.30 + t * 0.30 + 0.7) * 0.45;
        posAttr2.setY(i, wave1 + wave2);
      }
      posAttr2.needsUpdate = true;

      // Subtle camera drift with mouse
      camera.position.x += (currentMX * 0.8 - camera.position.x) * 0.02;
      camera.position.z += (10 - currentMY * 0.5 - camera.position.z) * 0.02;
      camera.lookAt(0, 0.5, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      geo2.dispose();
      mat2.dispose();
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
    />
  );
}
