// ****** SELECT ITEMS **********

const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option

let editElement;

let editFlag = false;

let editID = "";

// ****** EVENT LISTENERS **********

//submit form

form.addEventListener("submit", addItem);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  //time is given in milliseconds since Jan 1 1970
  //to string useful to manipulate time and put it in human readable format
  const id = new Date().getTime().toString();

  //if they have entered a value and not 'editing'
  //truthy or fasy values
  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    //add id
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    //add class
    element.classList.add("grocery-item");

    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;

    //access to buttons like delete and edit, happen after list rendered dynamically.
    //solution - could target parent OR target element itself instead of through document.getId etc

    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);

    //append child
    list.appendChild(element);
    displayAlert("item added to the list", "success");
    //show container
    container.classList.add("show-container");
    //add to local storage
    addToLocalStorage(id, value);
    //set back to default

    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    //edit local storage using new editID (not the old one - new time in milliseconds)
    editLocalStorage(editID, value);
    setBackToDefault();

    //whatever edited in input bar now becomes the new saved value;
  } else {
    displayAlert("please enter value", "danger");
  }
}
//display alert and text to go with it

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  //after one second make the text content empty and
  //remove the action

  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//clear button

// clearBtn.addEventListener("click", clearItems);???

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

//delete function

function deleteItem(e) {
  //targets the delete btn of the grocery item - the item is accessed as a grandparent of this button
  const element = e.currentTarget.parentElement.parentElement;

  //finds the generated id of that grocery item element from the time in milliseconds created.
  const id = element.dataset.id;
  //from grocerylist removes the child
  list.removeChild(element);
  //if there are no children (grocery items) in the list - then hide container
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  //remove from local storage.
  removeFromLocalStorage(id);
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //edit item.
  //Set edit item - targeting the h3 title from button container - which is its sibling.
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //set form value- make it show up in the search bar and display edit button.
  //grab h3 and assign it to form input.
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //when this function is run change the submitBtn to read 'EDIT' instead.
  submitBtn.textContent = "edit";
}

//set back to default - delete old item from search bar
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********

//grabbed title assigned to the input - then assign in back
function addToLocalStorage(id, value) {
  //passed on from arguments {id:id, value:value} it creates an object in a variable
  const grocery = { id, value };

  //set up a variable which takes in the key (list) value pair in localStorage
  //if it is not there set up an empty array called list
  let items = getLocalStorage();

  //push into the array the invidual grocery item.
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
  console.log(items);
}

function removeFromLocalStorage(id) {
  //empty array or array in localStorage
  let items = getLocalStorage();
  //creates a new array, without the one with the targetted id to be removed
  items = items.filter(function (item) {
    if (item.id !== id) {
      //if there is no match - include it in the new list
      return item;
    }
  });
  //updated local Storage is created with the new array or (items) that made the cut
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {}

//return from localStorage whatever you get
//Ternary operator - if condition true? valueIfTrue : value if False
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//This get's whatever is returned from the addToLocalStorage func

// JS object - const person = {
// name: 'Laura';
// age: 32;
// }

// AFTER JSON. stringify - compact way store data in ONE STRING
// {"firstName":"John","lastName":"Doe","age":30}
//  the key value pairs are now an array of strings

//to save to local storage
// localStorage.setItem("banana", JSON.stringify(["item2", "item2"]));
//to get item - you need to specify its 'key'.
// const banana = JSON.parse(localStorage.getItem("banana"));
//return as a a JS object
// console.log(banana);
// localStorage.removeItem("banana");
// ****** SETUP ITEMS **********
