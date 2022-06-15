import type { GetStaticPropsContext, NextPage } from 'next'
import { useState } from 'react';
import { useRouter } from 'next/router'
import styles from '../styles/DialogFull.module.css'
import AppLayout from '../components/layout/appLayout'
import _ from 'lodash'
import { AppToaster } from '../components/services/toaster'
import { Button, Card, Elevation, FormGroup, InputGroup, Intent } from "@blueprintjs/core"
import { login } from '../components/services/api'
import { useTranslations } from 'next-intl'

const Login: NextPage = () => {
    const router = useRouter()
    const t = useTranslations('Login')

    // form state
    const [isLoading, setLoading] = useState(false);

    // form elements
    const [email, setEmail] = useState(String);
    const [password, setPassword] = useState(String);

    const onSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        
        try{
            const res = await login({ email, password })
            AppToaster().show({ message: res.message, intent: Intent.PRIMARY })
            router.push('/');           
        } catch(e) {                                
            AppToaster().show({ message: _.get(e, 'message', 'Error'), intent: Intent.DANGER })                
        }            
        
        setLoading(false)
    }

    return (
        <AppLayout>
            <title>{t('Login on homelib')}</title>
            <Card className={styles.modal} interactive={true} elevation={Elevation.THREE}>
                <h3>{t('Login on homelib')}</h3>
                <form onSubmit={onSubmit}>
                    <div>
                    <FormGroup
                            disabled={isLoading}                  
                            label={t('Enter email')}
                            labelFor="email">
                            <InputGroup id="email" type="email" placeholder={t('Email')} disabled={isLoading} required
                                        onChange={(e) => setEmail(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={t('Enter Password')}
                            labelFor="password">
                            <InputGroup id="password" type="password" placeholder={t('Password')} disabled={isLoading} required 
                                        onChange={(e) => setPassword(e.target.value)} />
                        </FormGroup>
                    </div>
                    <Button type="submit">{t('Login')}</Button>
                </form>
            </Card>
        </AppLayout>
    )
}

export default Login

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