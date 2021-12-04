"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _PlayerModel = _interopRequireDefault(require("../models/PlayerModel"));

var _UserModel = _interopRequireDefault(require("../models/UserModel"));

var _ChatModel = _interopRequireDefault(require("../models/ChatModel"));

var levelData = _interopRequireWildcard(require("../../public/assets/level/new_level.json"));

var itemData = _interopRequireWildcard(require("../../public/assets/level/tools.json"));

var enemyData = _interopRequireWildcard(require("../../public/assets/Enemies/enemies.json"));

var _Spawner = _interopRequireDefault(require("./controllers/Spawner"));

var _utils = require("./utils");

var _ItemModel = _interopRequireDefault(require("../models/ItemModel"));

var _ChestModel = _interopRequireDefault(require("../models/ChestModel"));

var _uuid = require("uuid");

var _MonsterModel = _interopRequireDefault(require("../models/MonsterModel"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var GameManager = /*#__PURE__*/function () {
  function GameManager(io) {
    (0, _classCallCheck2["default"])(this, GameManager);
    this.io = io;
    this.spawners = {};
    this.chests = {};
    this.monsters = {};
    this.players = {};
    this.items = {};
    this.npcs = {};
    this.rangedObjects = {};
    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {};
    this.npcLocations = {};
    this.itemsLocations = itemData.locations;
    this.itemDictionary = {
      chest: this.createChest.bind(this),
      item: this.createItem.bind(this),
      "": this.drop
    };
  }

  (0, _createClass2["default"])(GameManager, [{
    key: "setup",
    value: function setup() {
      this.parseMapData();
      this.setupEventListeners();
      this.setupSpawners();
    }
  }, {
    key: "parseMapData",
    value: function parseMapData() {
      var _this = this;

      this.levelData = levelData;
      this.levelData.layers.forEach(function (layer) {
        if (layer.name === "player_locations") {
          layer.objects.forEach(function (obj) {
            _this.playerLocations.push([obj.x, obj.y]);
          });
        } else if (layer.name === "monster_locations") {
          layer.objects.forEach(function (obj) {
            if (_this.monsterLocations[obj.properties.spawner]) {
              _this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
            } else {
              _this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];
            }
          });
        } else if (layer.name === "chest_locations") {
          layer.objects.forEach(function (obj) {
            if (_this.chestLocations[obj.properties.spawner]) {
              _this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
            } else {
              _this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];
            }
          });
        } else if (layer.name === "npc_locations") {
          layer.objects.forEach(function (obj) {
            if (_this.npcLocations[obj.properties.spawner]) {
              _this.npcLocations[obj.properties.spawner].push([obj.x, obj.y]);
            } else {
              _this.npcLocations[obj.properties.spawner] = [[obj.x, obj.y]];
            }
          });
        }
      });
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this2 = this;

      this.io.on("connection", function (socket) {
        // player disconnected
        socket.on("savePlayerData", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  if (!_this2.players[socket.id].items) {
                    _this2.players[socket.id].items = null;
                  }

                  if (!_this2.players[socket.id].equipedItems) {
                    _this2.players[socket.id].equipedItems = null;
                  }

                  _context.next = 5;
                  return _UserModel["default"].updateOne({
                    username: _this2.players[socket.id].playerName
                  }, {
                    $set: {
                      player: _this2.players[socket.id]
                    }
                  });

                case 5:
                  _context.next = 10;
                  break;

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context["catch"](0);
                  console.log(_context.t0);

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 7]]);
        })));
        socket.on("disconnect", function () {
          // delete user data from server
          console.log("disconnect");
          delete _this2.players[socket.id]; // emit a message to all players to remove this player

          _this2.io.emit("disconnected", socket.id);
        });
        socket.on("sendMessage", /*#__PURE__*/function () {
          var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message, token) {
            var decoded, email;
            return _regenerator["default"].wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                    email = decoded.user.email;
                    _context2.next = 5;
                    return _ChatModel["default"].create({
                      email: email,
                      message: message
                    });

                  case 5:
                    _this2.io.emit("newMessage", {
                      message: message,
                      name: _this2.players[socket.id].playerName,
                      frame: _this2.players[socket.id].frame
                    });

                    _context2.next = 11;
                    break;

                  case 8:
                    _context2.prev = 8;
                    _context2.t0 = _context2["catch"](0);
                    console.log(_context2.t0);

                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, null, [[0, 8]]);
          }));

          return function (_x, _x2) {
            return _ref2.apply(this, arguments);
          };
        }());
        socket.on("newPlayer", /*#__PURE__*/function () {
          var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(token, key) {
            var decoded, _decoded$user, name, _id, playerSchema;

            return _regenerator["default"].wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.prev = 0;
                    decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
                    _decoded$user = decoded.user, name = _decoded$user.name, _id = _decoded$user._id;
                    _context3.next = 5;
                    return _UserModel["default"].findById(_id);

                  case 5:
                    playerSchema = _context3.sent;

                    // create a new Player
                    _this2.spawnPlayer(socket.id, name, key, playerSchema.player); // send the players object to the new player


                    socket.emit("currentPlayers", _this2.players); // send the monsters object to the new player

                    socket.emit("currentMonsters", _this2.monsters); // send the chests object to the new player

                    socket.emit("currentChests", _this2.chests); // send the items object to the new player

                    socket.emit("currentItems", _this2.items); // send the npcs object to the new player

                    socket.emit("currentNpcs", _this2.npcs); // inform the other players of the new player that joined

                    socket.broadcast.emit("spawnPlayer", _this2.players[socket.id]);
                    socket.emit("updateItems", _this2.players[socket.id]);
                    socket.broadcast.emit("updatePlayersItems", socket.id, _this2.players[socket.id]);
                    _context3.next = 21;
                    break;

                  case 17:
                    _context3.prev = 17;
                    _context3.t0 = _context3["catch"](0);
                    console.log(_context3.t0);
                    socket.emit("invalidToken");

                  case 21:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, null, [[0, 17]]);
          }));

          return function (_x3, _x4) {
            return _ref3.apply(this, arguments);
          };
        }());
        socket.on("playerMovement", function (playerData) {
          if (_this2.players[socket.id]) {
            _this2.players[socket.id].x = playerData.x;
            _this2.players[socket.id].y = playerData.y;
            _this2.players[socket.id].flipX = playerData.flipX;
            _this2.players[socket.id].actionAActive = playerData.actionAActive;
            _this2.players[socket.id].potionAActive = playerData.potionAActive;
            _this2.players[socket.id].frame = playerData.frame;
            _this2.players[socket.id].currentDirection = playerData.currentDirection; // emit a message to all players about the player that moved

            _this2.io.emit("playerMoved", _this2.players[socket.id]);
          }
        });
        socket.on("pickUpChest", function (chestId) {
          // update the spawner
          if (_this2.chests[chestId]) {
            var gold = _this2.chests[chestId].gold; // updating the players gold

            _this2.players[socket.id].updateGold(gold);

            socket.emit("updateScore", _this2.players[socket.id].gold);
            socket.broadcast.emit("updatePlayersScore", socket.id, _this2.players[socket.id].gold); // removing the chest

            _this2.deleteChest(chestId);
          }
        });
        socket.on("pickUpItem", function (itemId) {
          // update the spawner
          if (_this2.items[itemId]) {
            if (_this2.players[socket.id].canPickupItem()) {
              _this2.players[socket.id].addItem(_this2.items[itemId]);

              socket.emit("updateItems", _this2.players[socket.id]);
              socket.broadcast.emit("updatePlayersItems", socket.id, _this2.players[socket.id]); // removing the item

              _this2.deleteItems(itemId);
            }
          }
        });
        socket.on("playerDroppedItem", function (itemId) {
          _this2.players[socket.id].removeItem(itemId);

          socket.emit("updateItems", _this2.players[socket.id]);
          socket.broadcast.emit("updatePlayersItems", socket.id, _this2.players[socket.id]);
        });
        socket.on("playerEquipedItem", function (itemId) {
          if (_this2.players[socket.id].items[itemId]) {
            if (_this2.players[socket.id].canEquipItem()) {
              _this2.players[socket.id].equipItem(_this2.players[socket.id].items[itemId]);

              socket.emit("updateItems", _this2.players[socket.id]);
              socket.broadcast.emit("updatePlayersItems", socket.id, _this2.players[socket.id]);
            }
          }
        });
        socket.on("playerUnequipedItem", function (itemId) {
          if (_this2.players[socket.id].equipedItems[itemId]) {
            if (_this2.players[socket.id].canPickupItem()) {
              _this2.players[socket.id].addItem(_this2.players[socket.id].equipedItems[itemId]);

              _this2.players[socket.id].removeEquipedItem(itemId);

              socket.emit("updateItems", _this2.players[socket.id]);
              socket.broadcast.emit("updatePlayersItems", socket.id, _this2.players[socket.id]);
            }
          }
        });
        socket.on("levelUp", function () {
          _this2.players[socket.id].levelUp();

          _this2.io.emit("updatePlayerStats", socket.id, _this2.players[socket.id].level, _this2.players[socket.id].attack, _this2.players[socket.id].defense, _this2.players[socket.id].maxHealth, _this2.players[socket.id].exp, _this2.players[socket.id].maxExp);
        });
        socket.on("attackedPlayer", function (attackedPlayerId) {
          if (_this2.players[attackedPlayerId]) {
            // get required info from attacked player
            var gold = _this2.players[attackedPlayerId].gold;
            var playerAttackValue = _this2.players[socket.id].attack; // subtract health from attacked player

            _this2.players[attackedPlayerId].playerAttacked(playerAttackValue); // check attacked players health, if dead send gold to other player


            if (_this2.players[attackedPlayerId].health <= 0) {
              // get the amount of gold, and update player object
              _this2.players[socket.id].updateGold(gold); // respawn attacked player


              _this2.players[attackedPlayerId].respawn(_this2.players);

              _this2.io.emit("respawnPlayer", _this2.players[attackedPlayerId]); // send update gold message to player


              socket.emit("updateScore", _this2.players[socket.id].gold); // reset the attacked players gold

              _this2.players[attackedPlayerId].updateGold(-gold);

              _this2.io.to("".concat(attackedPlayerId)).emit("updateScore", _this2.players[attackedPlayerId].gold); // add bonus health to the player


              _this2.players[socket.id].updateHealth(15);

              _this2.io.emit("updatePlayerHealth", socket.id, _this2.players[socket.id].health);
            } else {
              _this2.io.emit("updatePlayerHealth", attackedPlayerId, _this2.players[attackedPlayerId].health);
            }
          }
        });
        socket.on("monsterAttacked", function (monsterId, dis) {
          // update the spawner
          if (_this2.monsters[monsterId]) {
            var _this2$monsters$monst = _this2.monsters[monsterId],
                gold = _this2$monsters$monst.gold,
                attack = _this2$monsters$monst.attack,
                exp = _this2$monsters$monst.exp;
            var playerAttackValue = _this2.players[socket.id].attack; // subtract health monster model

            _this2.monsters[monsterId].loseHealth(playerAttackValue); // check the monsters health, and if dead remove that object


            if (_this2.monsters[monsterId].health <= 0) {
              // updating the players gold
              _this2.players[socket.id].updateGold(gold);

              socket.emit("updateScore", _this2.players[socket.id].gold); //update xp

              _this2.players[socket.id].updateExp(exp);

              _this2.io.emit("updateXp", exp, socket.id);

              _this2.deleteMonster(monsterId);
            } else {
              // update the monsters health
              _this2.io.emit("updateMonsterHealth", monsterId, _this2.monsters[monsterId].health);
            }
          }
        });
        socket.on("monsterAttack", function (monsterId, playerId) {
          var attack = _this2.monsters[monsterId].attack; // update the players health

          _this2.players[playerId].playerAttacked(attack);

          _this2.io.emit("updatePlayerHealth", playerId, _this2.players[playerId].health); // check the player's health, if below 0 have the player respawn


          if (_this2.players[playerId].health <= 0) {
            // update the gold the player has
            _this2.players[playerId].updateGold(parseInt(-_this2.players[playerId].gold / 2, 10));

            socket.emit("updateScore", _this2.players[playerId].gold); // respawn the player

            _this2.players[playerId].respawn(_this2.players);

            _this2.io.emit("respawnPlayer", _this2.players[playerId]);
          }
        });
        socket.on("playerHit", function (damage) {});
        socket.on("healthPotion", function (playerId, health) {
          if (socket.id === playerId) {
            _this2.players[socket.id];

            _this2.players[socket.id].potion(health);

            _this2.io.emit("updatePlayerHealth", socket.id, _this2.players[socket.id].health);
          }
        });
        socket.on("sendBuyItemMessage", function (item) {
          _this2.players[socket.id].potions++;

          _this2.players[socket.id].updateGold(-item.price);

          socket.emit("updateScore", _this2.players[socket.id].gold);
          socket.broadcast.emit("updatePlayersScore", socket.id, _this2.players[socket.id].gold);
        });
        socket.on("monsterMovement", function (monster) {
          if (!_this2.monsters[monster.id]) return;
          _this2.monsters[monster.id].stateTime = monster.stateTime;
          _this2.monsters[monster.id].randomPosition = monster.randomPosition;
          _this2.monsters[monster.id].x = monster.x;
          _this2.monsters[monster.id].y = monster.y; // emit a message to all players about the monster that moved

          _this2.io.emit("monsterMoved", _this2.monsters[monster.id]);
        });
        socket.on("dropItem", function (x, y, item) {
          _this2.itemDictionary[item](x, y);
        }); // player connected to our game

        console.log("player connected to our game");
      });
    }
  }, {
    key: "setupSpawners",
    value: function setupSpawners() {
      var _this3 = this;

      var config = {
        spawnInterval: 3000,
        limit: 3,
        spawnerType: _utils.SpawnerType.CHEST,
        id: ""
      };
      var spawner; // create chest spawners

      Object.keys(this.chestLocations).forEach(function (key) {
        config.id = "chest-".concat(key);
        spawner = new _Spawner["default"](config, _this3.chestLocations[key], _this3.addChest.bind(_this3), _this3.deleteChest.bind(_this3));
        _this3.spawners[spawner.id] = spawner;
      }); // create monster spawners

      Object.keys(this.monsterLocations).forEach(function (key) {
        config.id = "monster-".concat(key);
        config.limit = 8;
        config.spawnerType = _utils.SpawnerType.MONSTER;
        spawner = new _Spawner["default"](config, _this3.monsterLocations[key], _this3.addMonster.bind(_this3), _this3.deleteMonster.bind(_this3));
        _this3.spawners[spawner.id] = spawner;
      }); // create npc spawners

      Object.keys(this.npcLocations).forEach(function (key) {
        config.id = "npc-".concat(key);
        config.spawnerType = _utils.SpawnerType.NPC;
        spawner = new _Spawner["default"](config, _this3.npcLocations[key], _this3.addNpc.bind(_this3), _this3.deleteNpc.bind(_this3));
        _this3.spawners[spawner.id] = spawner;
      }); // create items spawners

      config.id = "item";
      config.spawnerType = _utils.SpawnerType.ITEM;
      spawner = new _Spawner["default"](config, this.itemsLocations, this.addItems.bind(this), this.deleteItems.bind(this));
      this.spawners[spawner.id] = spawner;
      setInterval(function () {
        if (Object.keys(_this3.monsters).length < 8) {
          _this3.spawnMonster();
        }
      }, 3000);
    }
  }, {
    key: "spawnPlayer",
    value: function spawnPlayer(playerId, name, key, playerSchema) {
      var player = new _PlayerModel["default"](playerId, this.playerLocations, this.players, name, key, undefined, playerSchema);
      this.players[playerId] = player;
    }
  }, {
    key: "addItems",
    value: function addItems(itemId, item) {
      this.items[itemId] = item;
      this.io.emit("itemSpawned", item);
    }
  }, {
    key: "deleteItems",
    value: function deleteItems(itemId) {
      delete this.items[itemId];
      this.io.emit("itemRemoved", itemId);
    }
  }, {
    key: "addChest",
    value: function addChest(chestId, chest) {
      this.chests[chestId] = chest;
      this.io.emit("chestSpawned", chest);
    }
  }, {
    key: "deleteChest",
    value: function deleteChest(chestId) {
      delete this.chests[chestId];
      this.io.emit("chestRemoved", chestId);
    }
  }, {
    key: "addMonster",
    value: function addMonster(monsterId, monster) {
      this.monsters[monsterId] = monster;
      this.io.emit("monsterSpawned", monster);
    }
  }, {
    key: "deleteMonster",
    value: function deleteMonster(monsterId) {
      delete this.monsters[monsterId];
      this.io.emit("monsterRemoved", monsterId);
    }
  }, {
    key: "addNpc",
    value: function addNpc(npcId, npc) {
      this.npcs[npcId] = npc;
      this.io.emit("npcSpawned", npc);
    }
  }, {
    key: "deleteNpc",
    value: function deleteNpc(npcId) {
      delete this.npcs[npcId];
      this.io.emit("npcRemoved", npcId);
    }
  }, {
    key: "drop",
    value: function drop(x, y) {}
  }, {
    key: "createChest",
    value: function createChest(x, y) {
      var chest = new _ChestModel["default"](x, y, (0, _utils.randomNumber)(10, 20), "chest-".concat((0, _uuid.v4)()));
      this.addChest(chest.id, chest);
    }
  }, {
    key: "createItem",
    value: function createItem(x, y) {
      var randomItem = itemData.items[Math.floor(Math.random() * itemData.items.length)];
      var item = new _ItemModel["default"](x, y, "item-".concat((0, _uuid.v4)()), randomItem.name, randomItem.frame, (0, _utils.getRandonValues)(), (0, _utils.getRandonValues)(), (0, _utils.getRandonValues)(), _utils.WeaponTypes.MELEE, "Description");
      this.addItems(item.id, item);
    }
  }, {
    key: "pickRandomLocation",
    value: function pickRandomLocation() {
      var location = this.monsterLocations[Math.floor(Math.random() * this.monsterLocations.length)];

      if (this.monsters.length > 0) {
        var invalidLocation = this.monsters.some(function (obj) {
          if (obj.x === location[0] && obj.y === location[1]) {
            return true;
          }

          return false;
        });
        if (invalidLocation) return this.pickRandomLocation();
        return location || [200, 200];
      }

      return location || [200, 200];
    }
  }, {
    key: "spawnMonster",
    value: function spawnMonster() {
      var randomEnemy = enemyData.enemies[Math.floor(Math.random() * enemyData.enemies.length)];
      var location = this.pickRandomLocation();
      var monster = new _MonsterModel["default"](location[0], location[1], randomEnemy.goldValue, // gold value
      this.id, randomEnemy.key, // key
      randomEnemy.healthValue, // health value
      randomEnemy.attackValue, // attack value
      randomEnemy.expValue, // exp value
      3000 //timer
      );
      this.addMonster(monster.id, monster);
    }
  }]);
  return GameManager;
}();

exports["default"] = GameManager;
//# sourceMappingURL=GameManager.js.map