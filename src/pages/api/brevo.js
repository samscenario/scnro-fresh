src/pages/api/brevo.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY, // stored securely in Vercel
      },
      body: JSON.stringify({
        email,
        listIds: [14], // replace 14 with your actual Brevo list ID
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Brevo error:", error);
      return res.status(500).json({ error: "Brevo API call failed" });
    }

    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
}
