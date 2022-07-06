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
  
  const formatChartOpts = {
    plugins: {
      title: {
        display: true,
        text: t('Books count by format')
      }
    }
  };
  const formatChart = {
    labels: ['PDF', 'Djvu', 'Fb2', 'Word', 'Epub', 'ComicBook', 'CHM'],
    datasets: [{      
      data: [stats.pdf, stats.djvu, stats.fb2, stats.doc, stats.epub, stats.comicBook, stats.chm],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
    
  }

  const sizeChartOpts = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: t('Books size')
      }
    }
  };
  const sizeChart = {    
    labels: [t('Small'), t('Medium'), t('Normal'), t('Large')],
    datasets: [{      
      data: [stats.less1Mb, stats.mediumSize, stats.normalSize, stats.extraLargeSize],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  }

  return (
    <AppLayout>
      <title>{t('Welcome To homelib')}</title>
      <div className={styles.title}><h2>{t('Welcome To homelib')}</h2></div>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <Pie data={formatChart} options={formatChartOpts} width={300} height={300} />
        </div>
        <div className={styles.chart}>
          <Pie data={sizeChart} options={sizeChartOpts} width={300} height={300} />
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
