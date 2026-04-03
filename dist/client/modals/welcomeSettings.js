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
exports.welcomeSettings = void 0;
const services_1 = require("../../services");
exports.welcomeSettings = {
    data: {
        name: 'welcomeSettings'
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const channelId = interaction.fields.getTextInputValue('channelId');
        const title = interaction.fields.getTextInputValue('welcomeTitle');
        const description = interaction.fields.getTextInputValue('welcomeDescription');
        const image = interaction.fields.getTextInputValue('welcomeImage');
        const guild = interaction.guild;
        if (!guild)
            return interaction.reply({
                content: 'Erro!',
                ephemeral: true,
            });
        const channel = guild.channels.resolve(channelId);
        if (!channel)
            return interaction.reply({
                content: 'Invalid Channel!',
                ephemeral: true,
            });
        yield services_1.welcomeSettingsService.saveSettings(channel.id, guild.id, title, description, image);
        yield interaction.reply({
            content: 'Configurações de boas-vindas salvas com sucesso!',
            ephemeral: true,
        });
    })
};
