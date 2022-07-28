import { GetStaticPropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Callout, Card, Elevation, Intent, ProgressBar } from "@blueprintjs/core";
import SocketIOClient from "socket.io-client";
import AppLayout from '../components/layout/appLayout'
import { useTranslations } from 'next-intl' 
import styles from '../styles/Scanner.module.css'

let socket;

const Scanner: NextPage = () => {
  const t = useTranslations("Scanner")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")

  const socketInit = () => {
    socket = SocketIOClient({ path: '/api/scanner' });
    socket.on('connect', () => console.log('connected'))
    socket.on('progress-update', setProgress)
    socket.on('status-update', setStatus)
  }

  const checkLaunch = () => {
    fetch('/api/scanner').then(async res => {
      const status = await res.json() as any;
      setIsRunning(status.scannerLaunched)
    })
  }

  useEffect(() => {
    socketInit()
    checkLaunch()
  }, [])

  const onLaunchClick = () => {
    if(socket){
      socket.emit('scanner-launch')
      setIsRunning(true)
    }
  }

  const progressBar = <div>
    <p>{t("Progress")}</p>
    <ProgressBar value={progress} intent={Intent.SUCCESS} stripes={false} />
    <Callout intent={Intent.PRIMARY}>{status}</Callout>
  </div>

  return <AppLayout title={t("Scanner")}>
    <Card elevation={Elevation.THREE} className={styles.scanner}>
      {isRunning && progressBar}      
      <Button disabled={isRunning} text={t("Launch Scan")} onClick={onLaunchClick} />
    </Card>
  </AppLayout>

}

export default Scanner;

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