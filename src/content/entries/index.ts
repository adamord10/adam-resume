import type { Entry } from '../types'
import { ldsMission } from './lds-mission'
import { levinthal } from './levinthal'
import { nexu } from './nexu'
import { redo } from './redo'
import { skep } from './skep'

export const entries: Entry[] = [redo, nexu, levinthal, ldsMission, skep]
