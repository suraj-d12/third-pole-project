import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraControls, Stars } from '@react-three/drei';
import CameraControlsImpl from 'camera-controls';
import { easing } from 'maath';
import Planet from './Planet';
import ThirdPoleMarker from './ThirdPoleMarker';
import {
    THIRD_POLE, LOCK_DIST, REST_SPIN, HERO_DIST, HERO_TILT, FOV, heroFraming,
    themeCoordinates, latLongToPosition, worldPosition,
} from './coordinates';
import {
    CycloneOverlay, IsolineOverlay, IceFieldOverlay,
    CanopyOverlay, ReliefArcs, AquiferOverlay, LocationMarker,
} from './Overlays';
import S2SLayer from './S2SLayer';

const { ACTION } = CameraControlsImpl;

export { FOV };
// scroll-progress window of the flight; past SCRUB_END the pose is final
const SCRUB_START = 0.06;
const SCRUB_END = 0.7;

const ORIGIN = new THREE.Vector3(0, 0, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ── SCROLL RIG ─────────────────────────────────────────────
// Scrubs the whole flight from scroll progress: the globe rises from its
// bottom-of-viewport peek, spins a full revolution, and the camera dollies
// onto the Third Pole while drifting to the right-hand anchor. All motion
// is damped so scrubbing feels weighted, and the final pose matches the
// CameraControls handoff exactly.
const ScrollRig = ({ progress, locked, globeRef, anchorOffset }) => {
    const scratch = useMemo(() => ({
        qy: new THREE.Quaternion(), qx: new THREE.Quaternion(), q: new THREE.Quaternion(),
        camQ: new THREE.Quaternion(), pos: new THREE.Vector3(), dir: new THREE.Vector3(),
        m: new THREE.Matrix4(), right: new THREE.Vector3(), up: new THREE.Vector3(),
    }), []);
    const lockDir = useMemo(() => worldPosition(THIRD_POLE.lat, THIRD_POLE.long, 1), []);

    useFrame((state, delta) => {
        const globe = globeRef.current;
        if (!globe) return;
        const p = progress.get();
        const e = easeInOut(THREE.MathUtils.clamp((p - SCRUB_START) / (SCRUB_END - SCRUB_START), 0, 1));

        // hero framing is responsive: the dome spans the viewport width and
        // only a ~15% sliver peeks above the bottom edge; the globe stays
        // centred, with the Third Pole marker facing the camera dead-on.
        const { heroScale, heroY } = heroFraming(state.size.width, state.size.height);

        // globe pose: peek → centered, one full revolution, tilt released
        const s = THREE.MathUtils.lerp(heroScale, 1, e);
        scratch.qy.setFromAxisAngle(Y_AXIS, REST_SPIN - Math.PI * 2 * e);
        scratch.qx.setFromAxisAngle(X_AXIS, HERO_TILT * (1 - e));
        scratch.q.multiplyQuaternions(scratch.qx, scratch.qy);
        easing.damp3(globe.position, [0, heroY * (1 - e), 0], 0.16, delta);
        easing.damp3(globe.scale, [s, s, s], 0.16, delta);
        easing.dampQ(globe.quaternion, scratch.q, 0.16, delta);

        if (locked) return; // CameraControls owns the camera now

        // camera: straight-on wide → radially above the Third Pole,
        // then shifted in screen space toward the layout anchor
        scratch.dir.set(0, 0, 1).lerp(lockDir, e).normalize();
        scratch.pos.copy(scratch.dir).multiplyScalar(THREE.MathUtils.lerp(HERO_DIST, LOCK_DIST, e));
        scratch.m.lookAt(scratch.pos, ORIGIN, Y_AXIS);
        scratch.camQ.setFromRotationMatrix(scratch.m);
        scratch.right.setFromMatrixColumn(scratch.m, 0);
        scratch.up.setFromMatrixColumn(scratch.m, 1);
        scratch.pos
            .addScaledVector(scratch.right, anchorOffset[0] * e)
            .addScaledVector(scratch.up, anchorOffset[1] * e);
        // damping tightens as the flight completes so the camera has fully
        // converged before CameraControls takes over — no seam at the lock
        const lam = 0.22 - 0.16 * e;
        easing.damp3(state.camera.position, scratch.pos, lam, delta);
        easing.dampQ(state.camera.quaternion, scratch.camQ, lam, delta);
    });
    return null;
};

// ── CONTROLS SYNC ──────────────────────────────────────────
// CameraControls stays mounted but disabled until the flight completes
// (drei skips updating disabled controls, so the rig owns the camera).
// The instant lock flips on, its internal state is synced to the exact
// pose the rig converged on — zero-transition, so there is no seam.
// Later theme changes fly smoothly.
const ControlsSync = ({ controlsRef, locked, activeTheme, anchorOffset }) => {
    const wasLocked = useRef(false);
    useEffect(() => {
        const ctrl = controlsRef.current;
        if (!ctrl) return;
        if (!locked) { wasLocked.current = false; return; }
        const smooth = wasLocked.current; // instant on handoff, smooth after
        wasLocked.current = true;
        const t = activeTheme ? themeCoordinates[activeTheme] : { ...THIRD_POLE, zoom: LOCK_DIST };
        const pos = worldPosition(t.lat, t.long, t.zoom);
        ctrl.setLookAt(pos.x, pos.y, pos.z, 0, 0, 0, smooth);
        ctrl.setFocalOffset(anchorOffset[0], anchorOffset[1], 0, smooth);
    }, [locked, activeTheme, anchorOffset, controlsRef]);
    return null;
};

// ── ASSEMBLY ───────────────────────────────────────────────
const Scene = ({ progress, locked, activeTheme, anchorOffset, s2sVariable, s2sStepRef }) => {
    const globeRef = useRef();
    const controlsRef = useRef();

    const themeMarker = useMemo(() => {
        if (!activeTheme || !themeCoordinates[activeTheme]) return null;
        const c = themeCoordinates[activeTheme];
        return latLongToPosition(c.lat, c.long, 1.03);
    }, [activeTheme]);

    return (
        <>
            {/* Drag rotates once locked; wheel and one-finger touch stay with
                the page so scrolling is never hijacked. */}
            <CameraControls ref={controlsRef} makeDefault enabled={locked} smoothTime={0.9}
                minDistance={1.5} maxDistance={6} azimuthRotateSpeed={0.6} polarRotateSpeed={0.6}
                mouseButtons={{ left: ACTION.ROTATE, middle: ACTION.NONE, right: ACTION.NONE, wheel: ACTION.NONE }}
                touches={{ one: ACTION.NONE, two: ACTION.TOUCH_ROTATE, three: ACTION.NONE }}
            />
            <ControlsSync controlsRef={controlsRef} locked={locked} activeTheme={activeTheme} anchorOffset={anchorOffset} />
            <ScrollRig progress={progress} locked={locked} globeRef={globeRef} anchorOffset={anchorOffset} />

            <ambientLight intensity={0.6} />
            <Stars radius={30} depth={25} count={1500} factor={2.5} saturation={0} fade speed={0.4} />

            <group ref={globeRef}>
                <Suspense fallback={null}>
                    <Planet />
                </Suspense>

                {/* data layers — injected only once the globe is locked */}
                <IsolineOverlay active={locked && activeTheme === 'Climate Modeling and Predictions'} />
                <CycloneOverlay active={locked && activeTheme === 'Extreme Weather Events'} />
                <IceFieldOverlay active={locked && activeTheme === 'Glacier Dynamics and Water Resources'} />
                <CanopyOverlay active={locked && activeTheme === 'Vegetation Changes and Land Use'} />
                <ReliefArcs active={locked && activeTheme === 'Humanitarian Response'} />
                <AquiferOverlay active={locked && activeTheme === 'Terrestrial Water Changes'} />
                {locked && themeMarker && <LocationMarker position={themeMarker} />}

                {/* S2S reforecast demo layers (heatmaps / wind arrows) */}
                <S2SLayer active={locked} variable={s2sVariable} stepRef={s2sStepRef} />
            </group>

            <ThirdPoleMarker globeRef={globeRef} />
        </>
    );
};

export default Scene;
