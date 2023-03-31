// ELEMENTS
const main = document.querySelector('.game-wrapper');
const playBtn = document.querySelector('#play');
const levelSelect = document.querySelector('#level');

// DATA
const gridLevels = [100, 81, 49];
const NUM_BOMBS = 16;
let bombs = [];
let points = 0;


// PLAY
playBtn.addEventListener('click', play);


function play(){
  console.log('PLAY');
  
  reset();

  // prendo il livello
  const cellNumbers = gridLevels[levelSelect.value];

  //genero la griglia
  generatePlayGround(cellNumbers);

  // genero le bombe
  bombs = generateBombs(cellNumbers);

  console.log(bombs);
}

function generateBombs(cellNumbers){
  /*
    - creo un array dentro in quale sarvare tutte le bombe
    - estraggo un numero random da 1 a cellNumbers
    - se non prosente nell'array lo pusho
    - ne estraggo in base a NUM_BOMBS
    - restituisco l'array
  */

    const bombs = [];

    // faccio il ciclo fino al raggiungimento del numero di bombe necessario
    while(bombs.length < NUM_BOMBS){
      const bomb = getRandomNumber(1, cellNumbers);
      // pusho la bomba solo se non presente
      if(!bombs.includes(bomb)) bombs.push(bomb);
    }

    return bombs;
}


function generatePlayGround(cellNumbers){
  /*
    - creo l'elemento griglia
    - creo tutte le celle e le aggiungo alla griglia
    - aggiungo la griglia al game-wrapper
  */

    const grid = document.createElement('div');
    grid.className = 'grid';
    
    for (let i = 1; i <= cellNumbers; i++) {
      const cell = createCell(cellNumbers, i);
      grid.append(cell);
    }

    main.append(grid);

}

// ricevo il numero totale di celle e id che deriva dal ciclo for
function createCell(cellNumbers, id){
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.classList.add('square' + cellNumbers);
  cell._cellId = id;
  // cell.innerHTML = `<span>${id}</span>`;
  cell.addEventListener('click', hadleClickCell)
  return cell;
}

// al click della cella
function hadleClickCell(){

  /*
    verifico se è una bomba 
    SI -> FINE GIOCO
    NO -> aggiungo la classe colore alla cella
          punteggio + 1
          verifico se il punteggio ha raggiunto il limite -> FINE GIOCO
  */
  
  // se la bomba è inclusa -> fine gioco
  if(bombs.includes(this._cellId)){
    endGame(false);
  }else{

    // ottengo il numero di bombe limitrofe
    const numBombs = getNearlyBombs(this._cellId);

    this.innerHTML = `<span>${numBombs}</span>`;
    points++;
    // rimuovo la possibilità di cliccare ancora per incrementare
    this.removeEventListener('click',hadleClickCell);

    // prendo l'elenco di tutte le celle per sapere quante sono
    const cells = document.getElementsByClassName('cell');
    if(points === cells.length - NUM_BOMBS){
      endGame(true);
    }
  }
  this.classList.add('clicked');
}

// prendo il numero di bombe limitrofe
function getNearlyBombs(idCell){
  const nearlyCell = getNearlyCells(idCell);
  let numBombs = 0;
  
  // ciclo gli id limitrofi per verificare se sono presenti nell'array delle bombe
  for (let i = 0; i < nearlyCell.length; i++) {
    if(bombs.includes(nearlyCell[i])) numBombs++;
  }
  return numBombs;
}

// prendo gli id delle celle limitrofe
function getNearlyCells(idCell){
  const cellPerRow = Math.sqrt(document.getElementsByClassName('cell').length)
  let nearlyCell = [];

  if(idCell % cellPerRow === 1){
    // prima colonna
    nearlyCell = [
      idCell + 1,
      idCell - cellPerRow,
      idCell - cellPerRow + 1,
      idCell + cellPerRow,
      idCell + cellPerRow + 1,
    ]
  } else if(idCell % cellPerRow === 0){
    // ultima colonna
    nearlyCell = [
      idCell - 1,
      idCell - cellPerRow,
      idCell - cellPerRow - 1,
      idCell + cellPerRow,
      idCell + cellPerRow - 1,
    ]
  }else{
    nearlyCell = [
      idCell + 1,
      idCell - 1,
      idCell - cellPerRow,
      idCell - cellPerRow - 1,
      idCell - cellPerRow + 1,
      idCell + cellPerRow,
      idCell + cellPerRow - 1,
      idCell + cellPerRow + 1,
    ]
  }

  return nearlyCell;

}

function endGame(isWin){

  /*
    - accendere tutte le bombe
    - congelo la griglia e la opacizzo
    - stampare il messaggio col punteggio (diverso se vinci o perdi)
  */
  showBombs();
  // creo l'elemento che si posiziona in absolute sulla griglia congelandola
  const endGame = document.createElement('div');
  endGame.className = 'end-game';
  main.append(endGame);
  console.log('FINE');

  const cells = document.getElementsByClassName('cell');
  let endMessageStr = '';
  // messaggio differenziato se vinci o perdi
  if(isWin){
    endMessageStr = `HAI VINTO!! Ha fatto ${points} punti su ${cells.length - NUM_BOMBS}`;
  }else{
    endMessageStr = `HAI PERSO! Ha fatto SOLO ${points} punti su ${cells.length - NUM_BOMBS}`;
  }
  document.querySelector('.endMessage').innerHTML = endMessageStr;
}

function showBombs(){
  // prendo tutte le celle
  const cells = document.getElementsByClassName('cell');
  // le ciclo
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    // se l'id della cella è inclusa nell'elenco delle bombe
    // aggiungo la classe bomb
    if(bombs.includes(cell._cellId)){
      console.log('sono una bomba',cell._cellId);
      cell.classList.add('bomb');
    }
  }

}

function reset(){
  console.log('RESET');
  main.innerHTML = '';
  points = 0;
  bombs = [];
  document.querySelector('.endMessage').innerHTML = '';
}

/**
 * Questa funzione genera un numero random fra due valori
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns random number generated
 */
function getRandomNumber(min, max){
  let error = false;
  let errorMsg;
  // controllo che sia min che max siano numeri
  if(isNaN(min) || isNaN(max)){
    error = true;
    errorMsg = 'min e max devono essere numeri';
  }
  // controsslo che min sia inferiore a max
  if(min >= max){
    error = true;
    errorMsg = 'min deve essere inferiore a max';
  }
  if(error){
    console.error(errorMsg);
    // col return blocco la funzione
    return;
  }
  
  return Math.floor(Math.random() * (max - min + 1 ) + min)
}