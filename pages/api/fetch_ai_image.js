const { Configuration, OpenAIApi } = require("openai")
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const fetch_ai_image = async (req, res) => {
    const { description } = req.body
    console.log("api call entry", description)

    const response = await openai.createImage({
        prompt: description,
        n: 1,
        size: "256x256",
    })
    const image_url = response.data.data[0].url
    console.log(image_url)

    res.status(200).json({ image_url: image_url })
}

export default fetch_ai_image
