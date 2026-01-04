import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { CameraControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';

// Geographic coordinates for each theme (lat, long)
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

// City coordinates for Humanitarian Response data pips
const cityCoordinates = [
    { lat: 27.7, long: 85.3, name: 'Kathmandu' },
    { lat: 25.6, long: 85.1, name: 'Patna' },
    { lat: 26.8, long: 87.3, name: 'Biratnagar' },
    { lat: 28.2, long: 83.9, name: 'Pokhara' },
    { lat: 26.4, long: 80.3, name: 'Kanpur' },
];

// Info Popup Component
const InfoPopup = ({ position, data, isActive }) => {
    if (!isActive || !data) return null;

    return (
        <Html
            position={[position.x * 1.2, position.y * 1.2, position.z * 1.2]}
            center
            // Removed distanceFactor to prevent auto-scaling based on zoom
            // Added style to ensure fixed size in screen space
            style={{
                width: '300px',
                pointerEvents: 'none',
            }}
            zIndexRange={[1000, 0]} // Ensure it's always on top
        >
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-[300px] bg-black/80 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden shadow-2xl"
            >
                {/* Image */}
                <div className="h-32 w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <img
                        src={data.image}
                        alt={data.label}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Text Content */}
                <div className="p-4 relative z-20 -mt-8 text-left">
                    <h3 className="text-white font-bold text-lg mb-1 shadow-black drop-shadow-md">{data.label}</h3>
                    <div className="h-0.5 w-12 bg-primary mb-3" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {data.description}
                    </p>
                </div>
            </motion.div>
        </Html>
    );
};

// Default global view
const globalView = { lat: 20, long: 78, zoom: 3.5 };

// Convert lat/long to 3D position on sphere surface
const latLongToPosition = (lat, long, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (long + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
};

// Marker component with pulsing animation
const LocationMarker = ({ position, label, color = '#f97316', isActive }) => {
    const markerRef = useRef();
    const ringRef = useRef();

    useFrame((state) => {
        if (markerRef.current && isActive) {
            markerRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
        }
        if (ringRef.current && isActive) {
            ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.3);
            ringRef.current.material.opacity = 0.5 - Math.sin(state.clock.elapsedTime * 2) * 0.3;
        }
    });

    if (!isActive) return null;

    return (
        <group position={position}>
            {/* Main marker point */}
            <mesh ref={markerRef}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Pulsing ring */}
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.03, 0.05, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

// Data Pips for Humanitarian Response
const DataPips = ({ isActive }) => {
    const pipsRef = useRef([]);

    useFrame((state) => {
        pipsRef.current.forEach((pip, i) => {
            if (pip && isActive) {
                pip.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3);
            }
        });
    });

    if (!isActive) return null;

    return (
        <group>
            {cityCoordinates.map((city, i) => {
                const pos = latLongToPosition(city.lat, city.long, 1.02);
                return (
                    <group key={city.name} position={pos}>
                        <mesh ref={(el) => (pipsRef.current[i] = el)}>
                            <sphereGeometry args={[0.015, 16, 16]} />
                            <meshBasicMaterial color="#22d3ee" />
                        </mesh>
                        <pointLight position={[0, 0, 0]} intensity={0.5} color="#22d3ee" distance={0.2} />
                    </group>
                );
            })}
        </group>
    );
};

// Heatmap overlay for Climate Modeling
const HeatmapOverlay = ({ isActive }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current && isActive) {
            meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    if (!isActive) return null;

    return (
        <mesh ref={meshRef} scale={[1.02, 1.02, 1.02]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                transparent
                uniforms={{
                    time: { value: 0 }
                }}
                vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
                fragmentShader={`
          uniform float time;
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            float heat = sin(vUv.x * 10.0 + time) * sin(vUv.y * 8.0 + time * 0.5);
            heat = (heat + 1.0) * 0.5;
            vec3 coolColor = vec3(0.0, 0.5, 1.0);
            vec3 hotColor = vec3(1.0, 0.3, 0.0);
            vec3 color = mix(coolColor, hotColor, heat);
            float alpha = 0.15 + heat * 0.1;
            gl_FragColor = vec4(color, alpha);
          }
        `}
            />
        </mesh>
    );
};

// Storm/Cloud overlay for Extreme Weather
const StormOverlay = ({ isActive }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current && isActive) {
            meshRef.current.rotation.y += 0.002;
            meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    if (!isActive) return null;

    return (
        <mesh ref={meshRef} scale={[1.08, 1.08, 1.08]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                transparent
                side={THREE.DoubleSide}
                uniforms={{
                    time: { value: 0 }
                }}
                vertexShader={`
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
                fragmentShader={`
          uniform float time;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          void main() {
            vec2 uv = vUv * 8.0;
            float n = noise(uv + time * 0.1);
            float swirl = sin(vUv.x * 20.0 + time + n * 5.0) * cos(vUv.y * 15.0 + time * 0.7);
            swirl = (swirl + 1.0) * 0.5;
            vec3 color = vec3(0.8, 0.9, 1.0);
            float alpha = swirl * 0.15;
            gl_FragColor = vec4(color, alpha);
          }
        `}
            />
        </mesh>
    );
};

// Glacier glow for Glacier Dynamics
const GlacierGlow = ({ isActive }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current && isActive) {
            meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    if (!isActive) return null;

    return (
        <mesh ref={meshRef} scale={[1.01, 1.01, 1.01]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                transparent
                uniforms={{
                    time: { value: 0 }
                }}
                vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
                fragmentShader={`
          uniform float time;
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            // High altitude = near poles (vNormal.y near 1 or -1) or specific lat range
            float altitude = abs(vNormal.y);
            float himalayanBand = smoothstep(0.3, 0.5, vNormal.y) * smoothstep(0.7, 0.5, vNormal.y);
            float glow = max(altitude * 0.5, himalayanBand * 2.0);
            glow *= 0.5 + sin(time * 2.0) * 0.1;
            vec3 color = vec3(0.4, 0.8, 1.0);
            float alpha = glow * 0.2;
            gl_FragColor = vec4(color, alpha);
          }
        `}
            />
        </mesh>
    );
};

// Fresnel Shader for atmospheric glow
const FresnelMaterial = () => {
    const fresnelMaterialRef = useRef();

    useFrame(() => {
        if (fresnelMaterialRef.current) {
            fresnelMaterialRef.current.uniforms.time.value += 0.01;
        }
    });

    return (
        <shaderMaterial
            ref={fresnelMaterialRef}
            transparent
            side={THREE.BackSide}
            uniforms={{
                time: { value: 0 },
                glowColor: { value: new THREE.Color('#38bdf8') },
                glowIntensity: { value: 0.6 }
            }}
            vertexShader={`
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
            fragmentShader={`
        uniform vec3 glowColor;
        uniform float glowIntensity;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vPositionNormal), 2.0);
          float pulse = 1.0 + sin(time) * 0.05;
          gl_FragColor = vec4(glowColor, intensity * glowIntensity * pulse);
        }
      `}
        />
    );
};

// Camera Controller Component
const CameraController = ({ activeTheme, cameraControlsRef }) => {
    useEffect(() => {
        if (!cameraControlsRef.current) return;

        const target = activeTheme ? themeCoordinates[activeTheme] : globalView;
        if (!target) return;

        const position = latLongToPosition(target.lat, target.long, target.zoom);

        cameraControlsRef.current.setLookAt(
            position.x, position.y, position.z,
            0, 0, 0,
            true
        );

    }, [activeTheme, cameraControlsRef]);

    return null;
};

const Earth = ({ activeTheme, cameraControlsRef }) => {
    const earthRef = useRef();
    const cloudsRef = useRef();

    // Load Earth textures
    const [dayMap, normalMap, cloudsMap] = useLoader(TextureLoader, [
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png',
    ]);

    // Get marker position for active theme
    const markerPosition = useMemo(() => {
        if (!activeTheme || !themeCoordinates[activeTheme]) return null;
        const coord = themeCoordinates[activeTheme];
        return latLongToPosition(coord.lat, coord.long, 1.02);
    }, [activeTheme]);

    useFrame((state, delta) => {
        if (!earthRef.current || !cloudsRef.current) return;

        // Only rotate when no theme is selected (global view)
        if (!activeTheme) {
            earthRef.current.rotation.y += 0.0005;
            cloudsRef.current.rotation.y += 0.0006;
        }
    });

    return (
        <>
            {/* Camera Controls */}
            <CameraControls
                ref={cameraControlsRef}
                makeDefault
                smoothTime={0.8} // Faster transition (was 1.5)
                draggingSmoothTime={0.5}
                minDistance={1.5}
                maxDistance={6}
                dollySpeed={0.3}
                truckSpeed={0.3}
            />

            <CameraController activeTheme={activeTheme} cameraControlsRef={cameraControlsRef} />

            <group>
                {/* Main Earth Sphere */}
                <mesh ref={earthRef}>
                    <sphereGeometry args={[1, 128, 128]} />
                    <meshPhongMaterial
                        map={dayMap}
                        bumpMap={normalMap}
                        bumpScale={0.05}
                        shininess={5}
                    />
                </mesh>

                {/* Cloud Layer */}
                <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial
                        map={cloudsMap}
                        transparent
                        opacity={0.25}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>

                {/* Thematic Visual Layers */}
                <HeatmapOverlay isActive={activeTheme === 'Climate Modeling and Predictions'} />
                <StormOverlay isActive={activeTheme === 'Extreme Weather Events'} />
                <GlacierGlow isActive={activeTheme === 'Glacier Dynamics and Water Resources'} />
                <DataPips isActive={activeTheme === 'Humanitarian Response'} />

                {/* Location Marker */}
                {markerPosition && activeTheme && (
                    <>
                        <LocationMarker
                            position={markerPosition}
                            label={themeCoordinates[activeTheme].label}
                            color="#f97316"
                            isActive={true}
                        />
                        {/* New Info Popup */}
                        <InfoPopup
                            position={markerPosition}
                            data={themeCoordinates[activeTheme]}
                            isActive={true}
                        />
                    </>
                )}

                {/* Atmospheric Fresnel Glow */}
                <mesh scale={[1.2, 1.2, 1.2]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <FresnelMaterial />
                </mesh>

                {/* Inner atmosphere layer */}
                <mesh scale={[1.05, 1.05, 1.05]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshBasicMaterial
                        color="#0ea5e9"
                        transparent
                        opacity={0.03}
                        side={THREE.BackSide}
                    />
                </mesh>
            </group>
        </>
    );
};

export default Earth;
