const initialPrice = window.location.hash.substring(1);
// const initialPrice = window.location.href.split("#").pop();
console.log(initialPrice);

const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");

const calculateTotal = () => {
  const subtotal = parseFloat(initialPrice.replace("$", ""));
  let tax = (subtotal * 0.1).toFixed(2);
  taxElement.innerText = `$${tax}`;
  tax = parseFloat(tax);
  const total = (subtotal + tax).toFixed(2);

  subtotalElement.innerText = initialPrice;
  totalElement.innerText = `$${total}`;
};

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", calculateTotal);
} else {
  calculateTotal();
}
