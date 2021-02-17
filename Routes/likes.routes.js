const router = require('express').Router()
const db = require('../db')

//* GET LIKES
router.route('/:postID').get(async(req,res) => {
  const postID = req.params.postID

  try{
    const likes = await db.query('SELECT username FROM likes WHERE parent_postID = $1', [postID])

    res.status(200).json(
      {
        status: 'Success',
        data: {
          numOfLikes: likes.rows.length,
          likedBy: likes.rows
        }
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

//* LIKE POST
router.route('/add').post(async(req, res) => {
  const userName = req.body.userName
  const postID = req.body.postID

  try{
    const likePost = await db.query('INSERT INTO likes(username,parent_postID) VALUES ($1, $2) returning *', [userName, postID])

    res.status(200).json(
      {
        status: "Success",
        message: "Liked Post successfully"
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        status: "Failed",
        message: err.message
      }
    )
  }
})

//* REMOVE LIKE
router.route('/dislike').post(async(req, res) => {
  const postID = req.body.postID
  const userName = req.body.userName
  try{
    const deleteLike = await db.query('DELETE FROM likes WHERE username = $1 AND parent_postid = $2', [userName,postID])
    
    res.status(200).json(
      {
        status: "Success",
        message: 'Disliked'
      }
    )
  
  } catch(err) {
    res.status(400).json({
      status: "Error",
      message: err.message
    })
  }
})

module.exports = router