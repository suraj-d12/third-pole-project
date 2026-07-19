import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLongToPosition, latLongToUV, cityCoordinates } from './coordinates';

// palette — luminous inks for the black canvas
export const GLACIER = new THREE.Color('#5aa7d6');
export const TERRACOTTA = new THREE.Color('#d0603f');
const SAGE = new THREE.Color('#7ba36f');
const ICE = new THREE.Color('#eaf4fb');

export const LocationMarker = ({ position, color = GLACIER }) => {
    const ring = useRef();
    useFrame((s) => {
        if (ring.current) {
            const p = 1 + Math.sin(s.clock.elapsedTime * 4) * 0.4;
            ring.current.scale.setScalar(p);
            ring.current.material.opacity = 0.7 - Math.sin(s.clock.elapsedTime * 4) * 0.35;
        }
    });
    return (
        <group position={position}>
            <mesh><sphereGeometry args={[0.016, 16, 16]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
            <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.026, 0.04, 40]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
        </group>
    );
};

// ── OVERLAY SCAFFOLD ───────────────────────────────────────
const overlayVertex = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const useTime = (active) => {
    const ref = useRef();
    useFrame((s) => { if (ref.current && active) ref.current.material.uniforms.time.value = s.clock.elapsedTime; });
    return ref;
};
const OverlaySphere = React.forwardRef(({ scale = 1.015, children }, ref) => (
    <mesh ref={ref} scale={[scale, scale, scale]}>
        <sphereGeometry args={[1, 128, 128]} />
        {children}
    </mesh>
));

// 1 · WEATHER — logarithmic-spiral cyclone with eye (terracotta)
export const CycloneOverlay = ({ active }) => {
    const ref = useTime(active);
    const c = latLongToUV(18, 84);
    if (!active) return null;
    return (
        <OverlaySphere ref={ref} scale={1.016}>
            <shaderMaterial transparent depthWrite={false}
                uniforms={{ time: { value: 0 }, centerUV: { value: new THREE.Vector2(c.u, c.v) }, col: { value: TERRACOTTA }, ice: { value: ICE } }}
                vertexShader={overlayVertex}
                fragmentShader={`
                    uniform float time; uniform vec2 centerUV; uniform vec3 col; uniform vec3 ice; varying vec2 vUv;
                    void main(){
                        vec2 d = (vUv - centerUV) * vec2(2.0, 1.0);
                        float r = length(d);
                        float a = atan(d.y, d.x);
                        float disk = smoothstep(0.16, 0.02, r);
                        float arms = sin(a * 2.0 + log(r + 0.02) * 9.0 - time * 2.2);
                        float band = smoothstep(0.2, 0.9, arms);
                        float eye = smoothstep(0.018, 0.03, r);
                        float flick = 0.85 + 0.15 * sin(time * 20.0 + r * 30.0);
                        vec3 color = mix(ice, col, band);
                        gl_FragColor = vec4(color, disk * eye * (0.28 + band * 0.5) * flick);
                    }`}
            />
        </OverlaySphere>
    );
};

// 2 · CLIMATE — flowing warming isolines (glacier→terracotta)
export const IsolineOverlay = ({ active }) => {
    const ref = useTime(active);
    const c = latLongToUV(32, 88);
    if (!active) return null;
    return (
        <OverlaySphere ref={ref} scale={1.014}>
            <shaderMaterial transparent depthWrite={false}
                uniforms={{ time: { value: 0 }, centerUV: { value: new THREE.Vector2(c.u, c.v) }, cool: { value: GLACIER }, hot: { value: TERRACOTTA } }}
                vertexShader={overlayVertex}
                fragmentShader={`
                    uniform float time; uniform vec2 centerUV; uniform vec3 cool; uniform vec3 hot; varying vec2 vUv;
                    void main(){
                        float dist = distance(vUv, centerUV);
                        float area = smoothstep(0.24, 0.05, dist);
                        float flow = sin(dist * 150.0 - time * 2.5);
                        float lines = smoothstep(0.82, 0.99, flow);
                        float bloom = area * (0.5 + 0.5 * sin(time * 1.2)) * 0.15;
                        vec3 color = mix(cool, hot, smoothstep(0.02, 0.16, dist));
                        gl_FragColor = vec4(color, area * lines * 0.9 + bloom);
                    }`}
            />
        </OverlaySphere>
    );
};

// 3 · GLACIER — shimmering retreating ice field + monitoring ring
export const IceFieldOverlay = ({ active }) => {
    const ref = useTime(active);
    const c = latLongToUV(28, 86.9);
    if (!active) return null;
    return (
        <OverlaySphere ref={ref} scale={1.02}>
            <shaderMaterial transparent depthWrite={false}
                uniforms={{ time: { value: 0 }, centerUV: { value: new THREE.Vector2(c.u, c.v) }, ice: { value: ICE }, edge: { value: GLACIER } }}
                vertexShader={overlayVertex}
                fragmentShader={`
                    uniform float time; uniform vec2 centerUV; uniform vec3 ice; uniform vec3 edge; varying vec2 vUv;
                    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
                    float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
                        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
                    void main(){
                        float dist = distance(vUv, centerUV);
                        float rad = 0.05 + 0.006 * sin(time * 0.6);
                        float field = smoothstep(rad, rad - 0.03, dist);
                        float sparkle = smoothstep(0.82, 1.0, noise(vUv * 140.0 + time * 0.8));
                        float ring = smoothstep(rad - 0.004, rad, dist) * (1.0 - smoothstep(rad, rad + 0.004, dist));
                        float pulse = 0.5 + 0.5 * sin(time * 3.0);
                        vec3 color = mix(edge, ice, field);
                        gl_FragColor = vec4(color, field * 0.3 + sparkle * field * 0.7 + ring * (0.6 + pulse * 0.8));
                    }`}
            />
        </OverlaySphere>
    );
};

// 4 · VEGETATION — sweeping LIDAR scan revealing canopy grid (sage)
export const CanopyOverlay = ({ active }) => {
    const ref = useTime(active);
    const c = latLongToUV(-3, -60);
    if (!active) return null;
    return (
        <OverlaySphere ref={ref} scale={1.016}>
            <shaderMaterial transparent depthWrite={false}
                uniforms={{ time: { value: 0 }, centerUV: { value: new THREE.Vector2(c.u, c.v) }, col: { value: SAGE }, hi: { value: new THREE.Color('#a4c97a') } }}
                vertexShader={overlayVertex}
                fragmentShader={`
                    uniform float time; uniform vec2 centerUV; uniform vec3 col; uniform vec3 hi; varying vec2 vUv;
                    void main(){
                        float dist = distance(vUv, centerUV);
                        float area = smoothstep(0.3, 0.08, dist);
                        float scanPos = fract(time * 0.12);
                        float local = (vUv.y - (centerUV.y - 0.2)) / 0.4;
                        float scan = smoothstep(0.03, 0.0, abs(local - scanPos));
                        float grid = step(0.86, fract(vUv.x * 40.0)) * step(0.86, fract(vUv.y * 40.0));
                        vec3 color = mix(col, hi, scan);
                        gl_FragColor = vec4(color, area * (grid * 0.7 + scan * 0.6 + 0.05));
                    }`}
            />
        </OverlaySphere>
    );
};

// 5 · HUMANITARIAN — travelling relief arcs, terracotta district nodes
export const ReliefArcs = ({ active }) => {
    const matRefs = useRef([]);
    const arcs = useMemo(() => {
        const hub = latLongToPosition(27.7, 85.3, 1.0); // Kathmandu
        return cityCoordinates.filter((c) => c.name !== 'Kathmandu').map((c) => {
            const end = latLongToPosition(c.lat, c.long, 1.0);
            const mid = hub.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(1.28);
            const curve = new THREE.QuadraticBezierCurve3(hub.clone().multiplyScalar(1.01), mid, end.clone().multiplyScalar(1.01));
            return { geo: new THREE.TubeGeometry(curve, 48, 0.004, 8, false), end };
        });
    }, []);
    useFrame((s) => { if (active) matRefs.current.forEach((m) => m && (m.uniforms.time.value = s.clock.elapsedTime)); });
    if (!active) return null;
    return (
        <group>
            {arcs.map((a, i) => (
                <group key={i}>
                    <mesh geometry={a.geo}>
                        <shaderMaterial ref={(m) => (matRefs.current[i] = m)} transparent depthWrite={false}
                            uniforms={{ time: { value: i * 0.4 }, col: { value: GLACIER } }}
                            vertexShader={overlayVertex}
                            fragmentShader={`
                                uniform float time; uniform vec3 col; varying vec2 vUv;
                                void main(){
                                    float head = fract(time * 0.35);
                                    float d = mod(vUv.x - head + 1.0, 1.0);
                                    float pulse = exp(-d * d * 60.0) + exp(-(1.0-d)*(1.0-d)*60.0);
                                    float ends = smoothstep(0.0,0.05,vUv.x) * smoothstep(1.0,0.95,vUv.x);
                                    gl_FragColor = vec4(col, (0.3 + pulse) * ends);
                                }`}
                        />
                    </mesh>
                    <mesh position={a.end}>
                        <sphereGeometry args={[0.012, 12, 12]} />
                        <meshBasicMaterial color={TERRACOTTA} toneMapped={false} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

// 6 · TERRESTRIAL WATER — expanding aquifer ripples (glacier)
export const AquiferOverlay = ({ active }) => {
    const ref = useTime(active);
    const c = latLongToUV(29, 79);
    if (!active) return null;
    return (
        <OverlaySphere ref={ref} scale={1.014}>
            <shaderMaterial transparent depthWrite={false}
                uniforms={{ time: { value: 0 }, centerUV: { value: new THREE.Vector2(c.u, c.v) }, col: { value: GLACIER } }}
                vertexShader={overlayVertex}
                fragmentShader={`
                    uniform float time; uniform vec2 centerUV; uniform vec3 col; varying vec2 vUv;
                    void main(){
                        float dist = distance(vUv, centerUV);
                        float area = smoothstep(0.22, 0.04, dist);
                        float ripple = sin(dist * 120.0 - time * 4.0);
                        float rings = smoothstep(0.4, 1.0, ripple) * exp(-dist * 12.0);
                        float fill = area * (0.10 + 0.05 * sin(time * 1.5));
                        gl_FragColor = vec4(col, area * rings * 0.8 + fill);
                    }`}
            />
        </OverlaySphere>
    );
};
