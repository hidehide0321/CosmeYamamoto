
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.endsWith('diagnosis.html')) {
        setupDiagnosisPage();
    } else if (path.endsWith('result.html')) {
        displayResults();
    }
});

// --- 診断データ ---
const questions = [
    {
        question: "最も気になる肌の悩みはどれですか？",
        answers: [
            { text: "乾燥やカサつき", points: 1 },
            { text: "たるみやほうれい線", points: 2 },
            { text: "くすみやシミ", points: 3 },
            { text: "ニキビや毛穴の開き", points: 4 }
        ]
    },
    {
        question: "普段、運動はどのくらいしますか？",
        answers: [
            { text: "ほとんどしない", points: 1 },
            { text: "週に1〜2回", points: 2 },
            { text: "週に3回以上", points: 3 }
        ]
    },
    {
        question: "平均的な睡眠時間はどのくらいですか？",
        answers: [
            { text: "6時間未満", points: 1 },
            { text: "6〜8時間", points: 2 },
            { text: "8時間以上", points: 3 }
        ]
    },
    {
        question: "食生活で意識していることはありますか？",
        answers: [
            { text: "特にない", points: 1 },
            { text: "野菜を多めに摂る", points: 2 },
            { text: "バランスの取れた食事", points: 3 }
        ]
    }
];

const estheMenus = {
    1: { // score 4-6
        title: "超音波エステ",
        image: "images/ultrasonic.jpg",
        description: "超音波の力で肌の深層部まで美容成分を届け、乾燥しがちなお肌に潤いとハリを与えます。リラックス効果も抜群です。"
    },
    2: { // score 7-9
        title: "ハイパーナイフ",
        image: "images/hyperknife.jpg",
        description: "高周波の力で脂肪を温め、流れを促進します。たるみが気になる部分にアプローチし、シャープなフェイスラインを目指します。"
    },
    3: { // score 10-12
        title: "水素吸引",
        image: "images/hydrogen.jpg",
        description: "体内の活性酸素にアプローチする水素を吸引。体の内側からコンディションを整え、くすみ知らずの透明感あふれる肌へ導きます。"
    }
};


// --- 診断ページのロジック ---
function setupDiagnosisPage() {
    const questionContainer = document.getElementById('question-container');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const progressBar = document.getElementById('progress-bar');

    let currentQuestionIndex = 0;
    let userAnswers = {};

    function showQuestion(index) {
        const questionData = questions[index];
        questionContainer.innerHTML = `
            <h3>Q${index + 1}. ${questionData.question}</h3>
            <div class="answers">
                ${questionData.answers.map((answer, i) => `
                    <div class="answer">
                        <input type="radio" id="answer${i}" name="question${index}" value="${answer.points}">
                        <label for="answer${i}">${answer.text}</label>
                    </div>
                `).join('')}
            </div>
        `;
        updateProgressBar();
        updateNavButtons();

        // 前回の回答を復元
        if (userAnswers[index]) {
            document.querySelector(`input[name="question${index}"][value="${userAnswers[index]}"]`).checked = true;
        }
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function updateNavButtons() {
        prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
        nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? '結果を見る' : '次へ';
    }

    nextBtn.addEventListener('click', () => {
        const selected = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
        if (!selected) {
            alert('回答を選択してください。');
            return;
        }
        userAnswers[currentQuestionIndex] = selected.value;

        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            // 最終問題なので結果を計算して結果ページへ
            calculateResult();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });
    
    function calculateResult() {
        let totalScore = 0;
        for(const qIndex in userAnswers) {
            totalScore += parseInt(userAnswers[qIndex]);
        }

        let resultKey = 1;
        if (totalScore >= 10) {
            resultKey = 3;
        } else if (totalScore >= 7) {
            resultKey = 2;
        }
        
        // 結果をlocalStorageに保存してリダイレクト
        localStorage.setItem('diagnosisResult', resultKey);
        window.location.href = 'result.html';
    }

    // 初期表示
    showQuestion(currentQuestionIndex);
}


// --- 結果ページのロジック ---
function displayResults() {
    const resultKey = localStorage.getItem('diagnosisResult');
    if (!resultKey) {
        window.location.href = 'index.html'; // 結果がない場合はトップへ
        return;
    }

    const resultData = estheMenus[resultKey];
    
    document.getElementById('result-title').textContent = resultData.title;
    document.getElementById('result-image').src = resultData.image;
    document.getElementById('result-image').alt = resultData.title;
    document.getElementById('result-description').textContent = resultData.description;
    
    // 不要になった結果を削除
    localStorage.removeItem('diagnosisResult');
}
