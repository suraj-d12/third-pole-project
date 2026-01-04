import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { CameraControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';

// --- GEOGRAPHIC DATA ---
const themeCoordinates = {
    'Extreme Weather Events': {
        lat: 20, long: 78, zoom: 2.2, label: 'India',
        image: 'https://images.unsplash.com/photo-1542316410-63ce7c0e5272?auto=format&fit=crop&q=80&w=300&h=200',
        description: 'Increasing frequency of cyclones and heatwaves across the subcontinent.'
    },
    'Climate Modeling and Predictions': {
        lat: 30, long: 90, zoom: 2.8, label: 'Tibet',
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=300&h=200',
        description: 'AI-driven models predicting temperature shifts in high-altitude zones.'
    },
    'Glacier Dynamics and Water Resources': {
        lat: 28, long: 86.9, zoom: 1.8, label: 'Everest Region',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300&h=200',
        description: 'Rapid glacial retreat threatening freshwater supply for millions.'
    },
    'Vegetation Changes and Land Use': {
        lat: -3, long: -60, zoom: 2.5, label: 'Amazon Basin',
        image: 'https://images.unsplash.com/photo-1516937941344-00b460337589?auto=format&fit=crop&q=80&w=300&h=200',
        description: 'Deforestation patterns analysis using satellite imagery.'
    },
    'Humanitarian Response': {
        lat: 25, long: 85, zoom: 2.0, label: 'Nepal/Bihar',
        image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=300&h=200',
        description: 'Coordinating disaster relief during monsoon floods.'
    },
    'Terrestrial Water Changes': {
        lat: 30, long: 79, zoom: 2.2, label: 'Uttarakhand',
        image: 'https://images.unsplash.com/photo-1619441163456-11f26487e352?auto=format&fit=crop&q=80&w=300&h=200',
        description: 'Groundwater depletion metrics in the Himalayan foothills.'
    },
};

const cityCoordinates = [
    { lat: 27.7, long: 85.3, name: 'Kathmandu' },
    { lat: 25.6, long: 85.1, name: 'Patna' },
    { lat: 26.8, long: 87.3, name: 'Biratnagar' },
    { lat: 28.2, long: 83.9, name: 'Pokhara' },
    { lat: 26.4, long: 80.3, name: 'Kanpur' },
];

const globalView = { lat: 20, long: 78, zoom: 3.5 };

// --- UTILS ---
const latLongToPosition = (lat, long, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (long + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
};

// --- COMPONENTS ---
const InfoPopup = ({ position, data, isActive }) => {
    if (!isActive || !data) return null;

    return (
        <Html
            position={[position.x * 1.2, position.y * 1.2, position.z * 1.2]}
            center
            style={{ width: '300px', pointerEvents: 'none' }}
            zIndexRange={[1000, 0]}
        >
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-[300px] bg-black/80 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden shadow-2xl"
            >
                <div className="h-32 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <img src={data.image} alt={data.label} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 relative z-20 -mt-8 text-left">
                    <h3 className="text-white font-bold text-lg mb-1 shadow-black drop-shadow-md">{data.label}</h3>
                    <div className="h-0.5 w-12 bg-primary mb-3" />
                    <p className="text-gray-300 text-sm leading-relaxed">{data.description}</p>
                </div>
            </motion.div>
        </Html>
    );
};

const LocationMarker = ({ position, label, color = '#f97316', isActive }) => {
    const markerRef = useRef();
    const ringRef = useRef();
    useFrame((state) => {
        if (markerRef.current && isActive) markerRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 6) * 0.2);
        if (ringRef.current && isActive) {
            ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.4);
            ringRef.current.material.opacity = 0.8 - Math.sin(state.clock.elapsedTime * 4) * 0.4;
        }
    });
    if (!isActive) return null;
    return (
        <group position={position}>
            <mesh ref={markerRef}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.03, 0.05, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
        </group>
    );
};

// --- REFINED SCIENTIFIC VISUALIZATION SHADERS ---

// 1. Extreme Weather: Volumetric Storm Swirl
const StormOverlay = ({ isActive }) => {
    const meshRef = useRef();
    const materialRef = useRef();
    useFrame((state) => {
        if (meshRef.current && isActive) {
            meshRef.current.rotation.y += 0.001;
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;
        }
    });
    if (!isActive) return null;
    return (
        <mesh ref={meshRef} scale={[1.05, 1.05, 1.05]}>
            <sphereGeometry args={[1, 128, 128]} />
            <shaderMaterial
                ref={materialRef}
                transparent side={THREE.DoubleSide} depthWrite={false}
                uniforms={{ time: { value: 0 } }}
                vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
                fragmentShader={`
                    uniform float time;
                    varying vec2 vUv;
                    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
                    float noise(vec2 p) {
                        vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
                        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
                    }
                    void main() {
                        vec2 centered = vUv * 2.0 - 1.0;
                        float dist = length(centered);
                        float angle = atan(centered.y, centered.x);
                        float spiral = sin(angle * 3.0 + dist * 10.0 - time * 0.5);
                        float n = noise(vUv * 10.0 + time * 0.1);
                        float cloud = smoothstep(0.4, 0.7, spiral * n);
                        float mask = smoothstep(1.0, 0.2, dist); 
                        vec3 stormColor = vec3(0.9, 0.95, 1.0);
                        gl_FragColor = vec4(stormColor, cloud * mask * 0.5);
                    }
                `}
            />
        </mesh>
    );
};

// 2. Climate Modeling: Scientific Heatmap
const HeatmapOverlay = ({ isActive }) => {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current && isActive) meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    });
    if (!isActive) return null;
    return (
        <mesh ref={meshRef} scale={[1.02, 1.02, 1.02]}>
            <sphereGeometry args={[1, 128, 128]} />
            <shaderMaterial
                transparent depthWrite={false}
                uniforms={{ time: { value: 0 } }}
                vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
                fragmentShader={`
                    uniform float time;
                    varying vec2 vUv;
                    void main() {
                        float pattern = sin(vUv.y * 50.0) * 0.5 + 0.5;
                        float heat = sin(vUv.x * 5.0 + time * 0.2) * cos(vUv.y * 5.0 + time * 0.1);
                        vec3 cold = vec3(0.2, 0.4, 0.8);
                        vec3 neutral = vec3(0.9, 0.9, 0.9);
                        vec3 hot = vec3(0.8, 0.2, 0.2);
                        vec3 color = mix(cold, neutral, smoothstep(-0.5, 0.0, heat));
                        color = mix(color, hot, smoothstep(0.0, 0.5, heat));
                        float alpha = smoothstep(0.2, 0.8, abs(heat)) * 0.4;
                        gl_FragColor = vec4(color, alpha);
                    }
                `}
            />
        </mesh>
    );
};

// 3. Glacier Dynamics: Matte White Coverage
const GlacierGlow = ({ isActive }) => {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current && isActive) meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    });
    if (!isActive) return null;
    return (
        <mesh ref={meshRef} scale={[1.005, 1.005, 1.005]}>
            <sphereGeometry args={[1, 128, 128]} />
            <shaderMaterial
                transparent depthWrite={false}
                uniforms={{ time: { value: 0 } }}
                vertexShader={`varying vec3 vNormal; void main() { vNormal = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
                fragmentShader={`
                    uniform float time;
                    varying vec3 vNormal;
                    void main() {
                        float altitude = abs(vNormal.y);
                        float breath = 0.8 + 0.2 * sin(time * 1.5);
                        float iceExtent = smoothstep(0.4, 0.6, altitude);
                        vec3 iceColor = vec3(0.85, 0.95, 1.0);
                        gl_FragColor = vec4(iceColor, iceExtent * 0.5 * breath);
                    }
                `}
            />
        </mesh>
    );
};

// 4. Humanitarian Response: Radar Ripples
const DataPips = ({ isActive }) => {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current && isActive) meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    });
    if (!isActive) return null;
    return (
        <mesh ref={meshRef} scale={[1.01, 1.01, 1.01]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                transparent depthWrite={false}
                uniforms={{ time: { value: 0 } }}
                vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
                fragmentShader={`
                    uniform float time;
                    varying vec2 vUv;
                    float ripple(vec2 uv, vec2 center, float t) {
                        float dist = distance(uv, center);
                        return smoothstep(0.0, 0.05, sin(dist * 50.0 - t * 2.0) * exp(-dist * 10.0));
                    }
                    void main() {
                        vec2 center = vec2(0.72, 0.65); 
                        float signal = ripple(vUv, center, time);
                        vec3 radarColor = vec3(0.0, 1.0, 0.8);
                        gl_FragColor = vec4(radarColor, signal * 0.6);
                    }
                `}
            />
        </mesh>
    );
};

// 5. Vegetation: NDVI Semantic Grid
const VegetationOverlay = ({ isActive }) => {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current && isActive) meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    });
    if (!isActive) return null;
    return (
        <mesh ref={meshRef} scale={[1.01, 1.01, 1.01]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                transparent depthWrite={false}
                uniforms={{ time: { value: 0 } }}
                vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
                fragmentShader={`
                    uniform float time;
                    varying vec2 vUv;
                    void main() {
                        float latMask = 1.0 - smoothstep(0.4, 0.6, abs(vUv.y - 0.5));
                        float longMask = smoothstep(0.2, 0.3, vUv.x) * (1.0 - smoothstep(0.4, 0.5, vUv.x));
                        float mask = latMask * longMask;
                        float grid = step(0.95, fract(vUv.x * 50.0)) + step(0.95, fract(vUv.y * 50.0));
                        grid = clamp(grid, 0.0, 1.0);
                        vec3 bioColor = vec3(0.2, 0.8, 0.3);
                        float alpha = mask * grid * 0.4 + (mask * 0.1);
                        gl_FragColor = vec4(bioColor, alpha);
                    }
                `}
            />
        </mesh>
    );
};

const FresnelMaterial = () => {
    const fresnelMaterialRef = useRef();
    useFrame(() => {
        if (fresnelMaterialRef.current) fresnelMaterialRef.current.uniforms.time.value += 0.01;
    });
    return (
        <shaderMaterial
            ref={fresnelMaterialRef}
            transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide}
            uniforms={{ time: { value: 0 }, glowColor: { value: new THREE.Color('#38bdf8') }, glowIntensity: { value: 0.6 } }}
            vertexShader={`
        varying vec3 vNormal; varying vec3 vPositionNormal;
        void main() { vNormal = normalize(normalMatrix * normal); vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `}
            fragmentShader={`
        uniform vec3 glowColor; uniform float glowIntensity; uniform float time;
        varying vec3 vNormal; varying vec3 vPositionNormal;
        void main() { float intensity = pow(0.7 - dot(vNormal, vPositionNormal), 2.0); float pulse = 1.0 + sin(time) * 0.05; gl_FragColor = vec4(glowColor, intensity * glowIntensity * pulse); }
      `}
        />
    );
};

const CameraController = ({ activeTheme, cameraControlsRef }) => {
    useEffect(() => {
        if (!cameraControlsRef.current) return;
        const target = activeTheme ? themeCoordinates[activeTheme] : globalView;
        if (!target) return;
        const position = latLongToPosition(target.lat, target.long, target.zoom);
        cameraControlsRef.current.setLookAt(position.x, position.y, position.z, 0, 0, 0, true);
    }, [activeTheme, cameraControlsRef]);
    return null;
};

// --- MAIN COMPONENT ---
const Earth = ({ activeTheme, cameraControlsRef }) => {
    const planetRef = useRef(); // Single ref for the entire planet group

    const [dayMap, normalMap, cloudsMap] = useLoader(TextureLoader, [
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png',
    ]);

    const markerPosition = useMemo(() => {
        if (!activeTheme || !themeCoordinates[activeTheme]) return null;
        const coord = themeCoordinates[activeTheme];
        return latLongToPosition(coord.lat, coord.long, 1.02);
    }, [activeTheme]);

    useFrame((state) => {
        if (!planetRef.current) return;
        // Rotate the entire planet group ensuring all layers stay aligned
        if (!activeTheme) planetRef.current.rotation.y += 0.0005;
    });

    return (
        <>
            <CameraControls ref={cameraControlsRef} makeDefault smoothTime={0.8} draggingSmoothTime={0.5} minDistance={1.5} maxDistance={6} dollySpeed={0.3} truckSpeed={0.3} />
            <CameraController activeTheme={activeTheme} cameraControlsRef={cameraControlsRef} />

            {/* Rotatable Planet Group */}
            <group ref={planetRef}>
                <mesh>
                    <sphereGeometry args={[1, 128, 128]} />
                    <meshPhongMaterial map={dayMap} bumpMap={normalMap} bumpScale={0.05} shininess={5} />
                </mesh>

                <mesh scale={[1.01, 1.01, 1.01]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    {/* Clouds */}
                    <meshStandardMaterial map={cloudsMap} transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
                </mesh>

                <HeatmapOverlay isActive={activeTheme === 'Climate Modeling and Predictions'} />
                <StormOverlay isActive={activeTheme === 'Extreme Weather Events'} />
                <GlacierGlow isActive={activeTheme === 'Glacier Dynamics and Water Resources'} />
                <VegetationOverlay isActive={activeTheme === 'Vegetation Changes and Land Use'} />
                <DataPips isActive={activeTheme === 'Humanitarian Response'} />

                {markerPosition && activeTheme && (
                    <>
                        <LocationMarker position={markerPosition} label={themeCoordinates[activeTheme].label} color="#f97316" isActive={true} />
                        <InfoPopup position={markerPosition} data={themeCoordinates[activeTheme]} isActive={true} />
                    </>
                )}

                <mesh scale={[1.2, 1.2, 1.2]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <FresnelMaterial />
                </mesh>

                <mesh scale={[1.05, 1.05, 1.05]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshBasicMaterial color="#0ea5e9" transparent opacity={0.03} side={THREE.BackSide} depthWrite={false} />
                </mesh>
            </group>
        </>
    );
};

export default Earth;
