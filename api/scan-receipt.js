export default async function handler(req, res) {

    // Allow requests from Chloeat's GitHub Pages site
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://chloe2778.github.io"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // Handle browser CORS check
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                error: "No receipt image was provided."
            });
        }

        const response =
            await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            `Bearer ${process.env.OPENROUTER_API_KEY}`
                    },

                    body: JSON.stringify({

                        model: "openrouter/free",

                        messages: [
                            {
                                role: "user",

                                content: [
                                    {
                                        type: "text",

                                        text: `
Look at this grocery receipt.

Identify the actual grocery or food items purchased.

Ignore:
- prices
- taxes
- totals
- discounts
- store information
- payment information

For every grocery item, give:
- name
- quantity
- unit

Return ONLY valid JSON:

{
    "groceries": [
        {
            "name": "Chicken breast",
            "quantity": "1.24",
            "unit": "kg"
        }
    ]
}
`
                                    },

                                    {
                                        type: "image_url",

                                        image_url: {
                                            url: image
                                        }
                                    }
                                ]
                            }
                        ]
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            return res.status(response.status).json({
                error:
                    "OpenRouter returned an error.",
                openrouter:
                    data
            });
        }

        const content =
            data.choices?.[0]?.message?.content;

        if (!content) {

            return res.status(500).json({
                error:
                    "OpenRouter returned no content.",
                openrouter:
                    data
            });
        }

        let result;

        try {

            result =
                JSON.parse(content);

        } catch (error) {

            return res.status(500).json({
                error:
                    "The AI did not return valid JSON.",
                aiResponse:
                    content
            });
        }

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            error:
                "Backend error.",
            message:
                error.message
        });
    }
}
