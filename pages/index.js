import Head from "next/head"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
  return (
    <div className="p-5">
      <Head>
        <title>Smart Contract Raffle</title>
        <meta name="description" content="Provably random smart contract raffle" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Header />
      <LotteryEntrance />
    </div>
  )
}
