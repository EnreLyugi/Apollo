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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../../utils/localization");
const models_1 = require("../../../../models");
const config_1 = require("../../../../config");
const ticketService_1 = __importDefault(require("../../../../services/ticketService"));
exports.close = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('close')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.close.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.close.name', 'pt-BR')
    })
        .setDescription('Closes the current ticket')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.close.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.close.description', 'pt-BR')
    }),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const channel = interaction.channel;
        if (!guild || !channel)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const ticket = yield ticketService_1.default.getTicketByChannel(channel.id);
        if (!ticket) {
            const embed = new models_1.Embed()
                .setColor(`#${config_1.colors.default_color}`)
                .setTitle((0, localization_1.t)('commands.ticket.subcommands.close.response_title', locale))
                .setDescription((0, localization_1.t)('commands.ticket.subcommands.close.not_a_ticket', locale))
                .setTimestamp(new Date());
            return interaction.reply({ embeds: [embed.build()], flags: discord_js_1.MessageFlags.Ephemeral });
        }
        yield ticketService_1.default.closeTicket(channel.id);
        try {
            const user = yield interaction.client.users.fetch(ticket.user_id);
            yield user.send((0, localization_1.t)('commands.ticket.close_dm', locale));
        }
        catch (_a) { }
        yield interaction.reply({ content: (0, localization_1.t)('commands.ticket.subcommands.close.closed', locale) });
    }),
};
