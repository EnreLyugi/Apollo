import { 
    ChatInputCommandInteraction,
    SlashCommandChannelOption,
    SlashCommandStringOption,
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle,
    ChannelType,
    SlashCommandSubcommandBuilder
} from "discord.js";
import { Embed } from "../../../../models/";
import { guildService } from "../../../../services";
import { mapLocale, t, format } from "../../../../utils/localization";
import { colors } from "../../../../config";
import { welcomeSettingsService } from "../../../../services";

export const setChannel = {
    data: new SlashCommandSubcommandBuilder()
        .setName('setchannel')
        .addStringOption(new SlashCommandStringOption()
            .setName('channeltype')
            .setNameLocalizations({
                "en-US": t('commands.set.subcommands.channel.options.channeltype.name', 'en-US'),
                "pt-BR": t('commands.set.subcommands.channel.options.channeltype.name', 'pt-BR')
            })
            .setDescription(t('commands.set.subcommands.channel.options.channeltype.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.set.subcommands.channel.options.channeltype.description', 'en-US'),
                "pt-BR": t('commands.set.subcommands.channel.options.channeltype.description', 'pt-BR')
            })
            .setChoices([
                {
                    "name": "welcome_channel",
                    "name_localizations": {
                        "en-US": t('commands.set.subcommands.channel.options.channeltype.choices.welcome_channel.name', 'en-US'),
                        "pt-BR": t('commands.set.subcommands.channel.options.channeltype.choices.welcome_channel.name', 'pt-BR')
                    },
                    "value": "welcome_channel"
                },
                {
                    "name": "voice_activity_log_channel",
                    "name_localizations": {
                        "en-US": t('commands.set.subcommands.channel.options.channeltype.choices.voice_activity_log_channel.name', 'en-US'),
                        "pt-BR": t('commands.set.subcommands.channel.options.channeltype.choices.voice_activity_log_channel.name', 'pt-BR')
                    },
                    "value": "voice_activity_log_channel"
                }
            ])
            .setRequired(true)
        )
        .addChannelOption(new SlashCommandChannelOption()
            .setName('channel')
            .addChannelTypes(ChannelType.GuildText)
            .setNameLocalizations({
                "en-US": t('commands.set.subcommands.channel.options.channel.name', 'en-US'),
                "pt-BR": t('commands.set.subcommands.channel.options.channel.name', 'pt-BR')
            })
            .setDescription(t('commands.setchannel.options.channel.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.set.subcommands.channel.options.channel.description', 'en-US'),
                "pt-BR": t('commands.set.subcommands.channel.options.channel.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    usage: '/set channel <channeltype> <channel>',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const channelType = interaction.options.getString('channeltype');
        const channel = interaction.options.getChannel('channel');

        if(!guild || !channel || !channelType) return;

        const locale = mapLocale(interaction.locale);
        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.set.subcommands.channel.response_title', locale))
            .setTimestamp(new Date());

        switch (channelType) {
            case 'welcome_channel':
                const currentSettings = await welcomeSettingsService.fetch(guild.id);

                const modal = new ModalBuilder()
                    .setCustomId('welcomeSettings')
                    .setTitle(t('modals.welcomeSettings.title', locale));
                
                const channelIdInput = new TextInputBuilder()
                    .setCustomId('channelId')
                    .setLabel(t('modals.welcomeSettings.inputs.channelid.title', locale))
                    .setPlaceholder(t('modals.welcomeSettings.inputs.channelid.placeholder', locale))
                    .setStyle(TextInputStyle.Short)
                    .setValue(channel.id)

                const titleInput = new TextInputBuilder()
                    .setCustomId('welcomeTitle')
                    .setLabel(t('modals.welcomeSettings.inputs.title.title', locale))
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder(t('modals.welcomeSettings.inputs.title.placeholder', locale))
                    .setRequired(true);

                const descriptionInput = new TextInputBuilder()
                    .setCustomId('welcomeDescription')
                    .setLabel(t('modals.welcomeSettings.inputs.description.title', locale))
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder(t('modals.welcomeSettings.inputs.description.placeholder', locale))
                    .setRequired(true);

                const imageInput = new TextInputBuilder()
                    .setCustomId('welcomeImage')
                    .setLabel(t('modals.welcomeSettings.inputs.image.title', locale))
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder(t('modals.welcomeSettings.inputs.image.placeholder', locale))
                    .setRequired(false);

                if(currentSettings) {
                    titleInput.setValue(currentSettings.title);
                    descriptionInput.setValue(currentSettings.description);
                    imageInput.setValue(currentSettings.image);
                }

                modal.addComponents(
                    new ActionRowBuilder<TextInputBuilder>().addComponents(channelIdInput),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput),
                    new ActionRowBuilder<TextInputBuilder>().addComponents(imageInput)
                );

                return await interaction.showModal(modal);
            default:
                await guildService.setChannel(channelType, guild.id, channel.id);
                break;
        }

        embed.setDescription(format(t(`commands.set.subcommands.channel.response_body`, locale), {
            "channelType": t(`commands.set.subcommands.channel.options.channeltype.choices.${channelType}.name`, locale)
        }));

        return interaction.reply({ embeds: [ embed.build() ] });
    }
};