import type { GetStaticPropsContext, NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/appLayout'
import styles from '../styles/Home.module.css'
import { fetchMain } from '../components/services/api'
import { useTranslations } from 'next-intl'
import { BookStats } from '../services/books'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);


const Home: NextPage = () => {
  const t = useTranslations('Home')

  const [stats, setStats] = useState({} as BookStats);
  useEffect(() => {
    fetchMain().then(setStats)
  }, [])

  
  const formatChart = {
    labels: ['PDF', 'Djvu', 'Fb2'],
    datasets: [{
      label: 'Books count by format',
      data: [stats.pdfCount, stats.djvuCount, stats.fb2Count]
    }],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(58, 169, 239, 0.2)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(59, 169, 239, 1)'
    ],
    borderWidth: 1,
  }

  const sizeChart = {
    labels: ['Small', 'Medium', 'Normal', 'Large'],
    datasets: [{
      label: 'Books size',
      data: [stats.less1Mb, stats.mediumSize, stats.normalSize, stats.extraLargeSize]
    }],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(57, 167, 237, 0.2)',
      'rgba(68, 178, 248, 0.2)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(57, 167, 237, 0.2)',
      'rgba(68, 178, 248, 0.2)'
    ],
    borderWidth: 1,
  }

  return (
    <AppLayout>
      <title>{t('Welcome To homelib')}</title>
      <div className={styles.title}><h2>{t('Welcome To homelib')}</h2></div>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <Pie data={formatChart} width={300} height={300} />
        </div>
        <div className={styles.chart}>
          <Pie data={sizeChart} width={300} height={300} />
        </div>
      </div>
    </AppLayout>    
  )
}

export default Home

export async function getStaticProps(props: GetStaticPropsContext) {  
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended
      // pattern is to put them in JSON files separated by language and read
      // the desired one based on the `locale` received from Next.js.
      messages: (await import(`../locales/${props.locale}.json`)).default
    }
  };
}
