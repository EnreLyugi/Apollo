import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ContainerBuilder,
    Guild,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextDisplayBuilder,
} from "discord.js";
import { mapLocale, t, format, type Locales } from "../../utils/localization";
import { colorRoleService, guildService, memberService, userColorService } from "../../services";
import { colors } from "../../config";
import { CommandCategory } from "./help";

const PAGE_SIZE = 25;

export async function buildColorShopContainer(guild: Guild, userId: string, locale: Locales, page = 0) {
    const roles = await colorRoleService.getGuildRoles(guild.id);
    if (!roles || roles.length === 0) return null;

    const guildData = await guildService.getGuildById(guild.id);
    const price = guildData?.color_roles_price ?? 1200;
    const memberData = await memberService.getMember(userId, guild.id);
    const balance = memberData?.coin ?? 0;
    const ownedIds = await userColorService.getOwnedRoleIds(userId, guild.id);

    const sortedRoles = [...roles].sort((a, b) => {
        const aOwned = ownedIds.has(a.role_id) ? 0 : 1;
        const bOwned = ownedIds.has(b.role_id) ? 0 : 1;
        return aOwned - bOwned;
    });

    const totalPages = Math.ceil(sortedRoles.length / PAGE_SIZE);
    const pageRoles = sortedRoles.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const selectOptions = pageRoles.map(role => {
        const owned = ownedIds.has(role.role_id);
        const opt = new StringSelectMenuOptionBuilder()
            .setLabel(role.name)
            .setValue(role.role_id);
        if (owned) {
            opt.setDescription(t('commands.shop.options.type.choices.roles.owned_label', locale));
            opt.setEmoji('✅');
        } else {
            opt.setDescription(`${price} coins`);
        }
        return opt;
    });

    const select = new StringSelectMenuBuilder()
        .setCustomId(`shopColorSelect:${page}`)
        .setPlaceholder(t('commands.shop.options.type.choices.roles.select_placeholder', locale))
        .addOptions(selectOptions);

    const description = format(
        t('commands.shop.options.type.choices.roles.response.description', locale),
        { price: String(price), count: String(sortedRoles.length), balance: String(balance) }
    );

    const pageInfo = totalPages > 1
        ? `\n${format(t('commands.shop.page_info', locale), { current: String(page + 1), total: String(totalPages) })}`
        : '';

    const colorPreview = pageRoles.map((role, i) => {
        const num = (page * PAGE_SIZE) + i + 1;
        const mention = `<@&${role.role_id}>`;
        const owned = ownedIds.has(role.role_id);
        return owned ? `\`${String(num).padStart(2, ' ')}.\` ${mention} ✅` : `\`${String(num).padStart(2, ' ')}.\` ${mention}`;
    }).join('\n');

    const container = new ContainerBuilder()
        .setAccentColor(parseInt(colors.default_color, 16))
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `## ${t('commands.shop.options.type.choices.roles.response.title', locale)}\n${description}${pageInfo}`
            )
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(colorPreview)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        .addActionRowComponents(
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)
        );

    if (totalPages > 1) {
        const navButtons: ButtonBuilder[] = [];
        if (page > 0) {
            navButtons.push(
                new ButtonBuilder()
                    .setCustomId(`shopColorPage:${page - 1}`)
                    .setLabel('◀')
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        if (page < totalPages - 1) {
            navButtons.push(
                new ButtonBuilder()
                    .setCustomId(`shopColorPage:${page + 1}`)
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        if (navButtons.length > 0) {
            container.addActionRowComponents(
                new ActionRowBuilder<ButtonBuilder>().addComponents(...navButtons)
            );
        }
    }

    return container;
}

interface ShopTypeEntry {
    id: string;
    label: (locale: Locales) => string;
    description: (locale: Locales) => string;
}

export const shopTypeRegistry: ShopTypeEntry[] = [
    {
        id: 'roles',
        label: (locale) => t('commands.shop.options.type.choices.roles.response.title', locale),
        description: (locale) => t('commands.shop.options.type.choices.roles.name', locale),
    },
];

export const shop = {
    data: new SlashCommandBuilder()
      .setName('shop')
      .setNameLocalizations({
            "en-US": t('commands.shop.name', 'en-US'),
            "pt-BR": t('commands.shop.name', 'pt-BR')
        })
        .setDescription('Some shops to spend your coins')
        .setDescriptionLocalizations({
            "en-US": t('commands.shop.description', 'en-US'),
            "pt-BR": t('commands.shop.description', 'pt-BR')
        }),
    category: CommandCategory.ECONOMY,
    usage: '/shop',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);

        if (shopTypeRegistry.length === 1) {
            const container = await buildColorShopContainer(guild, interaction.user.id, locale);
            if (!container) {
                await interaction.reply({ content: t('commands.shop.empty', locale), flags: MessageFlags.Ephemeral });
                return;
            }
            await interaction.reply({
                components: [container],
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
            return;
        }

        const selectOptions = shopTypeRegistry.map(s =>
            new StringSelectMenuOptionBuilder()
                .setLabel(s.label(locale))
                .setValue(s.id)
                .setDescription(s.description(locale))
        );

        const select = new StringSelectMenuBuilder()
            .setCustomId('shopTypeSelect')
            .setPlaceholder(t('commands.shop.type_select_placeholder', locale))
            .addOptions(selectOptions);

        const container = new ContainerBuilder()
            .setAccentColor(parseInt(colors.default_color, 16))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `## ${t('commands.shop.type_select_title', locale)}\n${t('commands.shop.type_select_description', locale)}`
                )
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
            )
            .addActionRowComponents(
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)
            );

        await interaction.reply({
            components: [container],
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        });
    },
};