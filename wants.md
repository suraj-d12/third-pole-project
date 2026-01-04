Step 1: The "Cinematic Canvas" & Asset Foundation

The Choice: Use react-three-fiber with drei’s PerspectiveCamera. This allows for professional depth of field and lighting right out of the box.

Prompt for Gemini: "I am building a high-end research portal for 'The Third Pole'. Create a React component with a 60/40 split screen. On the right, setup a react-three-fiber Canvas. Render a high-detail 3D Globe using a 4k texture (placeholder for now). Set the background to a deep, 'void' black. Add a Stars component and an atmospheric 'Fresnel' glow around the Earth's rim. The Earth should have a very slow, graceful auto-rotation (rotation.y += 0.0005). Use Tailwind to style the left side as a clean, minimalist container for text."

Step 2: The "Fly-To" Camera Orchestration

The Choice: Instead of just moving coordinates, we use Camera Transitions. This gives that "Google Earth" weight you mentioned.

Prompt for Gemini: "Now, implement a 'Fly-To' system. Create a state called activeTheme. When activeTheme changes, the camera should smoothly interpolate its position and lookAt target to specific geographic points on the globe (e.g., Himalayas for 'Glaciers', Amazon for 'Vegetation'). Use the CameraControls component from @react-three/drei for the transitions. Ensure the transition has a 'slow-in-slow-out' easing to make it feel cinematic and intentional, not robotic."

Step 3: Thematic Visual Layers (The "Stunning" Part)

The Choice: Use Shaders or Point Clouds. This is better than just changing a texture; it makes the Earth feel like a data-driven visualization.

Prompt for Gemini: "Let's add unique visual overlays for each theme.

If the theme is 'Climate Modeling', overlay a pulsing heatmap shader over the Earth.

If 'Extreme Weather', add a secondary, slightly larger sphere with a moving cloud/noise texture to represent the atmosphere.

If 'Humanitarian Response', render glowing 'data pips' or points of light at specific city coordinates. Use framer-motion-3d to fade these layers in and out based on the activeTheme state so the transitions are seamless."

Step 4: Antigravity UI Integration

The Choice: This is where the "Simple" meets "Visually Stunning." The text shouldn't just be a list; it should feel physical.

Prompt for Gemini: "Finally, let's build the left-hand menu using 'Antigravity' principles. The theme titles should use physics-based motion. When the mouse moves, the text should subtly 'float' and react to the cursor's proximity using spring physics (use framer-motion). When a theme is clicked, the other themes should dim slightly, and the active one should 'pop' forward in 3D space. Link these clicks to the activeTheme state we created in Step 2."