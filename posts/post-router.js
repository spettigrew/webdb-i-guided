const express = require("express")
const db = require("../data/db-config") // database access using knex

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        // translate to 'SELECT * FROM posts'
       return res.json(await db.select('*').from('posts'))
    } catch (err) {
        next
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        // translates to 'SELECT * FROM posts WHERE id = ?' first = limit 1 (will take out the first in the array.)
        // const post = await db('posts').where('id', req.params.id).first()//.select()
        return res.json(await db('posts').where('id', req.params.id).first())
    } catch (err) {
        next
    }
})

router.post("/", async (req, res, next) => {
    try {
        const payload = {
            // these object keys should match the column names
            title: req.body.title,
            contents: req.body.contents,
        }   
            // translate to 'INSERT INTO post (title, contents) VALUES(?, ?);'
            // .insert returns an array of IDs for the new rows, so we destructure it. 
            const [id] = await db('posts').insert(payload)
            return res.json(await db('posts').where('id', id).first())
    } catch (err) {
        next
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const payload = {
            title: req.body.title,
            contents: req.body.contents,
        }   
        // translates to 'UPDATE posts SET title = ? AND contents =? WHERE id = ?;'
        await db('posts').where('id', req.params.id).update(payload)
        return res.json(await db('posts').where('id', req.params.id).first())
    } catch (err) {
        next
    }
})

router.delete("/:id", validatePostId, async (req, res, next) => {
    try {
        await db('posts').where('id', req.params.id).del()
        // .end() sends an empty response
        return res.status(204).end()
    } catch (err) {
        next
    }
})

// Some simple middleware to validate the post ID before trying to use it
async function validatePostId(req, res, next) {
    try {
        const post = await db("posts").where("id", req.params.id).first()
        if (post) {
            next()
        } else {
            res.status(404).json({ message: "Post not found" })
        }
    } catch (err) {
        next(err)
    }
}

module.exports = router
