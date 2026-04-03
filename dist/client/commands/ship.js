"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ship = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../utils/localization");
const models_1 = require("../../models");
const services_1 = require("../../services");
const help_1 = require("./help");
exports.ship = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('ship')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ship.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ship.name', 'pt-BR')
    })
        .setDescription('Shows the ship compatibility between two users.')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ship.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ship.description', 'pt-BR')
    })
        .addUserOption(new discord_js_1.SlashCommandUserOption()
        .setName('user')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('misc.user', 'en-US'),
        'pt-BR': (0, localization_1.t)('misc.user', 'pt-BR')
    })
        .setDescription('User to Ship')
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.ship.options.user.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.ship.options.user.description', 'pt-BR')
    })
        .setRequired(true))
        .addUserOption(new discord_js_1.SlashCommandUserOption()
        .setName('seconduser')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('misc.user2', 'en-US'),
        'pt-BR': (0, localization_1.t)('misc.user2', 'pt-BR')
    })
        .setDescription('User to Ship')
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.ship.options.user.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.ship.options.user.description', 'pt-BR')
    })),
    category: help_1.CommandCategory.FUN,
    usage: '/ship',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user1 = interaction.options.getUser('user', true);
        const user2 = (_a = interaction.options.getUser('seconduser')) !== null && _a !== void 0 ? _a : interaction.user;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        if (user1.id === user2.id) {
            return interaction.reply({
                embeds: [
                    new models_1.Embed()
                        .setColor("Red")
                        .setDescription((0, localization_1.t)("commands.ship.same_user_error", locale))
                        .build()
                ],
                ephemeral: true
            });
        }
        const ship = yield services_1.shipService.getShip(user1.id, user2.id);
        const value = ship.value;
        const image = yield services_1.shipService.generateShipImage(user1.displayAvatarURL({ extension: "png", size: 512 }), user2.displayAvatarURL({ extension: "png", size: 512 }), value);
        const emoji = value >= 80 ? "💖" : value >= 50 ? "💘" : "💔";
        const color = value >= 80 ? "DarkVividPink" : value >= 50 ? "Orange" : "Red";
        const embed = new models_1.Embed()
            .setTitle((0, localization_1.t)("commands.ship.result.title", locale))
            .setDescription((0, localization_1.format)((0, localization_1.t)("commands.ship.result.description", locale), {
            user1: user1.username,
            user2: user2.username,
            value: `${value}%`,
            emoji
        }))
            .setImage({ url: "attachment://ship.png" })
            .setColor(color)
            .setTimestamp(new Date());
        yield interaction.reply({
            embeds: [embed.build()],
            files: [image]
        });
    })
};
