import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GlobeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 5.5;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 1.5, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, 5, 0);
    scene.add(dirLight);

    // Wireframe Globe Mesh
    const globeGeom = new THREE.SphereGeometry(2, 30, 30);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    const globe = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globe);

    // Inner Crystal Mesh
    const crystalGeom = new THREE.IcosahedronGeometry(0.85, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x0891b2,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.6,
      thickness: 1.2,
      flatShading: true
    });
    const crystal = new THREE.Mesh(crystalGeom, crystalMat);
    scene.add(crystal);

    // Particles Cloud
    const particleCount = 1000;
    const particleCoords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1));
      const distance = THREE.MathUtils.randFloat(2.2, 4.2);
      
      particleCoords[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      particleCoords[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      particleCoords[i * 3 + 2] = distance * Math.cos(phi);
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.032,
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Mouse Tracking
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      // Normalize values between -1 and 1
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      // Spin & rotate meshes
      globe.rotation.y = time * 0.08 + mouse.x * 0.3;
      globe.rotation.x = time * 0.03 - mouse.y * 0.3;

      crystal.rotation.y = -time * 0.2;
      crystal.rotation.x = time * 0.12;
      crystal.position.y = Math.sin(time * 1.2) * 0.12;

      particles.rotation.y = time * 0.02 + mouse.x * 0.08;
      particles.rotation.x = -mouse.y * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      globeGeom.dispose();
      globeMat.dispose();
      crystalGeom.dispose();
      crystalMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
