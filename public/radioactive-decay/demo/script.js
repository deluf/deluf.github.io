/* ANIMATIONS */

AOS.init({
    offset: 150,
    duration: 1000
});



/* POPUP */

const pagenumber = 7
const openModalButton = document.querySelector('[data-modal-target]')
const closeModalButton = document.querySelector('[data-close-button]')
const overlay = document.querySelector('.overlay')

openModalButton.addEventListener('click', () => {
  const modal = document.querySelector(openModalButton.dataset.modalTarget)
  openModal(modal)
})

function openModal(modal){
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
  window.scrollTo(0, 0);
}

closeModalButton.addEventListener('click', () => {
  const modal = closeModalButton.closest('.modal')
  closemodal(modal)
})

function closemodal(modal){
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
  window.scrollTo(0, window.innerHeight * pagenumber);
}

overlay.addEventListener('click', () => {
  const modal = document.querySelector('.modal.active')
  closemodal(modal)
})


/* CARD ANIMATION */

const cards = document.getElementsByClassName("card");
const containers = document.getElementsByClassName("container-card");

container = containers[0]
card = cards[0]

container.addEventListener("mousemove", (e) => {

  var relativeX = e.pageX - card.offsetLeft;
  var relativeY = e.pageY - card.offsetTop;

  let xAxis = -(card.offsetHeight - relativeX)/40;
  let yAxis = (card.offsetWidth/2 - relativeY)/40;

  card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

container.addEventListener("mouseenter", (e) => {
  card.style.transition = "none";
});

container.addEventListener("mouseleave", (e) => {
  card.style.transition = "all 0.5s ease";
  card.style.transform = `rotateY(0deg) rotateX(0deg)`;
});


/* SHOW STEPS */

const btnmassimi = document.getElementById("btnmassimi");
const imgmassimi = document.getElementById("imgmassimi");
var btnmassimi_premuto = false

btnmassimi.addEventListener("click", (e) => {
  if (!btnmassimi_premuto){
    imgmassimi.src = "images/equations/steps dervsec.PNG";
    imgmassimi.style.width = "35%"
    btnmassimi.innerText = "Chiudi"
    btnmassimi_premuto = true
  }
  else {
    imgmassimi.src = "images/equations/massimi minimi.PNG";
    imgmassimi.style.width = "80%"
    btnmassimi.innerText = "Mostra procedimento"
    btnmassimi_premuto = false
  }

});

const btnflessi = document.getElementById("btnflessi");
const imgflessi = document.getElementById("imgflessi");
var btnflessi_premuto = false

btnflessi.addEventListener("click", (e) => {
  if (!btnflessi_premuto){
    imgflessi.src = "images/equations/steps dervprima.PNG";
    imgflessi.style.width = "50%"
    btnflessi.innerText = "Chiudi"
    btnflessi_premuto = true
  }
  else {
    imgflessi.src = "images/equations/flessi.PNG";
    imgflessi.style.width = "80%"
    btnflessi.innerText = "Mostra procedimento"
    btnflessi_premuto = false
  }
});

/* SLIDESHOW 0 */

const slider00 = document.getElementById("asintoti");
const slider01 = document.getElementById("massimi-minimi");
const slider02 = document.getElementById("flessi");
const radiobtn00 = document.getElementById("slide00");
const radiobtn01 = document.getElementById("slide01");
const radiobtn02 = document.getElementById("slide02");

radiobtn00.addEventListener("click", (e) => {
  slider02.style.position = "absolute"
  slider02.style.visibility = "collapse"
  slider01.style.position = "absolute"
  slider01.style.visibility = "collapse"

  slider00.style.position = "static"
  slider00.style.visibility = "visible"
});

radiobtn01.addEventListener("click", (e) => {
  slider00.style.position = "absolute"
  slider00.style.visibility = "collapse"
  slider02.style.position = "absolute"
  slider02.style.visibility = "collapse"

  slider01.style.position = "static"
  slider01.style.visibility = "visible"
});

radiobtn02.addEventListener("click", (e) => {
  slider01.style.position = "absolute"
  slider01.style.visibility = "collapse"
  slider00.style.position = "absolute"
  slider00.style.visibility = "collapse"
  
  slider02.style.position = "static"
  slider02.style.visibility = "visible"
});

/* SLIDESHOW 1 */

const slider = document.getElementById("slideshow");
const radiobtn1 = document.getElementById("slide1");
const radiobtn2 = document.getElementById("slide2");

radiobtn1.addEventListener("click", (e) => {
  slider.src = "images/zona di acme.png";
  slider.style.width = "90%"
});

radiobtn2.addEventListener("click", (e) => {
  slider.src = "images/zona di concomitanza.png";
  slider.style.width = "70%"
});

/* SLIDESHOW 2 */

const slider2 = document.getElementById("slideshow2");
const radiobtn3 = document.getElementById("slide3");
const radiobtn4 = document.getElementById("slide4");
const radiobtn5 = document.getElementById("slide5");

radiobtn3.addEventListener("click", (e) => {
  slider2.src = "images/gif deriva dei continenti.gif";
  slider2.style.width = "50%"
});

radiobtn4.addEventListener("click", (e) => {
  slider2.src = "images/struttura della terra.png";
  slider2.style.width = "90%"
});

radiobtn5.addEventListener("click", (e) => {
  slider2.src = "images/flussi di calore.png";
  slider2.style.width = "75%"
});

/* SLIDESHOW 3 */

const slider3 = document.getElementById("slideshow3");
const radiobtn6 = document.getElementById("slide6");
const radiobtn7 = document.getElementById("slide7");
const radiobtn8 = document.getElementById("slide8");
const radiobtn9 = document.getElementById("slide9");

radiobtn6.addEventListener("click", (e) => {
  slider3.src = "images/PROVE-CONTINENTE-CENTRALE.jpg";
  slider3.style.width = "70%"
});

radiobtn7.addEventListener("click", (e) => {
  slider3.src = "images/distanza fossile esempio edit.png";
  slider3.style.width = "90%"
});

radiobtn8.addEventListener("click", (e) => {
  slider3.src = "images/vettori spostamento giappone.PNG";
  slider3.style.width = "80%"
});

radiobtn9.addEventListener("click", (e) => {
  slider3.src = "images/japan plates.png";
  slider3.style.width = "75%"
});

/* SLIDESHOW 4 */

const slider4 = document.getElementById("slideshow4");
const radiobtn10 = document.getElementById("slide10");
const radiobtn19 = document.getElementById("slide19");
const radiobtn11 = document.getElementById("slide11");
const radiobtn12 = document.getElementById("slide12");

radiobtn10.addEventListener("click", (e) => {
  slider4.src = "images/INES_it.svg";
  slider4.style.width = "85%"
});

radiobtn19.addEventListener("click", (e) => {
  slider4.src = "images/centrale nucleare.jpg";
  slider4.style.width = "80%"
});

radiobtn11.addEventListener("click", (e) => {
  slider4.src = "images/share-deaths-air-pollution.png";
  slider4.style.width = "80%"
});

radiobtn12.addEventListener("click", (e) => {
  slider4.src = "images/citazione.PNG";
  slider4.style.width = "90%"
});

/* SLIDESHOW 5 */

const slider5 = document.getElementById("slideshow5");
const radiobtn13 = document.getElementById("slide13");
const radiobtn14 = document.getElementById("slide14");
const radiobtn15 = document.getElementById("slide15");
const radiobtn16 = document.getElementById("slide16");
const radiobtn17 = document.getElementById("slide17");
const radiobtn18 = document.getElementById("slide18");

radiobtn13.addEventListener("click", (e) => {
  slider5.src = "images/altezza onde fukushima.PNG";
  slider5.style.width = "85%"
});

radiobtn14.addEventListener("click", (e) => {
  slider5.src = "images/serbatoi fukushima.png";
  slider5.style.width = "85%"
});

radiobtn15.addEventListener("click", (e) => {
  slider5.src = "images/nube di espansione al tg 1.PNG";
  slider5.style.width = "70%"
});

radiobtn16.addEventListener("click", (e) => {
  slider5.src = "images/gru estraente plutonio.PNG";
  slider5.style.width = "60%"
});

radiobtn17.addEventListener("click", (e) => {
  slider5.src = "images/robot 1.PNG";
  slider5.style.width = "60%"
});

radiobtn18.addEventListener("click", (e) => {
  slider5.src = "images/robot 2.PNG";
  slider5.style.width = "60%"
});