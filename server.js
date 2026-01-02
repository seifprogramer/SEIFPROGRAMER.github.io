// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("public"));

const CLIENT_ID = "Ov23li9K2iqXx5zmF955";       // from your GitHub OAuth app
const CLIENT_SECRET = "c780253da2b37bce3ce84fa88b10d57c83d78f0f"; // keep private

// OAuth callback endpoint
app.get("/auth/github/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("No code provided");

    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code
        })
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;
    if (!token) return res.send("Failed to get access token");

    // Send back a small page that stores the token and redirects to /home
    res.send(`
        <script>
            localStorage.setItem("github_token", "${token}");
            window.location.href = "/home.html";
        </script>
    `);
});

// Start backend
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
