const router = require("express").Router();
const db = require("../db");

//* FOR GETTING ALL ALL POSTS
router.route("/").get(async (req, res) => {
  try {
    const posts = await db.query(`SELECT posts.postid, posts.title, posts.content, posts.img_url, posts.subreddit, posts.username, posts.createdat, users.profile_url
                                  FROM posts LEFT JOIN users ON users.username = posts.username
                                  GROUP BY posts.postid, users.profile_url
                                  ORDER BY posts.createdAt DESC`);
    res.status(200).json({
      status: "Success",
      numOfResults: posts.rows.length,
      data: {
        posts: posts.rows,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      data: {
        message: err.message,
      },
    });
  }
});

//* POSTS FROM ONE SUBREDDIT
router.route("/subreddit/:subreddits").get(async (req, res) => {
  const subreddits = req.params.subreddits;

  try {
    const posts = await db.query(
      `
      SELECT posts.title, posts.content, posts.username, posts.createdat, posts.subreddit, users.profile_url, posts.img_url
      FROM posts JOIN users ON users.username = posts.username
      WHERE posts.subreddit ILIKE $1`,
      [subreddits]
    );
    res.status(200).json({
      status: "Success",
      data: {
        numOfResults: posts.rows.length,
        posts: posts.rows,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      messageL: err.message,
    });
  }
});

//* ADDING POST
router.route("/add").post(async (req, res) => {
  const userName = req.body.userName;
  const title = req.body.title;
  const content = req.body.content;
  const subreddit = req.body.subreddit;
  const createdAt = new Date();
  const imgURL = req.body.downloadURL


  try {
    if(imgURL){
      const response = await db.query(
        "INSERT INTO posts(username, title, content, subreddit, createdat, img_url ) VALUES ($1,$2,$3,$4,$5, $6) returning *",
        [userName, title, content, subreddit, createdAt, imgURL]
      )
      res.status(200).json({
        status: "Success",
        postID: response.rows[0].postid,
      });
    } else {
      const response = await db.query(
        "INSERT INTO posts(username, title, content, subreddit, createdat ) VALUES ($1,$2,$3,$4,$5) returning *",
        [userName, title, content, subreddit, createdAt]
      )
      res.status(200).json({
        status: "Success",
        postID: response.rows[0].postid,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "There was something wrong",
      message: err.message,
    });
  }
});

//* DELETE POST
router.route('/delete/:postID').delete(async(req, res) => {
  const postID = req.params.postID

  try{
    const deleteLikes = await db.query('DELETE FROM likes WHERE parent_postid = $1', [postID])
    const deleteComments = await db.query('DELETE FROM comments WHERE parent_postid = $1', [postID])
    const deletePost = await db.query('DELETE FROM posts WHERE postID = $1', [postID])
    res.status(200).json(
      {
        status: 'Success',
        message: 'Post deleted successfully'
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        status: 'Failed',
        message: err.message
      }
    )
  }
})

//* UPDATE POST
router.route('/update/:postID').put(async(req, res) => {
  const postID = req.params.postID
  const content = req.body.content
  try{
    const update = await db.query('UPDATE posts SET content = $1 WHERE postID = $2', [content, postID])

    res.status(200).json(
      {
        status: 'Success',
        message: 'Post Edited successfullly',
        content: update.rows
      }
    )


  } catch(err) {
    res.status(400).json(
      {
        status: 'Failed kar gaya bsdk',
        message: err.message
      }
    )
  }
})

//* GET A SINGLE POST
router.route("/:postID").get(async (req, res) => {
  const postID = req.params.postID;
  try {
    const post = await db.query(`SELECT posts.title, posts.content, posts.subreddit,  posts.username, posts.img_url, users.profile_url,posts.createdat
                                FROM posts JOIN users ON users.username = posts.username
                                WHERE posts.postid = $1`, [postID])
    res.status(200).json({
      status: "Success",
      data: {
        post: post.rows[0],
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      data: {
        message: err.message,
      },
    });
  }
});

//* POSTS FROM USER PRIVATE FEED
router.route('/feed/:username').get(async(req, res) => {
  const username = req.params.username

  console.log('recieved')

  try{
      const feedPosts = await db.query(`SELECT title,postid, content,createdat,FOLLOWED_SUBREDDITS.username,FOLLOWED_SUBREDDITS.img_url, FOLLOWED_SUBREDDITS.subreddit,FOLLOWED_SUBREDDITS.profile_url,img_url FROM (
                                        SELECT posts.title,posts.postid, posts.content, posts.createdat, posts.username, users.profile_url, posts.img_url, posts.subreddit
                                        FROM posts LEFT JOIN users ON users.username = posts.username
                                        ) AS FOLLOWED_SUBREDDITS, users
                                        WHERE subreddit = ANY(users.followed_subreddits) AND users.username = $1
                                        ORDER BY FOLLOWED_SUBREDDITS.createdat DESC`, [username])
  
    res.status(200).json(
      {
        status: 'Success',
        data: {
          posts: feedPosts.rows
        }
      }
    )
  
  } catch (err) {
    res.status(404).json(
      {
        status: 'Something went wrong',
        message: err.message
      }
    )
  }
})

//* POSTS FROM A SINGLE PERSON
router.route('/user/:username').get(async(req , res) => {
  const username = req.params.username

  try{
    const getData = await db.query(`SELECT posts.postid, posts.title, posts.content, posts.img_url, posts.subreddit, posts.username, posts.createdat, users.profile_url
                                    FROM posts JOIN users ON users.username = posts.username
                                    WHERE users.username = $1
                                    ORDER BY posts.createdat DESC`, [username])
    res.status(200).json(
      {
        status: "Success",
        data: {
          numOfRows: getData.rows.length,
          posts: getData.rows
        }
      }
    )
  } catch(err){
    res.status(400).json(
      {
        status: 'Failed',
        message: err.message
      }
    )
  }
})
module.exports = router;
