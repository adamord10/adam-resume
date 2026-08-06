import type { Entry } from '../types'
import { acmeStartup } from './acme-startup'
import { campusClub } from './campus-club'
import { firstGig } from './first-gig'
import { localNonprofit } from './local-nonprofit'
import { sampleCo } from './sample-co'

export const entries: Entry[] = [sampleCo, acmeStartup, firstGig, campusClub, localNonprofit]
