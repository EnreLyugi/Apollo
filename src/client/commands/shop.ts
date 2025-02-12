import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandStringOption
  } from "discord.js";
import { mapLocale, t } from "../../utils/localization";
import { colorRoleService } from "../../services";
import { Embed } from "../../models";
import { nextPageButton } from "../buttons/nextPage";
import { previousPageButton } from "../buttons/previousPage";
import { colors } from "../../config";

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
            let currentPage = 0;

            const updateEmbed = (page: number) => {
                const embed = new Embed()
                    .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
                    .setColor(`#${colors.default_color}`)
                    .setFooter({ text: t('commands.shop.options.type.choices.roles.response.footer', locale) })
                    .setTimestamp(new Date())
                    .setTitle(t('commands.shop.options.type.choices.roles.response.title', locale));
    
                let rolelist = '';
                for(let i = page * pageSize; i < (page + 1) * pageSize; i++) {
                    if(!roles[i]) continue;
                    rolelist += `${i+1}. <@&${roles[i].role_id}> (**${roles[i].name}**)\n`;
                }
                embed.setDescription(rolelist);
    
                return embed;
            };
    
            const components = (page: number) => {
                const buttons = new ActionRowBuilder();
                if(page > 0) buttons.addComponents(previousPageButton);
                if((page + 1) * pageSize < roles.length) buttons.addComponents(nextPageButton);
                return [buttons as any];
            };
    
            await interaction.reply({ 
                embeds: [updateEmbed(currentPage).build()], 
                components: components(currentPage), 
                ephemeral: true 
            });
    
            const collector = interaction.channel?.createMessageComponentCollector({ time: 60000 });
    
            collector?.on('collect', async (buttonInteraction) => {
                if(buttonInteraction.user.id !== interaction.user.id) {
                    return buttonInteraction.reply({ content: 'Você não pode usar esses botões.', ephemeral: true });
                }
    
                if (buttonInteraction.customId === 'nextPageButton') {
                    currentPage++;
                } else if (buttonInteraction.customId === 'previousPageButton') {
                    currentPage--;
                }
    
                await buttonInteraction.update({ 
                    embeds: [updateEmbed(currentPage).build()], 
                    components: components(currentPage) 
                });
            });
    
            collector?.on('end', () => {
                interaction.editReply({ components: [] });
            });
        }
    },
};