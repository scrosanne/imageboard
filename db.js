const spicedPg = require("spiced-pg");
const { USER, PASSWORD } = process.env;

const user = USER;
const password = PASSWORD;
const database = "imageboard";

// this establishes the connection to the db
// it get's a connection string as an argument
const db = spicedPg(`postgres:${user}:${password}@localhost:5432/${database}`);

const LIMIT = 5;

// / / / / / / / c o m m e n t / / / / / / /

function addComment({ username, comment, image_id }) {
    return db
        .query(
            `INSERT INTO comments ("username", "comment", "image_id")
    VALUES ($1, $2, $3)
    RETURNING *`,
            [username, comment, image_id]
        )
        .then((result) => result.rows[0]);
}

function getCommentsById(image_id) {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [image_id]);
}

// / / / / / / / i m a g e s / / / / / / /

function getImages(page = 0) {
    //first page 0
    const OFFSET = page * LIMIT;
    return db.query(`SELECT * FROM images LIMIT $1 OFFSET $2`, [LIMIT, OFFSET]);
    // .then((result) => result.rows[0]);
    // return new Promise((resolve, reject) => {
    //     resolve({ id: 0, fname: "name", lname: "lname", signature: "sign" });
    // });
}

function getImageById(id) {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
}

function addImage({ url, username, title, description }) {
    return db
        .query(
            `INSERT INTO images ("url", "username", "title", "description")
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
            [url, username, title, description]
        )
        .then((result) => result.rows[0]);
}

module.exports = {
    addComment,
    getCommentsById,
    getImages,
    getImageById,
    addImage,
};
