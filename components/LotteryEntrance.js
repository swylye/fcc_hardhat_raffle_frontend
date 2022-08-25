import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"
import { Bell } from "@web3uikit/icons"

export default function LotteryEntrance() {

    const [entranceFee, setEntranceFee] = useState("0")
    const [playerCount, setPlayerCount] = useState("0")
    const [recentWinner, setRecentWinner] = useState("")

    const { chainId: chainIdHex, isWeb3Enabled, isLoading, isFetching } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const contractAddress = chainId in contractAddresses ? (contractAddresses[chainId][0]) : (null)

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUIValues() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setPlayerCount(numberOfPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)

    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUIValues()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction complete!",
            title: "Tx notification",
            position: "topR",
            icon: <Bell fontSize={20} />,
        })
    }

    return (
        <div className="p-5">
            {/* <div className="py-3">Hi from lottery entrance!</div> */}
            {contractAddress
                ? (<div className="py-3">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching
                            ? (<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>)
                            : (<div>Enter raffle</div>)
                        }
                    </button>
                    <div className="py-1">Entrance fee: {ethers.utils.formatEther(entranceFee)} ETH</div>
                    <div className="py-1">Number of players in raffle: {playerCount}</div>
                    <div className="py-1">Recent winner: {recentWinner}</div>
                </div>)
                : (<div>
                    No raffle address detected.. Please switch to Goerli testnet.
                </div>)
            }

        </div >
    )
}