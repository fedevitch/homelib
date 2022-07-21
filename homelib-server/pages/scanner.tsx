import { GetStaticPropsContext, NextPage } from "next";
import AppLayout from '../components/layout/appLayout'

const Scanner: NextPage = () => {

    return <AppLayout title="Scanner"><div>{"Scanner"}</div></AppLayout>

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