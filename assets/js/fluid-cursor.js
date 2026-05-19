/**
 * WebGL fluid cursor — condensed from WebGL-Fluid-Simulation (MIT, Pavel Dobryakov).
 * 烟雾模式：随机扩散云 + 速度驱动可见度；越快注入时消散也越快。
 *
 * 参数说明见 index.html 底部 FLUID_CONFIG。
 */
class FluidCursor {
  constructor(canvas, options = {}) {
    if (!canvas || window.matchMedia('(pointer: coarse)').matches) return;

    this.canvas = canvas;
    this.smoothSpeedFactor = 0;
    this.config = {
      simResolution: options.simResolution ?? 128,
      dyeResolution: options.dyeResolution ?? 768,
      densityDissipation: options.densityDissipation ?? 0.85,
      velocityDissipation: options.velocityDissipation ?? 0.88,
      dissipationSpeedBoost: options.dissipationSpeedBoost ?? 0.12,
      pressure: options.pressure ?? 0.8,
      pressureIterations: options.pressureIterations ?? 20,
      curl: options.curl ?? 32,
      splatRadius: options.splatRadius ?? 0.0022,
      splatForce: options.splatForce ?? 700,
      speedSlow: options.speedSlow ?? 1.5,
      speedFast: options.speedFast ?? 40,
      splatIntensity: options.splatIntensity ?? 0.42,
      smokeSpread: options.smokeSpread ?? 0.0042,
      smokeInnerHole: options.smokeInnerHole ?? 0.58,
      smokePuffsMax: options.smokePuffsMax ?? 9,
      speedMinFactor: options.speedMinFactor ?? 0.18,
      color: options.color ?? [0.6, 0.2, 0.8],
      transparent: options.background === 'transparent',
    };

    const { gl, ext } = this.getWebGLContext(canvas);
    if (!gl) {
      console.warn('[FluidCursor] WebGL 不可用，特效已跳过');
      return;
    }
    this.gl = gl;
    this.ext = ext;

    this.pointer = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      moved: false,
      speedPx: 0,
    };

    this.initShaders();
    this.initFramebuffers();
    this.resize();
    this.bind();
    this.update();
  }

  getWebGLContext(canvas) {
    const params = { alpha: true, depth: false, stencil: false, antialias: false };
    let gl = canvas.getContext('webgl2', params);
    const isWebGL2 = !!gl;
    if (!isWebGL2) gl = canvas.getContext('webgl', params);

    let halfFloat, supportLinearFiltering;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }

    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
    const formatRGBA = this.getSupportedFormat(gl, isWebGL2, gl.RGBA, halfFloatTexType);
    const formatRG = this.getSupportedFormat(gl, isWebGL2, gl.RGBA, halfFloatTexType);
    const formatR = this.getSupportedFormat(gl, isWebGL2, gl.RGBA, halfFloatTexType);

    return {
      gl,
      ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering },
    };
  }

  getSupportedFormat(gl, isWebGL2, fallback, type) {
    if (isWebGL2) {
      return { internalFormat: gl.RGBA16F, format: gl.RGBA };
    }
    return { internalFormat: gl.RGBA, format: gl.RGBA, type };
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  createProgram(vs, fs) {
    const gl = this.gl;
    const program = gl.createProgram();
    gl.attachShader(program, this.compileShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, this.compileShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    return program;
  }

  initShaders() {
    const baseVertex = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const splatFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point;
        p.x *= aspectRatio;
        float d2 = dot(p, p);
        vec3 splat = exp(-d2 * d2 / (radius * radius * 0.5)) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
      }
    `;

    const divergenceFrag = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const pressureFrag = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float div = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractFrag = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    const curlFrag = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityFrag = `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const displayFrag = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      uniform float uTime;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main () {
        vec2 px = texelSize * 2.2;
        vec3 c  = texture2D(uTexture, vUv).rgb;
        float lumL = dot(texture2D(uTexture, vUv - vec2(px.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
        float lumR = dot(texture2D(uTexture, vUv + vec2(px.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
        float lumT = dot(texture2D(uTexture, vUv + vec2(0.0, px.y)).rgb, vec3(0.299, 0.587, 0.114));
        float lumB = dot(texture2D(uTexture, vUv - vec2(0.0, px.y)).rgb, vec3(0.299, 0.587, 0.114));
        float lum = dot(c, vec3(0.299, 0.587, 0.114));
        float edge = length(vec2(lumR - lumL, lumT - lumB)) * 12.0;

        float n1 = hash(vUv * 420.0 + uTime * 0.15);
        float n2 = hash(vUv * 180.0 - uTime * 0.08);
        float edgeRand = 0.015 + n1 * 0.045 + n2 * 0.025;
        float coreRand = 0.12 + n2 * 0.18;

        float softLum = lum / (1.0 + lum * 6.5);
        float coreDim = smoothstep(0.1, 0.028, lum);
        float hotCut = 1.0 - smoothstep(0.055, 0.16, lum);

        float puff = smoothstep(edgeRand, edgeRand + 0.032, softLum);
        puff *= smoothstep(coreRand, 0.012, softLum);
        puff *= coreDim * hotCut;
        float fray = smoothstep(0.02, 0.18, edge) * (0.55 + n1 * 0.45);
        float mask = max(puff, fray * 0.7);

        vec2 grad = vec2(lumR - lumL, lumT - lumB);
        float gLen = length(grad) + 1e-4;
        vec2 n = grad / gLen;
        float ca = 0.003 + softLum * 0.012;
        vec3 samp;
        samp.r = texture2D(uTexture, vUv + n * ca * 1.4).r;
        samp.g = texture2D(uTexture, vUv).g;
        samp.b = texture2D(uTexture, vUv - n * ca * 1.4).b;

        float hue = atan(samp.b - samp.g, samp.r - samp.b);
        hue += softLum * 14.0 + edge * 3.5 + uTime * 0.9 + vUv.x * 18.0 + vUv.y * 12.0 + n1 * 5.0;
        vec3 rainbow = 0.48 + 0.58 * cos(vec3(0.0, 2.094, 4.188) + hue * 2.2);
        float dyeAtten = 1.0 - smoothstep(0.04, 0.22, lum);
        vec3 dye = samp * 1.6 * dyeAtten;
        vec3 col = rainbow * softLum * 2.8 + dye + fray * rainbow * 0.35;
        float colLum = dot(col, vec3(0.299, 0.587, 0.114));
        col *= min(1.0, 0.7 / max(colLum, 0.001));
        float a = mask * 0.32 * hotCut * (0.3 + 0.7 * coreDim);
        gl_FragColor = vec4(col, a);
      }
    `;

    this.splatProgram = this.createProgram(baseVertex, splatFrag);
    this.advectionProgram = this.createProgram(baseVertex, advectionFrag);
    this.divergenceProgram = this.createProgram(baseVertex, divergenceFrag);
    this.pressureProgram = this.createProgram(baseVertex, pressureFrag);
    this.gradientSubtractProgram = this.createProgram(baseVertex, gradientSubtractFrag);
    this.curlProgram = this.createProgram(baseVertex, curlFrag);
    this.vorticityProgram = this.createProgram(baseVertex, vorticityFrag);
    this.displayProgram = this.createProgram(baseVertex, displayFrag);

    const gl = this.gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    this.quad = { vbo: buffer };
  }

  createFBO(w, h, internalFormat, format, type, filter) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return { texture, fbo, width: w, height: h, attach(id) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    }};
  }

  createDoubleFBO(w, h, internalFormat, format, type, filter) {
    let fbo1 = this.createFBO(w, h, internalFormat, format, type, filter);
    let fbo2 = this.createFBO(w, h, internalFormat, format, type, filter);
    return {
      width: w,
      height: h,
      read: fbo1,
      write: fbo2,
      swap() {
        const t = this.read;
        this.read = this.write;
        this.write = t;
      },
    };
  }

  initFramebuffers() {
    const gl = this.gl;
    const { formatRGBA, halfFloatTexType } = this.ext;
    const filtering = this.ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    const type = halfFloatTexType || gl.UNSIGNED_BYTE;
    const iw = formatRGBA.internalFormat;
    const fmt = formatRGBA.format;

    const sim = this.getResolution(this.config.simResolution);
    const dye = this.getResolution(this.config.dyeResolution);

    this.velocity = this.createDoubleFBO(sim.width, sim.height, iw, fmt, type, filtering);
    this.divergence = this.createFBO(sim.width, sim.height, iw, fmt, type, filtering);
    this.pressure = this.createDoubleFBO(sim.width, sim.height, iw, fmt, type, filtering);
    this.curl = this.createFBO(sim.width, sim.height, iw, fmt, type, filtering);
    this.dye = this.createDoubleFBO(dye.width, dye.height, iw, fmt, type, filtering);
    this.texelSize = { x: 1 / sim.width, y: 1 / sim.height };
    this.dyeTexelSize = { x: 1 / dye.width, y: 1 / dye.height };
  }

  getResolution(resolution) {
    const aspect = this.canvas.width / Math.max(this.canvas.height, 1);
    let w = resolution;
    let h = resolution;
    if (aspect > 1) h = Math.round(resolution / aspect);
    else w = Math.round(resolution * aspect);
    return { width: w, height: h };
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(innerWidth * dpr);
    this.canvas.height = Math.floor(innerHeight * dpr);
    this.canvas.style.width = `${innerWidth}px`;
    this.canvas.style.height = `${innerHeight}px`;
    this.aspect = this.canvas.width / this.canvas.height;
  }

  bind() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initFramebuffers();
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      const vx = x - this.pointer.x;
      const vy = y - this.pointer.y;
      const fromMovement = Math.hypot(e.movementX, e.movementY);
      const fromDelta = Math.hypot(vx * rect.width, vy * rect.height);
      this.pointer.speedPx = fromMovement || fromDelta;
      this.pointer.dx = vx;
      this.pointer.dy = vy;
      this.pointer.x = x;
      this.pointer.y = y;
      this.pointer.moved = true;
      const f = this.speedFactor(this.pointer.speedPx);
      this.smoothSpeedFactor += (f - this.smoothSpeedFactor) * 0.4;
    });
  }

  blit(target, clear = false) {
    const gl = this.gl;
    if (target == null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    }
    if (clear) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  draw(program, uniforms, target, clear) {
    const gl = this.gl;
    gl.useProgram(program);
    const posLoc = gl.getAttribLocation(program, 'aPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad.vbo);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    Object.entries(uniforms).forEach(([key, val]) => {
      const loc = gl.getUniformLocation(program, key);
      if (val === null || val === undefined) return;
      if (typeof val === 'number') gl.uniform1f(loc, val);
      else if (val.length === 2) gl.uniform2f(loc, val[0], val[1]);
      else if (val.length === 3) gl.uniform3f(loc, val[0], val[1], val[2]);
      else if (typeof val === 'object' && val.texture !== undefined) {
        gl.uniform1i(loc, val.unit);
        gl.activeTexture(gl.TEXTURE0 + val.unit);
        gl.bindTexture(gl.TEXTURE_2D, val.texture);
      }
    });

    this.blit(target, clear);
  }

  splatCircle(x, y, dx, dy, color, radiusMul = 1) {
    const c = this.config;
    const r = c.splatRadius * radiusMul;
    const base = {
      aspectRatio: this.aspect,
      point: [x, y],
      radius: r,
    };

    this.draw(this.splatProgram, {
      ...base,
      uTarget: { texture: this.velocity.read.texture, unit: 0 },
      color: [dx, dy, 0],
    }, this.velocity.write, false);
    this.velocity.swap();

    this.draw(this.splatProgram, {
      ...base,
      uTarget: { texture: this.dye.read.texture, unit: 0 },
      radius: r * (0.85 + Math.random() * 0.35),
      color,
    }, this.dye.write, false);
    this.dye.swap();
  }

  /** 越快消散系数越低（消失越快），抵消快划时注入更多染料的问题 */
  getDissipation() {
    const c = this.config;
    const f = this.smoothSpeedFactor;
    const boost = c.dissipationSpeedBoost * f;
    return {
      dye: Math.max(0.91, c.densityDissipation - boost),
      vel: Math.max(0.9, c.velocityDissipation - boost * 0.65),
    };
  }

  /** 0 = 慢速无效果，1 = 快速最明显（四次方，慢速更干净） */
  speedFactor(speedPx) {
    const { speedSlow, speedFast } = this.config;
    if (speedPx <= speedSlow) return 0;
    const t = Math.min((speedPx - speedSlow) / (speedFast - speedSlow), 1);
    const s = t * t * (3 - 2 * t);
    return s * s;
  }

  splatSmokeBurst(x, y, vx, vy, speedPx) {
    const factor = this.speedFactor(speedPx);
    const c = this.config;
    if (factor < c.speedMinFactor) return;

    const force = c.splatForce * factor * factor;
    const dx = vx * force;
    const dy = vy * force;
    const t = performance.now() * 0.001;
    const baseHue = (t * 0.3 + x * 1.7 + y * 1.3) % 1;

    const spread = c.smokeSpread * (0.35 + factor * 0.85);
    const inner = spread * c.smokeInnerHole;
    const count = Math.max(1, Math.ceil(factor * factor * c.smokePuffsMax));
    const perPuffGain = (c.splatIntensity * factor * factor * factor) / Math.sqrt(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = inner + Math.pow(Math.random(), 0.55) * (spread - inner);
      const jx = x + Math.cos(angle) * dist;
      const jy = y + Math.sin(angle) * dist;
      const distNorm = dist / Math.max(spread, 1e-6);
      const radiusMul = (0.28 + Math.random() * 0.75) * (0.45 + distNorm * 0.85);
      const hue = (baseHue + i * 0.11 + Math.random() * 0.85) % 1;
      const rgb = this.hslToRgb(
        hue,
        0.72 + Math.random() * 0.26,
        0.48 + Math.random() * 0.12
      );
      const col = rgb.map((v) => v * perPuffGain * (0.85 + Math.random() * 0.35));
      const swirl = (Math.random() - 0.5) * force * 0.5;
      const rdx = dx + Math.cos(angle + 1.2) * swirl;
      const rdy = dy + Math.sin(angle + 1.2) * swirl;
      this.splatCircle(jx, jy, rdx, rdy, col, radiusMul);
    }
  }

  step(dt) {
    const c = this.config;
    const gl = this.gl;

    this.draw(this.curlProgram, {
      texelSize: [this.texelSize.x, this.texelSize.y],
      uVelocity: { texture: this.velocity.read.texture, unit: 0 },
    }, this.curl, false);

    this.draw(this.vorticityProgram, {
      texelSize: [this.texelSize.x, this.texelSize.y],
      uVelocity: { texture: this.velocity.read.texture, unit: 0 },
      uCurl: { texture: this.curl.texture, unit: 1 },
      curl: c.curl,
      dt,
    }, this.velocity.write, false);
    this.velocity.swap();

    this.draw(this.divergenceProgram, {
      texelSize: [this.texelSize.x, this.texelSize.y],
      uVelocity: { texture: this.velocity.read.texture, unit: 0 },
    }, this.divergence, false);

    this.draw(this.pressureProgram, {
      texelSize: [this.texelSize.x, this.texelSize.y],
      uPressure: { texture: this.pressure.read.texture, unit: 0 },
      uDivergence: { texture: this.divergence.texture, unit: 1 },
    }, this.pressure.write, true);
    this.pressure.swap();

    for (let i = 0; i < c.pressureIterations; i++) {
      this.draw(this.pressureProgram, {
        texelSize: [this.texelSize.x, this.texelSize.y],
        uPressure: { texture: this.pressure.read.texture, unit: 0 },
        uDivergence: { texture: this.divergence.texture, unit: 1 },
      }, this.pressure.write, false);
      this.pressure.swap();
    }

    this.draw(this.gradientSubtractProgram, {
      texelSize: [this.texelSize.x, this.texelSize.y],
      uPressure: { texture: this.pressure.read.texture, unit: 0 },
      uVelocity: { texture: this.velocity.read.texture, unit: 1 },
    }, this.velocity.write, false);
    this.velocity.swap();

    const diss = this.getDissipation();

    this.draw(this.advectionProgram, {
      texelSize: [this.texelSize.x, this.texelSize.y],
      uVelocity: { texture: this.velocity.read.texture, unit: 0 },
      uSource: { texture: this.velocity.read.texture, unit: 1 },
      dt,
      dissipation: diss.vel,
    }, this.velocity.write, false);
    this.velocity.swap();

    this.draw(this.advectionProgram, {
      texelSize: [this.dyeTexelSize.x, this.dyeTexelSize.y],
      uVelocity: { texture: this.velocity.read.texture, unit: 0 },
      uSource: { texture: this.dye.read.texture, unit: 1 },
      dt,
      dissipation: diss.dye,
    }, this.dye.write, false);
    this.dye.swap();
  }

  hslToRgb(h, s, l) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue = (x) => {
      let t = x;
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)];
  }

  update() {
    const dt = Math.min((performance.now() - (this.last || performance.now())) / 1000, 0.016);
    this.last = performance.now();

    if (this.pointer.moved) {
      this.splatSmokeBurst(
        this.pointer.x,
        this.pointer.y,
        this.pointer.dx,
        this.pointer.dy,
        this.pointer.speedPx
      );
      this.pointer.moved = false;
    } else {
      this.smoothSpeedFactor *= 0.92;
    }

    this.step(dt);

    const gl = this.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.time = (this.time || 0) + dt;
    this.draw(this.displayProgram, {
      uTexture: { texture: this.dye.read.texture, unit: 0 },
      texelSize: [this.dyeTexelSize.x, this.dyeTexelSize.y],
      uTime: this.time,
    }, null, true);

    requestAnimationFrame(() => this.update());
  }
}

if (typeof module !== 'undefined') module.exports = FluidCursor;
