const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();

const db = new sqlite3.Database("./db/data.sqlite");

const init = () => {
    db.parallelize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS apparel
            (
                freeEntry       VARCHAR(20),
                big             VARCHAR(20),
                medium          VARCHAR(20),
                small           VARCHAR(20),
                height          VARCHAR(20),
                sleeve          VARCHAR(20),
                neck            VARCHAR(20),
                shape           VARCHAR(20),
                design          VARCHAR(20),
                material        VARCHAR(20),
                'set'           VARCHAR(20),
                image           VARCHAR(20),
                pattern         VARCHAR(20),
                seasonOrEvent   VARCHAR(20),
                ageOrSex        VARCHAR(20),
                place           VARCHAR(20),
                others          VARCHAR(20),
                size            VARCHAR(20),
                color           VARCHAR(20)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS shoes
            (
                freeEntry       VARCHAR(20),
                big             VARCHAR(20),
                medium          VARCHAR(20),
                heel            VARCHAR(20),
                designOrShape   VARCHAR(20),
                material        VARCHAR(20),
                image           VARCHAR(20),
                pattern         VARCHAR(20),
                seasonOrEvent   VARCHAR(20),
                ageOrSex        VARCHAR(20),
                place           VARCHAR(20),
                others          VARCHAR(20),
                size            VARCHAR(20),
                color           VARCHAR(20)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS bag_wallet
            (
                freeEntry       VARCHAR(20),
                big             VARCHAR(20),
                mediumBag       VARCHAR(20),
                mediumWallet    VARCHAR(20),
                functionBag     VARCHAR(20),
                functionWallet  VARCHAR(20),
                designOrShape   VARCHAR(20),
                material        VARCHAR(20),
                image           VARCHAR(20),
                pattern         VARCHAR(20),
                ageOrSex        VARCHAR(20),
                place           VARCHAR(20),
                others          VARCHAR(20),
                seasonOrEvent   VARCHAR(20),
                size            VARCHAR(20),
                color           VARCHAR(20)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS dress
            (
                freeEntry       VARCHAR(20),
                big             VARCHAR(20),
                medium          VARCHAR(20),
                height          VARCHAR(20),
                sleeve          VARCHAR(20),
                neck            VARCHAR(20),
                shape           VARCHAR(20),
                design          VARCHAR(20),
                material1       VARCHAR(20),
                material2       VARCHAR(20),
                image           VARCHAR(20),
                pattern1        VARCHAR(20),
                pattern2        VARCHAR(20),
                ageOrSex        VARCHAR(20),
                place           VARCHAR(20),
                others          VARCHAR(20),
                seasonOrEvent   VARCHAR(20),
                size            VARCHAR(20),
                color           VARCHAR(20)
            )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS swimsuit
            (
                freeEntry       VARCHAR(20),
                big             VARCHAR(20),
                medium          VARCHAR(20),
                shape           VARCHAR(20),
                design          VARCHAR(20),
                'set'           VARCHAR(20),
                image           VARCHAR(20),
                pattern         VARCHAR(20),
                ageOrSex        VARCHAR(20),
                others          VARCHAR(20),
                size            VARCHAR(20),
                color           VARCHAR(20)
            )
        `);
    });
};

init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/apparel", (req, res) => {
    db.all("SELECT * FROM apparel", (error, rows) => {
        if (error) return res.status(404).json({ error });
        res.json({ apparel: rows });
    });
});

app.post("/apparel", (req, res) => {
    const data = req.body.data;
    db.run("DELETE FROM apparel", (error) => {
        if (error) return res.status(400).json({ error });
        if (data.length === 0) return res.json({ saved: true });
        db.run(
            `INSERT INTO apparel(
                freeEntry, big, medium, small, height, sleeve, neck, shape, design, material, 'set', image, pattern, seasonOrEvent, ageOrSex, place, others, size, color
                ) VALUES ${data.map((t) => `(${t.map((s) => `'${s}'`).join(",")})`).join(",")}`,
            (error) => {
                if (error) return res.status(400).json({ error });
                res.json({ saved: true });
            }
        );
    });
});

app.get("/shoes", (req, res) => {
    db.all("SELECT * FROM shoes", (error, rows) => {
        if (error) return res.status(404).json({ error });
        res.json({ shoes: rows });
    });
});

app.post("/shoes", (req, res) => {
    const data = req.body.data;
    db.run("DELETE FROM shoes", (error) => {
        if (error) return res.status(400).json({ error });
        if (data.length === 0) return res.json({ saved: true });
        db.run(
            `INSERT INTO shoes(
                freeEntry, big, medium, heel, designOrShape, material, image, pattern, seasonOrEvent, ageOrSex, place, others, size, color
                ) VALUES ${data.map((t) => `(${t.map((s) => `'${s}'`).join(",")})`).join(",")}`,
            (error) => {
                if (error) return res.status(400).json({ error });
                res.json({ saved: true });
            }
        );
    });
});

app.get("/bag-wallet", (req, res) => {
    db.all("SELECT * FROM bag_wallet", (error, rows) => {
        if (error) return res.status(404).json({ error });
        res.json({ bagWallet: rows });
    });
});

app.post("/bag-wallet", (req, res) => {
    const data = req.body.data;
    db.run("DELETE FROM bag_wallet", (error) => {
        if (error) return res.status(400).json({ error });
        if (data.length === 0) return res.json({ saved: true });
        db.run(
            `INSERT INTO bag_wallet(
                freeEntry, big, mediumBag, mediumWallet, functionBag, functionWallet, designOrShape, material, image, pattern, ageOrSex, place, others, seasonOrEvent, size, color
                ) VALUES ${data.map((t) => `(${t.map((s) => `'${s}'`).join(",")})`).join(",")}`,
            (error) => {
                if (error) return res.status(400).json({ error });
                res.json({ saved: true });
            }
        );
    });
});

app.get("/dress", (req, res) => {
    db.all("SELECT * FROM dress", (error, rows) => {
        if (error) return res.status(404).json({ error });
        res.json({ dress: rows });
    });
});

app.post("/dress", (req, res) => {
    const data = req.body.data;
    db.run("DELETE FROM dress", (error) => {
        if (error) return res.status(400).json({ error });
        if (data.length === 0) return res.json({ saved: true });
        db.run(
            `INSERT INTO dress(
                freeEntry, big, medium, height, sleeve, neck, shape, design, material1, material2, image, pattern1, pattern2, ageOrSex, place, others, seasonOrEvent, size, color
                ) VALUES ${data.map((t) => `(${t.map((s) => `'${s}'`).join(",")})`).join(",")}`,
            (error) => {
                if (error) return res.status(400).json({ error });
                res.json({ saved: true });
            }
        );
    });
});

app.get("/swimsuit", (req, res) => {
    db.all("SELECT * FROM swimsuit", (error, rows) => {
        if (error) return res.status(404).json({ error });
        res.json({ swimsuit: rows });
    });
});

app.post("/swimsuit", (req, res) => {
    const data = req.body.data;
    db.run("DELETE FROM swimsuit", (error) => {
        if (error) return res.status(400).json({ error });
        if (data.length === 0) return res.json({ saved: true });
        db.run(
            `INSERT INTO swimsuit(
                freeEntry, big, medium, shape, design, 'set', image, pattern, ageOrSex, others, size, color
                ) VALUES ${data.map((t) => `(${t.map((s) => `'${s}'`).join(",")})`).join(",")}`,
            (error) => {
                if (error) return res.status(400).json({ error });
                res.json({ saved: true });
            }
        );
    });
});

app.listen(5000, () => {
    console.log(`Backend server running at port 5000`);
});
