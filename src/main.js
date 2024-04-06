import { k } from './kaboomCtx';
import {
  NUM_OF_HORIZONTAL_FRAMES,
  NUM_OF_VERTICAL_FRAMES,
  ANIMATION_CONF
} from './constants';

k.loadSprite('spritesheet', './spritesheet.png', {
  sliceX: NUM_OF_HORIZONTAL_FRAMES,
  sliceY: NUM_OF_VERTICAL_FRAMES,
  anims: ANIMATION_CONF
})

k.loadSprite('map', './map.png')

const BG_COLOR = "#311047"
k.setBackground(k.Color.fromHex(BG_COLOR))

k.scene("main", async () => {
  // const fetchMap = await fetch('./map.json')
  // const mapData = await fetchMap.json()
})

k.go("main")
