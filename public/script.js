const email = document.querySelector('.email');
const userName = document.querySelector('.userNameInput');
const password = document.querySelector('.password');
const imgUserInput = document.querySelector('.imgUser');
const signUpBtn = document.querySelector('.signUpBtn');
const signUpForm = document.querySelector('.signUpForm');
const userContainer = document.querySelector('.userContainer');
const signInForm = document.querySelector('.signInForm');
const signInBtn = document.querySelector('.signInBtn');
const emailIn = document.querySelector('.emailIn');
const passwordIn = document.querySelector('.passwordIn');
const signOutBtn = document.querySelector('.signOUTBTN');

signOutBtn.style.display = 'none'

// let IfThereIsUser = false
// if(user === undefined) {
  // fetch('/api/get-all-posts').then(data => data.json())
  // .then(result => result.forEach(e =>createPost(e)))
// }

//! fetching sign up form and send data to backend side and redirect the user to main page

signUpBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const userInfo = {
    userName: userName.value,
    email: email.value,
    password: password.value,
    img: imgUserInput.value 
  }

  fetch('/api/sign-up',  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  }).then(data => data.json()).then(data => {
    if(data.msg){
      alert(data.msg)
    } else{
      window.location.href = '/';
    }
  })
})

//! fetching user data

fetch('/api/is-user')
  .then(data => data.json())
  .then(data => {
    if(data.username !== undefined){
      document.querySelector('.signForms').style.display = 'none';
      createPostForm(data);
      fetch('/api/get-all-posts').then(data => data.json()).then(result => result.forEach(e =>{ 
        createPost(e,data)}))
        signOutHandle(data)
    } else {
          fetch('/api/get-all-posts').then(data => data.json())
          .then(result => result.forEach(e =>createPost(e)))
        }
})

//! sign out event

function signOutHandle (user) {
  signOutBtn.style.display = 'block'

  signOutBtn.addEventListener('click', () => {
    const signOutInfo = {
      user_id: user.id
    }
    fetch('/api/sign-out',  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signOutInfo),
    }).then(data => data.json()).then(data => {
      window.location.href = '/';
    })
  })
}

//! sign in event

signInBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const signInInfo = {
    email: emailIn.value,
    password: passwordIn.value
  }
  fetch('/api/sign-in',  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signInInfo),
  }).then(data => data.json()).then(data => {
    if(data.msg){
      alert(data.msg)
    } else{
      window.location.href = '/';
    }
  })
})

//! build form to use inputs to creats posts 

function createPostForm(user) {
  //add placeholder to inputs
  // voteBtn.setAttribute("class", "fa-regular fa-heart");

  signInForm.style.display = 'none'

  const hello = document.querySelector('.userName');
  hello.textContent = ` ${user.username}`
  const imgUser = document.createElement('img');
  imgUser.src = user.img;
  imgUser.classList.add('userIamge');

  const form = document.createElement('form');
  const input = document.createElement('input');
  const inputImg = document.createElement('input');
  const addPostBtn = document.createElement('button');
  const addPostSection = document.querySelector('.addPostSection');

  form.classList.add('addPostForm');
  input.classList.add('addPostInput');
  inputImg.classList.add('addPostInput');
  addPostBtn.classList.add('addPostBtn');
  input.setAttribute('placeholder', 'Write a post');
  inputImg.setAttribute('placeholder', 'insert image');

  addPostSection.appendChild(form)
  userContainer.appendChild(imgUser)
  form.appendChild(input)
  form.appendChild(inputImg)
  form.appendChild(addPostBtn)
  addPostBtn.textContent = 'add post'
  signUpForm.style.display = 'none';

//! add post event

  addPostBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const postInfo = {
      post: input.value,
      user_id: user.id,
      img: inputImg.value
    }
    fetch('/api/add-post',  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postInfo),
    }).then(data => data.json()).then(post => {
      createPost(post,user);
      inputImg.value = '';
      input.value = '';
    
    })
  })

}

//! create post function (DOM) and its events

function createPost (post,user) {
  // {id: 3, post: 'asd', user_id: 1, username: 'kakashi', votes: Array(2)}
  // user = user || {name:e.username, id: e.user_id}
  // post = post || {id:e.id, post: e.post}
  const postsContainer = document.querySelector('.postsContainer');
  const userName = document.createElement('p');
  const item = document.createElement('dev');
  const text = document.createElement('p');
  const postTime = document.createElement('p');
  const voteContainer = document.createElement('dev');
  const voteText = document.createElement('p');
  const voteBtn = document.createElement('i');
  const updateInput = document.createElement('input');
  const deleteBTN = document.createElement('i');
  const updateBTN = document.createElement('i');
  const postContent = document.createElement('dev');
  const postBtns = document.createElement('dev');

  item.classList.add('post')
  voteContainer.classList.add('voteContainer')
  voteBtn.setAttribute("class", "fa-regular fa-heart");
  deleteBTN.setAttribute("class", "fa-solid fa-trash");
  updateBTN.setAttribute("class", "fa-solid fa-pen-to-square");
  postContent.classList.add('postContent')
  text.classList.add('postText')
  updateInput.classList.add('updateInput');
  postTime.classList.add('postTime')

  item.appendChild(voteContainer);
  voteContainer.appendChild(voteBtn);
  voteContainer.appendChild(voteText);

  if(post.img){
    const imgPost =  document.createElement('img');
    item.appendChild(imgPost);
    imgPost.src = post.img;
    imgPost.classList.add('postImg')
  }

  item.appendChild(postContent);
  postContent.appendChild(text);
  postContent.appendChild(updateInput);
  postContent.appendChild(postTime);
  postContent.appendChild(postBtns);
  
  postsContainer.appendChild(item);
  userName.textContent = post.username || 'anonymous';
  text.textContent = post.post;
  postTime.textContent = `published by ${userName.textContent}`;


//! in case no user found, the votes will appear before the below (return) stops the process
  if((!post.votes) || post.votes[0] === null){
    voteText.textContent = 0
    voteBtn.setAttribute("class", "fa-regular fa-heart");
  } else{
    if(user !== undefined){
      let a = post.votes.some(e => e.user_id === user.id && post.id === e.post_id)
      if(a){
        voteBtn.style.color = '#FD4500'
      }
  
    }
    voteText.textContent = post.votes.length;
    voteBtn.setAttribute("class", "fa-solid fa-heart");
    // if(user.id === post.votes.){
    //   voteBtn.style.color = '#FD4500'
    // }
  }



//! delete post event
  if(user === undefined){
    //will stop the process if user doesn't exist
    return;
  } else{
    if(user.id === post.user_id){
      postBtns.appendChild(deleteBTN);
      postBtns.appendChild(updateBTN);
  
      deleteBTN.addEventListener('click', () => {
        item.remove();
        const deleteInfo = {
          post_id: post.id,
          user_id: post.user_id
        }
        fetch('/api/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deleteInfo),
        })
      })  
  }

//! update post event

    let isUpdate = false;
    updateBTN.addEventListener('click', () => {
      if (!isUpdate) {
        updateInput.style.display = 'block';
        updateInput.value = text.textContent;
        text.style.display = 'none';
        updateInput.classList.add('postText');
        updateInput.classList.add('postText')
        updateInput.style.color = '#FD4500';
        updateInput.style.outline = 'none';
        updateInput.style.border = 'none';
        updateInput.focus()
        isUpdate = true;
      } else{
        text.style.display = 'block';
        updateInput.style.display = 'none';
        isUpdate = false;

        const updateInfo ={
          post: updateInput.value,
          post_id: post.id,
          user_id: post.user_id
        }
        fetch('/api/update',  {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateInfo),
        }).then(data => data.json()).then(data => text.textContent = data.post)
      }
    })
  }

//! Votes event, add vote and delete it

  voteBtn.addEventListener('click', () => {
      const voteInfo = {
        user_id: user.id,
        post_id: post.id
      }
      fetch('/api/voteing',  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteInfo),
      }).then(data => data.json()).then(data => {
        if(data.addVote){
          voteText.textContent =   +voteText.textContent + 1;
          voteBtn.setAttribute("class", "fa-solid fa-heart");
          voteBtn.style.color = '#FD4500'
        } else{
          voteText.textContent =   +voteText.textContent - 1;
          voteBtn.setAttribute("class", "fa-regular fa-heart");
          voteBtn.style.color = '#e5e5e5'
        }
      })
    })
}

