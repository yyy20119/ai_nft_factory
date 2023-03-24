const pinataSDK = require("@pinata/sdk")
const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

const upload_to_pinata = async (req, res) => {
    const { metadata } = req.body
    console.log("api call entry", metadata)

    const response = await pinata.pinJSONToIPFS(metadata)
    console.log(response)

    res.status(200).json(response)
}

export default upload_to_pinata
