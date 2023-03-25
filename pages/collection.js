import { useMoralis, useWeb3Contract } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"
import NFTBox from "../components/NFTBox"
import customNFTFactoryAbi from "../constants/CustomNFTFactory.json"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const scrollChainId = networkMapping.scrollChainId
    const customNFTFactoryAddress = networkMapping.customNFTFactoryAddress
    const [collectionList, setCollectionList] = useState([])
    const [fetched, setFetched] = useState(false)

    const { runContractFunction: getCollection } = useWeb3Contract({
        abi: customNFTFactoryAbi,
        contractAddress: customNFTFactoryAddress,
        functionName: "getCollection",
        params: { owner: account },
        onError: (error) => console.log(error),
    })

    async function setupUI() {
        const res = await getCollection()
        setCollectionList(res)
        setFetched(true)
    }

    useEffect(() => {
        if (isWeb3Enabled && chainId == scrollChainId) {
            setupUI()
        }
    }, [account, isWeb3Enabled, chainId])

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Collection</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    chainId == scrollChainId ? (
                        collectionList && collectionList.length > 0 ? (
                            collectionList.map((nft) => {
                                return (
                                    <NFTBox
                                        nftAddress={nft}
                                        tokenId="0"
                                        creator={account}
                                        key={`${nft}`}
                                    />
                                )
                            })
                        ) : fetched ? (
                            <div>Please create your NFT first.</div>
                        ) : (
                            <div>Fetching...</div>
                        )
                    ) : (
                        <div>Please switch to Scroll Network.</div>
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
