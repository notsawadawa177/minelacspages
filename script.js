document.addEventListener('DOMContentLoaded', () => {

    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle-checkbox');

    // --------------- 1. Переключение темы ---------------
    const applyTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        if (theme === 'light') {
            themeToggle.checked = true;
        } else {
            themeToggle.checked = false;
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --------------- 2. Анимация логотипа при скролле ---------------
    const header = document.getElementById('main-header');
    const heroSection = document.getElementById('hero');

    const logoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.boundingClientRect.y < 0) {
                header.classList.add('logo-in-header', 'scrolled');
            } else {
                header.classList.remove('logo-in-header');
                if (window.scrollY < 50) {
                     header.classList.remove('scrolled');
                }
            }
        });
    }, { threshold: [1] });
    
    if (heroSection) {
       logoObserver.observe(heroSection);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50 && !header.classList.contains('logo-in-header')) {
            header.classList.add('scrolled');
        } else if (window.scrollY < 50 && !header.classList.contains('logo-in-header')) {
            header.classList.remove('scrolled');
        }
    });


    // --------------- 3. Анимации при скролле ---------------
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --------------- 4. Типизированная анимация текста ---------------
    const typingSpan = document.getElementById('typing-span');
    if(typingSpan) {
        const words = ["один!", "уникальный!", "крутой!"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingSpan.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingSpan.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                const typingSpeed = isDeleting ? 75 : 150;
                setTimeout(type, typingSpeed);
            }
        }
        type();
    }
    
    // --------------- 5. 3D эффект для карточек ---------------
    const interactiveCards = document.querySelectorAll('.feature-card, .dev-card, .link-block');
    
    interactiveCards.forEach(card => {
        const cardInner = card.querySelector('.feature-card-inner') || card.querySelector('.dev-card-inner') || card;
        
        if (cardInner) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const rotateX = -y / 25; 
                const rotateY = x / 25;
                
                cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                cardInner.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });
        }
    });

    // --------------- 6. Логика для FAQ-аккордеона ---------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --------------- 7. Мобильное меню ---------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
        mainNav.querySelectorAll('a').forEach(link => {
            if (!link.parentElement.classList.contains('dropdown')) {
                link.addEventListener('click', () => {
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                    }
                });
            }
        });
    }

    // --------------- 8. Логика пасхалки "Крестики-нолики" ---------------
    const footerLogo = document.querySelector('.footer-logo-img');
    const modal = document.getElementById('tic-tac-toe-modal');
    const closeBtn = document.querySelector('.modal-close');
    let clickCount = 0;
    let clickTimer = null;

    if (footerLogo && modal) {
        footerLogo.addEventListener('click', () => {
            clearTimeout(clickTimer);
            clickCount++;

            if (clickCount === 5) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.add('visible'), 10);
                handleResetGame();
                clickCount = 0;
            }

            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 2000);
        });
    }

    const statusDisplay = document.getElementById('game-status');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset-button');
    const boardElement = document.getElementById('game-board');

    const player = 'X';
    const bot = 'O';
    let gameActive = true;
    let boardState;

    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [6, 4, 2]
    ];

    function handleCellClick(e) {
        const clickedCellIndex = e.target.dataset.index;
        if (!gameActive || typeof boardState[clickedCellIndex] !== 'number') {
            return;
        }

        performTurn(clickedCellIndex, player);

        if (checkWin(boardState, player)) {
            gameOver(player);
            return;
        }
        if (checkTie()) {
            gameOver(null);
            return;
        }

        boardElement.classList.add('locked');
        statusDisplay.innerHTML = "Бот думает...";
        
        setTimeout(() => {
            const bestMoveIndex = findBestMove(boardState);
            performTurn(bestMoveIndex, bot);

            if (checkWin(boardState, bot)) {
                gameOver(bot);
            } else if (checkTie()) {
                gameOver(null);
            } else {
                statusDisplay.innerHTML = "Ваш ход";
                boardElement.classList.remove('locked');
            }
        }, 500);
    }

    function performTurn(index, currentPlayer) {
        boardState[index] = currentPlayer;
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
    }
    
    function checkWin(board, currentPlayer) {
        for (const combo of winCombos) {
            if (combo.every(index => board[index] === currentPlayer)) {
                return true;
            }
        }
        return false;
    }

    function checkTie() {
        return boardState.every(cell => typeof cell !== 'number');
    }

    function gameOver(winner) {
        gameActive = false;
        boardElement.classList.remove('locked');
        if (winner === null) {
            statusDisplay.innerHTML = "Ничья!";
        } else if (winner === player) {
            statusDisplay.innerHTML = "Вы победили! (Это невозможно)";
        } else {
            statusDisplay.innerHTML = "Бот победил!";
        }
    }
    
    function handleResetGame() {
        gameActive = true;
        boardState = Array.from(Array(9).keys());
        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('x', 'o');
        });
        statusDisplay.innerHTML = "Ваш ход (X)";
        boardElement.classList.remove('locked');
    }

    function findBestMove(board) {
        return minimax(board, bot).index;
    }

    function minimax(newBoard, currentPlayer) {
        const availSpots = newBoard.filter(s => typeof s === 'number');

        if (checkWin(newBoard, player)) {
            return { score: -10 };
        } else if (checkWin(newBoard, bot)) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = currentPlayer;

            if (currentPlayer === bot) {
                const result = minimax(newBoard, player);
                move.score = result.score;
            } else {
                const result = minimax(newBoard, bot);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;
            moves.push(move);
        }

        let bestMove;
        if (currentPlayer === bot) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
    
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', handleResetGame);
    
    const closeModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});