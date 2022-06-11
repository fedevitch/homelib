import React from "react"
import Header from "./appHeader"
import Footer from "./appFooter"

interface AppLayoutProps {
    children: JSX.Element[] | JSX.Element
}

export default function AppLayout(props: AppLayoutProps) {
    return(
        <React.Fragment>
            <Header />
            <main>{props.children}</main>
            <Footer />
        </React.Fragment>
    )
}