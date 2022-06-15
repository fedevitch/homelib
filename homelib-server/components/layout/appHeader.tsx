import { 
    Alignment, Button, Classes, 
    Menu, MenuDivider, MenuItem,
    Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Position
 } from "@blueprintjs/core"
import { Popover2 } from "@blueprintjs/popover2";
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getCookie } from "cookies-next"
import { logout } from "../services/api"
import {useTranslations} from 'next-intl'

export default function Header() {

    const router = useRouter()
    const t = useTranslations('Header')

    const [ loggedIn, setLoggedIn ] = useState(false)

    useEffect(() => {
        const cookieToken = getCookie('Token');
        if(cookieToken && cookieToken !== '') {
            setLoggedIn(true)
        }
    }, [])

    const homeClick = () => router.push('/')
    const booksClick = () => router.push('/books')

    const logoutClick = () => logout()
    const loginClick = () => router.push('/login')
    const signupClick = () => router.push('/signup')
    const switchLocale = (locale: string) => (e: React.MouseEvent) => {
        e.preventDefault()
        router.push(router.asPath, undefined, { locale, shallow: false })
              .then(() => router.reload())
    }

    const ProfileMenu = () => loggedIn ? (
        <Menu>
            <MenuItem icon="log-out" text={t('Logout')} onClick={logoutClick} />
        </Menu>
    ) : (
        <Menu>
            <MenuItem icon="saved" text={t('Signup')} onClick={signupClick} />
            <MenuItem icon="log-in" text={t('Login')} onClick={loginClick} />                
        </Menu>
    )

    const SettingsMenu = () => (
        <Menu>
            <MenuItem icon="flag" text={t('Language')}>
                <MenuItem icon="flag" text={t('English')} onClick={switchLocale('en')} />
                <MenuItem icon="flag" text={t('Ukrainian')} onClick={switchLocale('ua')} />
            </MenuItem>
            <MenuItem icon="map" text={'Change Something'} />                
        </Menu>
    )

    return(
        <header>            
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>Homelib</NavbarHeading>
                    <NavbarDivider />
                    <Button className={Classes.MINIMAL} icon="home" text={t('Home')} onClick={homeClick} />
                    <Button className={Classes.MINIMAL} icon="book" text={t('Books')} onClick={booksClick} />                        
                    <NavbarDivider />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>    
                    <Popover2 content={<ProfileMenu />} position={Position.BOTTOM}>
                        <Button className={Classes.MINIMAL} icon="user" />
                    </Popover2>
                    <Popover2 content={<SettingsMenu />} position={Position.BOTTOM}>
                        <Button className={Classes.MINIMAL} icon="cog" />
                    </Popover2>
                </NavbarGroup>                 
                
            </Navbar>
        </header>
    )
}