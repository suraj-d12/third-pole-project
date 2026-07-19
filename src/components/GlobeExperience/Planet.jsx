import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

// ── NIGHT PLANET ───────────────────────────────────────────
// Printed for the black canvas: near-void oceans, slate lowlands and
// luminous high-altitude relief — so the Himalaya reads as the bright
// spine of the sphere. Terrain is displaced + hillshaded.
const NightPlanet = ({ dayMap, waterMask, bumpMap }) => {
    const uniforms = useMemo(() => ({
        dayMap: { value: dayMap }, waterMask: { value: waterMask }, bumpMap: { value: bumpMap },
        disp: { value: 0.035 },
        lightDir: { value: new THREE.Vector3(0.9, 0.6, 0.75).normalize() },
        oceanShallow: { value: new THREE.Color('#12202f') },
        oceanDeep: { value: new THREE.Color('#050a12') },
        landLow: { value: new THREE.Color('#25313f') },
        landHigh: { value: new THREE.Color('#dbe7f2') },
        coastInk: { value: new THREE.Color('#79b4dc') },
        gridColor: { value: new THREE.Color('#5aa7d6') },
    }), [dayMap, waterMask, bumpMap]);

    return (
        <mesh>
            <sphereGeometry args={[1, 256, 256]} />
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

                        // let the far side fall toward the void
                        float ndl = clamp(dot(normalize(vNormalW), normalize(lightDir)), 0.0, 1.0);
                        float shade = 0.35 + 0.65 * ndl;

                        vec3 ocean = mix(oceanDeep, oceanShallow, shade);
                        vec3 land  = mix(landLow, landHigh, clamp(elev*1.3 + lum*0.12, 0.0, 1.0));
                        land = mix(land * 0.72, land, 0.4 + 0.6 * hill);
                        land = mix(land * 0.6, land, shade);

                        float w = smoothstep(0.35, 0.62, water);
                        vec3 base = mix(land, ocean, w);

                        // glowing coastline where the water mask transitions
                        float coast = (1.0 - smoothstep(0.0, 0.16, abs(water - 0.5)));
                        base = mix(base, coastInk, coast * 0.35 * shade);

                        // faint printed graticule
                        float lon = min(fract(vUv.x*24.0), 1.0-fract(vUv.x*24.0));
                        float lat = min(fract(vUv.y*12.0), 1.0-fract(vUv.y*12.0));
                        float grat = (1.0-smoothstep(0.0,0.012,lon)) + (1.0-smoothstep(0.0,0.012,lat));
                        base = mix(base, gridColor, clamp(grat,0.0,1.0) * 0.06);

                        gl_FragColor = vec4(base, 1.0);
                    }`}
            />
        </mesh>
    );
};

// atmospheric fresnel rim so the sphere sits *in* the void, not on it
const Halo = () => (
    <mesh scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial transparent depthWrite={false} side={THREE.BackSide}
            uniforms={{ glowColor: { value: new THREE.Color('#4a90b8') } }}
            vertexShader={`varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vP = normalize((modelViewMatrix*vec4(position,1.0)).xyz); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
            fragmentShader={`uniform vec3 glowColor; varying vec3 vN; varying vec3 vP; void main(){ float i = pow(0.66 - dot(vN,vP), 3.0); gl_FragColor = vec4(glowColor, clamp(i,0.0,1.0) * 0.45); }`}
        />
    </mesh>
);

const Planet = () => {
    const [dayMap, bumpMap, waterMask] = useLoader(TextureLoader, [
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
        'https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png',
    ]);
    return (
        <>
            <NightPlanet dayMap={dayMap} waterMask={waterMask} bumpMap={bumpMap} />
            <Halo />
        </>
    );
};

export default Planet;
