const router = require("express").Router()
const db = require('../db')

router.route('/settings').get(async(req,res) => {
  const uid = req.body.uid

  const response = await db.query('SELECT * FROM users WHERE uid = $1', [uid])
})

router.route('/create').post(async(req,res) => {
  const uid = req.body.uid
  const username = req.body.userName


  try{
    const addUser = await db.query('INSERT INTO users(uid, username) VALUES ($1,$2)', [uid, username])
    res.status(200).json(
      {
        status: 'Success'
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        status: 'Something went wrong',
        message: err.message
      }
    )
  }
})


router.route('/follow/subreddit').post(async(req, res) => {
  const subreddit = req.body.subreddit
  const username = req.body.username

  try{
    const followSubreddit = await db.query('UPDATE users SET followed_subreddits = array_append(followed_subreddits , $1) WHERE username = $2', [subreddit, username])
    const addToSubreddits = await db.query('UPDATE subreddits SET followed_by = array_append(followed_by, $1) WHERE subreddit = $2', [ username, subreddit ])
    res.status(200).json(
      {
        status: 'Success'
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        status: 'Something went wrong',
        message: err.message
      }
    )
  }
})

router.route('/unfollow/subreddit').post(async(req, res) => {
  const subreddit = req.body.subreddit
  const username = req.body.username

  try{
    const unFollowSubreddit = await db.query('UPDATE users SET followed_subreddits = array_remove(followed_subreddits , $1) WHERE username = $2', [subreddit, username])
    const removeFromSubreddits = await db.query('UPDATE subreddits SET followed_by = array_remove(followed_by, $1) WHERE subreddit = $2', [ username, subreddit ])
    res.status(200).json(
      {
        status: 'Success'
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        status: 'Something went wrong',
        message: err.message
      }
    )
  }
})


router.route('/:username').get(async(req , res) => {
  const username = req.params.username
  console.log(username)

  try{
    const getData = await db.query('SELECT * FROM posts WHERE posts.username = $1 ORDER BY createdAt DESC', [username])
    res.status(200).json(
      {
        status: "Success",
        data: {
          numOfRows: getData.rows.length,
          posts: getData.rows
        }
      }
    )
    console.log(getData.rows)
  } catch(err){
    console.log(err)
  }
})



module.exports = router 