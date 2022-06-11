import type { NextPage } from 'next'
import { useState } from 'react';
import styles from '../styles/Signup.module.css'
import AppLayout from '../components/layout/appLayout'
import _ from 'lodash'
import { AppToaster } from '../components/services/toaster'
import { Button, Card, Elevation, FormGroup, InputGroup, Intent } from "@blueprintjs/core"
import { signUp } from '../components/services/api'


const Signup: NextPage = () => {

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
            <Card className={styles.signUp} interactive={true} elevation={Elevation.THREE}>
                <h3>Signup on homelib</h3>
                <form onSubmit={onSubmit}>
                    <div>
                        <FormGroup
                            disabled={isLoading}                  
                            label={"Enter your name or nick"}
                            labelFor="name"
                            labelInfo={"(required)"}>
                            <InputGroup id="name" placeholder="Name" disabled={isLoading} required 
                                        onChange={(e) => setName(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={"Enter First Name"}
                            labelFor="firstName"
                            labelInfo={"(optional)"}>
                            <InputGroup id="firstName" placeholder="First Name" disabled={isLoading} 
                                        onChange={(e) => setFirstName(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={"Enter Last Name"}
                            labelFor="lastName"
                            labelInfo={"(optional)"}>
                            <InputGroup id="lastName" placeholder="Last Name" disabled={isLoading} 
                                        onChange={(e) => setLastName(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={"Enter email"}
                            labelFor="email"
                            labelInfo={"(required)"}>
                            <InputGroup id="email" type="email" placeholder="Email" disabled={isLoading} required
                                        onChange={(e) => setEmail(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={"Enter Password"}
                            labelFor="password"
                            labelInfo={"(required)"}>
                            <InputGroup id="password" type="password" placeholder="Placeholder text" disabled={isLoading} required 
                                        onChange={(e) => setPassword(e.target.value)} />
                        </FormGroup>
                        <FormGroup
                            disabled={isLoading}                  
                            label={"Repeat Password"}
                            labelFor="passwordRepeat"
                            labelInfo={"(required)"}>
                            <InputGroup id="passwordRepeat" type="password" placeholder="Placeholder text" disabled={isLoading} required 
                                        onChange={(e) => setPasswordRepeat(e.target.value)} />
                        </FormGroup>
                    </div>
                    <Button type="submit">Signup</Button>
                </form>
            </Card>
        </AppLayout>
    )
}

export default Signup;