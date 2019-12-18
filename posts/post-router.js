const express = require("express")
const db = require("../data/db-config") // database access using knex

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
       res.json(await db.select('*').from('posts'))
    } catch (err) {
        next
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        // translates to 'SELECT * FROM posts WHERE id = ?' first = limit 1.
        const post = await db('posts').where('id', req.params.id).first()//.select()
        res.json(post)
    } catch (err) {
        next
    }
})

router.post("/", async (req, res, next) => {
    try {
        const payload = {
            title: req.body.title,
            contents: req.body.contents,
        }   
            // translate to 'INSERT INTO post (title, contents) VALUES(?, ?);'
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

        await db('posts').where('id', req.params.id).update(payload)
        return res.json(await db('posts').where('id', req.params.id).first())
    } catch (err) {
        next
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        await db('posts').where('id', req.params.id).del()
        // .end() sends an empty response
        return res.status(204).end()
    } catch (err) {
        next
    }
})

module.exports = router
