window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

const navigation = document.querySelector("nav");
const menuIcon = document.querySelector(".toggle");
const menuBtn = document.querySelector(".menu-btn");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  menuIcon.classList.toggle("active");
  navigation.classList.toggle("active");
});

const closeMenu = () => {
  navigation.classList.remove("active");
  menuIcon.classList.remove("active");
  menuBtn.classList.toggle("open");
};

const blurMain = document.getElementById("main");
const blurHeader = document.querySelector("header");
const blurFooter = document.getElementById("footer");
const modalHeading = document.getElementById("pop-up-heading");
const modalMessage = document.getElementById("pop-up-message");
const toggleEmailModal = () => {
  blurMain.classList.toggle("active");
  blurFooter.classList.toggle("active");
  blurHeader.classList.toggle("active");
  let popup = document.getElementById("pop-up");
  popup.classList.toggle("active");
};

let updateCartTotal = () => {
  let cartItemContainer = document.getElementsByClassName("cart-items")[0];
  let cartRows = cartItemContainer.getElementsByClassName("cart-row");
  let total = 0;
  for (let i = 0; i < cartRows.length; i++) {
    let cartRow = cartRows[i];
    let priceElement = cartRow.getElementsByClassName("cart-price")[0];
    let quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    let price = parseFloat(priceElement.innerHTML.replace("$", ""));
    let quantity = quantityElement.value;
    total += price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementById("cart-total-price").innerText = "$" + total;
};

let removeCartItem = (event) => {
  let buttonClicked = event.target;
  console.log(buttonClicked.parentElement.parentElement);
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
};

let quantityChanged = (event) => {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
};

let addItemToCart = (title, price, imageSrc) => {
  let cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  let cartItems = document.getElementsByClassName("cart-items")[0];
  let cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      toggleEmailModal();
      modalHeading.innerText = "Oops!";
      modalMessage.innerText = "This item is already added to the cart.";
      return;
    }
  }

  let cartRowContents = `
    <div class="cart-item cart-col">
        <img class="cart-item-image" src="${imageSrc}" alt="" width="75px">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-col">${price}</span>
    <div class="cart-quantity cart-col">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger remove-btn" type="button">REMOVE</button>
        <btn class="fas fa-times btn btn-danger"></i>
    </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("btn-danger")[1]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
};

let addToCartClicked = (event) => {
  let button = event.target;
  let shopItem = button.parentElement.parentElement.parentElement;
  let title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  let price = button.parentElement.parentElement.getElementsByClassName(
    "shop-item-price"
  )[0].innerText;
  let imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
};

let purchaseClicked = () => {
  updateCartTotal();
  totalPrice = document.getElementById("cart-total-price").innerText;
  if (totalPrice === "$0") {
    toggleEmailModal();
    modalHeading.innerText = "Oops!";
    modalMessage.innerText = "It looks like you forgot to add your items.";
  } else {
    toggleEmailModal();
    modalHeading.innerText = "Thank you for your support.";
    modalMessage.innerText = `Your subtotal is: ${totalPrice}. You will redirect to the purchase page.`;
    // const redirect = () => {
    //   window.location = `./purchase.html#${totalPrice}`;
    // };
    setTimeout(function wait() {
      window.location = `./purchase.html#${totalPrice}`;
    }, 2000);

    // alert(
    //   `Thank you for your support. Your total price is: ${totalPrice}. You will redirect to the purchase page.`
    // );
    let cartItems = document.getElementsByClassName("cart-items")[0];
    while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
  }
};

let ready = () => {
  let removeCartItemButtons = document.getElementsByClassName("btn-danger");
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  let quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  let addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (let i = 0; i < addToCartButtons.length; i++) {
    let button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  document
    .getElementsByClassName("btn-purchase")[0]
    .addEventListener("click", purchaseClicked);
};

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
