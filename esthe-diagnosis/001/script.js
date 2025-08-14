const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const resultTextEl = document.getElementById('result-text');

const questions = [
    {
        question: '一番気になるお悩みはどれですか？',
        answers: [
            { text: 'シミ・そばかす', value: 'brightening' },
            { text: 'しわ・たるみ', value: 'anti-aging' },
            { text: 'ニキビ・毛穴', value: 'acne-care' },
            { text: '乾燥・くすみ', value: 'moisturizing' }
        ]
    },
    {
        question: 'どのような効果を最も期待しますか？',
        answers: [
            { text: 'リラックスしたい', value: 'relax' },
            { text: 'すぐに効果を実感したい', value: 'immediate' },
            { text: '肌質を根本から改善したい', value: 'fundamental' },
            { text: '特別な日のためのケアがしたい', value: 'special' }
        ]
    },
    {
        question: '生活環境を教えてください！',
        answers: [
            { text: '冷房や暖房の場所にいることが多い', value: 'environment_ac' },
            { text: '良く運動をする', value: 'lifestyle_exercise' },
            { text: '暴飲暴食が多い', value: 'lifestyle_overeating' },
            { text: 'カラダが疲れやすい', value: 'condition_fatigue' }
        ]
    }
];

let currentQuestionIndex = 0;
const userAnswers = [];

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionEl.innerText = currentQuestion.question;
    answersEl.innerHTML = '';

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.onclick = () => selectAnswer(answer.value);
        answersEl.appendChild(button);
    });
}

function selectAnswer(value) {
    userAnswers.push(value);
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    // 簡単なロジックで結果を決定
    let result = 'スタンダードコース';
    if (userAnswers.includes('anti-aging') || userAnswers.includes('special')) {
        result = 'プレミアムエイジングケアコース';
    } else if (userAnswers.includes('brightening')) {
        result = '透明感アップコース';
    } else if (userAnswers.includes('acne-care')) {
        result = '毛穴集中ケアコース';
    }

    resultTextEl.innerText = `あなたにおすすめのメニューは「${result}」です。お肌の悩みに合わせた集中ケアで、理想の肌を目指しましょう。`;

    const resultImageEl = document.getElementById('result-image');
    resultImageEl.src = 'images/sample1.png';
    resultImageEl.style.display = 'block';
}

showQuestion();
