BEGIN;

DROP TABLE IF EXISTS posts,votes,users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    userName varchar(100),
    email varchar(100),
    password varchar(100),
    img TEXT
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    img TEXT,
    post TEXT NOT NULL,
    user_id int NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

COMMIT;