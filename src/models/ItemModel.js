import { v4 } from "uuid";
/**
 * @class
 */
export default class ItemModel {
  constructor(x, y, spawnerId, name, frame, attackValue, defenseValue, healthValue, type, description) {
    this.id = `${spawnerId}-${v4()}`;
    this.spawnerId = spawnerId;
    this.x = x;
    this.y = y;
    this.name = name;
    this.frame = frame;
    this.attackBonus = attackValue;
    this.defenseBonus = defenseValue;
    this.healthBonus = healthValue;
    this.type = type;
    this.description = description;
  }
}
