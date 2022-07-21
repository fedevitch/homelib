import React from "react"
import Header from "./appHeader"
import Footer from "./appFooter"

interface AppLayoutProps {
    children: JSX.Element[] | JSX.Element
    title?: string
}

export default function AppLayout(props: AppLayoutProps) {
    const{ children, title } = props;
    return(
        <React.Fragment>
            <Header />
            {title && <title>{title}</title>}
            <main>{children}</main>
            <Footer />
        </React.Fragment>
    )
}