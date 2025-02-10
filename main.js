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
  let gameStarted = false; // Tracks if the player has answered at least once

document.querySelector("#returne").addEventListener("click", () => {
    if (!gameStarted) {
        window.location.href = "index.html"; // Instantly return if the player hasn't started
    } else {
        displayFinalMessage(); // Show final message before returning

        setTimeout(() => {
            window.location.href = "index.html"; // Delayed return if they played
        }, 2000);
    }
});
 
});

const quotesByCategory = {
  omc: [
      { question: "Ce qui ne se ...... pas se perd !", answer: "partage" },
      { question: "Faouzi, next .... please !", answer: "slide" },
      { question: ".... ro7k !", answer: "zyr" },
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
    { question: "لي ماشي ليك ... " ,answer: "يعييك" },
    { question: "مول .... ويحتاج",  answer: "التاج" },
    { question: "...وحدة ماتصفق", answer: "يد" },
    { question: "من عندي ومن عندك ... وإلا غير من عندي تنقطع ", answer: "تنطبع" },
],
hamas: [
    { question: "قال القائد اسماعيل: لو خضعت كل الدنيا لن ... بإسرائيل", answer: "نعترف" },
    { question: "قال الشهيد اشرف نافع عندما اقتلعت عينه: رجعتلك ... يا هلس", answer: "قبطان" },
    { question: "قال الشهيد عبد الكريم الحاج: ...والله ولعت", answer: "ولعت" },
    { question: "قال القائد الشهيد يحيى السنوار: نحن قوم نعشق ... كما يعشق أعداؤنا الحياة", answer: "الموت" },
    { question: "قال القائد الشهيد محمد الضيف: العدو لا يفهم إلا لغة ...", answer: "القوة" },
    { question: "قال القائد الشهيد عبد الرحمن حن الشامي: إذا كانت ... هي دربنا إلى الشهادة فلن نتأخر في التضحية", answer: "القدس" },
    { question: "قال القائد الشهيد خالد مشعل: ... حق مشروع لشعبنا", answer: "المقاومة" },
    { question: "قال القائد الشهيد أحمد ياسين: نحن واليهود في صراع على هذا ...، فإما أن يأخذه اليهود منا، أو ننقذه من أيدي اليهود", answer: "الجيل" },
    
]
};

const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");
const finishSound = new Audio("final.mp3");


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
      return null; // khlassou les  citations
  }

  let newQuote;
  do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
  } while (usedQuotes.includes(newQuote));

  usedQuotes.push(newQuote);
  return newQuote;
}

function startNewRound() {
  // Si l'utilisateur n'a pas répondu et qu'il y avait une question en cours, on considère cette partie comme perdue
  if (currentAnswer.length === 0 && currentQuote) {
      lose++;
  }

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

  // Créer une grille de 5x3
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
 // Shuffle function to randomize an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

// Lists of messages
let correctMessages = [
  "🎉 Boom! Nailed it! You’re on fire! 🔥😎",
  "🌟 Genius mode activated! Keep it up! 🚀",
  "🎯 Bullseye! That was a perfect shot! 🎯",
  "🔥 You’re unstoppable! Are you even human?!",
  "💡 Smart move! You must have a big brain! 🧠",
  "✨ Correct! Your IQ just went up by 10 points! 📈",
  "🎶 Like a pro! You should be on a game show! 🎤",
  "💥 Boom! Another one bites the dust! 😆"
];

let wrongMessages = [
  "❌ Oops! That was a plot twist… but not the good kind! 😂",
  "😅 Oof! That one hurt! Try again!",
  "🙈 Oopsie daisy! That wasn’t it!",
  "🤔 Hmmm… maybe next time?",
  "🛑 Wrong turn! Try another path!",
  "🎭 That was unexpected… and not in a good way! 😆",
  "🚨 Alert! Your answer has been rejected by the universe! 😂",
  "🥴 That was close… but nope!"
];

// Shuffle the messages at the start
shuffleArray(correctMessages);
shuffleArray(wrongMessages);

// Index trackers
let correctIndex = 0;
let wrongIndex = 0;

function checkGameStatus() {
  const message = document.querySelector("#message");
  if (!message) return;

  gameStarted = true;
  if (currentAnswer === currentQuote.answer) {
      message.innerText = correctMessages[correctIndex];
      message.style.color = "green";
      correctIndex++;

      // Reset and shuffle if all messages are used
      if (correctIndex >= correctMessages.length) {
          correctIndex = 0;
          shuffleArray(correctMessages);
      }
      correctSound.play();
      setTimeout(startNewRound, 2500);
      win++;
  } else if (currentAnswer.length === currentQuote.answer.length) {
      message.innerText = wrongMessages[wrongIndex];
      message.style.color = "red";
      wrongIndex++;

      // Reset and shuffle if all messages are used
      if (wrongIndex >= wrongMessages.length) {
          wrongIndex = 0;
          shuffleArray(wrongMessages);
      }
      wrongSound.play();
      lose++;
      setTimeout(startNewRound, 2500);
  }
}



function displayFinalMessage() {
  const resultMessage = document.querySelector("#result");
  if (!resultMessage) return;

  gameStarted = true;
  if (usedQuotes.length === quotesByCategory[currentCategory].length){
  const message = document.querySelector("#message");
    if (message) {
        message.innerText = "🎉 Whoa! You’ve conquered all the quotes! Go flex on your friends! 💪😎";
        message.style.color = "blue";
        finishSound.play();
        setTimeout(() => {
          window.location.href = "index.html"; 
      }, 7000);
    }
  }

  if (win > 0 && lose > 0) {
      resultMessage.innerText = `👏 Well played! You won ${win} times and lost ${lose} times. A true warrior! ⚔️`;
      resultMessage.style.color = "green";
  } else if (win > 0 && lose === 0) {
      resultMessage.innerText = `🏆 Absolute legend! You crushed every round with ${win} wins! Are you even human? 🤖`;
      resultMessage.style.color = "gold";
  } else if (win === 0 && lose > 0) {
      resultMessage.innerText = `😢 Oof… ${lose} losses. But hey, even superheroes have bad days! Try again! 💪`;
      resultMessage.style.color = "red";
  }
}


function getRandomLetter() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

/*
document.addEventListener("DOMContentLoaded", function () {
  const hintBtn = document.querySelector("#hint");

  if (hintBtn) {
      hintBtn.addEventListener("click", giveHint);
  }
});

function giveHint() {
  if (!currentQuote || !currentQuote.answer) return;
  
  const answerArray = currentQuote.answer.split("");
  const slots = document.querySelectorAll(".answer-slots .slot");

  // Calculate the number of letters to reveal (30% rounded up)
  const numToReveal = Math.ceil(answerArray.length * 0.3);
  let revealedIndexes = new Set();

  while (revealedIndexes.size < numToReveal) {
      const randomIndex = Math.floor(Math.random() * answerArray.length);
      revealedIndexes.add(randomIndex);
  }

  revealedIndexes.forEach(index => {
      slots[index].innerText = answerArray[index];
      currentAnswer = currentAnswer.substring(0, index) + answerArray[index] + currentAnswer.substring(index + 1);
  });

  document.querySelector("#hint").disabled = true; // Disable the hint button after one use
}
*/

