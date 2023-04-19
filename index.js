const express = require('express');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const { Configuration, OpenAIApi } = require("openai");
const dbchannelmodel = require('./schema');
require('dotenv').config();
const app = express();
app.use(require("cors")());
app.use(express.json());
const Password = process.env.PASSWORD;
const secret_key = process.env.SECRET_KEY;

const dburl = "mongodb+srv://reactchatgpt:" + Password + "@cluster0.jvyxwnw.mongodb.net/?retryWrites=true&w=majority";
const connectionparams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
// skadjaskdj
mongoose.connect(dburl, connectionparams)
    .then(() => {
        console.log("Connected to the DB");
    })
    .catch((err) => {
        if (err)
            console.error(err);
    });

app.post("/Signup", async (req, res) => {
    try {
        const exisitingdb = await dbchannelmodel.findOne({ email: req.body.mail });
        if (exisitingdb) {
            res.send("Email is already taken");
        }
        else {
            const channelmodel = new dbchannelmodel({
                name: req.body.name,
                email: req.body.mail,
                password: req.body.password,
                work: req.body.work,
                address: req.body.adress
            })
            await channelmodel.save()
            console.log("data is inserted")
            res.status(200).json(channelmodel);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error saving data to database");
    }
});
// app.get("/", (req, resp) => {
//     resp.send("server is running in the port 3002")
// })


// Login page backend code


app.post("/", async (req, resp) => {
    const email = req.body.emailenter;
    console.log(email);
    if (!email) {
        return resp.status(400).json({ error: "Email is required" });
    }

    try {
        const user = await dbchannelmodel.findOne({ email });

        if (!user) {
            return resp.status(401).send("Invalid email");
        }

        const token = jwt.sign({ email }, secret_key, { expiresIn: "1h" });
        resp.send({ token });
    } catch (error) {
        console.log(error);
        resp.status(500).send("Internal Server error");
    }
});

// Route to handle welcome message after successful login
app.get("/chat", verifytoken, async (req, resp) => {
    const email = req.user.email;
    resp.send(email);
});

// Middleware function to verify token
function verifytoken(req, resp, next) {
    const token = req.query.token;

    if (!token) {
        return resp.status(401).send("Unauthorized request");
    }

    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded;
        next();
    } catch (error) {
        return resp.status(403).send("Forbidden request");
    }
}

// Chat page backend code


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
    const prompt = req.body.prompt;
    try {
        if (prompt == null) {
            throw new Error("Uh oh, no prompt was provided");
        }
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            max_tokens: 2024,
        });
        const completion = response.data.choices[0].text;
        return res.status(200).json({
            success: true,
            message: completion,

        });
    } catch (error) {
        console.log(error.message);
    }
});
app.get("/chat", (req, resp) => {
    resp.send("please check out the problem")
})



app.listen(3002, (err) => {
    if (err)
        console.error(err);
    else
        console.log("listening on port 3002");
});
