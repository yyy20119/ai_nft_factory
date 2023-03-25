import { useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import customNFTFactoryAbi from "../constants/CustomNFTFactory.json"
import networkMapping from "../constants/networkMapping.json"
import { Card, useNotification, Input, Button, Form } from "web3uikit"
import Router from "next/router"

export default function CreateNFTForm() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const scrollChainId = networkMapping.scrollChainId
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [description, setDescription] = useState("")
    const dispatch = useNotification()
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")

    const customNFTFactoryAddress = networkMapping.customNFTFactoryAddress

    const { runContractFunction } = useWeb3Contract()

    const fetchImageUrl = async (description) => {
        const response = await fetch("/api/fetch_ai_image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: description,
            }),
        }).then((res) => res.json())
        return response
    }

    const fetchTokenUri = async (metadata) => {
        const response = await fetch("/api/upload_to_pinata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                metadata: metadata,
            }),
        }).then((res) => res.json())
        return `ipfs://${response.IpfsHash}`
    }

    const handleSubmit = async (submitRes) => {
        setLoading(true)
        setLoadingText("generating...")
        const response = await fetchImageUrl(description)
        const image_url = response.image_url
        console.log(response)

        const tokenUriMetadata = {}
        tokenUriMetadata.name = name
        tokenUriMetadata.description = description
        tokenUriMetadata.image = image_url
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const tokenUri = await fetchTokenUri(tokenUriMetadata)
        console.log(tokenUri)

        const options = {
            abi: customNFTFactoryAbi,
            contractAddress: customNFTFactoryAddress,
            functionName: "createNFTContract",
            params: {
                _name: name,
                _symbol: symbol,
                _uri: tokenUri,
            },
        }
        runContractFunction({
            params: options,
            onError: handleCreateNftError,
            onSuccess: handleCreateNftSuccess,
        })
        setLoadingText("confirming...")
    }

    const handleCreateNftError = async (tx) => {
        dispatch({
            type: "error",
            message: "Failed!",
            title: "Error",
            position: "topR",
        })
        setLoading(false)
    }

    const handleCreateNftSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Your NFT contract has been created and minted to your address!",
            title: "Confirmed",
            position: "topR",
        })
        setLoading(false)
        Router.push({ pathname: "/collection" })
        console.log("push router to collection")
    }

    return (
        <div>
            {isWeb3Enabled ? (
                chainId == scrollChainId ? (
                    <div>
                        <div className="m-5">
                            <Input
                                label="Name:"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="m-5">
                            <Input
                                label="Symbol:"
                                type="text"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                            />
                        </div>
                        <div className="m-5">
                            <Input
                                label="Description:"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="m-5">
                            <Button
                                text="Create NFT"
                                type="button"
                                onClick={handleSubmit}
                                theme="primary"
                                isLoading={loading}
                                loadingText={loadingText}
                            />
                        </div>
                    </div>
                ) : (
                    <div>Please switch to Scroll Network.</div>
                )
            ) : (
                <div>Web3 Currently Not Enabled</div>
            )}
        </div>
    )
}
