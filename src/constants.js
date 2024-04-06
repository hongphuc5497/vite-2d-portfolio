// * Spritesheet Image Specs:
// * * width: 624
// * * height: 496
// 16x16 tiles
export const NUM_OF_HORIZONTAL_FRAMES = 39; // FORMULA: image width / tile width
export const NUM_OF_VERTICAL_FRAMES = 31; // FORMULA: image height / tile width

const IDLE_DOWN = 936;
const IDLE_SIDE = 975;
const IDLE_UP = 1014;

// https://kaboomjs.com/#SpriteAnim
const DISTANCE_BETWEEN_FRAMES = 2;
const buildSpriteAnim = (from) => ({
  from, // Starting frame
  to: from + DISTANCE_BETWEEN_FRAMES, // End frame
  loop: true, // Should be played in loop
  speed: 8, // Frame rate. E.g: 8 = 8 frames per second
});

console.debug(buildSpriteAnim(IDLE_DOWN))

export const ANIMATION_CONF = {
  "idle-down": IDLE_DOWN,
  "walk-down": buildSpriteAnim(IDLE_DOWN),
  "idle-side": IDLE_SIDE,
  "walk-side": buildSpriteAnim(IDLE_SIDE),
  "idle-up": IDLE_UP,
  "walk-up": buildSpriteAnim(IDLE_UP)
};
