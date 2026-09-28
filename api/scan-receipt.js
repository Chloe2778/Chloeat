export default async function handler(req, res) {

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

                    model: "openrouter/free",

                    messages: [

                        {
                            role: "user",

                            content: [

                                {
                                    type: "text",

                                    text: `
Look at this grocery receipt.

Identify the actual grocery/food items purchased.

Ignore:
- prices
- taxes
- totals
- discounts
- payment information
- store information
- loyalty information

For each grocery item, provide:
- name
- quantity
- unit

If the quantity cannot be determined, use an empty string.

Return ONLY valid JSON in this exact format:

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

            console.error(
                "OpenRouter error:",
                data
            );

            return res.status(500).json({
                error: "OpenRouter request failed.",
                details: data
            });

        }


        const content =
            data.choices?.[0]?.message?.content;


        if (!content) {

            return res.status(500).json({
                error: "The AI returned no result."
            });

        }


        let result;


        try {

            result =
                JSON.parse(content);

        }

        catch (error) {

            console.error(
                "AI returned invalid JSON:",
                content
            );

            return res.status(500).json({
                error: "The AI returned invalid JSON."
            });

        }


        return res.status(200).json(
            result
        );


    }

    catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Something went wrong."
        });

    }

}
