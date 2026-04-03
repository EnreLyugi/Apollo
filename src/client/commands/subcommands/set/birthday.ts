import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption
} from "discord.js";
import { format, mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";
import birthdayService from "../../../../services/birthdayService";

export const birthday = {
  data: new SlashCommandSubcommandBuilder()
    .setName('birthday')
    .setNameLocalizations({
      'en-US': t('commands.set.subcommands.birthday.name', 'en-US'),
      'pt-BR': t('commands.set.subcommands.birthday.name', 'pt-BR'),
    })
    .setDescription('Set a Birthday')
    .setDescriptionLocalizations({
      'en-US': t('commands.set.subcommands.birthday.description', 'en-US'),
      'pt-BR': t('commands.set.subcommands.birthday.description', 'pt-BR'),
    })
    .addUserOption(new SlashCommandUserOption()
      .setName('user')
      .setNameLocalizations({
        'en-US': t('commands.set.subcommands.birthday.choices.user.name', 'en-US'),
        'pt-BR': t('commands.set.subcommands.birthday.choices.user.name', 'pt-BR'),
      })
      .setDescription('User to add')
      .setDescriptionLocalizations({
        'en-US': t('commands.set.subcommands.birthday.choices.user.description', 'en-US'),
        'pt-BR': t('commands.set.subcommands.birthday.choices.user.description', 'pt-BR'),
      })
      .setRequired(true)
    )
    .addStringOption(new SlashCommandStringOption()
      .setName('date')
      .setNameLocalizations({
        'en-US': t('commands.set.subcommands.birthday.choices.date.name', 'en-US'),
        'pt-BR': t('commands.set.subcommands.birthday.choices.date.name', 'pt-BR'),
      })
      .setDescription('Birthday date (MM-DD)')
      .setDescriptionLocalizations({
        'en-US': t('commands.set.subcommands.birthday.choices.date.description', 'en-US'),
        'pt-BR': t('commands.set.subcommands.birthday.choices.date.description', 'pt-BR'),
      })
      .setRequired(true)
    ),
  usage: '/set birthday <user> <date>',
  execute: async (interaction: ChatInputCommandInteraction) => {
    const guild = interaction.guild;
    const user = interaction.options.getUser('user');
    const date = interaction.options.getString('date');

    if(!guild || !user || !date) return;

    const locale = mapLocale(interaction.locale);

    let day: number, month: number;
    if (/^\d{2}\/\d{2}$/.test(date)) {
      [day, month] = date.split('/').map(Number);
    } else if (/^\d{2}-\d{2}$/.test(date)) {
      [month, day] = date.split('-').map(Number);
    } else {
      return interaction.reply({
        content: t("commands.set.subcommands.birthday.errors.invalid_format", locale),
        ephemeral: true
      });
    }

    if (
      isNaN(day) || isNaN(month) ||
      day < 1 || day > 31 ||
      month < 1 || month > 12
    ) {
      return interaction.reply({
        content: t("commands.set.subcommands.birthday.errors.invalid_date", locale),
        ephemeral: true
      });
    }

    const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;

    await birthdayService.addBirthday(user.id, formattedDate);

    const embed = new Embed()
      .setColor(`#${colors.default_color}`)
      .setTitle(t('commands.set.subcommands.birthday.response.title', locale))
      .setTimestamp(new Date())
      .setDescription(format(t(`commands.set.subcommands.birthday.response.body`, locale), {
        "user": `${user}`,
        "date": date
      }));

    interaction.reply({ embeds: [ embed.build() ] });
  }
}