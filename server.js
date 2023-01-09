const path = require("path");
const fs = require("fs");

//express
const express = require("express");
const app = express();

//dotenv
require("dotenv").config();
const { PORT = 8080 } = process.env;

//my functions
const {
    addComment,
    getCommentsById,
    getImages,
    getImageById,
    addImage,
} = require("./db");

const { uploader, s3 } = require("./middleware");

// * * * * * * * * * * * * * * * * * * * * * *

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());

// * * * * * * * * * * * * * * * * * * * * * *

app.post("/comments", (req, res) => {
    const comment = req.body;
    addComment(comment).then((row) => {
        res.json(row);
    });
});

app.get("/images/:imageId/comment", (req, res) => {
    //show images from database as json under /images/id
    getCommentsById(req.params.imageId).then((result) => {
        res.json(result.rows);
    });
});

// * * * * * * * * * * * * * * * * * * * * * *

app.get("/images/:imageId", (req, res) => {
    //show images from database as json under /images/id
    getImageById(req.params.imageId).then((result) => {
        res.json(result.rows);
    });
});

app.get("/images", (req, res) => {
    //show images from database as json under /images
    //console.log(req.query);
    getImages(req.query.page).then((result) => {
        res.json(result.rows);
    });
});

app.post("/images", uploader.single("file"), (req, res) => {
    //req.file available from multer
    console.log(req.file);
    console.log(req.body);

    if (req.file) {
        const { filename, mimetype, size, path } = req.file;

        const promise = s3
            .putObject({
                Bucket: "spicedling",
                ACL: "public-read",
                Key: filename, //filename property of the req.file object created by multer = name of file in bucket
                Body: fs.createReadStream(path), //pass path of uploaded file (comes from req.file)
                ContentType: mimetype,
                ContentLength: size,
            })
            .promise(); //returned object has promise method to get one

        promise
            .then(() => {
                console.log("success");

                //write into database
                addImage({
                    url: `https://s3.amazonaws.com/spicedling/${req.file.filename}`,
                    username: req.body.username,
                    title: req.body.title,
                    description: req.body.description,
                })
                    .then((newImage) => {
                        //if successfully added to database, write json for img fetch in app.js
                        res.json({
                            success: true,
                            message: "File upload successful",
                            url: `https://s3.amazonaws.com/spicedling/${req.file.filename}`,
                            description: req.body.description,
                            title: req.body.title,
                            username: req.body.username,
                            id: newImage.id,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.json({ success: false });
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({
            success: false,
            message: "File upload failed",
        });
    }
});

// * * * * * * * * * * * * * * * * * * * * * *

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
