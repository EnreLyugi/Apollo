"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcommands = void 0;
const birthday_1 = require("./birthday");
const role_1 = require("./role");
const channel_1 = require("./channel");
const inviteRole_1 = require("./inviteRole");
exports.subcommands = [role_1.role, birthday_1.birthday, channel_1.channel, inviteRole_1.inviteRole];
