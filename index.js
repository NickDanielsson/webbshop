let myProduct = {
  productTitle: "",
  productPrice: "",
  imgUrl: "",
  inCart: 0,
};

let data = JSON.parse(localStorage.getItem("products"));

if (!data) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://webacademy.se/fakestore/");
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      localStorage.setItem("products", JSON.stringify(data));
      setItemsInCart();
      render(data);
    }
  };
} else {
  setItemsInCart();
  render(data);
}

function render(product) {
  let output = "";

  for (let i = 0; i < 8; i++) {
    const productItem = product[i];
    output += `<div class="col-lg-3 col-md-3 mb-3" id="cardholder">
          <div class="card h-100" id="card">
            <img
              class="card-img-top"
              id="cardimg"
              src="${productItem.image}"
              alt="Card image cap"
            />

            <div class="card-body" id="cardbody">
              <h4 class="card-title" id="cardtitle">${productItem.title}</h4>
              <h5 id="cardprice">Price: ${product[i].price}&#x24;</h5>
              <hr>
              <p class="card-text" id="cardinfo">
                ${product[i].description}
              </p>
            </div>
            <div class="card-footer text-center" id="cardfooter">
              <button class="btn btn-dark" id="btn">Köp/Lägg till</button>
            </div>
          </div>
        </div>`;
  }

  document.getElementById("output").innerHTML = output;
}

// Sets the correct numbers of items in the cart when the starting page loads
function setItemsInCart() {
  let itemNumbers = localStorage.getItem("itemsInCart");
  document.querySelector(".container #itemsincart").textContent = itemNumbers;
}

// EventListener to buttons
document.addEventListener("click", function (e) {
  if (e.target.id === "btn") {
    updateItemsInCart();
    createProductObject(e);
  }
});

// Updates the number of items in the cart when a product is added
function updateItemsInCart() {
  let itemNumbers = localStorage.getItem("itemsInCart");
  itemNumbers = parseInt(itemNumbers);

  if (itemNumbers) {
    localStorage.setItem("itemsInCart", itemNumbers + 1);
    document.querySelector(".container #itemsincart").textContent =
      itemNumbers + 1;
  } else {
    localStorage.setItem("itemsInCart", 1);
    document.querySelector(".container #itemsincart").textContent = 1;
  }
}

// Create an object of the clicked product.
function createProductObject(e) {
  let button = e.target;
  let item = button.parentElement.parentElement;
  let title = item.querySelector(".card-body h4").textContent;
  let imgurl = item.querySelector(".card-img-top").src;
  let price = item
    .querySelector(".card-body h5")
    .textContent.replace("Price", "")
    .replace("$", "")
    .replace(" ", "")
    .replace(":", "");
  price = parseFloat(price);
  myProduct.productPrice = price;
  myProduct.productTitle = title;
  myProduct.imgUrl = imgurl;
  sendProdcutToLocalStorage(myProduct);
}

// Save the product to localStorage.
function sendProdcutToLocalStorage(myProduct) {
  let cartItem = localStorage.getItem("productsInCart");
  cartItem = JSON.parse(cartItem);
 
  if (cartItem != null) {
    if (cartItem[myProduct.productTitle] == undefined) {
      myProduct.inCart = 0;
      cartItem = {
        ...cartItem,
        [myProduct.productTitle]: myProduct,
      };
    }
    cartItem[myProduct.productTitle].inCart += 1;
  } else {
    myProduct.inCart = 1;
    cartItem = {
      [myProduct.productTitle]: myProduct,
    };
  }
  localStorage.setItem("productsInCart", JSON.stringify(cartItem));
}
