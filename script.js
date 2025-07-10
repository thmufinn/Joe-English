class FlashcardApp {
    constructor() {
        this.cards = [];
        this.cardContainer = document.getElementById('cardContainer');
        this.cardCountSelect = document.getElementById('cardCount');
        this.generateBtn = document.getElementById('generateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.flipAllBtn = document.getElementById('flipAllBtn');
        
        this.initializeEventListeners();
        this.generateCards(4); // 기본값으로 4개 카드 생성
    }
    
    initializeEventListeners() {
        this.generateBtn.addEventListener('click', () => {
            const count = parseInt(this.cardCountSelect.value);
            this.generateCards(count);
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetCards();
        });
        
        this.flipAllBtn.addEventListener('click', () => {
            this.flipAllCards();
        });
    }
    
    generateCards(count) {
        this.clearCards();
        
        for (let i = 0; i < count; i++) {
            const card = this.createCard(i + 1);
            this.cards.push(card);
            this.cardContainer.appendChild(card);
        }
    }
    
    createCard(index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        
        // 카드 앞면
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        // 카드 번호 텍스트 제거
        
        // 카드 뒷면
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        const textarea = document.createElement('textarea');
        textarea.className = 'card-input';
        textarea.placeholder = '여기에 텍스트를 입력하세요...';
        textarea.dataset.index = index;
        
        // 로컬 스토리지에서 저장된 텍스트 불러오기
        const savedText = localStorage.getItem(`flashcard_${index}`);
        if (savedText) {
            textarea.value = savedText;
        }
        
        // 텍스트 입력 시 자동 저장
        textarea.addEventListener('input', (e) => {
            localStorage.setItem(`flashcard_${index}`, e.target.value);
        });
        
        cardBack.appendChild(textarea);
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        // 카드 클릭 이벤트
        card.addEventListener('click', (e) => {
            // 텍스트 영역 클릭 시에는 카드 뒤집기 방지
            if (e.target.classList.contains('card-input') || e.target.closest('.card-input')) {
                return;
            }
            
            this.flipCard(card);
        });
        
        return card;
    }
    
    flipCard(card) {
        card.classList.toggle('flipped');
        
        // 뒤집힌 카드의 텍스트 영역에 포커스
        if (card.classList.contains('flipped')) {
            setTimeout(() => {
                const textarea = card.querySelector('.card-input');
                if (textarea) {
                    textarea.focus();
                }
            }, 300); // 애니메이션 완료 후 포커스
        }
    }
    
    flipAllCards() {
        this.cards.forEach(card => {
            card.classList.toggle('flipped');
        });
    }
    
    clearCards() {
        this.cardContainer.innerHTML = '';
        this.cards = [];
    }
    
    resetCards() {
        // 로컬 스토리지에서 모든 카드 데이터 삭제
        for (let i = 1; i <= 20; i++) {
            localStorage.removeItem(`flashcard_${i}`);
        }
        
        // 카드 재생성
        const count = parseInt(this.cardCountSelect.value);
        this.generateCards(count);
        
        // 사용자에게 알림
        this.showNotification('모든 카드가 초기화되었습니다!');
    }
    
    showNotification(message) {
        // 간단한 알림 표시
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #222222;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});

// 키보드 단축키 지원
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter로 카드 생성
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.click();
        }
    }
    
    // Escape로 초기화
    if (e.key === 'Escape') {
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.click();
        }
    }
}); 