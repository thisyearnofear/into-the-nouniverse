import * as THREE from "three";

export function initParticles() {
  // Create canvas container
  const particleContainer = document.createElement("div");
  particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
    `;
  document.body.prepend(particleContainer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  particleContainer.appendChild(renderer.domElement);

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 15;
    posArray[i + 1] = (Math.random() - 0.5) * 15;
    posArray[i + 2] = (Math.random() - 0.5) * 15;

    colors[i] = Math.random() * 0.5 + 0.5;
    colors[i + 1] = Math.random() * 0.5 + 0.5;
    colors[i + 2] = Math.random();
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  camera.position.z = 5;

  // Create nebula effect
  const nebulaGeometry = new THREE.BufferGeometry();
  const nebulaCount = 50;
  const nebulaPositions = new Float32Array(nebulaCount * 3);
  const nebulaSizes = new Float32Array(nebulaCount);

  for (let i = 0; i < nebulaCount * 3; i += 3) {
    nebulaPositions[i] = (Math.random() - 0.5) * 15;
    nebulaPositions[i + 1] = (Math.random() - 0.5) * 15;
    nebulaPositions[i + 2] = (Math.random() - 0.5) * 15;
    nebulaSizes[i / 3] = Math.random() * 0.1 + 0.05;
  }

  nebulaGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(nebulaPositions, 3)
  );
  nebulaGeometry.setAttribute(
    "size",
    new THREE.BufferAttribute(nebulaSizes, 1)
  );

  // Create nebula shader material
  const nebulaMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0x4ecdc4) },
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = vec3(0.2, 0.5, 1.0);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float r = distance(gl_PointCoord, vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, r);
        gl_FragColor = vec4(vColor, alpha * 0.5);
      }
    `,
  });

  const nebulaMesh = new THREE.Points(nebulaGeometry, nebulaMaterial);
  scene.add(nebulaMesh);

  // Create light rays div
  const lightRays = document.createElement("div");
  lightRays.className = "light-rays";
  document.body.prepend(lightRays);

  // Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return {
    renderer,
    scene,
    camera,
    particlesMesh,
    nebulaMesh,
    nebulaMaterial,
  };
}
