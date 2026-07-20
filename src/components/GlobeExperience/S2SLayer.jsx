import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLongToPosition } from './coordinates';

// ── S2S reforecast demo layers ─────────────────────────────
// Streams the pre-baked binary frames from public/data/s2s (one monsoon
// initialization, 42 lead days) onto the globe:
//   · scalar fields (t2m / precip) — one atlas DataTexture, the shader
//     samples lead-day k and k+1 and blends, so scrubbing is butter-smooth
//   · 10 m wind — an instanced arrow field lerped between lead days in JS
// `stepRef.current` (float 0..steps-1) is the only animation input.

const BASE = import.meta.env.BASE_URL + 'data/s2s/';

// fetch manifest + binaries once, on demand
let cache = null;
const loadS2S = async () => {
    if (cache) return cache;
    cache = (async () => {
        const manifest = await (await fetch(BASE + 'manifest.json')).json();
        const [t2m, precip, windU, windV] = await Promise.all([
            fetch(BASE + 't2m.bin').then((r) => r.arrayBuffer()),
            fetch(BASE + 'precip.bin').then((r) => r.arrayBuffer()),
            fetch(BASE + 'wind_u.bin').then((r) => r.arrayBuffer()),
            fetch(BASE + 'wind_v.bin').then((r) => r.arrayBuffer()),
        ]);
        const makeAtlas = (buf) => {
            const { lon, lat, steps } = manifest.dims;
            const tex = new THREE.DataTexture(new Uint8Array(buf), lon, lat * steps, THREE.RedFormat, THREE.UnsignedByteType);
            tex.minFilter = tex.magFilter = THREE.LinearFilter;
            tex.unpackAlignment = 1; // width 35 isn't a multiple of 4
            tex.needsUpdate = true;
            return tex;
        };
        return {
            manifest,
            tex: { t2m: makeAtlas(t2m), precip: makeAtlas(precip) },
            wind: { u: new Float32Array(windU), v: new Float32Array(windV) },
        };
    })();
    return cache;
};

export const useS2SData = (enabled) => {
    const [data, setData] = useState(null);
    useEffect(() => { if (enabled && !data) loadS2S().then(setData); }, [enabled, data]);
    return data;
};

// color ramps (dark-canvas inks)
const RAMPS = {
    t2m: { c0: '#2f6f9d', c1: '#eaf4fb', c2: '#d0603f', alphaMode: 0 },
    precip: { c0: '#123044', c1: '#4aa3dd', c2: '#eaf7ff', alphaMode: 1 },
};

// ── SCALAR FIELD ───────────────────────────────────────────
const ScalarField = ({ data, variable, stepRef }) => {
    const matRef = useRef();
    const { manifest } = data;
    const uniforms = useMemo(() => {
        const r = RAMPS[variable];
        return {
            field: { value: data.tex[variable] },
            stepA: { value: 0 }, stepB: { value: 0 }, stepMix: { value: 0 },
            nLat: { value: manifest.dims.lat }, nLon: { value: manifest.dims.lon }, nSteps: { value: manifest.dims.steps },
            bounds: { value: new THREE.Vector4(manifest.lonRange[0], manifest.lonRange[1], manifest.latRange[0], manifest.latRange[1]) },
            c0: { value: new THREE.Color(r.c0) }, c1: { value: new THREE.Color(r.c1) }, c2: { value: new THREE.Color(r.c2) },
            alphaMode: { value: r.alphaMode },
        };
    }, [data, variable, manifest]);

    useFrame(() => {
        const m = matRef.current;
        if (!m) return;
        const n = manifest.dims.steps;
        const s = THREE.MathUtils.clamp(stepRef.current, 0, n - 1);
        m.uniforms.stepA.value = Math.floor(s);
        m.uniforms.stepB.value = Math.min(Math.floor(s) + 1, n - 1);
        m.uniforms.stepMix.value = s - Math.floor(s);
    });

    return (
        // radius clears the terrain displacement so the field drapes over peaks;
        // keyed by variable — swapping uniforms on a live shaderMaterial doesn't rebind
        <mesh key={variable} scale={[1.045, 1.045, 1.045]}>
            <sphereGeometry args={[1, 128, 128]} />
            <shaderMaterial ref={matRef} transparent depthWrite={false} uniforms={uniforms}
                vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
                fragmentShader={`
                    uniform sampler2D field;
                    uniform float stepA, stepB, stepMix, nLat, nLon, nSteps, alphaMode;
                    uniform vec4 bounds; uniform vec3 c0, c1, c2;
                    varying vec2 vUv;

                    float sampleStep(float k, vec2 g){
                        float u = (0.5 + g.x * (nLon - 1.0)) / nLon;
                        float v = (k * nLat + 0.5 + g.y * (nLat - 1.0)) / (nLat * nSteps);
                        return texture2D(field, vec2(u, v)).r;
                    }
                    void main(){
                        float lon = vUv.x * 360.0 - 180.0;
                        float lat = vUv.y * 180.0 - 90.0;
                        vec2 g = vec2((lon - bounds.x) / (bounds.y - bounds.x),
                                      (lat - bounds.z) / (bounds.w - bounds.z));
                        if (g.x < 0.0 || g.x > 1.0 || g.y < 0.0 || g.y > 1.0) discard;

                        float raw = mix(sampleStep(stepA, g), sampleStep(stepB, g), stepMix);
                        if (raw < 0.002) discard;              // 0 = missing
                        float t = clamp((raw * 255.0 - 1.0) / 254.0, 0.0, 1.0);

                        vec3 color = t < 0.5 ? mix(c0, c1, t * 2.0) : mix(c1, c2, t * 2.0 - 1.0);
                        float edge = smoothstep(0.0, 0.04, g.x) * smoothstep(1.0, 0.96, g.x)
                                   * smoothstep(0.0, 0.04, g.y) * smoothstep(1.0, 0.96, g.y);
                        float alpha = alphaMode < 0.5 ? 0.55 : pow(t, 0.6) * 0.9;
                        gl_FragColor = vec4(color, alpha * edge);
                    }`}
            />
        </mesh>
    );
};

// ── WIND ARROWS ────────────────────────────────────────────
const WindArrows = ({ data, stepRef }) => {
    const meshRef = useRef();
    const { manifest, wind } = data;
    const { lat: nLat, lon: nLon, steps: nSteps } = manifest.dims;
    const count = nLat * nLon;

    // per-cell surface position + local east/north tangent frame
    const grid = useMemo(() => {
        const [lat0, lat1] = manifest.latRange;
        const [lon0, lon1] = manifest.lonRange;
        const cells = [];
        for (let j = 0; j < nLat; j++) {
            for (let i = 0; i < nLon; i++) {
                const la = lat0 + (j / (nLat - 1)) * (lat1 - lat0);
                const lo = lon0 + (i / (nLon - 1)) * (lon1 - lon0);
                const pos = latLongToPosition(la, lo, 1.055);
                const east = latLongToPosition(la, lo + 0.5, 1.055).sub(latLongToPosition(la, lo - 0.5, 1.055)).normalize();
                const north = latLongToPosition(la + 0.5, lo, 1.055).sub(latLongToPosition(la - 0.5, lo, 1.055)).normalize();
                cells.push({ pos, east, north });
            }
        }
        return cells;
    }, [manifest, nLat, nLon]);

    const scratch = useMemo(() => ({
        obj: new THREE.Object3D(), dir: new THREE.Vector3(), q: new THREE.Quaternion(),
        up: new THREE.Vector3(0, 1, 0), col: new THREE.Color(),
        cGlacier: new THREE.Color('#4aa3dd'), cIce: new THREE.Color('#f2fbff'),
    }), []);

    useFrame(() => {
        const mesh = meshRef.current;
        if (!mesh) return;
        const s = THREE.MathUtils.clamp(stepRef.current, 0, nSteps - 1);
        const k = Math.floor(s);
        const k1 = Math.min(k + 1, nSteps - 1);
        const f = s - k;
        const maxS = manifest.vars.wind.maxSpeed;
        const { obj, dir, q, up, col, cGlacier, cIce } = scratch;

        for (let c = 0; c < count; c++) {
            const iA = k * count + c;
            const iB = k1 * count + c;
            const u = wind.u[iA] + (wind.u[iB] - wind.u[iA]) * f;
            const v = wind.v[iA] + (wind.v[iB] - wind.v[iA]) * f;
            const speed = Math.hypot(u, v);
            const cell = grid[c];
            obj.position.copy(cell.pos);
            if (speed < 0.35) {
                obj.scale.setScalar(0.0001); // becalmed — hide
            } else {
                dir.copy(cell.east).multiplyScalar(u).addScaledVector(cell.north, v).normalize();
                q.setFromUnitVectors(up, dir);
                obj.quaternion.copy(q);
                const len = 0.45 + Math.min(speed / maxS, 1) * 1.3;
                obj.scale.set(0.8, len, 0.8);
            }
            obj.updateMatrix();
            mesh.setMatrixAt(c, obj.matrix);
            col.copy(cGlacier).lerp(cIce, Math.min(speed / maxS, 1));
            mesh.setColorAt(c, col);
        }
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {/* slender dart, base at the cell, tip pointing downwind */}
            <coneGeometry args={[0.0035, 0.022, 4]} />
            <meshBasicMaterial transparent opacity={0.9} toneMapped={false} />
        </instancedMesh>
    );
};

// ── ASSEMBLY ───────────────────────────────────────────────
const S2SLayer = ({ active, variable, stepRef }) => {
    const data = useS2SData(active && !!variable);
    if (!active || !variable || !data) return null;
    return variable === 'wind'
        ? <WindArrows data={data} stepRef={stepRef} />
        : <ScalarField data={data} variable={variable} stepRef={stepRef} />;
};

export default S2SLayer;
