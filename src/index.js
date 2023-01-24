let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function fetchData(url) {
    return fetch(url)
    .then(res => res.json())
  }

  function postData(url, body) {
    return fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
  }

  function handleForm(e) {
    e.preventDefault()

    const toy = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    }
    postData('http://localhost:3000/toys', toy)
    .then(data => renderToyCard(data)) 
    .catch(e => console.error(e))
  }
 
  function renderToyCard(toyData) {
    const div = document.createElement('div')
    const h2 = document.createElement('h2')
    const img = document.createElement('img')
    const p = document.createElement('p')
    const btn = document.createElement('button')
  
    h2.textContent = toyData.name
    p.textContent = `${toyData.likes} Likes!`
    btn.textContent = 'Like <3'
  
    img.src = toyData.image
    img.className = 'toy-avatar'
    div.className = 'card'
    btn.className = 'like-btn'
    btn.id = toyData.id

    btn.addEventListener('click', () => {
      fetch(`http://localhost:3000/toys/${toyData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({likes:toyData.likes+1})
      })
      .then(res => res.json())
      .then(data => renderToyCard(data))
    })
  
    div.append(h2,img,p,btn)
    document.querySelector('#toy-collection').append(div)
  }
  
  fetchData('http://localhost:3000/toys')
  .then(data => data.forEach(renderToyCard))
  .catch(error => {
    console.error(error)
    document.querySelector('main').innerHTML = `<h2>Sorry, we will be back soon!</h2>`
  })

  document.querySelector('form').addEventListener('submit', handleForm);
});

