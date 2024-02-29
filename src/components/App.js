// App.js
import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch("http://localhost:4000/questions");
      const data = await response.json();
      setQuestions(data);
    }

    fetchQuestions();
  }, []);

  async function handleAddQuestion(formData) {
    const response = await fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: formData.prompt,
        answers: [formData.answer1, formData.answer2, formData.answer3, formData.answer4],
        correctIndex: parseInt(formData.correctIndex)
      })
    });
    const newQuestion = await response.json();
    setQuestions([...questions, newQuestion]);
    setPage("List");
  }

  async function handleDeleteQuestion(id) {
    await fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE"
    });
    setQuestions(questions.filter(question => question.id !== id));
  }

  async function handleUpdateCorrectIndex(id, correctIndex) {
    await fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        correctIndex: parseInt(correctIndex)
      })
    });
    const updatedQuestions = questions.map(question =>
      question.id === id ? { ...question, correctIndex: parseInt(correctIndex) } : question
    );
    setQuestions(updatedQuestions);
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? <QuestionForm onAddQuestion={handleAddQuestion} /> : <QuestionList questions={questions} onDeleteQuestion={handleDeleteQuestion} onUpdateCorrectIndex={handleUpdateCorrectIndex} />}
    </main>
  );
}

export default App;
