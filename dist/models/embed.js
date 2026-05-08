"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Embed {
    constructor(options = {}) {
        Object.assign(this, options);
    }
    setAuthor(author) {
        this.author = author;
        return this;
    }
    setColor(color) {
        this.color = color;
        return this;
    }
    setDescription(description) {
        this.description = description;
        return this;
    }
    addField(name, value, inline = false) {
        var _a;
        if (!this.fields)
            this.fields = [];
        (_a = this.fields) === null || _a === void 0 ? void 0 : _a.push({ name, value, inline });
        return this;
    }
    setFooter(footer) {
        this.footer = footer;
        return this;
    }
    setImage(image) {
        this.image = image;
        return this;
    }
    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;
        return this;
    }
    setTimestamp(timestamp) {
        this.timestamp = timestamp;
        return this;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setURL(url) {
        this.url = url;
        return this;
    }
    build() {
        const embed = new discord_js_1.EmbedBuilder();
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
exports.default = Embed;
