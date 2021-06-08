burger = document.querySelector('.burger');
list = document.querySelector('.list');
logoitem = document.querySelector('.logoitem');
navbar = document.querySelector('.navbar');
loginlist = document.querySelector('.loginlist')

burger.addEventListener("click", myFunction);
function myFunction(){
    list.classList.toggle('v-class-resp');
    logoitem.classList.toggle('v-class-resp');
    loginlist.classList.toggle('v-class-resp');
    navbar.classList.toggle('h-nav-resp');
}