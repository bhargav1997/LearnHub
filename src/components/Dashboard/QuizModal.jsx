import PropTypes from "prop-types";
import { useState } from "react";
const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN; // Add this to your .env file

function QuizModal({ quiz, onClose, onQuizComplete, showNotification }) {
   const [answers, setAnswers] = useState({});
   const [showResults, setShowResults] = useState(false);

   // Add this function to your component
   const calculateScore = (userAnswers, questions) => {
     let score = 0;
     questions.forEach((question, index) => {
       if (userAnswers[index] === question.correctAnswer) {
         score += 1;
       }
     });
     return score;
   };

   const handleSubmit = () => {
      const score = calculateScore(answers, quiz.questions);
      setShowResults(true);
      onQuizComplete(quiz.taskId, quiz.taskName, score);
   };

   const handleContinue = () => {
      onClose();
   };

   const parseCourseSuggestions = (text) => {
      // Split the text into sentences
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      
      // Take up to 3 sentences as suggestions
      return sentences.slice(0, 3).map(sentence => sentence.trim());
   };

   const generateCourseSuggestions = async (taskName) => {
      try {
         const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${HF_API_TOKEN}`,
               },
               body: JSON.stringify({
                  inputs: `Suggest 3 alternative courses or topics to study instead of ${taskName}:`,
               }),
            }
         );

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const data = await response.json();

         if (!data.generated_text) {
            throw new Error("No suggestions generated");
         }

         // Parse the generated text into an array of course suggestions
         return parseCourseSuggestions(data.generated_text);
      } catch (error) {
         console.error("Error generating course suggestions:", error);
         showNotification("Failed to generate course suggestions. Please try again later.", "error");
         return [];
      }
   };

   const handleReject = async () => {
      try {
         const suggestions = await generateCourseSuggestions(quiz.taskName);
         if (suggestions.length > 0) {
            showNotification(`Based on your quiz results, we suggest the following courses: ${suggestions.join(", ")}`, "info");
         } else {
            showNotification("Unable to generate course suggestions at this time.", "warning");
         }
      } catch (error) {
         console.error("Error handling course rejection:", error);
         showNotification("An error occurred while generating course suggestions.", "error");
      }
      onClose();
   };

   return (
      <div className='quiz-modal'>
         {!showResults ? (
            <>
               <h2>Quiz for {quiz.taskName}</h2>
               {quiz.questions.map((question, index) => (
                  <div key={index}>
                     <p>{question.text}</p>
                     {question.options.map((option, optionIndex) => (
                        <label key={optionIndex}>
                           <input
                              type='radio'
                              name={`question-${index}`}
                              value={option}
                              onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                           />
                           {option}
                        </label>
                     ))}
                  </div>
               ))}
               <button onClick={handleSubmit}>Submit</button>
            </>
         ) : (
            <>
               <h2>Quiz Results</h2>
               <p>
                  Your score: {calculateScore(answers, quiz.questions)}/{quiz.questions.length}
               </p>
               <p>Do you want to continue with this course?</p>
               <button onClick={handleContinue}>Yes, continue</button>
               <button onClick={handleReject}>No, suggest alternatives</button>
            </>
         )}
      </div>
   );
}

QuizModal.propTypes = {
   quiz: PropTypes.object.isRequired,
   onClose: PropTypes.func.isRequired,
   onQuizComplete: PropTypes.func.isRequired,
   showNotification: PropTypes.func.isRequired,
};

export default QuizModal;
