// server.js
const express = require("express");
const fetch = require("node-fetch");
const app = express();

const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";

app.get("/auth/github/callback", async (req, res) => {
    const code = req.query.code;

    // Exchange code for access token
    const tokenRes = await fetch(`https://github.com/login/oauth/access_token`, {
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

    // Redirect to /home and save token in localStorage
    res.send(`
        <script>
            localStorage.setItem("github_token", "${token}");
            window.location.href = "/home";
        </script>
    `);
});

app.listen(3000, () => console.log("Server running on port 3000"));
