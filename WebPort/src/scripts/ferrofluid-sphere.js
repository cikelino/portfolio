import * as THREE from 'three'

// Ferrofluid Sphere — porting fedele di drdr.html (Three.js r128)
// Sfera con spikes via Worley noise nel vertex shader, attrazione magnetica
// verso il cursore, respiro automatico e rotazione lenta.
const ENV_URL = '/ferrofluid/env-sphere.jpg'

export function initFerrofluidSphere(canvas) {
  if (!canvas) return

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0) // canvas trasparente: resta solo la sfera

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0, 6.2)

  const envTex = new THREE.TextureLoader().load(ENV_URL)
  envTex.wrapS = THREE.RepeatWrapping
  envTex.wrapT = THREE.ClampToEdgeWrapping
  envTex.minFilter = THREE.LinearFilter
  envTex.magFilter = THREE.LinearFilter

  const RADIUS = 1.0

  const vertexShader = `
    uniform float u_time, u_amp, u_radius, u_pointerStrength, u_agitation;
    uniform vec3  u_pointerDir;   // direzione del cursore sulla sfera
    uniform vec3  u_magnetPos;    // posizione del "magnete" (cursore) sopra la superficie
    varying vec3 v_worldPos;
    varying vec3 v_worldNormal;

    vec3 hash3(vec3 p){
      p = vec3(dot(p,vec3(127.1,311.7,74.7)),
               dot(p,vec3(269.5,183.3,246.1)),
               dot(p,vec3(113.5,271.9,124.6)));
      return fract(sin(p)*43758.5453123);
    }
    float worleyF1(vec3 x, float t){
      vec3 p = floor(x);
      vec3 f = fract(x);
      float d = 8.0;
      for(int k=-1;k<=1;k++)
      for(int j=-1;j<=1;j++)
      for(int i=-1;i<=1;i++){
        vec3 b = vec3(float(i),float(j),float(k));
        vec3 o = hash3(p+b);
        o = 0.5 + 0.5*sin(t + 6.2831853*o);
        vec3 r = b + o - f;
        d = min(d, dot(r,r));
      }
      return sqrt(d);
    }

    // forza del magnete in questa direzione (stretta = puntamento preciso)
    float magnetInfluence(vec3 dir){
      float pd = max(dot(dir, u_pointerDir), 0.0);
      return pow(pd, 3.0) * u_pointerStrength;
    }

    float spikeField(vec3 dir){
      float t = u_time*0.5;
      float f1 = worleyF1(dir*3.5, t);
      float cone = pow(clamp(1.0 - f1*1.4, 0.0, 1.0), 3.0);
      float f2 = worleyF1(dir*6.8 + 7.0, t*1.2);
      float bump = pow(clamp(1.0 - f2*1.3, 0.0, 1.0), 2.0);

      // il magnete alza le punte vicino al cursore (un po' piu' largo del puntamento)
      float pd = max(dot(dir, u_pointerDir), 0.0);
      float magnet = pow(pd, 2.5) * u_pointerStrength;
      float drive = clamp(max(u_agitation, magnet), 0.0, 1.0);

      float rest   = bump * 0.05;
      float spikes = cone * drive;
      return (rest + spikes) * u_amp;
    }

    vec3 displace(vec3 dir){
      vec3 base = dir * u_radius;       // base della punta sulla superficie
      float h   = spikeField(dir);      // altezza della punta
      // direzione di crescita: radiale, piegata verso il magnete = ATTRAZIONE
      float lean = clamp(magnetInfluence(dir), 0.0, 1.0);
      vec3 toMagnet = normalize(u_magnetPos - base);
      vec3 growDir  = normalize(mix(dir, toMagnet, lean * 0.45));
      return base + growDir * h;
    }

    void main(){
      vec3 dir = normalize(position);
      vec3 P = displace(dir);
      vec3 ref = abs(dir.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0);
      vec3 t1 = normalize(cross(ref, dir));
      vec3 t2 = cross(dir, t1);
      float e = 0.006;
      vec3 Pa = displace(normalize(dir + t1*e));
      vec3 Pb = displace(normalize(dir + t2*e));
      vec3 n = normalize(cross(Pa - P, Pb - P));

      vec4 wp = modelMatrix * vec4(P, 1.0);
      v_worldPos = wp.xyz;
      v_worldNormal = normalize(mat3(modelMatrix) * n);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `

  const fragmentShader = `
    precision highp float;
    uniform sampler2D u_env;
    varying vec3 v_worldPos;
    varying vec3 v_worldNormal;
    #define PI 3.14159265359
    float powFast(float a, float b){ return a/((1.0-b)*a+b); }
    vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){ return a+b*cos(6.28318*(c*t+d)); }
    vec3 sampleEnv(vec3 R){
      float phi = atan(R.z, R.x);
      float theta = acos(clamp(R.y, -1.0, 1.0));
      return texture2D(u_env, vec2(-phi/(2.0*PI), theta/PI)).rgb;
    }
    void main(){
      vec3 V = normalize(cameraPosition - v_worldPos);
      vec3 N = normalize(v_worldNormal);
      vec3 L = normalize(vec3(2.0, 1.0, 1.0));
      vec3 R = reflect(L, N);
      float specularValue = powFast(max(0.0, dot(R, -V)), 50.0);
      vec3 ambient = max(sampleEnv(R), sampleEnv(reflect(-V, N)));
      float ft = clamp(dot(N, V), 0.0, 1.0);
      float fresnelValue = pow(1.0 - ft, 2.5);
      vec3 fresnel = fresnelValue * vec3(0.9, 1.0, 1.0);
      vec3 a=vec3(0.5), b=vec3(0.5), c=vec3(1.0), d=vec3(0.0,0.33,0.67);
      vec3 iridescence = palette(ft*3.0, a, b, c, d) * (1.0 - ft) * 0.05;
      vec3 color = ambient*0.55 + fresnel*0.3 + specularValue*1.2 + iridescence;
      gl_FragColor = vec4(color, 1.0);
    }
  `

  const uniforms = {
    u_time:            { value: 0 },
    u_amp:             { value: 0.5 },
    u_radius:          { value: RADIUS },
    u_env:             { value: envTex },
    u_agitation:       { value: 0.0 },
    u_pointerDir:      { value: new THREE.Vector3(0,1,0) },
    u_magnetPos:       { value: new THREE.Vector3(0,1.35,0) },
    u_pointerStrength: { value: 0.0 }
  }

  const geometry = new THREE.IcosahedronGeometry(1, 48)
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
  const sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)

  const raycaster = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const hitSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 1.5)
  const MAGNET_HEIGHT = 0.35 // quanto "fluttua" il magnete sopra la superficie
  let pointerTarget = 0, dragging = false, lastX = 0, lastY = 0

  function updatePointer(cx, cy){
    const rect = renderer.domElement.getBoundingClientRect()
    ndc.x =  ((cx - rect.left)/rect.width)*2 - 1
    ndc.y = -((cy - rect.top)/rect.height)*2 + 1
    raycaster.setFromCamera(ndc, camera)
    const hit = new THREE.Vector3()
    if (raycaster.ray.intersectSphere(hitSphere, hit)) {
      const localDir = hit.clone().normalize().applyQuaternion(sphere.quaternion.clone().invert())
      uniforms.u_pointerDir.value.copy(localDir)
      // il magnete sta poco sopra la superficie, nella direzione del cursore
      uniforms.u_magnetPos.value.copy(localDir).multiplyScalar(RADIUS + MAGNET_HEIGHT)
      pointerTarget = 1
    } else { pointerTarget = 0 }
  }
  canvas.addEventListener('pointerdown', (e)=>{ dragging=true; lastX=e.clientX; lastY=e.clientY; canvas.setPointerCapture(e.pointerId) })
  canvas.addEventListener('pointermove', (e)=>{
    updatePointer(e.clientX, e.clientY)
    if (dragging){
      sphere.rotation.y += (e.clientX-lastX)*0.005
      sphere.rotation.x += (e.clientY-lastY)*0.005
      lastX=e.clientX; lastY=e.clientY
    }
  })
  const endDrag=()=>{ dragging=false }
  canvas.addEventListener('pointerup', endDrag)
  canvas.addEventListener('pointercancel', endDrag)
  canvas.addEventListener('pointerleave', ()=>{ pointerTarget=0 })

  // respiro automatico: l'agitazione sale e scende lentamente, sempre, senza mouse
  const BREATH_SPEED = 0.55   // ~11s a ciclo (piu' basso = piu' lento)
  const BREATH_MIN   = 0.0    // quasi liscia
  const BREATH_MAX   = 1.0    // tutti gli spuntoni
  let overrideLevel  = 0.0

  window.ferrofluid = {
    setAgitation(v){ overrideLevel = Math.max(0, Math.min(1, v)) },
    get agitation(){ return uniforms.u_agitation.value }
  }

  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w/h; camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', resize)
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas)
  resize()

  let sphereVisible = true
  new IntersectionObserver(([e]) => { sphereVisible = e.isIntersecting }, { threshold: 0.05 }).observe(canvas)

  const clock = new THREE.Clock()
  function animate(){
    requestAnimationFrame(animate)
    if (!sphereVisible) return
    const dt = clock.getDelta()
    uniforms.u_time.value += dt

    const breath = 0.5 - 0.5*Math.cos(uniforms.u_time.value * BREATH_SPEED)
    const target = Math.max(BREATH_MIN + breath*(BREATH_MAX - BREATH_MIN), overrideLevel)
    uniforms.u_agitation.value += (target - uniforms.u_agitation.value) * 0.08

    const s = uniforms.u_pointerStrength
    s.value += (pointerTarget - s.value)*0.1

    if (!dragging) sphere.rotation.y += dt*0.15
    renderer.render(scene, camera)
  }
  animate()
}
