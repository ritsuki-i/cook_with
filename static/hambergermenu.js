const ham = document.getElementById('js-hamburger');
const a_tag = document.querySelector('.nav__items');
const nav = document.getElementById('js-nav');


ham.addEventListener('click', function () {

  ham.classList.toggle('active');
  nav.classList.toggle('active');


});

a_tag.addEventListener('click', function () {

  ham.classList.toggle('active');
  nav.classList.toggle('active');

});