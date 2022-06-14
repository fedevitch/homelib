import { 
    Alignment, Button, Classes, 
    Menu, MenuDivider, MenuItem,
    Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Position
 } from "@blueprintjs/core"
import { Popover2 } from "@blueprintjs/popover2";
import React, { useEffect, useState } from "react"
import { getCookie } from "cookies-next"
import { logout } from "../services/api"

export default function Header() {

    const [ loggedIn, setLoggedIn ] = useState(false)

    useEffect(() => {
        const cookieToken = getCookie('Token');
        if(cookieToken && cookieToken !== '') {
            setLoggedIn(true)
        }
    }, [])

    const logoutClick = () => logout()
    const loginClick = () => window.location.href = '/login'
    const signupClick = () => window.location.href = '/signup'

    const ProfileMenu = () => loggedIn ? (
        <Menu>
            <MenuItem icon="log-out" text="Logout" onClick={logoutClick} />
        </Menu>
    ) : (
        <Menu>
            <MenuItem icon="saved" text="Register" onClick={signupClick} />
            <MenuItem icon="log-in" text="Login" onClick={loginClick} />                
        </Menu>
    )

    const SettingsMenu = () => (
        <Menu>
            <MenuItem icon="flag" text="Language">
                <MenuItem icon="flag" text="English" />
                <MenuItem icon="flag" text="Ukrainian" />
            </MenuItem>
            <MenuItem icon="map" text="Change Something" />                
        </Menu>
    )

    return(
        <header>            
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>Homelib</NavbarHeading>
                    <NavbarDivider />
                    <Button className={Classes.MINIMAL} icon="home" text="Home" />
                    <Button className={Classes.MINIMAL} icon="book" text="Books" />                        
                    <NavbarDivider />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>    
                    <Popover2 content={<ProfileMenu />} position={Position.BOTTOM} usePortal>
                        <Button className={Classes.MINIMAL} icon="user" />
                    </Popover2>
                    <Popover2 content={<SettingsMenu />} position={Position.BOTTOM} usePortal>
                        <Button className={Classes.MINIMAL} icon="cog" />
                    </Popover2>
                </NavbarGroup>                 
                
            </Navbar>
        </header>
    )
}