import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THIRD_POLE, latLongToPosition } from './coordinates';

const Z_AXIS = new THREE.Vector3(0, 0, 1);

// Glowing surface pin + pulsing ground ring at the Third Pole. Lives at
// scene root and re-derives its world position from the globe group every
// frame, so it stays welded to the surface through the whole scroll flight.
// (The hero's vertical | is HTML, anchored to the headline.)
const ThirdPoleMarker = ({ globeRef }) => {
    const root = useRef();
    const ringHolder = useRef();
    const ring = useRef();
    const glow = useRef();

    const local = useMemo(() => latLongToPosition(THIRD_POLE.lat, THIRD_POLE.long, 1.012), []);
    const localNormal = useMemo(() => local.clone().normalize(), [local]);

    const glowTexture = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, 'rgba(214,236,250,0.95)');
        g.addColorStop(0.22, 'rgba(140,198,232,0.5)');
        g.addColorStop(0.55, 'rgba(90,167,214,0.16)');
        g.addColorStop(1, 'rgba(90,167,214,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
    }, []);

    const scratch = useMemo(() => ({ v: new THREE.Vector3(), n: new THREE.Vector3(), q: new THREE.Quaternion() }), []);

    useFrame((state) => {
        const globe = globeRef.current;
        if (!globe || !root.current) return;

        const s = globe.scale.x;
        scratch.v.copy(local).applyQuaternion(globe.quaternion).multiplyScalar(s).add(globe.position);
        root.current.position.copy(scratch.v);
        root.current.scale.setScalar(s);

        // ground ring lies tangent to the (rotating) surface
        scratch.n.copy(localNormal).applyQuaternion(globe.quaternion);
        ringHolder.current.quaternion.copy(scratch.q.setFromUnitVectors(Z_AXIS, scratch.n));

        const t = state.clock.elapsedTime;
        const pulse = 1 + Math.sin(t * 3) * 0.35;
        ring.current.scale.setScalar(pulse);
        ring.current.material.opacity = 0.55 - Math.sin(t * 3) * 0.3;
        glow.current.material.opacity = 0.75 + Math.sin(t * 2.2) * 0.2;
    });

    return (
        <group ref={root}>
            {/* dot */}
            <mesh>
                <sphereGeometry args={[0.013, 16, 16]} />
                <meshBasicMaterial color="#d6ecfa" toneMapped={false} />
            </mesh>
            {/* soft additive glow (self-erases on the white opening page) */}
            <sprite ref={glow} scale={[0.18, 0.18, 0.18]}>
                <spriteMaterial map={glowTexture} color="#8cc6e8" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
            </sprite>
            {/* pulsing ground ring */}
            <group ref={ringHolder}>
                <mesh ref={ring}>
                    <ringGeometry args={[0.024, 0.036, 40]} />
                    <meshBasicMaterial color="#5aa7d6" transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
                </mesh>
            </group>
        </group>
    );
};

export default ThirdPoleMarker;
