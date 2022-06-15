import type { GetStaticPropsContext, NextPage } from 'next'
import { useState } from 'react';
import styles from '../styles/DialogFull.module.css'
import AppLayout from '../components/layout/appLayout'
import _ from 'lodash'
import { AppToaster } from '../components/services/toaster'
import { Button, Card, Elevation, FormGroup, InputGroup, Intent } from "@blueprintjs/core"
import { signUp } from '../components/services/api'
import { useTranslations } from 'next-intl'


const Signup: NextPage = () => {
    const t = useTranslations('Signup');

    // form state
    const [isLoading, setLoading] = useState(false);

    // form elements
    const [name, setName] = useState(String);
    const [firstName, setFirstName] = useState(String);
    const [lastName, setLastName] = useState(String);
    const [email, setEmail] = useState(String);
    const [password, setPassword] = useState(String);
    const [passwordRepeat, setPasswordRepeat] = useState(String);

    const onSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        if(password !== passwordRepeat) {
            AppToaster().show({ message: 'Passwords mismatch', intent: Intent.WARNING })
        } else {
            try{
                const res = await signUp({ name, firstName, lastName, email, password })
                AppToaster().show({ message: res.message, intent: Intent.PRIMARY })           
            } catch(e) {                      
                AppToaster().show({ message: _.get(e, 'message', 'Error'), intent: Intent.DANGER })                
            }            
        }
        setLoading(false)
    }

    return (
        <AppLayout>
            <title>{t('Signup on homelib')}</title>
            <Card className={styles.modal} interactive={true} elevation={Elevation.THREE}>
                <h3>{t('Signup on homelib')}</h3>
                <form onSubmit={onSubmit}>
                    <div>
                        <FormGroup
                            disabled={isLoading}                  
                            label={t('Enter your name or nick')}
                            labelFor="name"
                            labelInfo={t('(required)')}>
                            <InputGroup id="name" placeholder={t('Name')} disabled={isLoading} required 
                                        onChange={(e) => setName(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={t('Enter First Name')}
                            labelFor="firstName"
                            labelInfo={t('(optional)')}>
                            <InputGroup id="firstName" placeholder={t('First Name')} disabled={isLoading} 
                                        onChange={(e) => setFirstName(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={t('Enter Last Name')}
                            labelFor="lastName"
                            labelInfo={t('(optional)')}>
                            <InputGroup id="lastName" placeholder={t('Last Name')} disabled={isLoading} 
                                        onChange={(e) => setLastName(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={t('Enter email')}
                            labelFor="email"
                            labelInfo={t('(required)')}>
                            <InputGroup id="email" type="email" placeholder={t('Email')} disabled={isLoading} required
                                        onChange={(e) => setEmail(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={t('Enter Password')}
                            labelFor="password"
                            labelInfo={t('(required)')}>
                            <InputGroup id="password" type="password" placeholder={t('Password')} disabled={isLoading} required 
                                        onChange={(e) => setPassword(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={t('Repeat Password')}
                            labelFor="passwordRepeat"
                            labelInfo={t('(required)')}>
                            <InputGroup id="passwordRepeat" type="password" placeholder={t('Password')} disabled={isLoading} required 
                                        onChange={(e) => setPasswordRepeat(e.target.value)} />
                        </FormGroup>
                    </div>
                    <Button type="submit">{t('Signup')}</Button>
                </form>
            </Card>
        </AppLayout>
    )
}

export default Signup;


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