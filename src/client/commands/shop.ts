import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandStringOption
  } from "discord.js";
import { mapLocale, t } from "../../utils/localization";
import { colorRoleService } from "../../services";
import { Embed } from "../../models";

export const shop = {
    data: new SlashCommandBuilder()
      .setName('shop')
      .setNameLocalizations({
            "en-US": t('commands.shop.name', 'en-US'),
            "pt-BR": t('commands.shop.name', 'pt-BR')
        })
        .addStringOption(new SlashCommandStringOption()
            .setName('type')
            .setNameLocalizations({
                "en-US": t('commands.shop.options.type.name', 'en-US'),
                "pt-BR": t('commands.shop.options.type.name', 'pt-BR')
            })
            .setDescription(t('commands.shop.options.type.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.shop.options.type.description', 'en-US'),
                "pt-BR": t('commands.shop.options.type.description', 'pt-BR')
            })
            .setChoices([
                {
                    "name": "roles",
                    "name_localizations": {
                        "en-US": t('commands.shop.options.type.choices.roles.name', 'en-US'),
                        "pt-BR": t('commands.shop.options.type.choices.roles.name', 'pt-BR')
                    },
                    "value": "roles"
                }
            ])
            .setRequired(true)
        ),
    usage: '/shop',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const shopType = interaction.options.getString('type');
        const guild = interaction.guild;
        if(!guild || !shopType) return;

        const locale = mapLocale(interaction.locale);

        if(shopType == "roles") {
            const roles = await colorRoleService.getGuildRoles(guild.id);
            if(!roles) return;
            const pageSize = 10;

            const embed = new Embed()
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
                .setFooter({ 'text': t('commands.shop.options.type.choices.roles.response.footer', locale) })
                .setTimestamp(new Date())

            let rolelist = '';

            for(let i = 0; i < pageSize; i++) {
                if(!roles[i]) continue;
                rolelist += `${i+1}. <@&${roles[i].role_id}> (**${roles[i].name}**)\n`
            }

            embed.setDescription(rolelist)
            embed.setTitle(t('commands.shop.options.type.choices.roles.response.title', locale))

            return await interaction.reply({ embeds: [ embed.build(), ], ephemeral: true });
        }
    },
};