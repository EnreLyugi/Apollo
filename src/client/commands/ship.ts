import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import { format, mapLocale, t } from "../../utils/localization";
import { Embed } from "../../models";
import { shipService } from "../../services";
import { colors } from "../../config";
import { CommandCategory } from "./help";

export const ship = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setNameLocalizations({
      "en-US": t('commands.ship.name', 'en-US'),
      "pt-BR": t('commands.ship.name', 'pt-BR')
    })
    .setDescription('Shows the ship compatibility between two users.')
    .setDescriptionLocalizations({
      "en-US": t('commands.ship.description', 'en-US'),
      "pt-BR": t('commands.ship.description', 'pt-BR')
    })
    .addUserOption(new SlashCommandUserOption()
      .setName('user')
      .setNameLocalizations({
        'en-US': t('misc.user', 'en-US'),
        'pt-BR': t('misc.user', 'pt-BR')
      })
      .setDescription('User to Ship')
      .setDescriptionLocalizations({
        'en-US': t('commands.ship.options.user.description', 'en-US'),
        'pt-BR': t('commands.ship.options.user.description', 'pt-BR')
      })
      .setRequired(true)
    )
    .addUserOption(new SlashCommandUserOption()
      .setName('seconduser')
      .setNameLocalizations({
        'en-US': t('misc.user2', 'en-US'),
        'pt-BR': t('misc.user2', 'pt-BR')
      })
      .setDescription('User to Ship')
      .setDescriptionLocalizations({
        'en-US': t('commands.ship.options.user.description', 'en-US'),
        'pt-BR': t('commands.ship.options.user.description', 'pt-BR')
      })
    )
  ,
  category: CommandCategory.FUN,
  usage: '/ship',
  execute: async (interaction: ChatInputCommandInteraction) => {
    const user1 = interaction.options.getUser('user', true);
    const user2 = interaction.options.getUser('seconduser') ?? interaction.user;
    const locale = mapLocale(interaction.locale);

    if (user1.id === user2.id) {
      return interaction.reply({
        embeds: [
          new Embed()
            .setColor("Red")
            .setDescription(t("commands.ship.same_user_error", locale))
            .build()
        ],
        ephemeral: true
      });
    }

    const ship = await shipService.getShip(user1.id, user2.id);
    const value = ship.value;

    const image = await shipService.generateShipImage(
      user1.displayAvatarURL({ extension: "png", size: 512 }),
      user2.displayAvatarURL({ extension: "png", size: 512 }),
      value
    );

    const emoji = value >= 80 ? "💖" : value >= 50 ? "💘" : "💔";
    const color = value >= 80 ? "DarkVividPink" : value >= 50 ? "Orange" : "Red";

    const embed = new Embed()
      .setTitle(t("commands.ship.result.title", locale))
      .setDescription(
        format(
          t("commands.ship.result.description", locale), {
            user1: user1.username,
            user2: user2.username,
            value: `${value}%`,
            emoji
          }
        )
      )
      .setImage({ url: "attachment://ship.png" })
      .setColor(color)
      .setTimestamp(new Date());

    await interaction.reply({
      embeds: [embed.build()],
      files: [image]
    });
  }
}