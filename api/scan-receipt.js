export default async function handler(req, res) {

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

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

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

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENROUTER_API_KEY}`
                },

                body: JSON.stringify({

                    model: "google/gemma-4-26b-a4b-it:free",

                    messages: [
                        {
                            role: "user",

                            content: [
                                {
                                    type: "text",

                                    text: `
You are the grocery receipt scanner for an app called Chloeat.

Look carefully at the receipt image.

Identify ONLY actual food or grocery products that were purchased.

Ignore:
- prices
- taxes
- totals
- discounts
- coupons
- payment information
- store information
- loyalty information
- transaction numbers
- dates
- addresses

For each grocery item, determine:
- name
- quantity
- unit

If quantity cannot be determined, use an empty string.

If unit cannot be determined, use an empty string.

Return ONLY valid JSON.
Do not write any explanation.
Do not write any safety message.
Do not use markdown.

Use exactly this format:

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
