import { ping } from './ping';
import { help } from './help';
import { xp, xpAdmin, xpUser } from './xp';
import { disablexp } from './disablexp';
import { enablexp } from './enablexp';
import { setChannel } from './setChannel';
import { addXpRole } from './addXpRole';
import { music } from './music';
import { set } from './set';
import { addColorRole } from './addColorRole';
import { shop } from './shop';
import { buy } from './buy';
import { removeColorRole } from './removeColorRole';
import { ship } from './ship';

export const commands = [ping, help, xp, disablexp, enablexp, setChannel, addXpRole, addColorRole, removeColorRole, xpUser, xpAdmin, music, set, shop, buy, ship];