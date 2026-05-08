"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = t;
exports.format = format;
exports.getCommandNames = getCommandNames;
exports.getCommandDescriptions = getCommandDescriptions;
exports.mapLocale = mapLocale;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const locales = {
    'en-US': JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../locales/en-US.json'), 'utf8')),
    'pt-BR': JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../locales/pt-BR.json'), 'utf8')),
};
function getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : null, obj);
}
function t(keyPath, locale = 'en-US') {
    const value = getNestedValue(locales[locale], keyPath);
    return value !== null ? value : getNestedValue(locales['en-US'], keyPath) || keyPath;
}
function format(str, args) {
    return str.replace(/{(\w+)}/g, (match, key) => {
        return typeof args[key] !== 'undefined' ? String(args[key]) : match;
    });
}
function getCommandNames(commandKey) {
    const names = {};
    for (const locale of Object.keys(locales)) {
        const name = t(`commands.${commandKey}.name`, locale);
        if (name) {
            names[locale] = name;
        }
    }
    return names;
}
function getCommandDescriptions(commandKey) {
    const descriptions = {};
    for (const locale of Object.keys(locales)) {
        const description = t(`commands.${commandKey}.description`, locale);
        if (description) {
            descriptions[locale] = description;
        }
    }
    return descriptions;
}
function mapLocale(discordLocale) {
    switch (discordLocale) {
        case 'pt-BR':
            return 'pt-BR';
        case 'en-US':
        default:
            return 'en-US';
    }
}
