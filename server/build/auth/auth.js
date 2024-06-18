"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _passport = _interopRequireDefault(require("passport"));
var _passportLocal = _interopRequireDefault(require("passport-local"));
var _passportJwt = _interopRequireDefault(require("passport-jwt"));
var _UserModel = _interopRequireDefault(require("../models/UserModel"));
// handle user registration
_passport["default"].use("signup", new _passportLocal["default"].Strategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
}, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(request, email, password, done) {
    var username, player, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          username = request.body.username;
          player = {
            playerName: username,
            attack: 25,
            defense: 10,
            maxHealth: 150,
            health: 150,
            frame: 0,
            key: "characters_1",
            gold: 20,
            items: null,
            equipedItems: null,
            exp: 0,
            maxExp: 100,
            level: 1,
            potions: 0
          };
          _context.next = 5;
          return _UserModel["default"].create({
            email: email,
            password: password,
            username: username,
            player: player
          });
        case 5:
          user = _context.sent;
          return _context.abrupt("return", done(null, user));
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", done(_context.t0));
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}()));

// handle user login
_passport["default"].use("login", new _passportLocal["default"].Strategy({
  usernameField: "username",
  passwordField: "password"
}, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(username, password, done) {
    var user, valid;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _UserModel["default"].findOne({
            username: username
          });
        case 3:
          user = _context2.sent;
          if (user) {
            _context2.next = 6;
            break;
          }
          return _context2.abrupt("return", done(new Error("user not found"), false));
        case 6:
          if (user.player) {
            _context2.next = 8;
            break;
          }
          return _context2.abrupt("return", done(new Error("user not found"), false));
        case 8:
          _context2.next = 10;
          return user.isValidPassword(password);
        case 10:
          valid = _context2.sent;
          if (valid) {
            _context2.next = 13;
            break;
          }
          return _context2.abrupt("return", done(new Error("invalid password"), false));
        case 13:
          return _context2.abrupt("return", done(null, user));
        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", done(_context2.t0));
        case 19:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 16]]);
  }));
  return function (_x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}()));

// verify jwt token
_passport["default"].use(new _passportJwt["default"].Strategy({
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: function jwtFromRequest(request) {
    var token = null;
    if (request && request.cookies) token = request.cookies.jwt;
    return token;
  }
}, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(token, done) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          return _context3.abrupt("return", done(null, token.user));
        case 4:
          _context3.prev = 4;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", done(_context3.t0));
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 4]]);
  }));
  return function (_x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()));
//# sourceMappingURL=auth.js.map