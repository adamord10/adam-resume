import type { MetadataRoute } from 'next'
import { profile } from '@/content/profile'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl },
    { url: `${profile.siteUrl}/resume` },
  ]
}
