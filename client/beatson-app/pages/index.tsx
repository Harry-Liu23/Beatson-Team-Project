import type { InferGetStaticPropsType, GetStaticProps } from 'next'

type Repo = {
    name: string
    stargazers_count: number
  }
   
  export const getStaticProps = (async (accession) => {
    const res = await fetch("http://127.0.0.1:2020/get_study/<accession>");
    const repo = await res.json()
    return { props: { repo } }
  }) satisfies GetStaticProps<{
    repo: Repo
  }>
  
/* website.url/ */

export default function Home() {
    return (
        <div className='page-content'>
            <h1>Welcome to the MOSAIC Data Portal!</h1>
            <img src='/ukri-logo.png' alt='UKRI Logo' />
        </div>
    );
}