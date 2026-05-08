import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import { format, mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";
import ticketCategoryService from "../../../../services/ticketCategoryService";
import { parseEmoji } from "../../../../utils/parseEmoji";

export const category = {
    data: new SlashCommandSubcommandBuilder()
        .setName('category')
        .setNameLocalizations({
            "en-US": t('commands.ticket.subcommands.category.name', 'en-US'),
            "pt-BR": t('commands.ticket.subcommands.category.name', 'pt-BR')
        })
        .setDescription('Manages ticket categories')
        .setDescriptionLocalizations({
            "en-US": t('commands.ticket.subcommands.category.description', 'en-US'),
            "pt-BR": t('commands.ticket.subcommands.category.description', 'pt-BR')
        })
        .addStringOption(new SlashCommandStringOption()
            .setName('action')
            .setNameLocalizations({
                "en-US": t('commands.ticket.subcommands.category.options.action.name', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.category.options.action.name', 'pt-BR')
            })
            .setDescription('Action to perform')
            .setDescriptionLocalizations({
                "en-US": t('commands.ticket.subcommands.category.options.action.description', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.category.options.action.description', 'pt-BR')
            })
            .setChoices(
                { name: 'add', name_localizations: { "pt-BR": "adicionar" }, value: 'add' },
                { name: 'remove', name_localizations: { "pt-BR": "remover" }, value: 'remove' },
                { name: 'edit', name_localizations: { "pt-BR": "editar" }, value: 'edit' }
            )
            .setRequired(true)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName('name')
            .setNameLocalizations({
                "en-US": t('commands.ticket.subcommands.category.options.name.name', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.category.options.name.name', 'pt-BR')
            })
            .setDescription('Category name')
            .setDescriptionLocalizations({
                "en-US": t('commands.ticket.subcommands.category.options.name.description', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.category.options.name.description', 'pt-BR')
            })
            .setRequired(false)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName('description')
            .setNameLocalizations({
                "en-US": t('commands.ticket.subcommands.category.options.description.name', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.category.options.description.name', 'pt-BR')
            })
            .setDescription('Category description (only for add)')
            .setDescriptionLocalizations({
                "en-US": t('commands.ticket.subcommands.category.options.description.description', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.category.options.description.description', 'pt-BR')
            })
            .setRequired(false)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const action = interaction.options.getString('action')!;
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');

        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.ticket.subcommands.category.response_title', locale))
            .setTimestamp(new Date());

        if (action === 'edit') {
            const categories = await ticketCategoryService.getCategories(guild.id);
            if (categories.length === 0) {
                embed.setDescription(t('commands.ticket.subcommands.category.no_categories', locale));
                return interaction.reply({ embeds: [embed.build()], flags: MessageFlags.Ephemeral });
            }

            const selectOptions = categories.map(cat => {
                const { emoji, label } = parseEmoji(cat.name);
                const option = new StringSelectMenuOptionBuilder()
                    .setLabel(label)
                    .setValue(String(cat.id));
                if (emoji) option.setEmoji(emoji);
                if (cat.description) option.setDescription(cat.description);
                return option;
            });

            const select = new StringSelectMenuBuilder()
                .setCustomId('ticketCategoryEditSelect')
                .setPlaceholder(t('commands.ticket.subcommands.category.edit_select_placeholder', locale))
                .addOptions(selectOptions);

            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

            return interaction.reply({
                content: t('commands.ticket.subcommands.category.edit_select_prompt', locale),
                components: [row],
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!name) {
            embed.setDescription(t('commands.ticket.subcommands.category.name_required', locale));
            return interaction.reply({ embeds: [embed.build()], flags: MessageFlags.Ephemeral });
        }

        if (action === 'add') {
            const existing = await ticketCategoryService.getCategoryByName(guild.id, name);
            if (existing) {
                embed.setDescription(t('commands.ticket.subcommands.category.already_exists', locale));
                return interaction.reply({ embeds: [embed.build()], flags: MessageFlags.Ephemeral });
            }

            await ticketCategoryService.addCategory(guild.id, name, description || undefined);
            embed.setDescription(format(t('commands.ticket.subcommands.category.added', locale), { name }));
        } else {
            const existing = await ticketCategoryService.getCategoryByName(guild.id, name);
            if (!existing) {
                embed.setDescription(t('commands.ticket.subcommands.category.not_found', locale));
                return interaction.reply({ embeds: [embed.build()], flags: MessageFlags.Ephemeral });
            }

            await ticketCategoryService.removeCategory(existing.id, guild.id);
            embed.setDescription(format(t('commands.ticket.subcommands.category.removed', locale), { name }));
        }

        return interaction.reply({ embeds: [embed.build()], flags: MessageFlags.Ephemeral });
    },
};
