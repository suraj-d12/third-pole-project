import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { CameraControls } from '@react-three/drei';
import CameraControlsImpl from 'camera-controls';

const { ACTION } = CameraControlsImpl;

// ── RESEARCH THEMES ────────────────────────────────────────
export const THEME_ORDER = [
    'Extreme Weather Events',
    'Climate Modeling and Predictions',
    'Glacier Dynamics and Water Resources',
    'Vegetation Changes and Land Use',
    'Humanitarian Response',
    'Terrestrial Water Changes',
];

export const themeCoordinates = {
    'Extreme Weather Events': { lat: 18, long: 84, zoom: 2.7, label: 'Bay of Bengal', region: 'Indian Subcontinent', description: 'Cyclone genesis and intensity tracked across the monsoon belt, from formation at sea to landfall.' },
    'Climate Modeling and Predictions': { lat: 32, long: 88, zoom: 2.9, label: 'Tibetan Plateau', region: 'High Asia', description: 'Deep-learning models sharpen temperature and warming forecasts across high-altitude zones.' },
    'Glacier Dynamics and Water Resources': { lat: 28, long: 86.9, zoom: 2.5, label: 'Everest region', region: 'Khumbu Himal', description: 'Mass-balance monitoring of a rapidly retreating cryosphere — the water tower of Asia.' },
    'Vegetation Changes and Land Use': { lat: -3, long: -60, zoom: 3.0, label: 'Amazon Basin', region: 'South America', description: 'LIDAR canopy scanning tracks forest-cover change and its feedback on regional climate.' },
    'Humanitarian Response': { lat: 26.5, long: 85.5, zoom: 2.6, label: 'Nepal & Bihar', region: 'Gangetic Plain', description: 'Building-level exposure maps link early warnings to relief corridors in flood-prone districts.' },
    'Terrestrial Water Changes': { lat: 29, long: 79, zoom: 2.7, label: 'Uttarakhand', region: 'Ganga headwaters', description: 'Subsurface water-table and recharge modelling along the headwaters of the Ganga.' },
};

const cityCoordinates = [
    { lat: 27.7, long: 85.3, name: 'Kathmandu' },
    { lat: 25.6, long: 85.1, name: 'Patna' },
    { lat: 26.8, long: 87.3, name: 'Biratnagar' },
    { lat: 28.2, long: 83.9, name: 'Pokhara' },
    { lat: 26.4, long: 80.3, name: 'Kanpur' },
];

const globalView = { lat: 24, long: 82, zoom: 3.1 };

// palette — the globe is printed in the page's own inks
const GLACIER = new THREE.Color('#1f5f8b');
const TERRACOTTA = new THREE.Color('#b5462f');
const SAGE = new THREE.Color('#5f7d5a');
const ICE = new THREE.Color('#f3f8fb');

const latLongToPosition = (lat, long, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (long + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
    );
};
const latLongToUV = (lat, long) => ({ u: (long + 180) / 360, v: (lat + 90) / 180 });

const LocationMarker = ({ position, color = GLACIER }) => {
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
        <sphereGeometry args={[1, 160, 160]} />
        {children}
    </mesh>
));

// 1 · WEATHER — logarithmic-spiral cyclone with eye (terracotta)
const CycloneOverlay = ({ active }) => {
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
const IsolineOverlay = ({ active }) => {
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
const IceFieldOverlay = ({ active }) => {
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
const CanopyOverlay = ({ active }) => {
    const ref = useTime(active);
    const c = latLongToUV(-3, -60);
    if (!active) return null;
    return (
        <OverlaySphere ref={ref} scale={1.016}>
            <shaderMaterial transparent depthWrite={false}
                uniforms={{ time: { value: 0 }, centerUV: { value: new THREE.Vector2(c.u, c.v) }, col: { value: SAGE }, hi: { value: new THREE.Color('#8fae5f') } }}
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
const ReliefArcs = ({ active }) => {
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
                            vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
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
const AquiferOverlay = ({ active }) => {
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

// faint glacier halo so the sphere sits *in* the page, not on it
const Halo = () => (
    <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial transparent depthWrite={false} side={THREE.BackSide}
            uniforms={{ glowColor: { value: GLACIER } }}
            vertexShader={`varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vP = normalize((modelViewMatrix*vec4(position,1.0)).xyz); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
            fragmentShader={`uniform vec3 glowColor; varying vec3 vN; varying vec3 vP; void main(){ float i = pow(0.66 - dot(vN,vP), 3.5); gl_FragColor = vec4(glowColor, clamp(i,0.0,1.0) * 0.3); }`}
        />
    </mesh>
);

// ── ENGRAVED PLANET ────────────────────────────────────────
// Printed in the page's own inks: paper oceans, tan→ink relief land,
// engraved coastlines, faint graticule. Terrain is displaced + hillshaded.
const EngravedPlanet = ({ dayMap, waterMask, bumpMap }) => {
    const uniforms = useMemo(() => ({
        dayMap: { value: dayMap }, waterMask: { value: waterMask }, bumpMap: { value: bumpMap },
        disp: { value: 0.035 },
        lightDir: { value: new THREE.Vector3(0.9, 0.6, 0.75).normalize() },
        oceanShallow: { value: new THREE.Color('#efe9db') },
        oceanDeep: { value: new THREE.Color('#ddd3bf') },
        landLow: { value: new THREE.Color('#c9b892') },
        landHigh: { value: new THREE.Color('#243447') },
        coastInk: { value: new THREE.Color('#1a2230') },
        gridColor: { value: new THREE.Color('#1f5f8b') },
    }), [dayMap, waterMask, bumpMap]);

    return (
        <mesh>
            <sphereGeometry args={[1, 320, 320]} />
            <shaderMaterial uniforms={uniforms}
                vertexShader={`
                    uniform sampler2D bumpMap; uniform float disp;
                    varying vec2 vUv; varying vec3 vNormalW;
                    void main(){
                        vUv = uv;
                        float e = texture2D(bumpMap, uv).r;
                        vec3 displaced = position + normal * e * disp;
                        vNormalW = normalize(mat3(modelMatrix) * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
                    }`}
                fragmentShader={`
                    uniform sampler2D dayMap, waterMask, bumpMap;
                    uniform vec3 lightDir, oceanShallow, oceanDeep, landLow, landHigh, coastInk, gridColor;
                    varying vec2 vUv; varying vec3 vNormalW;
                    void main(){
                        float water = texture2D(waterMask, vUv).r;
                        float elev  = texture2D(bumpMap, vUv).r;
                        float lum   = dot(texture2D(dayMap, vUv).rgb, vec3(0.299,0.587,0.114));

                        // hillshade from topology slope
                        vec2 tx = vec2(0.0016, 0.0016);
                        float ex = texture2D(bumpMap, vUv + vec2(tx.x,0.0)).r;
                        float ey = texture2D(bumpMap, vUv + vec2(0.0,tx.y)).r;
                        vec3 sn = normalize(vec3((elev-ex)*8.0, (elev-ey)*8.0, 1.0));
                        float hill = clamp(dot(sn, normalize(vec3(0.6,0.5,0.6))), 0.0, 1.0);

                        // soft global light — keep the far side readable on paper
                        float ndl = clamp(dot(normalize(vNormalW), normalize(lightDir)), 0.0, 1.0);
                        float shade = 0.6 + 0.4 * ndl;

                        vec3 ocean = mix(oceanDeep, oceanShallow, shade);
                        vec3 land  = mix(landLow, landHigh, clamp(elev*1.3 + lum*0.12, 0.0, 1.0));
                        land = mix(land * 0.72, land, 0.4 + 0.6 * hill);
                        land = mix(land * 0.88, land, shade);

                        float w = smoothstep(0.35, 0.62, water);
                        vec3 base = mix(land, ocean, w);

                        // engraved coastline where the water mask transitions
                        float coast = (1.0 - smoothstep(0.0, 0.16, abs(water - 0.5)));
                        base = mix(base, coastInk, coast * 0.45);

                        // faint printed graticule
                        float lon = min(fract(vUv.x*24.0), 1.0-fract(vUv.x*24.0));
                        float lat = min(fract(vUv.y*12.0), 1.0-fract(vUv.y*12.0));
                        float grat = (1.0-smoothstep(0.0,0.012,lon)) + (1.0-smoothstep(0.0,0.012,lat));
                        base = mix(base, gridColor, clamp(grat,0.0,1.0) * 0.07);

                        gl_FragColor = vec4(base, 1.0);
                    }`}
            />
        </mesh>
    );
};

// ── CAMERA + ASSEMBLY ──────────────────────────────────────
const CameraController = ({ activeTheme, cameraControlsRef, focalOffset }) => {
    useEffect(() => {
        let raf, timer;
        // CameraControls resets to the camera's default transform on its first
        // frame, so a synchronous setLookAt at mount gets clobbered. Defer past
        // that init frame (and re-apply once as a safety net for slow mounts).
        const apply = () => {
            const ctrl = cameraControlsRef.current;
            if (!ctrl) { raf = requestAnimationFrame(apply); return; }
            const t = activeTheme ? themeCoordinates[activeTheme] : globalView;
            if (t) {
                const p = latLongToPosition(t.lat, t.long, t.zoom);
                ctrl.setLookAt(p.x, p.y, p.z, 0, 0, 0, true);
            }
            // Screen-space shift so text can own the other side. Applied here
            // (not a separate effect) so it also survives the mount race.
            if (focalOffset) ctrl.setFocalOffset(focalOffset[0], focalOffset[1], 0, true);
        };
        raf = requestAnimationFrame(apply);
        timer = setTimeout(apply, 200);
        return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
    }, [activeTheme, focalOffset, cameraControlsRef]);
    return null;
};

const Earth = ({ activeTheme, cameraControlsRef, focalOffset }) => {
    const planetRef = useRef();
    const [dayMap, bumpMap, waterMask] = useLoader(TextureLoader, [
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png',
    ]);

    const markerPosition = useMemo(() => {
        if (!activeTheme || !themeCoordinates[activeTheme]) return null;
        const c = themeCoordinates[activeTheme];
        return latLongToPosition(c.lat, c.long, 1.03);
    }, [activeTheme]);

    useFrame(() => { if (planetRef.current && !activeTheme) planetRef.current.rotation.y += 0.0004; });

    return (
        <>
            {/* Drag rotates the globe; wheel and touch-drag stay with the page so
                scrolling is never hijacked. (Don't use enabled=false to disable
                input — that also freezes the update loop and kills setLookAt flights.) */}
            <CameraControls ref={cameraControlsRef} makeDefault smoothTime={0.9}
                minDistance={1.6} maxDistance={6} azimuthRotateSpeed={0.6} polarRotateSpeed={0.6}
                mouseButtons={{ left: ACTION.ROTATE, middle: ACTION.NONE, right: ACTION.NONE, wheel: ACTION.NONE }}
                touches={{ one: ACTION.NONE, two: ACTION.TOUCH_ROTATE, three: ACTION.NONE }} />
            <CameraController activeTheme={activeTheme} cameraControlsRef={cameraControlsRef} focalOffset={focalOffset} />

            <group ref={planetRef}>
                <EngravedPlanet dayMap={dayMap} waterMask={waterMask} bumpMap={bumpMap} />

                <IsolineOverlay active={activeTheme === 'Climate Modeling and Predictions'} />
                <CycloneOverlay active={activeTheme === 'Extreme Weather Events'} />
                <IceFieldOverlay active={activeTheme === 'Glacier Dynamics and Water Resources'} />
                <CanopyOverlay active={activeTheme === 'Vegetation Changes and Land Use'} />
                <ReliefArcs active={activeTheme === 'Humanitarian Response'} />
                <AquiferOverlay active={activeTheme === 'Terrestrial Water Changes'} />

                {markerPosition && activeTheme && <LocationMarker position={markerPosition} />}

                <Halo />
            </group>
        </>
    );
};

export default Earth;
