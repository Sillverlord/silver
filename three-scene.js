// Silversound — Three.js r186 scene, following threejs-fundamentals.
// A chrome-silver torus (the vinyl), a glowing violet ring, and silver
// particles, on the site's own colour scheme: midnight #07070c,
// silver #e8e8f2, violet #8f8fff, rose #ff8fb3 used sparingly.
import * as THREE from "three";

const canvas = document.querySelector("#scene");
if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07070c, 0.045);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0.6, 6);

  // Lights: cool white key, violet fill, soft ambient.
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x8f8fff, 1.2);
  fill.position.set(-4, -1, 3);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));

  const group = new THREE.Group();
  scene.add(group);

  // Chrome vinyl disc: a flat torus, silver and highly metallic.
  const disc = new THREE.Mesh(
    new THREE.TorusGeometry(1.35, 0.42, 24, 96),
    new THREE.MeshStandardMaterial({ color: 0xe8e8f2, metalness: 1, roughness: 0.18 })
  );
  disc.rotation.x = Math.PI / 2.6;
  group.add(disc);

  // Inner violet ring, emissive so it glows against the silver.
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.35, 0.05, 12, 96),
    new THREE.MeshStandardMaterial({ color: 0x8f8fff, emissive: 0x8f8fff, emissiveIntensity: 1.4, metalness: 0.4, roughness: 0.3 })
  );
  ring.rotation.x = Math.PI / 2.6;
  group.add(ring);

  // Small rose centre, used once as the accent.
  const centre = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 16),
    new THREE.MeshStandardMaterial({ color: 0xff8fb3, emissive: 0xff8fb3, emissiveIntensity: 0.7, metalness: 0.6, roughness: 0.25 })
  );
  group.add(centre);

  // Silver particles, spread in a wide disc.
  const count = 420;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.2 + Math.random() * 3.4;
    const a = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
    positions[i * 3 + 2] = Math.sin(a) * r - 1;
  }
  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particlesGeo,
    new THREE.PointsMaterial({ color: 0xc9c9d4, size: 0.035, transparent: true, opacity: 0.85 })
  );
  scene.add(particles);

  // Mouse parallax: the camera drifts gently toward the pointer.
  let targetX = 0;
  let targetY = 0;
  window.addEventListener("pointermove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.8;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  function resize() {
    const w = canvas.clientWidth || 600;
    const h = canvas.clientHeight || 320;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener("resize", resize);
  resize();

  const timer = new THREE.Timer();
  timer.connect(document);

  function animate() {
    timer.update();
    const t = timer.getElapsed();
    const dt = timer.getDelta();
    disc.rotation.z += dt * 0.35;
    ring.rotation.z -= dt * 0.5;
    group.position.y = Math.sin(t * 0.8) * 0.12;
    particles.rotation.y += dt * 0.04;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (0.6 - targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}
