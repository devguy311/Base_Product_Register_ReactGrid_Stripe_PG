const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Pool } = require("pg");
const stripe = require("stripe")(
    process.env.STRIPE_SECRET_KEY || "sk_test_51Mh2sVADW7HKLIBblqO3FY6Wv5Yx2dmHpKbsnwI57qyGJX2sm0SrD62WYN6NfXL1nCQrqqQy2WtwtIxYE2CIpJYh00utYcr8kr"
);

const pool = new Pool({
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PSW || "postgres",
    database: process.env.POSTGRES_DB || "thebase",
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || "localhost",
});

const app = express();

const init = () => {
    pool.query(`CREATE TABLE IF NOT EXISTS users
        (
            email           VARCHAR(50) NOT NULL,
            descriptions    VARCHAR(2000),
            subscription    VARCHAR(30)
        )
    `);
};

init();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/descriptions", (req, res) => {
    pool.query(`SELECT (descriptions) FROM users WHERE email='${req.query.email}'`, (error, result) => {
        let descriptions = [];
        if (!error && result.rows.length !== 0 && result.rows[0].descriptions !== null)
            result.rows[0].descriptions.split(";\t").forEach((t) => descriptions.push({ header: t.split(":\t")[0], keywords: t.split(":\t")[1].split(",\t") }));
        res.json({ descriptions });
    });
});

app.post("/descriptions", (req, res) => {
    pool.query(
        `UPDATE users SET descriptions='${req.body.data.map((t) => `${t.header}:\t${t.keywords.join(",\t")}`).join(";\t")}' WHERE email='${req.body.email}'`,
        (error) => {
            if (error) return res.status(400).json({ error });
            res.json({ saved: true });
        }
    );
});

app.get("/me", (req, res) => {
    axios
        .get("https://api.thebase.in/1/users/me", {
            headers: {
                Authorization: `Bearer ${req.query.accessToken}`,
            },
        })
        .then((response) => {
            return res.status(200).json({
                result: "success",
                user: response.data.user,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                result: "failure",
                error,
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
                                    client_id: `${process.env.CLIENT_ID || "6cd00fb8ffcab2dec0d1f10f7096b697"}`,
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
        .catch(() => {
            return res.status(400).json({
                /*result: "failure"*/
            });
        });
});

app.get("/stripe/success", async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    pool.query(`SELECT * FROM users WHERE email='${session.customer_email}'`, (error, result) => {
        if (error) return res.redirect(`${process.env.APP_URL || "http://localhost:3000"}?backend_error`);
        if (result.rows.length === 0)
            pool.query(`INSERT INTO users(email, subscription) VALUES ('${session.customer_email}', '${session.subscription}')`, (error) => {
                if (error) return res.redirect(`${process.env.APP_URL || "http://localhost:3000"}?backend_error`);
                res.redirect(process.env.APP_URL || "http://localhost:3000");
            });
        else {
            pool.query(`UPDATE users SET subscription='${session.subscription}' WHERE email='${session.customer_email}'`, (error) => {
                if (error) return res.redirect(`${process.env.APP_URL || "http://localhost:3000"}?backend_error`);
                res.redirect(process.env.APP_URL || "http://localhost:3000");
            });
        }
    });
});

app.post("/stripe/check", async (req, res) => {
    pool.query(`SELECT (subscription) FROM users WHERE email='${req.body.email}'`, async (error, result) => {
        if (error || result.rows.length === 0 || result.rows[0].subscription === null) return res.status(404).json({ error });
        const subscription = await stripe.subscriptions.retrieve(result.rows[0].subscription);
        if (subscription.current_period_end < Math.floor(Date.now() / 1000)) res.json({ result: "failure" });
        else res.json({ result: "success", interval: subscription.plan.interval });
    });
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server running at port ${process.env.PORT || 5000}`);
});
