  CREATE TABLE users (
    uid VARCHAR,
    username VARCHAR(25) PRIMARY KEY,
    followed_subreddits TEXT[]
    bio VARCHAR DEFAULT 'Hey guys, welcome to my profile',
    profile_url VARCHAR
    portfolio VARCHAR
  );

CREATE TABLE posts (
  postId BIGSERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(25) NOT NULL,
  title VARCHAR(30) NOT NULL,
  content VARCHAR,
  subreddit VARCHAR(20) NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  img_url VARCHAR 
);

CREATE TABLE likes (
  parent_postid UUID DEFAULT uuid_generate_v4(),
  username VARCHAR(20) NOT NULL,

  FOREIGN KEY (parent_postid) REFERENCES posts(postid)
);

CREATE TABLE comments (
  parent_postid UUID DEFAULT uuid_generate_v4,
  username VARCHAR NOT NULL,
  content VARCHAR NOT NULL,
  createdat TIMESTAMP NOT NULL,
  comment_id UUID DEFAULT uuid_generate_v4
)

CREATE TABLE subreddits (
  subreddit VARCHAR(20) PRIMARY KEY,
  about VARCHAR NOT NULL,
  followed_by TEXT[]
);

