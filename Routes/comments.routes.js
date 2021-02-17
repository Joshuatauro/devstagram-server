const router = require('express').Router()
const db = require('../db')

//* ADD COMMENTS
router.route('/add').post(async(req,res) => {
  const postID = req.body.postID
  const username = req.body.userName
  const content = req.body.content
  const createdAt = new Date()

  try{
    const createComment = await db.query('INSERT INTO comments (username,content,parent_postid,createdAt) VALUES ($1,$2,$3,$4) returning *', [username, content, postID,createdAt ])
    
    res.status(200).json(
      {
        status: "Success",
        data: {
          commentDetails: createComment.rows[0]
        }
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


//* GET ALL COMMENTS FOR A SINGLE POST
router.route('/:postID').get(async(req,res) => {
  const postID = req.params.postID

  try{
    const comments = await db.query(`SELECT comments.content, comments.username,comments.createdat, comments.comment_id,comments.parent_postid, users.profile_url
                                    FROM comments, users
                                    WHERE comments.parent_postid = $1 AND comments.username = users.username
                                    ORDER BY comments.createdat DESC`, [postID])
    res.status(200).json(
      {
        status: "Success",
        numOfResults: comments.rows.length,
        data: {
          comments: comments.rows
        }
      }
    )
  } catch(err){
    res.status(400).json(
      {
        status:"Error",
        message: err.message
      }
    )
  }
})

//* UPDATE A SINGLE COMMENT
router.route('/:commentID').put(async(req,res) => {
  const commentID = req.params.commentID
  const content = req.body.content
  try{
    const update = await db.query('UPDATE comments SET content = $1 WHERE comment_id = $2', [content, commentID])

    res.status(200).json(
      {
        status: "Success",
        data: {
          updatedContent: update.rows[0].content
        }
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

//* DELETE A COMMENT
router.route('/:commentID').delete(async(req, res) => {
  const commentID = req.params.commentID

  try{
    
    const deleteComment = await db.query('DELETE FROM comments WHERE comment_id = $1', [commentID])
    res.status(200).json({
      status: "Success",
      message: "Comment deleted successfully"
    })
  
  } catch(err) {
    res.status(400).json(
      {
        status: "Error",
        message: err.message
      }
    )
  }

})

module.exports = router