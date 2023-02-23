const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");

const app = express();

const db = new sqlite3.Database("./db/data.sqlite");

const init = () => {
    db.parallelize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS descriptions
            (
                header          VARCHAR(50),
                keywords        VARCHAR(1000)
            )
        `);
    });
};

init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/descriptions", (req, res) => {
    db.all("SELECT * FROM descriptions", (error, rows) => {
        if (error) return res.status(404).json({ error });
        res.json({ descriptions: rows });
    });
});

app.post("/descriptions", (req, res) => {
    const data = req.body.data;
    db.run("DELETE FROM descriptions", (error) => {
        if (error) return res.status(400).json({ error });
        if (data.length === 0) return res.json({ saved: true });
        db.run(`INSERT INTO descriptions(header, keywords) VALUES ${data.map((t) => `('${t.header}', '${t.keywords.join(",")}')`)}`, (error) => {
            if (error) return res.status(400).json({ error });
            res.json({ saved: true });
        });
    });
});

app.post("/credentials", (req, res) => {
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;
    const authorizationCode = req.body.authorizationCode;
    axios
        .get("https://api.thebase.in/1/users/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(() => {
            return res.status(200).json({
                /*result: "success"*/
            });
        })
        .catch(() => {
            axios
                .post(
                    "https://api.thebase.in/1/oauth/token",
                    {},
                    {
                        params: {
                            grant_type: "refresh_token",
                            client_id: "6cd00fb8ffcab2dec0d1f10f7096b697",
                            client_secret: "1155fba3aa930f860d3436b84fbc06d0",
                            refresh_token: refreshToken,
                            redirect_uri: "http://localhost:3000/redirect",
                        },
                    }
                )
                .then((response) => {
                    return res
                        .status(201)
                        .json({ /*refresh_type: "token",*/ accessToken: response.data.access_token, refreshToken: response.data.refresh_token });
                })
                .catch(() => {
                    axios
                        .post(
                            "https://api.thebase.in/1/oauth/token",
                            {},
                            {
                                params: {
                                    grant_type: "authorization_code",
                                    client_id: "6cd00fb8ffcab2dec0d1f10f7096b697",
                                    client_secret: "1155fba3aa930f860d3436b84fbc06d0",
                                    code: authorizationCode,
                                    redirect_uri: "http://localhost:3000/redirect",
                                },
                            }
                        )
                        .then((response) => {
                            return res.status(201).json({
                                /*refresh_type: "authorization_code",*/ accessToken: response.data.access_token,
                                refreshToken: response.data.refresh_token,
                            });
                        })
                        .catch(() => {
                            res.status(400).json({
                                /*result: "failure"*/
                            });
                        });
                });
        });
});

app.post("/product", (req, res) => {
    const variationObject = {};
    req.body.variations.forEach((t, idx) => {
        variationObject[`variation[${idx}]`] = t.name;
        variationObject[`variation_stock[${idx}]`] = t.stock;
    });

    axios
        .post(
            "https://api.thebase.in/1/items/add",
            {},
            {
                headers: {
                    Authorization: `Bearer ${req.body.accessToken}`,
                },
                params: {
                    title: req.body.title,
                    detail: req.body.detail,
                    price: 50,
                    stock: 0,
                    visible: 0,
                    ...variationObject,
                },
            }
        )
        .then(() => {
            return res.json({
                /*result: "success"*/
            });
        })
        .catch((error) => {
            return res.status(400).json({
                /*result: "failure"*/
            });
        });
});

app.listen(5000, () => {
    console.log(`Backend server running at port 5000`);
});
