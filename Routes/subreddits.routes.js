const router = require('express').Router()
const db = require('../db')

router.route('/').get(async(req, res) => {
  try{
    const subreddits = await db.query('SELECT subreddit FROM subreddits')
    res.status(200).json(
      {
        status: "Success",
        subreddits: subreddits.rows
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        stauts: "Success",
        message: err.message
      }
    )
  }
})



router.route('/:subreddit').get(async(req, res) => {
  const subreddit = req.params.subreddit

  try{
    const aboutSubreddit = await db.query('SELECT about, followed_by FROM subreddits WHERE subreddit ILIKE $1', [subreddit])
    res.status(200).json(
      {
        status:'Success',
        data: aboutSubreddit.rows[0]
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        status: 'Error',
        message: err.message
      }
    )
  }
})

module.exports = router