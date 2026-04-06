import React, { useState } from "react";

const quizQuestions = [
  {
    question: "Qual foi o nosso primeiro encontro/sair para comer?",
    options: ["Outback", "Pecorino", "Laguetto", "Outro"],
    answer: 1,
  },
  {
    question: "Quem disse 'eu te amo' primeiro?",
    options: ["Yas", "João", "Ao mesmo tempo", "Não lembramos"],
    answer: 0,
  },
  {
    question: "Qual foi a nossa primeira viagem juntos?",
    options: ["Rio de Janeiro", "Santa Catarina", "Campos de Jordão", "Fortaleza"],
    answer: 2,
  },
];

const memoryImages = [
  // Use imagens reais depois
  { id: 3, src: "assets/amorzinho3.jpg" },
  { id: 1, src: "assets/amorzinho1.jpg" },
  { id: 5, src: "assets/amorzinho5.jpg" },
  { id: 6, src: "assets/amorzinho6.jpg" },
  { id: 2, src: "assets/amorzinho2.jpg" },
  { id: 4, src: "assets/amorzinho4.jpg" },
  { id: 1, src: "assets/amorzinho1.jpg" },
  { id: 4, src: "assets/amorzinho4.jpg" },
  { id: 5, src: "assets/amorzinho5.jpg" },
  { id: 2, src: "assets/amorzinho2.jpg" },
  { id: 6, src: "assets/amorzinho6.jpg" },
  { id: 3, src: "assets/amorzinho3.jpg" },
];

const romanticChallenges = [
  "Dê um abraço apertado agora!",
  "Escreva uma mensagem fofa para o outro.",
  "Conte uma lembrança engraçada do casal.",
  "Faça um elogio sincero.",
  "De um beijo surpresa no outro.",
  "Tire uma peça de roupa (de forma divertida e consensual) e mostre para o outro.",
];

export function RomanticGame() {
  const [step, setStep] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [memoryState, setMemoryState] = useState({
    open: [] as number[],
    matched: [] as number[],
  });
  const [challengeIndex, setChallengeIndex] = useState(0);

  // Quiz logic
  function handleQuizOption(idx: number) {
    setSelectedOption(idx);
    setTimeout(() => {
      if (idx === quizQuestions[quizIndex].answer) setQuizScore((s) => s + 1);
      if (quizIndex + 1 < quizQuestions.length) {
        setQuizIndex((i) => i + 1);
        setSelectedOption(null);
      } else {
        setShowQuizResult(true);
      }
    }, 700);
  }

  // Memory logic
  function handleMemoryClick(i: number) {
    if (
      memoryState.open.length === 2 ||
      memoryState.open.includes(i) ||
      memoryState.matched.includes(i)
    )
      return;
    const newOpen = [...memoryState.open, i];
    setMemoryState((s) => ({ ...s, open: newOpen }));
    if (newOpen.length === 2) {
      const [first, second] = newOpen;
      if (memoryImages[first].id === memoryImages[second].id) {
        setTimeout(() => {
          setMemoryState((s) => ({
            open: [],
            matched: [...s.matched, first, second],
          }));
        }, 800);
      } else {
        setTimeout(() => {
          setMemoryState((s) => ({ ...s, open: [] }));
        }, 800);
      }
    }
  }

  // Challenge logic
  function nextChallenge() {
    setChallengeIndex((i) => (i + 1) % romanticChallenges.length);
  }

  return (
    <div style={{ maxWidth: 500, margin: "32px auto", background: "#1a0010", borderRadius: 16, boxShadow: "0 2px 16px #7a0026cc", padding: 24, color: "#ffb3b3" }}>
      <h2 style={{ textAlign: "center", color: "#ff2d55" }}>Jogo Romântico do Casal</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setStep(0)} style={{ background: step===0?"#ff2d55":"#2d0b15", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", margin: 2 }}>Quiz</button>
        <button onClick={() => setStep(1)} style={{ background: step===1?"#ff2d55":"#2d0b15", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", margin: 2 }}>Memória</button>
        <button onClick={() => setStep(2)} style={{ background: step===2?"#ff2d55":"#2d0b15", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", margin: 2 }}>Desafios</button>
      </div>
      {step === 0 && (
        <div>
          {!showQuizResult ? (
            <>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>{quizQuestions[quizIndex].question}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {quizQuestions[quizIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizOption(idx)}
                    style={{
                      background: selectedOption === idx ? (idx === quizQuestions[quizIndex].answer ? "#1ed760" : "#ff2d55") : "#2d0b15",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 12px",
                      margin: 2,
                      cursor: "pointer",
                      opacity: selectedOption !== null && selectedOption !== idx ? 0.7 : 1,
                    }}
                    disabled={selectedOption !== null}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 16, fontSize: 14, color: "#ffb3b3" }}>
                Pergunta {quizIndex + 1} de {quizQuestions.length}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 12 }}>Você acertou {quizScore} de {quizQuestions.length}!</div>
              <button onClick={() => { setQuizIndex(0); setQuizScore(0); setShowQuizResult(false); }} style={{ background: "#ff2d55", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px" }}>Jogar novamente</button>
            </div>
          )}
        </div>
      )}
      {step === 1 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 103px)", gap: 16, justifyContent: "center" }}>
            {memoryImages.map((img, i) => (
              <div key={i} onClick={() => handleMemoryClick(i)} style={{ cursor: "pointer", background: "#2d0b15", borderRadius: 12, height: 103, width: 103, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px #7a0026cc", transition: 'box-shadow 0.2s', margin: 2 }}>
                {(memoryState.open.includes(i) || memoryState.matched.includes(i)) ? (
                  <img src={img.src} alt="memória" style={{ width: 95, height: 95, borderRadius: 10, objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 48, color: "#ff2d55" }}>?</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, textAlign: "center", fontSize: 18 }}>
            {memoryState.matched.length === memoryImages.length && <span>Parabéns! Você encontrou todos os pares! 🎉</span>}
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, marginBottom: 16 }}>{romanticChallenges[challengeIndex]}</div>
          <button onClick={nextChallenge} style={{ background: "#ff2d55", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px" }}>Próximo desafio</button>
        </div>
      )}
    </div>
  );
}
