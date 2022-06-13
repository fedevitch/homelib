import type { NextPage } from 'next'
import { useEffect } from 'react'
import AppLayout from '../components/layout/appLayout'
import styles from '../styles/Home.module.css'
import { fetchMain } from '../components/services/api'

const Home: NextPage = () => {

  useEffect(() => {
    fetchMain().then(books => {
      console.log({ books });
    });
  }, [])

  return (
    <AppLayout>
      <div>Welcome to homelib</div>
    </AppLayout>    
  )
}

export default Home
