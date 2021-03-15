const today = new Date().getTime();
const tomorrow = new Date(today);
const deliveryDate = tomorrow.setDate(tomorrow.getDate() + 3);

const countDown = () => {
  const today = new Date().getTime();
  let gap = deliveryDate - today;
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const d = Math.floor(gap / day);
  const h = Math.floor((gap % day) / hour);
  const m = Math.floor((gap % hour) / minute);
  const s = Math.floor((gap % minute) / second);

  document.getElementById("day").innerText = d;
  document.getElementById("hour").innerText = h;
  document.getElementById("minute").innerText = m;
  document.getElementById("second").innerText = s;
};

setInterval(() => {
  countDown();
}, 1000);
