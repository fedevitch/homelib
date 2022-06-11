import type { NextPage } from 'next'
import { useState } from 'react';
import styles from '../styles/DialogFull.module.css'
import AppLayout from '../components/layout/appLayout'
import _ from 'lodash'
import { AppToaster } from '../components/services/toaster'
import { Button, Card, Elevation, FormGroup, InputGroup, Intent } from "@blueprintjs/core"
import { login } from '../components/services/api'

const Login: NextPage = () => {

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
            window.location.href = '/';           
        } catch(e) {                                
            AppToaster().show({ message: _.get(e, 'message', 'Error'), intent: Intent.DANGER })                
        }            
        
        setLoading(false)
    }

    return (
        <AppLayout>
            <Card className={styles.modal} interactive={true} elevation={Elevation.THREE}>
                <h3>Login on homelib</h3>
                <form onSubmit={onSubmit}>
                    <div>
                    <FormGroup
                            disabled={isLoading}                  
                            label={"Enter email"}
                            labelFor="email">
                            <InputGroup id="email" type="email" placeholder="Email" disabled={isLoading} required
                                        onChange={(e) => setEmail(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={"Enter Password"}
                            labelFor="password">
                            <InputGroup id="password" type="password" placeholder="Placeholder text" disabled={isLoading} required 
                                        onChange={(e) => setPassword(e.target.value)} />
                        </FormGroup>
                    </div>
                    <Button type="submit">Login</Button>
                </form>
            </Card>
        </AppLayout>
    )
}

export default Login