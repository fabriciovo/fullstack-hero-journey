import { DEPTH, healthBarTypes, iconsetWeaponTypes } from "../../../utils/utils";
import Bar from "../../UI/Bar";
import Monster from "./Monster";

export default class Mushroom extends Monster {
  constructor(
    scene,
    x,
    y,
    key,
    frame,
    id,
    health,
    maxHealth,
    stateTime,
    randomPosition
  ) {
    super(scene, x, y, key, frame, id);
    this.health = health;
    this.maxHealth = maxHealth;
    this.scene = scene;
    this.key = key;
    this.stateTime = stateTime;
    this.randomPosition = randomPosition;
    this.dead = false;
    this.hitbox = false;
    this.monsterAttackActive = false;
    this.tag = "monster";

    this.setDepth(DEPTH.ENTITIES);

    this.scene.anims.create({
      key: `normal_${this.key}`,
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.play(`normal_${this.key}`);

    this.createHealthBar();

    this.monsterAttack = this.scene.add.sprite(
      40,
      0,
      "iconset",
      iconsetWeaponTypes.SMALL_WOODEN_SWORD
    );

    this.scene.add.existing(this.monsterAttack);
    this.monsterAttack.setScale(2);
    this.scene.physics.world.enable(this.monsterAttack);
    this.monsterAttack.alpha = 0;
  }

  createHealthBar() {
    //Health bar
    this.healthBar = new Bar(
      this.scene,
      this.x,
      this.y,
      "bar_sheet",
      healthBarTypes.LIFE_BAR,
      healthBarTypes.HOLDER,
      DEPTH.BARS
    );
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.UpdateBar(
      this.x - 22,
      this.y - 22,
      this.health,
      this.maxHealth
    );
  }

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  update() {
    if (!this.dead) {
      this.updateHealthBar();
      this.animation();
    }
  }

  move(targetPosition) {
    this.scene.physics.moveToObject(this, targetPosition, 90);
  }

  attack() {
    if (this.dead) return;
    this.monsterAttackActive = true;
    this.scene.time.delayedCall(
      1000,
      () => {
        this.monsterAttackActive = false;
        this.hitbox = false;
      },
      [],
      this
    );
  }

  animation() {}

  damage() {}

  idle() {
    this.body.setVelocityX(0);
    this.body.setVelocityY(0);
  }

  makeInactive() {
    super.makeInactive();
    this.updateHealthBar();
    this.healthBar.DestroyBar();
    this.dead = true;
  }

  makeActive() {
    super.makeActive();
    this.createHealthBar();
    this.dead = false;
  }

  createMonsterAttack() {
    this.monsterAttack = this.scene.add.sprite(
      40,
      0,
      "iconset",
      iconsetWeaponTypes.SMALL_WOODEN_SWORD
    );

    this.scene.add.existing(this.monsterAttack);
    this.monsterAttack.setScale(2);
    this.scene.physics.world.enable(this.monsterAttack);
    this.monsterAttack.alpha = 0;
  }
}
