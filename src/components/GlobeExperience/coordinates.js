import * as THREE from 'three';

// The narrative anchor: Sagarmatha / Everest — the Third Pole.
export const THIRD_POLE = { lat: 27.98, long: 86.92 };

// Camera distance once the scroll flight locks onto the region.
export const LOCK_DIST = 2.35;

// The globe rests permanently spun so the Third Pole faces the camera
// (+z). A group rotation of R radians about Y shifts every feature's
// longitude by R·180/π degrees, so this is expressed as a longitude delta.
export const REST_LONG_DELTA = -90 - THIRD_POLE.long;
export const REST_SPIN = THREE.MathUtils.degToRad(REST_LONG_DELTA);

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

export const cityCoordinates = [
    { lat: 27.7, long: 85.3, name: 'Kathmandu' },
    { lat: 25.6, long: 85.1, name: 'Patna' },
    { lat: 26.8, long: 87.3, name: 'Biratnagar' },
    { lat: 28.2, long: 83.9, name: 'Pokhara' },
    { lat: 26.4, long: 80.3, name: 'Kanpur' },
];

export const latLongToPosition = (lat, long, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (long + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
    );
};

export const latLongToUV = (lat, long) => ({ u: (long + 180) / 360, v: (lat + 90) / 180 });

// ── HERO FRAMING ───────────────────────────────────────────
// Shared between the 3D rig and the HTML overlay so the beacon line can
// end exactly on the marker dot's projected screen position.
export const FOV = 45;
export const HERO_DIST = 3.4;          // camera distance during the hero
export const HERO_TILT = -0.62;        // pitches the Third Pole up into the dome

// Marker offset from the globe centre in the hero pose (unit sphere,
// spin + tilt applied). x is 0 by construction: the Third Pole faces camera.
const HERO_MARKER_LOCAL = (() => {
    const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), REST_SPIN);
    const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), HERO_TILT);
    return latLongToPosition(THIRD_POLE.lat, THIRD_POLE.long, 1.012)
        .applyQuaternion(qy)
        .applyQuaternion(qx);
})();

// Responsive hero numbers: dome scale/position plus the marker's world
// height and the view half-extents at the marker's depth (for projection).
export const heroFraming = (width, height) => {
    const aspect = width / height;
    const halfFov = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const viewH = 2 * halfFov * HERO_DIST;
    const heroScale = THREE.MathUtils.clamp(viewH * aspect * 0.42, 1.25, 2.05);
    const heroY = -viewH / 2 - 0.7 * heroScale; // only a ~15% sliver peeks
    const markerY = heroY + HERO_MARKER_LOCAL.y * heroScale;
    const markerDepth = HERO_DIST - HERO_MARKER_LOCAL.z * heroScale;
    const halfH = halfFov * markerDepth;
    const halfW = halfH * aspect;
    return { heroScale, heroY, markerY, halfH, halfW };
};

// World-space position of a surface feature, accounting for the globe's
// resting spin. Use this for anything outside the rotated group — above
// all camera fly-to targets.
export const worldPosition = (lat, long, radius) =>
    latLongToPosition(lat, long + REST_LONG_DELTA, radius);
