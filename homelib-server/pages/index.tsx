import type { GetStaticPropsContext, NextPage } from 'next'
import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/appLayout'
import styles from '../styles/Home.module.css'
import { fetchMain } from '../components/services/api'
import { useTranslations } from 'next-intl'
import { BookStats } from '../components/schemas/bookStats'

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title,
         CategoryScale, LinearScale, BarElement  } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale,
  LinearScale,
  BarElement, ArcElement, Tooltip, Legend, Title);

const _chartSize = 500;

const Home: NextPage = () => {
  const t = useTranslations('Home')

  const [stats, setStats] = useState({ 
    byFormat: {}, byPages: {}, bySize: {}, byData: {}
  } as BookStats);
  useEffect(() => {
    fetchMain().then(setStats)
  }, [])
  
  const booksByFormatChartOpts = {
    responsive: true,    
    plugins: {
      title: {
        display: true,
        text: t('Books count by format')
      }    
    }
  };
  const booksByFormatChart = {
    labels: ['PDF', 'Djvu', 'Fb2', 'Word', 'Epub', 'ComicBook', 'CHM'],
    datasets: [{      
      data: [
        stats.byFormat.pdf, stats.byFormat.djvu, 
        stats.byFormat.fb2, stats.byFormat.doc, 
        stats.byFormat.epub, stats.byFormat.comicBook, 
        stats.byFormat.chm
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(184, 210, 127, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(184, 210, 127, 1)',
      ],
      borderWidth: 1,
    }],
    
  }

  const booksBySizeChartOpts = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: t('Books by size')
      }
    }
  };
  const booksBySizeChart = {    
    labels: [t('Small'), t('Medium'), t('Normal'), t('Large')],
    datasets: [{      
      data: [
        stats.bySize.less1Mb, 
        stats.bySize.mediumSize, 
        stats.bySize.normalSize, 
        stats.bySize.extraLargeSize
      ],
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

  const booksByPagesChartOpts = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: t('Books by pages')
      }    
    }
  };
  const booksByPagesChart = {    
    labels: [t('Few pages'), t('Typical pages count'), t('Big size')],
    datasets: [{      
      data: [stats.byPages.small, stats.byPages.medium, stats.byPages.large],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    }],
  }

  const booksByDataChartOpts = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: t('Books by data')
      }
    }
  };
  const booksByDataChart = {    
    labels: [t('All good'), t('Without summary'), t('Without meta'), t('WithoutISBN'), t('Without anything')],
    datasets: [{      
      data: [
        stats.byData.allGood, 
        stats.byData.withoutSummary, 
        stats.byData.withoutMeta, 
        stats.byData.withoutISBN,
        stats.byData.withoutAnything
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    }],
  }

  return (
    <AppLayout>
      <title>{t('Welcome To homelib')}</title>
      <h2 className={styles.title}>{t('Welcome To homelib')}</h2>
      <h3 className={styles.title}>{t('Statistics')}</h3>
      <div className={styles.chartContainer}>        
        <div className={styles.chart}>
          <Pie data={booksByFormatChart} options={booksByFormatChartOpts} width={_chartSize} height={_chartSize} />
        </div>
        <div className={styles.chart}>
          <Pie data={booksBySizeChart} options={booksBySizeChartOpts} width={_chartSize} height={_chartSize} />
        </div>
        <div className={styles.chart}>
          <Pie data={booksByPagesChart} options={booksByPagesChartOpts} width={_chartSize} height={_chartSize} />
        </div>
        <div className={styles.chart}>
          <Bar data={booksByDataChart} options={booksByDataChartOpts} width={_chartSize} height={_chartSize} />
        </div>
      </div>
      <div className={styles.textContainer}>
        <h3>{`${t('Books in library')}: ${stats.all}`}</h3>
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
