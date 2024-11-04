import {
    EmbedAuthorData,
    APIEmbedField,
    EmbedFooterData,
    EmbedAssetData,
    APIEmbedProvider,
    EmbedType,
    ColorResolvable,
    EmbedBuilder
} from 'discord.js';

interface EmbedAttributes {
    author: EmbedAuthorData;
    color: ColorResolvable;
    description: string;
    fields: APIEmbedField[];
    footer: EmbedFooterData;
    image: EmbedAssetData;
    provider: APIEmbedProvider;
    thumbnail: EmbedAssetData;
    timestamp: string | number | Date;
    title: string;
    type: EmbedType;
    url: string;
    video: EmbedAssetData
}

class Embed {
  public author?: EmbedAuthorData;
  public color?: ColorResolvable;
  public description?: string;
  public fields?: APIEmbedField[];
  public footer?: EmbedFooterData;
  public image?: EmbedAssetData;
  public provider?: APIEmbedProvider;
  public thumbnail?: EmbedAssetData;
  public timestamp?: string | number | Date;
  public title?: string;
  public type?: EmbedType;
  public url?: string;
  public video?: EmbedAssetData;

  constructor(options: Partial<EmbedAttributes> = {}) {
    Object.assign(this, options);
  }

  public setAuthor(author: EmbedAuthorData) {
    this.author = author;
    return this;
  }

  public setColor(color: ColorResolvable) {
    this.color = color;
    return this;
  }

  public setDescription(description: string) {
    this.description = description;
    return this;
  }

  public addField(name: string, value: string, inline: boolean = false) {
    if(!this.fields) this.fields = [];
    this.fields?.push({ name, value, inline });
    return this;
  }

  public setFooter(footer: EmbedFooterData) {
    this.footer = footer;
    return this;
  }

  public setImage(image: EmbedAssetData) {
    this.image = image;
    return this;
  }

  public setThumbnail(thumbnail: EmbedAssetData) {
    this.thumbnail = thumbnail;
    return this;
  }

  public setTimestamp(timestamp: string | number | Date) {
    this.timestamp = timestamp;
    return this;
  }

  public setTitle(title: string) {
    this.title = title;
    return this;
  }

  public setURL(url: string) {
    this.url = url;
    return this;
  }

  public build() {
    const embed = new EmbedBuilder();

    if (this.author) {
        embed.setAuthor(this.author);
    }

    if (this.color) {
        embed.setColor(this.color);
    }

    if (this.description) {
        embed.setDescription(this.description);
    }

    if (this.footer) {
        embed.setFooter(this.footer);
    }

    if (this.image) {
        embed.setImage(this.image.url);
    }

    if (this.thumbnail) {
        embed.setThumbnail(this.thumbnail.url);
    }

    if (this.timestamp) {
        const timestampValue = typeof this.timestamp === 'string' ? new Date(this.timestamp) : this.timestamp;
        embed.setTimestamp(timestampValue);
    }

    if (this.title) {
        embed.setTitle(this.title);
    }

    if (this.url) {
        embed.setURL(this.url);
    }

    if (this.fields) {
        embed.addFields(...this.fields);
    }


    return embed;
  }
  
}

export default Embed;