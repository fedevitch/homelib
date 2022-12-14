import { GetStaticPropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Callout, Card, Elevation, FormGroup, Intent, ProgressBar } from "@blueprintjs/core";
import SocketIOClient from "socket.io-client";
import ScannerEvents from "../components/schemas/scannerEvents";
import AppLayout from '../components/layout/appLayout'
import { useTranslations } from 'next-intl' 
import styles from '../styles/Scanner.module.css'

let socket;

const Scanner: NextPage = () => {
  const t = useTranslations("Scanner")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [processingFile, setProcessingFile] = useState("")
  const [errors, setErrors] = useState(Array<string>)

  const socketInit = () => {
    socket = SocketIOClient({ path: '/api/scanner' });
    //socket.on('connect', () => console.log('connected'))
    socket.on(ScannerEvents.Progress, setProgress)
    socket.on(ScannerEvents.OcrProgress, setOcrProgress)
    socket.on(ScannerEvents.File, setProcessingFile)
    socket.on(ScannerEvents.Error, error  => errors.push(error))
    socket.on(ScannerEvents.Stop, () => setIsRunning(false))
  }

  const checkLaunch = () => {
    fetch('/api/scanner').then(async res => {
      const status = await res.json() as any;
      setIsRunning(status.scannerLaunched)
    })
  }

  useEffect(() => setErrors([]), [processingFile])

  useEffect(() => {
    socketInit()
    checkLaunch()
  }, [])

  const onLaunchClick = () => {
    if(socket){
      socket.emit(ScannerEvents.Launch)
      setIsRunning(true)
    }
  }

  const onStopClick = () => {
    if(socket){
      socket.emit(ScannerEvents.Stop)
      setIsRunning(false)
    }
  }

  const progressBar = <div>
    <FormGroup label={t("Progress")}>
      <ProgressBar className={styles.progressBar} value={progress} intent={Intent.SUCCESS} stripes={false} />
    </FormGroup>
    <Callout className={styles.status} intent={Intent.PRIMARY}>{t("Processing")}: {processingFile}</Callout>
    { ocrProgress > 0 && <FormGroup label={t("OCR progress")}>
      <ProgressBar className={styles.progressBar} value={ocrProgress} intent={Intent.SUCCESS} stripes={false} />
    </FormGroup> }
    { errors.length > 0 && <Callout className={styles.error} intent={Intent.DANGER}>{errors.map((e, i) => (<span key={i}>{e}</span>) )}</Callout>}
  </div>

  return <AppLayout title={t("Scanner")}>
    <Card elevation={Elevation.THREE} className={styles.scanner}>
      <Button className={styles.controls} disabled={isRunning} text={t("Launch Scan")} onClick={onLaunchClick} />
      <Button className={styles.controls} disabled={!isRunning} text={t("Stop Scan")} onClick={onStopClick} />
      {isRunning && progressBar}     
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