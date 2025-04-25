const gameContainer = document.querySelector('.game');
    const message = document.querySelector('.message');
    const restartBtn = document.querySelector('.restart');
    const backMenuBtn = document.querySelector('.back-menu');
    const levels = document.querySelector('.levels');
    const mainMenu = document.querySelector('.main-menu');
    const counter = document.querySelector('.counter');
    const stepsLeftText = document.getElementById('stepsLeft');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');

    let safePath = [];
    let currentStep = 0;
    let selectedLevel = null;
    let gameOver = false;

    function showLevels() {
      mainMenu.style.display = 'none';
      levels.classList.remove('hidden');
    }

    function toggleGameSettings() {
      levels.classList.toggle('hidden');
    }

    function toggleMusic() {
      const music = document.getElementById("bgMusic");
      if (music.paused) {
        music.play();
      } else {
        music.pause();
      }
    }
    function showHelp() {
      alert(`INSTRUCTIONS:\n\n1. Choose a difficulty level after clicking 'Start Game'.\n2. Each level has a series of pairs of stones.\n3. Only one stone in each pair is safe.\n4. Click on the stone you believe is safe to move forward.\n5. If you choose the wrong stone, the game ends.\n6. Successfully reach the final step to win!\n\nGood luck!`);
    }

    function selectLevel(steps) {
      selectedLevel = steps;
      levels.classList.add('hidden');
      startGame();
    }

    function startGame() {
      if (!selectedLevel) return;
      gameContainer.classList.remove('hidden');
      counter.classList.remove('hidden');
      progressBar.classList.remove('hidden');
      safePath = Array.from({ length: selectedLevel }, () => Math.random() < 0.5 ? 'left' : 'right');
      updateProgress();
      renderFullPath();
    }

    function renderFullPath() {
      gameContainer.innerHTML = '';

      for (let i = 0; i < safePath.length; i++) {
        const stepDiv = document.createElement('div');
        stepDiv.classList.add('step');
        stepDiv.dataset.step = i;

        const leftStone = document.createElement('div');
        leftStone.classList.add('stone');
        leftStone.onclick = () => handleChoice('left', i, leftStone);

        const rightStone = document.createElement('div');
        rightStone.classList.add('stone');
        rightStone.onclick = () => handleChoice('right', i, rightStone);

        stepDiv.appendChild(leftStone);
        stepDiv.appendChild(rightStone);
        gameContainer.appendChild(stepDiv);
      }

      // Add player at step 0
      movePlayerToStep(0);
      scrollToCurrentStep();
    }

    function handleChoice(choice, stepIndex, clickedStone) {
      if (stepIndex !== currentStep || gameOver) return;

      const stepDiv = document.querySelector(`[data-step='${stepIndex}']`);

      if (choice === safePath[currentStep]) {
        currentStep++;
        updateProgress();
        movePlayerToStep(currentStep);

        if (currentStep >= safePath.length) {
          message.textContent = '🎉 You Win!';
          restartBtn.classList.remove('hidden');
          backMenuBtn.classList.remove('hidden');
        } else {
          scrollToCurrentStep();
        }
      } else {
        clickedStone.classList.add('break');
        message.textContent = '💥 You Fell! Game Over!';
        gameOver = true;
        restartBtn.classList.remove('hidden');
        backMenuBtn.classList.remove('hidden');
      }
    }

    function movePlayerToStep(stepIndex) {
      document.querySelectorAll('.player').forEach(el => el.remove());
      const targetStep = document.querySelector(`[data-step='${stepIndex - 1}']`);
      const currentStepDiv = document.querySelector(`[data-step='${stepIndex}']`);
      if (currentStepDiv) {
        const player = document.createElement('div');
        player.classList.add('player');
        currentStepDiv.appendChild(player);
      }
    }

    function scrollToCurrentStep() {
      const target = document.querySelector(`[data-step='${currentStep}']`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function updateProgress() {
      stepsLeftText.textContent = `${selectedLevel - currentStep}`;
      const percent = Math.floor((currentStep / selectedLevel) * 100);
      progress.style.width = `${percent}%`;
    }