let addToy = false;


//constants
const toyContainer = document.querySelector('#toy-collection'); //for charcter cards
const toyForm = document.querySelector('.add-toy-form');
const url = 'http://localhost:3000/toys'; //json server

//fetch toys (GET)  
const fetchAll = () => {
  fetch(url)
  .then(resp => resp.json())
  .then(data => {
    //add toy card
    data.forEach(character => {
      addToyCard(character)
    })
  })
}

//add toy card
const addToyCard = (character) => {
    //create all elements
    let div = document.createElement('div'); 
    let h2 = document.createElement('h2');
    let img = document.createElement('img');
    let p = document.createElement('p');
    let button = document.createElement('button');
      //populate elements
    div.classList.add('card') 

    h2.innerText = character.name

    img.src = character.image
    img.classList.add("toy-avatar") 

    p.innerText = `${character.likes} Likes`

    button.innerText = 'Like ❤️'
    button.classList.add('like-btn')
    button.id = `${character.id}`
      //add any event listeners
    button.addEventListener('click', (e) => {
      onLikeClick(e)
    })
    //put card / elements in DOM
    div.appendChild(h2)
    div.appendChild(img)
    div.appendChild(p)
    div.appendChild(button)

    toyContainer.appendChild(div)


}

//on form submit  event listener
const onFormSubmit = (e) => {
  e.preventDefault() 
  //get form information
  let formData = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }


  //add a new toy (POST)
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
  .then(res => res.json()) //translate response to JSON
  .then(data => {
    //if successful update DOM with new toy card
    //add toy card
    addToyCard(data)
  })
  .catch(error => console.error(error));
    
    
  
}

//on like button click 
const onLikeClick = (e) => {

  //get toy id
  let id = e.target.id
  //calculate new number of likes
  let target = e.target.previousElementSibling
  let numLikes = parseInt(target.innerText.split(' ')[0]) + 1 
  //submit patch request
  fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      likes: numLikes
    }),

    
  })
  .then(res => res.json())
  .then(data => console.log(data))
  // .catch(error => console.error(error));
  //update DOM
  target.innerText = `${numLikes} Likes`
}



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

  //get all toys and populate page
  fetchAll();
  //add on form submit to toyform
  toyForm.addEventListener('submit', onFormSubmit)
});
