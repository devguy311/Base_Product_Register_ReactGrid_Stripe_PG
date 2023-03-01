const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PSW || "postgres",
    database: process.env.POSTGRES_DB || "thebase",
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
});

const app = express();

const init = () => {
    pool.query(`CREATE TABLE IF NOT EXISTS descriptions
        (
            header          VARCHAR(50),
            keywords        VARCHAR(1000)
        )
    `);
};

init();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/descriptions", (req, res) => {
    pool.query("SELECT * FROM descriptions", (error, result) => {
        if (error) return res.status(404).json({ error });
        res.json({ descriptions: result.rows });
    });
});

app.post("/descriptions", (req, res) => {
    const data = req.body.data;
    pool.query("DELETE FROM descriptions", (error) => {
        if (error) return res.status(400).json({ error });
        if (data.length === 0) return res.json({ saved: true });
        pool.query(`INSERT INTO descriptions(header, keywords) VALUES ${data.map((t) => `('${t.header}', '${t.keywords.join(",")}')`)}`, (error) => {
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
                            client_id: `${process.env.CLIENT_ID || "6cd00fb8ffcab2dec0d1f10f7096b697"}`,
                            client_secret: `${process.env.CLIENT_SECRET || "1155fba3aa930f860d3436b84fbc06d0"}`,
                            refresh_token: refreshToken,
                            redirect_uri: `${process.env.APP_URL || "http://localhost:3000"}/redirect`,
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
                                    client_id: `${process.env.APP_CLIENT_ID || "6cd00fb8ffcab2dec0d1f10f7096b697"}`,
                                    client_secret: `${process.env.CLIENT_SECRET || "1155fba3aa930f860d3436b84fbc06d0"}`,
                                    code: authorizationCode,
                                    redirect_uri: `${process.env.APP_URL || "http://localhost:3000"}/redirect`,
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

app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server running at port ${process.env.PORT || 5000}`);
});
