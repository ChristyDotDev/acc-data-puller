import Head from 'next/head'
import Image from 'next/image'
import LiveNow from '../components/LiveNow'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ACC Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the F1diots ACC tracker
        </h1>
      </main>
    </div>
  )
}
