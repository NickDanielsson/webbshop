let totalPrice = 0;
const form = document.getElementById("form");
setItemsInCart();
getProducts();

// Sets the correct numbers of items in the cart when the page loads
function setItemsInCart() {
  let itemNumbers = localStorage.getItem("itemsInCart");
  document.querySelector(".container #itemsincart").textContent = itemNumbers;
}

// Gets the items from LS and injects into HTML
function getProducts() {
  let products = JSON.parse(localStorage.getItem("productsInCart"));
  let item = Object.values(products);
  let output = "";
  for (let i = 0; i < item.length; i++) {
    totalPrice += item[i].productPrice * item[i].inCart;

    output += `<div class="col-lg-3 col-md-3 mb-3" id="cardholder">
          <div class="card h-100" id="card">
            <img
              class="card-img-top"
              id="cardimg"
              src="${item[i].imgUrl}"
              alt="Card image cap"
            />

            <div class="card-body" id="cardbody">
              <h4 class="card-title" id="cardtitle">${item[i].productTitle}</h4>
              <h5 id="cardprice">Price: ${item[i].productPrice}&#x24;</h5>
            </div>
            <div class="card-footer text-center">
            <button class="btn btn-dark" id="minusbtn">-</button>
            <button class="btn btn-dark" id="quantitybtn">Antal: ${item[i].inCart}</button>
            
            <button class="btn btn-dark" id="plusbtn">+</button>
          </div>
          </div>
        </div>`;
  }
  totalPrice = totalPrice.toFixed(2);
  let priceOut = `Totalt pris: ${totalPrice} $`;
  document.getElementById("output").innerHTML = output;
  document.querySelector(".card-footer #totalprice").textContent = priceOut;
  checkIfCratIsEmpty();
}

// EventListener to buttons
document.addEventListener("click", function (e) {
  if (e.target.id === "minusbtn") {
    removeProduct(e);
    checkIfCratIsEmpty();
    reduceTotalPrice(e);
  }
  if (e.target.id === "plusbtn") {
    addProduct(e);
    increaseTotalPrice(e);
  }
  if (e.target.id === "submitbtn") {
    validateInput();
  }
});

// Validation for user input
function validateInput() {
  let a = document.getElementById("validationname").value;
  let b = document.getElementById("validationlastname").value;
  let c = document.getElementById("validationmail").value;
  let d = document.getElementById("validationaddress").value;
  let e = document.getElementById("validationcity").value;
  let f = document.getElementById("validationzipcode").value;

  if (a === "") {
    alert("Du måste ange ett namn!");
  }
  if (!isNaN(a)) {
    alert("Du får inte ange siffror i namnfältet!");
    document.getElementById("validationname").value = "";
  }

  if (b === "") {
    alert("Du måste ange ett efternamn!");
  }
  if (!isNaN(b)) {
    alert("Du får inte ange siffror i namnfältet!");
    document.getElementById("validationlastname").value = "";
  }

  if (c === "") {
    alert("Du måste ange en E-mail!");
  }
  if (d === "") {
    alert("Du måste ange en adress!");
  }
  if (e === "") {
    alert("Du måste ange en ort!");
  }
  if (!isNaN(e)) {
    alert("Du får inte ange siffror i ortfältet!");
    document.getElementById("validationcity").value = "";
  }
  if (f === "") {
    alert("Du måste ange en postkod!");
  }
  if (isNaN(f)) {
    alert("Ange endast siffror i postkodfältet!");
    document.getElementById("validationzipcode").value = "";
  }
}

// On submit, resets the cart to zero
form.addEventListener("submit", function () {
  localStorage.setItem("itemsInCart", 0);
  localStorage.setItem("productsInCart", null);
});

// Increases the total price when adding a product
function increaseTotalPrice(e) {
  let thisProductPrice = 0;
  let button = e.target;
  let item = button.parentElement.parentElement;
  thisProductPrice = item
    .querySelector(".card-body #cardprice")
    .textContent.replace("Price: ", "")
    .replace("$", "");
  thisProductPrice = parseFloat(thisProductPrice);
  totalPrice = parseFloat(totalPrice);
  let newTotalPrice = totalPrice + thisProductPrice;
  totalPrice = newTotalPrice.toFixed(2);
  let priceOut = `Totalt pris: ${totalPrice} $`;
  document.querySelector(".card-footer #totalprice").textContent = priceOut;
}

// Reduces total price when removing a product
function reduceTotalPrice(e) {
  let quantity = JSON.parse(localStorage.getItem("itemsInCart"));
  quantity = parseInt(quantity);
  let thisProductPrice = 0;
  let button = e.target;
  let item = button.parentElement.parentElement;
  thisProductPrice = item
    .querySelector(".card-body #cardprice")
    .textContent.replace("Price: ", "")
    .replace("$", "");
  let newTotalPrice = totalPrice - thisProductPrice;
  totalPrice = newTotalPrice.toFixed(2);

  if (quantity <= 0) {
    totalPrice = 0;
  }
  let priceOut = `Totalt pris: ${totalPrice} $`;
  document.querySelector(".card-footer #totalprice").textContent = priceOut;
}

// Lowers the quantity when removing a product
function removeProduct(e) {
  // Removes 1 from the navbar cart icon
  let itemNumbers = localStorage.getItem("itemsInCart");
  itemNumbers = parseInt(itemNumbers);
  localStorage.setItem("itemsInCart", itemNumbers - 1);
  document.querySelector(".container #itemsincart").textContent =
    itemNumbers - 1;

  // Removes 1 from the card that shows the product
  let button = e.target;
  let item = button.parentElement.parentElement;
  let thisTitle = item.querySelector(".card-body #cardtitle").textContent;
  let currentQuantity = item
    .querySelector(".card-footer #quantitybtn")
    .textContent.replace("Antal: ", "");
  let newQuantity = currentQuantity - 1;
  if (newQuantity === 0) {
    item.remove();
  }
  item.querySelector(
    ".card-footer #quantitybtn"
  ).textContent = `Antal: ${newQuantity}`;

  // Removes from LocalStorage
  let productFromLS = JSON.parse(localStorage.getItem("productsInCart"));
  productFromLS[thisTitle].inCart = newQuantity;
  if (productFromLS[thisTitle].inCart === 0) {
    delete productFromLS[thisTitle];
  }
  localStorage.setItem("productsInCart", JSON.stringify(productFromLS));
}

// If the cart gets empty, injects text into the output element
// and disable the submit button
function checkIfCratIsEmpty() {
  let quantity = JSON.parse(localStorage.getItem("itemsInCart"));
  quantity = parseInt(quantity);
  if (quantity === 0) {
    let output = ` <h1 class="header">Din varukorg är tom! Iväg och handla med dig!</h1>`;
    document.getElementById("output").innerHTML = output;
    const button = document.getElementById("submitbtn");
    button.disabled = true;
  }
}

// Add quantity when adding a product
function addProduct(e) {
  // Add to the navbar cart icon and LS
  let itemNumbers = localStorage.getItem("itemsInCart");
  itemNumbers = parseInt(itemNumbers);
  localStorage.setItem("itemsInCart", itemNumbers + 1);
  document.querySelector(".container #itemsincart").textContent =
    itemNumbers + 1;

  // Add 1 to the card that shows the product
  let button = e.target;
  let item = button.parentElement.parentElement;
  let thisTitle = item.querySelector(".card-body #cardtitle").textContent;
  let currentQuantity = item
    .querySelector(".card-footer #quantitybtn")
    .textContent.replace("Antal: ", "");
  currentQuantity = parseInt(currentQuantity);
  let newQuantity = currentQuantity + 1;

  item.querySelector(
    ".card-footer #quantitybtn"
  ).textContent = `Antal: ${newQuantity}`;

  // Add to LocalStorage
  let productFromLS = JSON.parse(localStorage.getItem("productsInCart"));
  productFromLS[thisTitle].inCart = newQuantity;
  localStorage.setItem("productsInCart", JSON.stringify(productFromLS));
}
