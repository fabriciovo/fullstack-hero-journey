import * as Phaser from "phaser";
import Bar from "../classes/UI/Bar";
import InventoryWindow from "../classes/window/InventoryWindow";
import ItemDescriptionWindow from "../classes/window/ItemDescriptionWindow";
import PlayerWindow from "../classes/window/PlayerWindow";
import PopupWindow from "../classes/window/popupWindow";
import ShopWindow from "../classes/window/ShopWindow";
import SlotsWindow from "../classes/window/SlotsWindow";
import {
  DEPTH,
  healthBarTypes,
  iconsetPotionsTypes,
  iconsetSlotsTypes,
  iconsetWeaponTypes,
} from "../utils/utils";

export default class UiScene extends Phaser.Scene {
  constructor() {
    super("Ui");
  }

  init() {
    // grab a reference to the game scene
    this.gameScene = this.scene.get("Game");
    this.showInventory = false;
    this.showPlayerStats = false;
    this.showShopWindow = false;
    this.showWeaponsBook = false;
    this.showMaterialsBook = false;
    this.showPotionsBook = false;
  }

  create() {
    this.setupUiElements();
    this.setupEvents();

    // handle game resize
    this.scale.on("resize", this.resize, this);
    // resize our game
    this.resize({ height: this.scale.height, width: this.scale.width });
  }

  update() {
    if (this.showShopWindow) {
      this.shopWindow.showWindow(this.gameScene.player);
    } else {
      this.shopWindow.hideWindow();
    }
  }

  setupUiElements() {
    this.createWindows();

    //Create equiped weapons text
    this.actionAText = this.add
      .text(60, this.scale.height - 50, "Z", {
        fontSize: "46px",
        fill: "#fff",
      })
      .setDepth(DEPTH.UI);

    this.actionBText = this.add
      .text(160, this.scale.height - 50, "X", {
        fontSize: "46px",
        fill: "#fff",
      })
      .setDepth(DEPTH.UI);

    this.potionAText = this.add
      .text(50, this.scale.height - 190, "C", {
        fontSize: "46px",
        fill: "#fff",
      })
      .setDepth(DEPTH.UI);

    this.potionACountText = this.add
      .text(80, this.scale.height - 135, "0", {
        fontSize: "46px",
        fill: "#fff",
      })
      .setDepth(DEPTH.UI);

    // create playerStats button
    this.playerStatsButton = this.add
      .image(this.scale.width / 2 - 90, this.scale.height - 50, "playerstats")
      .setScale(0.1)
      .setInteractive({ cursor: "pointer" });

    this.playerStatsButton.on("pointerdown", () => {
      this.togglePlayerStats(this.gameScene.player);
    });

    // create WeaponsBook button
    this.weaponsBookButton = this.add
      .image(this.scale.width / 2 - 120, this.scale.height - 50, "iconset", 56)
      .setScale(3)
      .setInteractive({ cursor: "pointer" });

    this.weaponsBookButton.on("pointerdown", () => {
      this.toggleWeaponsBook();
    });

    // create potionsBook button
    this.potionsBookButton = this.add
      .image(this.scale.width / 2 - 220, this.scale.height - 50, "iconset", 56)
      .setScale(3)
      .setInteractive({ cursor: "pointer" });

    this.potionsBookButton.on("pointerdown", () => {
      this.togglePotionsBook();
    });

    // create MaterialsBook button
    this.materialsBookButton = this.add
      .image(this.scale.width / 2 - 320, this.scale.height - 50, "iconset", 56)
      .setScale(3)
      .setInteractive({ cursor: "pointer" });

    this.materialsBookButton.on("pointerdown", () => {
      this.toggleMaterialsBook();
    });

    // create inventory button
    this.inventoryButton = this.add
      .image(
        this.scale.width / 2 - 20,
        this.scale.height - 50,
        "inventoryButton"
      )
      .setScale(0.1)
      .setInteractive({ cursor: "pointer" });

    this.inventoryButton.on("pointerdown", () => {

      this.toggleInventory(this.gameScene.player);
    });

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (
        !gameObjects.includes(this.inventoryWindow.rect) &&
        !gameObjects.includes(this.inventoryButton) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[0].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[1].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[2].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[3].item) &&
        !gameObjects.includes(this.inventoryWindow.inventoryItems[4].item) &&
        !gameObjects.includes(this.inventoryWindow.discardButton) &&
        !gameObjects.includes(this.inventoryWindow.equipButton) &&
        !gameObjects.includes(this.playerStatsWindow.rect) &&
        !gameObjects.includes(this.playerStatsWindow.removeItemButton) &&
        !gameObjects.includes(this.playerStatsButton) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[0].item) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[1].item) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[2].item) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[3].item) &&
        !gameObjects.includes(this.playerStatsWindow.equipedItems[4].item) &&
        !gameObjects.includes(this.weaponsBookButton) &&
        !gameObjects.includes(this.potionsBookButton) &&
        !gameObjects.includes(this.materialsBookButton)
      ) {
        this.gameScene.dialogWindow.rect.setInteractive();
        this.inventoryWindow.hideWindow();
        this.showInventory = false;

        this.playerStatsWindow.hideWindow();
        this.showPlayerStats = false;

        this.weaponsBook.hideWindow();
        this.showWeaponsBook = false;

        this.potionsBook.hideWindow();
        this.showPotionsBook = false;

        this.materialsBook.hideWindow();
        this.showMaterialsBook = false;

        this.popup.hideWindow();
      }
    });
  }

  setupEvents() {
    this.gameScene.events.on("showInventory", (playerObject) => {
      this.toggleInventory(playerObject);
    });
  }

  toggleWeaponsBook() {
    this.potionsBook.hideWindow();
    this.showPotionsBook = false;

    this.materialsBook.hideWindow();
    this.showMaterialsBook = false;

    this.showWeaponsBook = !this.showWeaponsBook;
    if (this.showWeaponsBook) {
      this.weaponsBook.showWindow(this.gameScene.player);
    } else {
      this.weaponsBook.hideWindow();
    }
  }

  toggleMaterialsBook() {
    this.weaponsBook.hideWindow();
    this.showWeaponsBook = false;

    this.potionsBook.hideWindow();
    this.showPotionsBook = false;

    this.showMaterialsBook = !this.showMaterialsBook;
    if (this.showMaterialsBook) {
      this.materialsBook.showWindow(this.gameScene.player);
    } else {
      this.materialsBook.hideWindow();
    }
  }

  togglePotionsBook() {
    this.weaponsBook.hideWindow();
    this.showWeaponsBook = false;

    this.materialsBook.hideWindow();
    this.showMaterialsBook = false;

    this.showPotionsBook = !this.showPotionsBook;
    if (this.showPotionsBook) {
      this.potionsBook.showWindow(this.gameScene.player);
    } else {
      this.potionsBook.hideWindow();
    }
  }

  toggleInventory(playerObject) {
    this.showInventory = !this.showInventory;
    if (this.showInventory) {
      this.gameScene.dialogWindow.rect.disableInteractive();
      this.inventoryWindow.showWindow(playerObject);
    } else {
      this.gameScene.dialogWindow.rect.setInteractive();
      this.inventoryWindow.hideWindow();
    }
  }

  toggleShop(playerObject, active) {
    this.showShopWindow = active;
    if (this.showShopWindow) {

      this.shopWindow.showWindow(playerObject);
    } else {
      this.shopWindow.hideWindow();
    }
  }

  togglePlayerStats(playerObject) {
    this.showPlayerStats = !this.showPlayerStats;
    if (this.showPlayerStats) {
      this.gameScene.dialogWindow.rect.disableInteractive();
      this.playerStatsWindow.showWindow(playerObject);
    } else {
      this.gameScene.dialogWindow.rect.setInteractive();
      this.playerStatsWindow.hideWindow();
    }
  }

  createPlayersStatsUi(playerObject) {
    //create stats container
    this.playerStatsContainer = this.add.container(0, 20);
    this.containerImage = this.add
      .image(20, 0, "iconset", iconsetSlotsTypes.SLOT_9)
      .setScale(24, 6)
      .setAlpha(0.8);
    this.playerStatsContainer.add(this.containerImage);
    //Create Bars
    this.createPlayerExpBar(playerObject);
    this.createPlayerHealthBar(playerObject);

    //Create texts
    this.levelText = this.add
      .text(
        60,
        this.scale.height / 14 + 10,
        `Level: ${playerObject.exp} /  ${playerObject.maxExp} - ${playerObject.level}`,
        {
          fontSize: "22px",
          fill: "#fff",
        }
      )
      .setDepth(DEPTH.UI);

    this.healtText = this.add
      .text(
        60,
        this.scale.height / 22 - 8,
        `HP: ${playerObject.health} /  ${playerObject.maxHealth}`,
        {
          fontSize: "22px",
          fill: "#fff",
        }
      )
      .setDepth(DEPTH.UI);

    this.potionACountText.setText(`${playerObject.potions}`);

    //create equiped slots icons

    this.slotA = this.add.image(
      50,
      this.scale.height - 50,
      "iconset",
      iconsetSlotsTypes.SLOT_1
    );

    this.slotB = this.add.image(
      150,
      this.scale.height - 50,
      "iconset",
      iconsetSlotsTypes.SLOT_1
    );

    //create equiped weapons icons

    this.slotC = this.add.image(
      50,
      this.scale.height - 150,
      "iconset",
      iconsetSlotsTypes.SLOT_1
    );

    this.actionA = this.add.image(
      55,
      this.scale.height - 55,
      "iconset",
      iconsetWeaponTypes.SMALL_WOODEN_SWORD
    );
    this.actionB = this.add.image(
      150,
      this.scale.height - 50,
      "iconset",
      iconsetWeaponTypes.BOW
    );

    this.potionA = this.add.image(
      50,
      this.scale.height - 150,
      "iconset",
      iconsetPotionsTypes.HEALTH_POTION
    );

    this.actionA.setScale(2.5);
    this.actionB.setScale(2.5);
    this.potionA.setScale(2.5);

    this.actionA.setOrigin(0.5);
    this.actionB.setOrigin(0.5);
    this.potionA.setOrigin(0.5);

    this.slotA.setScale(3);
    this.slotB.setScale(3);
    this.slotC.setScale(3);
  }

  updatePlayerStatsUi(playerObject) {
    this.levelText.setText(
      `Level: ${playerObject.exp} /  ${playerObject.maxExp} - ${playerObject.level}`
    );
    this.healtText.setText(
      `HP: ${playerObject.health} /  ${playerObject.maxHealth}`
    );
  }

  createPlayerExpBar(playerObject) {
    this.expBar = new Bar(
      this,
      40,
      this.scale.height / 14,
      "bar_sheet",
      healthBarTypes.EXP,
      healthBarTypes.HOLDER,
      DEPTH.UI,
      300
    );

    this.updatePlayerExpBar(playerObject);
  }

  updatePlayerExpBar(playerObject) {
    this.expBar.UpdateBar(
      40,
      this.scale.height / 14,
      playerObject.exp,
      playerObject.maxExp
    );
  }

  createPlayerHealthBar(playerObject) {
    this.healthBar = new Bar(
      this,
      40,
      this.scale.height / 24,
      "bar_sheet",
      healthBarTypes.LIFE_BAR,
      healthBarTypes.HOLDER,
      DEPTH.UI,
      300
    );

    this.updatePlayerHealthBar(playerObject);
  }

  updatePlayerHealthBar(playerObject) {
    this.healthBar.UpdateBar(
      40,
      this.scale.height / 28 - 5,
      playerObject.health,
      playerObject.maxHealth
    );
  }

  resize(gameSize) {
    if (this.inventoryWindow) this.inventoryWindow.resize(gameSize);
    if (this.playerStatsWindow) this.playerStatsWindow.resize(gameSize);
    if (this.descriptionWindow) this.descriptionWindow.resize(gameSize);

    if (gameSize.width < 560) {
      this.inventoryButton.x = gameSize.width - 350;
      this.playerStatsButton.x = gameSize.width - 450;
    } else if (gameSize.width <= 560) {
      this.inventoryButton.x = gameSize.width - 350;
      this.playerStatsButton.x = gameSize.width - 450;
    } else {
      this.inventoryButton.x = gameSize.width - 350;
      this.playerStatsButton.x = gameSize.width - 450;
    }
  }

  createWindows() {
    // create weaponsBook Window
    this.weaponsBook = new SlotsWindow(
      this,
      {
        windowWidth: this.scale.width / 2,
        windowHeight: this.scale.height * 0.8,
        borderAlpha: 1,
        windowAlpha: 0.9,
        debug: false,
        textAlpha: 1,
        windowColor: 0x000000,
        name: "weaponsBook",
      },
      this.gameScene.cache.json.get("weaponsData")
    );

    // create potionsBook Window
    this.potionsBook = new SlotsWindow(
      this,
      {
        windowWidth: this.scale.width / 2,
        windowHeight: this.scale.height * 0.8,
        borderAlpha: 1,
        windowAlpha: 0.9,
        debug: false,
        textAlpha: 1,
        windowColor: 0x000000,
        name: "potionsBook",
      },
      this.gameScene.cache.json.get("potionsData")
    );

    // create materialsBook Window
    this.materialsBook = new SlotsWindow(
      this,
      {
        windowWidth: this.scale.width / 2,
        windowHeight: this.scale.height * 0.8,
        borderAlpha: 1,
        windowAlpha: 0.9,
        debug: false,
        textAlpha: 1,
        windowColor: 0x000000,
        name: "materialsBook",
      },
      this.gameScene.cache.json.get("materialsData")
    );

    //create Popup window
    this.shopWindow = new ShopWindow(this, {
      x: this.scale.width / 2 - 174,
      y: this.scale.height / 2 - 200,
      windowWidth: 360,
      windowHeight: 220,
      borderAlpha: 1,
      windowAlpha: 0.9,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
      name: "shopWindow",
    });

    //create Popup window
    this.popup = new PopupWindow(this, {
      x: this.scale.width / 2 - 174,
      y: this.scale.height / 2 - 200,
      windowWidth: 360,
      windowHeight: 120,
      borderAlpha: 1,
      windowAlpha: 0.9,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
      name: "popup",
    });

    // create playerStats window
    this.playerStatsWindow = new PlayerWindow(this, {
      windowWidth: this.scale.width / 5,
      windowHeight: this.scale.height * 0.3,
      borderAlpha: 1,
      windowAlpha: 0.9,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
      name: "playerStatsWindow",
    });

    // create inventory window
    this.inventoryWindow = new InventoryWindow(this, {
      windowWidth: this.scale.width / 4 - 300,
      windowHeight: this.scale.height * 0.3,
      borderAlpha: 1,
      windowAlpha: 0.9,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
      name: "inventoryWindow",
    });

    this.descriptionWindow = new ItemDescriptionWindow(this, {
      x: this.gameScene.input.mousePointer.x,
      y: this.gameScene.input.mousePointer.y,
      windowWidth: 360,
      windowHeight: 120,
      borderAlpha: 1,
      windowAlpha: 1,
      debug: false,
      textAlpha: 1,
      windowColor: 0x000000,
      name: "descriptionWindow",
    });
  }
}
