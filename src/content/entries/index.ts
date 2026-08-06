import type { Entry } from '../types'
import { halverson } from './halverson'
import { ldsMission } from './lds-mission'
import { levinthal } from './levinthal'
import { nexu } from './nexu'
import { redo } from './redo'
import { skep } from './skep'
import { soloStove } from './solo-stove'

export const entries: Entry[] = [redo, nexu, levinthal, soloStove, halverson, ldsMission, skep]
