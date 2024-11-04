import fs from 'fs';
import path from 'path';

export type Locales = 'en-US' | 'pt-BR';

interface Localization {
  [key: string]: any;
}

const locales: { [key in Locales]: Localization } = {
  'en-US': JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/en-US.json'), 'utf8')),
  'pt-BR': JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/pt-BR.json'), 'utf8')),
};

function getNestedValue(obj: any, keyPath: string): any {
  return keyPath.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : null, obj);
}

export function t(keyPath: string, locale: Locales = 'en-US'): string {
  const value = getNestedValue(locales[locale], keyPath);
  return value !== null ? value : getNestedValue(locales['en-US'], keyPath) || keyPath;
}

export function format(str: string, args: { [key: string]: string | number }): string {
  return str.replace(/{(\w+)}/g, (match, key) => {
    return typeof args[key] !== 'undefined' ? String(args[key]) : match;
  });
}

export function getCommandNames(commandKey: string): { [key in Locales]?: string } {
  const names: { [key in Locales]?: string } = {};

  for (const locale of Object.keys(locales) as Locales[]) {
    const name = t(`commands.${commandKey}.name`, locale);
    if (name) {
      names[locale] = name;
    }
  }

  return names;
}

export function getCommandDescriptions(commandKey: string): { [key in Locales]?: string } {
    const descriptions: { [key in Locales]?: string } = {};
  
    for (const locale of Object.keys(locales) as Locales[]) {
      const description = t(`commands.${commandKey}.description`, locale);
      if (description) {
        descriptions[locale] = description;
      }
    }
  
    return descriptions;
}

export function mapLocale(discordLocale: string): Locales {
  switch (discordLocale) {
    case 'pt-BR':
      return 'pt-BR';
    case 'en-US':
    default:
      return 'en-US';
  }
}
