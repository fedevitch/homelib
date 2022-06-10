import type { NextPage } from 'next'
import styles from '../styles/Signup.module.css'

import { Button, Card, Elevation, FormGroup, InputGroup } from "@blueprintjs/core";
import { useState } from 'react';

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

    const onSubmit = (event: any) => {
        event.preventDefault();
        console.log('submitting...', { name, firstName, lastName, email, password });
    }

    return (
        <Card className={styles.main} interactive={true} elevation={Elevation.TWO}>
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
    )
}

export default Signup;