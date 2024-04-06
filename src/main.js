import { k } from './kaboomCtx';
import {
	NUM_OF_HORIZONTAL_FRAMES,
	NUM_OF_VERTICAL_FRAMES,
	ANIMATION_CONF,
	BG_COLOR,
	SCALE_FACTOR,
	INITIAL_POS,
	DIALOGUE_DATA,
} from './constants';
import { displayDialogue, setCamScale } from './utils';

k.loadSprite('spritesheet', './spritesheet.png', {
	sliceX: NUM_OF_HORIZONTAL_FRAMES,
	sliceY: NUM_OF_VERTICAL_FRAMES,
	anims: ANIMATION_CONF,
});

k.loadSprite('map', './map.png');

k.setBackground(k.Color.fromHex(BG_COLOR));

k.scene('main', async () => {
	// === Phase 1: Build artifacts ===
	const fetchMap = await fetch('./map.json');
	const mapData = await fetchMap.json();
	const layers = mapData.layers;

	const map = k.add([
		k.sprite('map'),
		k.pos(INITIAL_POS),
		k.scale(SCALE_FACTOR),
	]);

	const player = k.make([
		k.sprite('spritesheet', {
			anim: 'idle-down',
		}),
		k.area({
			shape: new k.Rect(k.vec2(0, 3), 10, 10),
		}),
		k.body(),
		k.anchor('center'),
		k.pos(),
		k.scale(SCALE_FACTOR),
		{
			speed: 250,
			direction: 'down',
			isInDialogue: false,
		},
		'player',
	]);
	// ======

	// === Phase 2: Build map ===
	for (const layer of layers) {
		// * Boundaries layer
		let isBoundariesLayer = layer.name === 'boundaries';
		if (isBoundariesLayer) {
			for (const boundary of layer.objects) {
				map.add([
					k.area({
						shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
					}),
					k.body({
						isStatic: true,
					}),
					k.pos(boundary.x, boundary.y),
					boundary.name,
				]);

				if (boundary.name) {
					player.onCollide(boundary.name, () => {
						player.isInDialogue = true;
						displayDialogue(
							// DIALOGUE_DATA[boundary.name],
							"TODO: Implement dialogue data here.",
							() => (player.isInDialogue = false)
						);
					});
				}
			}

			continue;
		}

		// * Spawnpoints layer
		let isSpawnpointsLayer = layer.name === 'spawnpoints';
		if (isSpawnpointsLayer) {
			for (const entity of layer.objects) {
				if (entity.name === 'player') {
					player.pos = k.vec2(
						(map.pos.x + entity.x) * SCALE_FACTOR,
						(map.pos.y + entity.y) * SCALE_FACTOR
					);
					k.add(player);

					continue;
				}
			}
		}
	}
	// ======

	// === Phase 3: Controls ===
	setCamScale(k);

	k.onResize(() => setCamScale(k));

	k.onUpdate(() => {
		k.camPos(player.worldPos().x, player.worldPos().y - 100);
	});

	k.onMouseDown((mouseBtn) => {
		if (mouseBtn !== 'left' || player.isInDialogue) return;

		const worldMousePos = k.toWorld(k.mousePos());
		player.moveTo(worldMousePos, player.speed);

		const mouseAngle = player.pos.angle(worldMousePos);

		const lowerBound = 50;
		const upperBound = 125;

		if (
			mouseAngle > lowerBound &&
			mouseAngle < upperBound &&
			player.curAnim() !== 'walk-up'
		) {
			player.play('walk-up');
			player.direction = 'up';
			return;
		}

		if (
			mouseAngle < -lowerBound &&
			mouseAngle > -upperBound &&
			player.curAnim() !== 'walk-down'
		) {
			player.play('walk-down');
			player.direction = 'down';
			return;
		}

		if (Math.abs(mouseAngle) > upperBound) {
			player.flipX = false;
			if (player.curAnim() !== 'walk-side') player.play('walk-side');
			player.direction = 'right';
			return;
		}

		if (Math.abs(mouseAngle) < lowerBound) {
			player.flipX = true;
			if (player.curAnim() !== 'walk-side') player.play('walk-side');
			player.direction = 'left';
			return;
		}
	});

	const stopAnims = () => {
		if (player.direction === 'down') {
			player.play('idle-down');
			return;
		}

		if (player.direction === 'up') {
			player.play('idle-up');
			return;
		}

		player.play('idle-side');
	};

	k.onMouseRelease(stopAnims);

	k.onKeyRelease(() => {
		stopAnims();
	});

	k.onKeyDown((key) => {
		const keyMap = [
			k.isKeyDown('right'),
			k.isKeyDown('left'),
			k.isKeyDown('up'),
			k.isKeyDown('down'),
		];

		let nbOfKeyPressed = 0;
		for (const key of keyMap) {
			if (key) {
				nbOfKeyPressed++;
			}
		}

		if (nbOfKeyPressed > 1) return;

		if (player.isInDialogue) return;
		if (keyMap[0]) {
			player.flipX = false;
			if (player.curAnim() !== 'walk-side') player.play('walk-side');
			player.direction = 'right';
			player.move(player.speed, 0);
			return;
		}

		if (keyMap[1]) {
			player.flipX = true;
			if (player.curAnim() !== 'walk-side') player.play('walk-side');
			player.direction = 'left';
			player.move(-player.speed, 0);
			return;
		}

		if (keyMap[2]) {
			if (player.curAnim() !== 'walk-up') player.play('walk-up');
			player.direction = 'up';
			player.move(0, -player.speed);
			return;
		}

		if (keyMap[3]) {
			if (player.curAnim() !== 'walk-down') player.play('walk-down');
			player.direction = 'down';
			player.move(0, player.speed);
		}
	});
  // ======
});

k.go('main');
