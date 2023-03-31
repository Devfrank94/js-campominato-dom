

const btnGen = document.getElementById("btn");
const container = document.querySelector(".container");

btnGen.addEventListener("click", function(){
  container.classList.add("show");

  //Ciclo che generà la griglia con quadrati.

  for(let i = 0; i < 100; i++){
  const square =  createElement();
  container.append(square);

  //assegno la classe clicked a square e leggo id nel console log
  square.addEventListener("click", function(){
    square.classList.toggle("clicked");
    square.squareId = i + 1;
    console.log(this.squareId);
  
  });
  }


});



//funzione genera quadrati.

function createElement(){
  const square = document.createElement("div");
  square.className = "square";
  return square;
}
