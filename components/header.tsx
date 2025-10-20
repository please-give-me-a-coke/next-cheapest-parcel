import styles from './header.module.css'
import Link from 'next/link'

const navItems = [
  { title: 'Hacker News-style' },
  { title: 'Open API ↗', href: 'https://api.cheapest-parcel.dedyn.io/parcels-prices/cheapest?type=DOMESTIC&region=OTHER_AREA&weight=1000&continue' },
]

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/">
          <span className={styles.logo}>
            <span className={styles.n}>C</span>
          </span>
            <span className={styles['site-title']}>Cheapest Parcel</span>
        </Link>
        <div className={styles.nav}>
          <ul className={styles['nav-ul']}>
              {navItems.map(({ title, href }, index) => (
              <li key={index}>
                    {href ? (
                        <a href={href} target="_blank" rel="noreferrer" className={styles.link}>{title}</a>
                    ) : (
                <span>{title}</span>
                    )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}