"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _ChatModel = _interopRequireDefault(require("../models/ChatModel"));
var levelData = _interopRequireWildcard(require("../../public/assets/level/new_level.json"));
var _MonsterController = _interopRequireDefault(require("./controllers/MonsterController"));
var _PlayerController = _interopRequireDefault(require("./controllers/PlayerController"));
var _ItemController = _interopRequireDefault(require("./controllers/ItemController"));
var _NpcController = _interopRequireDefault(require("./controllers/NpcController"));
var _MessageController = _interopRequireDefault(require("./controllers/MessageController"));
var _currentController = _interopRequireDefault(require("./controllers/currentController"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var GameManager = exports["default"] = /*#__PURE__*/function () {
  function GameManager(io) {
    (0, _classCallCheck2["default"])(this, GameManager);
    this.io = io;
    this.monsterController = new _MonsterController["default"](this.io);
    this.playerController = new _PlayerController["default"](this.io);
    this.itemController = new _ItemController["default"](this.io);
    this.npcController = new _NpcController["default"](this.io);
    this.messageController = new _MessageController["default"](this.io);
    this.currentController = new _currentController["default"](this.io);
    this.instanceId = "instance-0";
    this.rangedObjects = {};
    this.locationsDictionary = {};
  }
  return (0, _createClass2["default"])(GameManager, [{
    key: "setup",
    value: function setup() {
      this.parseMapData();
      this.setupEventListeners();
    }
  }, {
    key: "parseMapData",
    value: function parseMapData() {
      this.levelData = levelData;
      this.levelData.layers.forEach(function (_ref) {
        var name = _ref.name,
          objects = _ref.objects;
      } //this.locationsDictionary[name](objects);
      );
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      this.io.on("connection", function (socket) {
        socket.on("connect_error", function (err) {
          console.log("connect_error due to ".concat(err.message));
        });
        _this.monsterController.setupEventListeners(socket);
        _this.itemController.setupEventListeners(socket);
        _this.npcController.setupEventListeners(socket);
        _this.playerController.setupEventListeners(socket);
        _this.messageController.setupEventListeners(socket);
        _this.currentController.setupEventListeners(socket);
        socket.emit("currentPlayers", _this.playerController.players, _this.instanceId);
        socket.emit("currentMonsters", _this.monsterController.monsters, _this.instanceId);
        socket.emit("currentChests", _this.itemController.chests, _this.instanceId);
        socket.emit("currentItems", _this.itemController.items, _this.instanceId);

        // player connected to our game
        console.log("player connected to our game");
      });
    }
  }]);
}();
//# sourceMappingURL=GameManager.js.map