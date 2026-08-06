import type { Entry } from '@/content/types'
import { formatYm } from '@/lib/timeline'
import styles from './EntryDetail.module.css'

export default function EntryDetail({ entry }: { entry: Entry }) {
  return (
    <article className={styles.detail}>
      <header className={styles.header}>
        <span className={styles.laneTag}>{entry.lane}</span>
        <h2 className={styles.role}>{entry.role}</h2>
        <p className={styles.meta}>
          {entry.org} · {formatYm(entry.start)} – {formatYm(entry.end)}
        </p>
      </header>

      {entry.story.map((p, i) => (
        <p key={i} className={styles.story}>
          {p}
        </p>
      ))}

      {entry.metrics?.length ? (
        <dl className={styles.metrics}>
          {entry.metrics.map((m) => (
            <div key={m.label} className={styles.metric}>
              <dt className={styles.metricLabel}>{m.label}</dt>
              <dd className={styles.metricValue}>{m.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {entry.projects?.length ? (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>projects</h3>
          {entry.projects.map((p) => (
            <div key={p.name} className={styles.project}>
              <strong>{p.name}</strong>
              <p>{p.description}</p>
              {p.links?.length ? (
                <div className={styles.projectLinks}>
                  {p.links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {entry.media?.length ? (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>media</h3>
          <div className={styles.gallery}>
            {entry.media.map((m) => (
              <figure key={m.src}>
                <img src={m.src} alt={m.alt} className={styles.mediaImg} />
                {m.caption ? <figcaption className={styles.caption}>{m.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {entry.links?.length ? (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>links</h3>
          <ul className={styles.links}>
            {entry.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {entry.quotes?.length ? (
        <section className={styles.section}>
          {entry.quotes.map((q) => (
            <blockquote key={q.name} className={styles.quote}>
              <p>“{q.text}”</p>
              <footer>
                — {q.name}, {q.title}
              </footer>
            </blockquote>
          ))}
        </section>
      ) : null}
    </article>
  )
}
