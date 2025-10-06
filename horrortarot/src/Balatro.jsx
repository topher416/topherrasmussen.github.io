import { useEffect, useRef } from 'react';

import './Balatro.css';

function hexToVec4(hex) {
  let hexStr = hex.replace('#', '');
  let r = 0, g = 0, b = 0, a = 1;
  if (hexStr.length === 6) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
  } else if (hexStr.length === 8) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
    a = parseInt(hexStr.slice(6, 8), 16) / 255;
  }
  return [r, g, b, a];
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

#define PI 3.14159265359

uniform float iTime;
uniform vec3 iResolution;
uniform float uSpinRotation;
uniform float uSpinSpeed;
uniform vec2 uOffset;
uniform vec4 uColor1;
uniform vec4 uColor2;
uniform vec4 uColor3;
uniform float uContrast;
uniform float uLighting;
uniform float uSpinAmount;
uniform float uPixelFilter;
uniform float uSpinEase;
uniform bool uIsRotate;
uniform vec2 uMouse;

varying vec2 vUv;

vec4 effect(vec2 screenSize, vec2 screen_coords) {
    float pixel_size = length(screenSize.xy) / uPixelFilter;
    vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy) - uOffset;
    float uv_len = length(uv);
    
    float speed = (uSpinRotation * uSpinEase * 0.2);
    if(uIsRotate){
       speed = iTime * speed;
    }
    speed += 302.2;
    
    float mouseInfluence = (uMouse.x * 2.0 - 1.0);
    speed += mouseInfluence * 0.1;
    
    float new_pixel_angle = atan(uv.y, uv.x) + speed - uSpinEase * 20.0 * (uSpinAmount * uv_len + (1.0 - uSpinAmount));
    vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
    uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);
    
    uv *= 30.0;
    float baseSpeed = iTime * uSpinSpeed;
    speed = baseSpeed + mouseInfluence * 2.0;
    
    vec2 uv2 = vec2(uv.x + uv.y);
    
    for(int i = 0; i < 5; i++) {
        uv2 += sin(max(uv.x, uv.y)) + uv;
        uv += 0.5 * vec2(
            cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
            sin(uv2.x - 0.113 * speed)
        );
        uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
    }
    
    float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
    float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
    float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
    float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
    float c3p = 1.0 - min(1.0, c1p + c2p);
    float light = (uLighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + uLighting * max(c2p * 5.0 - 4.0, 0.0);
    
    return (0.3 / uContrast) * uColor1 + (1.0 - 0.3 / uContrast) * (uColor1 * c1p + uColor2 * c2p + vec4(c3p * uColor3.rgb, c3p * uColor1.a)) + light;
}

void main() {
    vec2 uv = vUv * iResolution.xy;
    gl_FragColor = effect(iResolution.xy, uv);
}
`;

export default function Balatro({
  spinRotation = -2.0,
  spinSpeed = 7.0,
  offset = [0.0, 0.0],
  color1 = '#4A1948', // Deep Amethyst/Purple
  color2 = '#004D40', // Muted Emerald/Teal
  color3 = '#1B1B1B', // Charcoal Black
  contrast = 3.5,
  lighting = 0.4,
  spinAmount = 0.25,
  pixelFilter = undefined, // if undefined, auto-scale to native 1px
  spinEase = 1.0,
  isRotate = false,
  mouseInteraction = true
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    // Minimal inline OGL replacements (Renderer, Program, Mesh, Triangle)
    class Renderer {
      constructor() {
        this.canvas = document.createElement('canvas');
        this.gl = this.canvas.getContext('webgl', { antialias: true, alpha: true });
        this.gl.clearColor(0, 0, 0, 1);
      }
      setSize(w, h) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.max(1, Math.floor(w * dpr));
        this.canvas.height = Math.max(1, Math.floor(h * dpr));
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      }
      render({ scene }) {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (scene && typeof scene.draw === 'function') scene.draw(gl);
      }
      get glContext() { return this.gl; }
    }

    class Program {
      constructor(gl, { vertex, fragment, uniforms }) {
        this.gl = gl;
        this.program = this._createProgram(gl, vertex, fragment);
        this.uniforms = uniforms || {};
        this._uniformLocations = {};
        this._initUniforms();
      }
      _compile(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const info = gl.getShaderInfoLog(shader);
          gl.deleteShader(shader);
          throw new Error('Shader compile error: ' + info);
        }
        return shader;
      }
      _createProgram(gl, vsSource, fsSource) {
        const vs = this._compile(gl, gl.VERTEX_SHADER, vsSource);
        const fs = this._compile(gl, gl.FRAGMENT_SHADER, fsSource);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const info = gl.getProgramInfoLog(program);
          gl.deleteProgram(program);
          throw new Error('Program link error: ' + info);
        }
        return program;
      }
      _initUniforms() {
        const gl = this.gl;
        gl.useProgram(this.program);
        Object.keys(this.uniforms).forEach(name => {
          this._uniformLocations[name] = gl.getUniformLocation(this.program, name);
          this._setUniform(name, this.uniforms[name].value);
        });
      }
      _setUniform(name, val) {
        const gl = this.gl;
        const loc = this._uniformLocations[name];
        if (!loc) return;
        if (typeof val === 'number') gl.uniform1f(loc, val);
        else if (typeof val === 'boolean') gl.uniform1i(loc, val ? 1 : 0);
        else if (Array.isArray(val)) {
          if (val.length === 2) gl.uniform2f(loc, val[0], val[1]);
          else if (val.length === 3) gl.uniform3f(loc, val[0], val[1], val[2]);
          else if (val.length === 4) gl.uniform4f(loc, val[0], val[1], val[2], val[3]);
        }
      }
      use() { this.gl.useProgram(this.program); }
      updateUniforms() {
        this.use();
        Object.keys(this.uniforms).forEach(name => this._setUniform(name, this.uniforms[name].value));
      }
    }

    class Triangle {
      constructor(gl) {
        this.gl = gl;
        // Fullscreen triangle
        const positions = new Float32Array([
          -1, -1,
           3, -1,
          -1,  3,
        ]);
        const uvs = new Float32Array([
          0, 0,
          2, 0,
          0, 2,
        ]);
        this.vao = gl.createVertexArray ? gl.createVertexArray() : null;
        if (this.vao) gl.bindVertexArray(this.vao);

        this.position = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        this.uv = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uv);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
      }
      bind(program) {
        const gl = this.gl;
        const posLoc = gl.getAttribLocation(program.program, 'position');
        const uvLoc = gl.getAttribLocation(program.program, 'uv');

        if (this.vao) gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.position);
        if (posLoc !== -1) {
          gl.enableVertexAttribArray(posLoc);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uv);
        if (uvLoc !== -1) {
          gl.enableVertexAttribArray(uvLoc);
          gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
        }
      }
    }

    class Mesh {
      constructor(gl, { geometry, program }) {
        this.gl = gl;
        this.geometry = geometry;
        this.program = program;
      }
      draw(gl) {
        this.program.updateUniforms();
        this.geometry.bind(this.program);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    }

    const renderer = new Renderer();
    const gl = renderer.glContext;
    gl.clearColor(0, 0, 0, 1);

    let program;

    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      if (program) {
        const w = gl.canvas.width;
        const h = gl.canvas.height;
        program.uniforms.iResolution.value = [w, h, w / h];
        // Auto pixel filter for native 1px sampling
        if (program.uniforms.uPixelFilter) {
          if (typeof pixelFilter === 'number' && Number.isFinite(pixelFilter)) {
            program.uniforms.uPixelFilter.value = pixelFilter;
          } else {
            const diag = Math.hypot(w, h);
            program.uniforms.uPixelFilter.value = diag; // yields pixel_size ~= 1
          }
        }
      }
    }
    window.addEventListener('resize', resize);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height]
        },
        uSpinRotation: { value: spinRotation },
        uSpinSpeed: { value: spinSpeed },
        uOffset: { value: offset },
        uColor1: { value: hexToVec4(color1) },
        uColor2: { value: hexToVec4(color2) },
        uColor3: { value: hexToVec4(color3) },
        uContrast: { value: contrast },
        uLighting: { value: lighting },
        uSpinAmount: { value: spinAmount },
        uPixelFilter: { value: (typeof pixelFilter === 'number' && Number.isFinite(pixelFilter)) ? pixelFilter : 1.0 },
        uSpinEase: { value: spinEase },
        uIsRotate: { value: isRotate },
        uMouse: { value: [0.5, 0.5] }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animationFrameId;

    function update(time) {
      animationFrameId = requestAnimationFrame(update);
      program.uniforms.iTime.value = time * 0.001;
      renderer.render({ scene: mesh });
    }
    animationFrameId = requestAnimationFrame(update);
    container.appendChild(gl.canvas);
    // Ensure uniforms reflect actual canvas size now that program exists
    resize();

    function handleMouseMove(e) {
      if (!mouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      program.uniforms.uMouse.value = [x, y];
    }
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      try { container.removeChild(gl.canvas); } catch (e) {}
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    spinRotation,
    spinSpeed,
    offset,
    color1,
    color2,
    color3,
    contrast,
    lighting,
    spinAmount,
    pixelFilter,
    spinEase,
    isRotate,
    mouseInteraction,
    containerRef
  ]);

  return <div ref={containerRef} className="balatro-container" />;
}
