const express = require('express');
const app = express();
const path = require('path');
const connection = require('./database/connection') 
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const {jwtFun, auth} = require('./jwt')
const {signInSchema,signUpSchema} = require('./validation')

app.use(express.json());
app.use(cookieParser());
app.use(auth)

// run the static files.
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/is-user', (req,res) => {
    if(req.user){
        res.json(req.user)
    } else{
        res.json(req.noUser)
    }
})

app.post('/api/sign-up', (req, res) => {
    const {userName, email, password, img} = req.body;
    const {error}=signUpSchema.validate(req.body)
    if(!error){
        return connection.query(
            'select email from users where email = $1;',
            [email]
        ).then(data => {
            if(data.rows[0]){
                res.json({msg: 'email exists'})
            } else{
                bcrypt.hash(password, 10).then(hashPassword => {
                    return connection.query(
                        'insert into users (username, email, password, img) values ($1, $2, $3, $4) returning id, username, img;',
                        [userName, email, hashPassword, img]
                    ).then(data => jwtFun(data.rows[0], res))
                })
            }
        })
    
    } else{
        res.json({ msg: error.details[0].message, state: 'fail' });
    }
})

app.post('/api/sign-out', (req, res) => {
    const {user_id} = req.body;
    if(req.user.id === user_id){
        res.clearCookie('token');
        res.json({bye: 'bye our frind'})
    }
})

app.post('/api/sign-in', (req, res) => {
    const {email, password} = req.body;
    const {error}=signInSchema.validate(req.body)
    if(!error){
        return connection.query(
            'select email, password from users where email = $1;',
            [email]
        ).then(data => {
            if(data.rows[0]){
                bcrypt.compare(password, data.rows[0].password).then(data => {
                    if(data){
                        return connection.query(
                            'select id, username, img from users where email = $1;',
                            [email]
                        ).then(data => jwtFun(data.rows[0], res))
                    } else{
                        res.json({msg: 'password is false'});
                    }
                })
            }
        })
    } else {
        res.json({ msg: error.details[0].message, state: 'fail' });
    }
 
})

app.get('/api/get-all-posts', (req, res) => {
    return connection.query(
        'select posts.*, users.userName, json_agg(votes.*)as votes from posts left join users on posts.user_id = users.id left join votes on posts.id = votes.post_id group by posts.id, users.id;'
    ).then(data => res.json(data.rows))
})

app.post('/api/add-post', (req, res) => {
    const {post, user_id, img} = req.body;
    if(req.user.id === user_id){
        return connection.query(
            'insert into posts (post, user_id, img) values ($1, $2, $3) returning *;',
            [post, user_id, img]
        ).then(data => {
            return connection.query(
                'select users.username, posts.* from posts left join users on posts.user_id = users.id where posts.id = $1 and users.id = $2;',
                [data.rows[0].id, data.rows[0].user_id]
            ).then(result => res.json(result.rows[0]))
        } )
    }
})

app.delete('/api/delete', (req, res) => {
    const {post_id, user_id} = req.body;
    if(user_id === req.user.id){
        return connection.query(
            'delete from posts where id = $1;',
            [post_id]
        )
    }
})

app.post('/api/voteing', (req,res) => {
    const {post_id, user_id} = req.body;
        return connection.query(
            'select id from votes where post_id = $1 and user_id = $2;',
            [post_id, user_id]
        ).then(data => {
            if(!data.rows[0]){
                return connection.query(
                    'insert into votes (post_id, user_id) values($1, $2);',
                    [post_id, user_id]
                ).then(data => res.json({addVote: 'voted'}))
            } else{
                return connection.query(
                    'delete from votes where post_id = $1 and user_id = $2;',
                    [post_id, user_id]
                ).then(data => res.json({deleteVote: 'vote is deleted'}))
            }
        })
})

app.put('/api/update', (req, res) => {
    const {post, post_id, user_id} = req.body;
    if(req.user.id === user_id){
        return connection.query(
            'update posts set post = $1 where id=$2 returning post;',
            [post, post_id]
        ).then(data => res.json(data.rows[0]))
    }
})

app.listen(5000, () =>{
    console.log('server is listining on port 5000');
})