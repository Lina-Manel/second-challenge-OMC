document.addEventListener("DOMContentLoaded", function () {
  // Vérifie sur quelle page on est et définit la catégorie
  if (window.location.pathname.includes("omc")) {
      startGame("omc");
  } else if (window.location.pathname.includes("bkri")) {
      startGame("bkri");
  } else if (window.location.pathname.includes("hamas")) {
      startGame("hamas");
  }

  // Sécuriser l'ajout des écouteurs pour éviter les erreurs
  const btnOmc = document.querySelector(".omc");
  const btnBkri = document.querySelector(".bkri");
  const btnHamas = document.querySelector(".hamas");
  const btnReset = document.querySelector("#reset");
  const btnretun = document.querySelector("#returne");
  const deleteBtn = document.querySelector("#delete");

  if (btnOmc) btnOmc.addEventListener("click", () => location.href = "omc.html");
  if (btnBkri) btnBkri.addEventListener("click", () => location.href = "bkri.html");
  if (btnHamas) btnHamas.addEventListener("click", () => location.href = "hamas.html");
  if (btnReset) btnReset.addEventListener("click", startNewRound);
  document.querySelector("#returne").addEventListener("click", () => {
    displayFinalMessage(); // Affiche la plaque

    setTimeout(() => {
        window.location.href = "index.html"; // Redirection après un délai
    }, 3000); // 3000 ms = 3 secondes
 });
 
});

const quotesByCategory = {
  omc: [
      { question: "Ce qui ne se ...... pas se perd !", answer: "partage" },
      { question: "Faouzi, next .... please !", answer: "slide" },
      { question: ".... ro7k !", answer: "zyr" },
      { question: "fi ...", answer: "lhakika" },
      { question: ".... chabiba", answer: "rigl" },
      { question: "Coucou les ....", answer: "loulou" },
      { question: "Matnsawch tdoukhlou team .... the best", answer: "marketing" },
      { question: "....", answer: "SOON" }

  ],
  bkri: [
      { question: " العود لي تحقرو ....", answer: "يعميك" },
      { question: "لي يحب ... ينوض بكري", answer: "العكري" },
      { question: "لي يبات مع ... ينوض يقاقي", answer: "الجاج" },
      { question: "لي ما يعرفكش يا ... بلادي يقول عليك بانان", answer: "خروب" },
  ],
  hamas: [
      { question: "L'union fait la ...... !", answer: "force" },
      { question: "Il ne faut pas vendre la peau de l'ours avant de l'avoir ...... !", answer: "tué" },
      { question: "Un tiens vaut mieux que deux tu ...... !", answer: "l'auras" }
  ]
};

let usedQuotes = [];
let currentQuote;
let currentAnswer = "";
let currentCategory = "omc";

function startGame(category) {
  currentCategory = category;
  usedQuotes = [];
  availableQuotes = [...quotesByCategory[category]];
  startNewRound();
}

function getRandomQuote() {
  const quotes = quotesByCategory[currentCategory];

  // Vérifier si toutes les citations ont été utilisées
  if (usedQuotes.length === quotes.length) {
      displayFinalMessage(); // Afficher le message de fin
      return null; // Plus de citations disponibles
  }

  let newQuote;
  do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
  } while (usedQuotes.includes(newQuote));

  usedQuotes.push(newQuote);
  return newQuote;
}

function startNewRound() {
  currentQuote = getRandomQuote();

  if (!currentQuote) {
      displayFinalMessage();
      return; // Arrête le jeu si plus de citations
  }

  currentAnswer = "";
  const questionText = document.querySelector("#question-text");
  const answerSlots = document.querySelector(".answer-slots");
  const message = document.querySelector("#message");

  if (!questionText || !answerSlots || !message) return;

  questionText.innerHTML = currentQuote.question;
  answerSlots.innerHTML = "";
  message.innerText = "";

  generateSlots(currentQuote.answer);
  generateLetters(currentQuote.answer);
}

function generateSlots(answer) {
  const slotsContainer = document.querySelector(".answer-slots");
  if (!slotsContainer) return;

  for (let i = 0; i < answer.length; i++) {
      const slotElement = document.createElement("div");
      slotElement.className = "slot";
      slotElement.dataset.slotIndex = i;
      slotsContainer.appendChild(slotElement);
  }
}

function generateLetters(answer) {
  const lettersContainer = document.querySelector("#letters-grid");
  if (!lettersContainer) return;

  const answerLetters = answer.split(""); // Pas besoin de .toUpperCase() pour l'arabe
  const randomLetters = [];
  const rest = 12 - answer.length;

  if (currentCategory === "hamas" || currentCategory === "bkri") {
    // Générer des lettres arabes aléatoires
    for (let i = 0; i < rest; i++) {
        randomLetters.push(getRandomArabicLetter());
    }
  } else {
    // Générer des lettres aléatoires en anglais
    for (let i = 0; i < rest; i++) {
        randomLetters.push(getRandomLetter().toLowerCase());
    }
  }

  const allLetters = [...answerLetters, ...randomLetters].sort(() => Math.random() - 0.5);
  lettersContainer.innerHTML = "";

  // Créer une grille de 4x3
  for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.className = "letter-row";
    lettersContainer.appendChild(row);
    
    for (let j = 0; j < 4; j++) {
      const letterIndex = i * 4 + j;
      const letter = allLetters[letterIndex];
      
      const letterBtn = document.createElement("button");
      letterBtn.className = "letter-btn";
      letterBtn.innerText = letter;

      letterBtn.addEventListener("click", function () {
          if (currentAnswer.length >= currentQuote.answer.length || letterBtn.classList.contains("used")) return;

          currentAnswer += letter;
          const slotIndex = currentAnswer.length - 1;
          const slot = document.querySelector(`[data-slot-index="${slotIndex}"].slot`);
          if (slot) slot.innerHTML = letter;

          letterBtn.classList.add("used");
          checkGameStatus();
      });

      row.appendChild(letterBtn);
    }
  }
}


function getRandomArabicLetter() {
  const arabicLetters = [
    "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", 
    "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
  ];
  return arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
}

document.addEventListener("DOMContentLoaded", function () {
  const deleteBtn = document.querySelector("#delete");

  if (deleteBtn) {
      deleteBtn.addEventListener("click", function () {
          if (currentAnswer.length > 0) {
              // Supprimer la dernière lettre ajoutée
              const lastIndex = currentAnswer.length - 1;
              currentAnswer = currentAnswer.slice(0, -1);

              // Vider le dernier slot
              const slot = document.querySelector(`[data-slot-index="${lastIndex}"].slot`);
              if (slot) slot.innerHTML = "";

              // Réactiver la lettre correspondante dans la grille
              const letterBtns = document.querySelectorAll(".letter-btn.used");
              if (letterBtns.length > 0) {
                  letterBtns[letterBtns.length - 1].classList.remove("used");
              }
          }
      });
  }
});


  win = 0; 
  lose = 0;
function checkGameStatus() {
  
  const message = document.querySelector("#message");
  if (!message) return;

  if (currentAnswer === currentQuote.answer) {
      message.innerText = "🎉 Correct! Bravo!";
      message.style.color = "green";
      setTimeout(startNewRound, 2000);
      win = win + 1;
  } else if (currentAnswer.length === currentQuote.answer.length) {
      message.innerText = "❌ Mauvaise réponse, réessaie!";
      message.style.color = "red";
      lose = lose + 1;
  }
}

function displayFinalMessage() {
  const resultMessage = document.querySelector("#result");
  if (!resultMessage) return;

  if (usedQuotes.length === quotesByCategory[currentCategory].length){
  const message = document.querySelector("#message");
    if (message) {
        message.innerText = "🎉 Félicitations ! Vous avez terminé toutes les citations !";
        message.style.color = "blue";
    }
  }

  if (win > 0 && lose > 0) {
      resultMessage.innerText = `👏 Bravo! Vous avez gagné ${win} fois et appris ${lose} nouvelles citations !`;
      resultMessage.style.color = "green";
  } else if (win > 0 && lose === 0) {
      resultMessage.innerText = `🏆 Félicitations ! Vous avez gagné toutes les parties (${win} victoires) !`;
      resultMessage.style.color = "gold";
  } else if (win === 0 && lose > 0) {
      resultMessage.innerText = `😢 Dommage, vous avez perdu ${lose} fois. Ne lâchez rien !`;
      resultMessage.style.color = "red";
  }
}


function getRandomLetter() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
