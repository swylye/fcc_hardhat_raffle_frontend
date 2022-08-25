import { ConnectButton } from "@web3uikit/web3"

export default function Header() {
    return (
        <div className="flex justify-between border-b-2 py-5">
            <div className="text-3xl font-bold">Decentralized Raffle</div>
            <ConnectButton MoralisAuth={false} />
            <style jsx>{`
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            `}</style>
        </div>
    )
}