  CREATE TABLE users (
    uid VARCHAR,
    username VARCHAR(25) PRIMARY KEY,
    followed_subreddits TEXT[]
  );

-- FOR INSERTING ARRAY INTO TABLE
INSERT INTO users VALUES (1,'Joshua',ARRAY['1','2'])


//CREATED TABLE
CREATE TABLE posts (
  postId BIGSERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(25) NOT NULL,
  title VARCHAR(30) NOT NULL,
  content VARCHAR NOT NULL,
  subreddit VARCHAR(20) NOT NULL,
  createdAt TIMESTAMP NOT NULL
);

CREATE TABLE likes (
  parent_postid UUID DEFAULT uuid_generate_v4(),
  username VARCHAR(20) NOT NULL,

  FOREIGN KEY (parent_postid) REFERENCES posts(postid)
);

CREATE TABLE subreddits (
  subreddit VARCHAR(20) PRIMARY KEY,
  about VARCHAR NOT NULL
);

SELECT comments.content, comments.username,comments.createdat, comments.comment_id 
FROM comments 
JOIN posts ON posts.postid = comments.parent_postid 
WHERE posts.postid = $1
ORDER BY createdat DESC

SELECT comments.content, comments.username,comments.createdat, comments.comment_id,comments.parent_postid,posts.postid, users.profile_url
FROM comments, users, posts
WHERE comments.parent_postid = posts.postid AND comments.username = users.username
ORDER BY comments.createdat DESC;

SELECT posts.postid, posts.title, posts.content, posts.img_url, posts.subreddit, posts.username, posts.createdat, COUNT(comments.parent_postid) AS comments_count
FROM posts LEFT JOIN comments ON comments.parent_postid = posts.postid
GROUP BY posts.postid
ORDER BY posts.createdAt;