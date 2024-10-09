// Add this function outside of the Dashboard component
const generateQuizQuestions = (milestoneName) => {
   const questionSets = {
      Basics: [
         {
            question: "What is Node.js?",
            options: [
               "A JavaScript runtime built on Chrome's V8 JavaScript engine",
               "A programming language",
               "A database management system",
               "A web browser",
            ],
            correctAnswer: "A JavaScript runtime built on Chrome's V8 JavaScript engine",
         },
         {
            question: "Which of the following is NOT a core module in Node.js?",
            options: ["http", "fs", "path", "mysql"],
            correctAnswer: "mysql",
         },
         {
            question: "What does the 'npm' stand for in Node.js?",
            options: ["Node Package Manager", "New Project Module", "Node Process Manager", "Node Program Monitor"],
            correctAnswer: "Node Package Manager",
         },
      ],
      "Advanced Concepts": [
         {
            question: "What is the purpose of the 'cluster' module in Node.js?",
            options: [
               "To create child processes",
               "To manage database connections",
               "To handle file operations",
               "To create worker threads",
            ],
            correctAnswer: "To create child processes",
         },
         {
            question: "Which of the following is true about the Node.js event loop?",
            options: [
               "It runs in a separate thread from the main application",
               "It uses multiple threads to handle I/O operations",
               "It runs in the same thread as the main application",
               "It only handles synchronous operations",
            ],
            correctAnswer: "It runs in the same thread as the main application",
         },
         {
            question: "What is the purpose of the 'Buffer' class in Node.js?",
            options: ["To handle binary data", "To create temporary files", "To manage memory allocation", "To compress large files"],
            correctAnswer: "To handle binary data",
         },
      ],
      "Project Implementation": [
         {
            question: "Which of the following is a popular web framework for Node.js?",
            options: ["Express", "Django", "Flask", "Ruby on Rails"],
            correctAnswer: "Express",
         },
         {
            question: "What is the purpose of middleware in Express.js?",
            options: [
               "To handle requests between the server and the routes",
               "To create database schemas",
               "To manage server-side rendering",
               "To handle client-side routing",
            ],
            correctAnswer: "To handle requests between the server and the routes",
         },
         {
            question: "Which module is commonly used for authentication in Node.js applications?",
            options: ["Passport", "Authenticate", "Bcrypt", "Crypto"],
            correctAnswer: "Passport",
         },
      ],
      "Testing and Deployment": [
         {
            question: "Which of the following is NOT a testing framework for Node.js?",
            options: ["Mocha", "Jest", "Jasmine", "Sinon"],
            correctAnswer: "Sinon",
         },
         {
            question: "What is the purpose of Docker in Node.js application deployment?",
            options: [
               "To containerize applications",
               "To manage database connections",
               "To handle load balancing",
               "To monitor application performance",
            ],
            correctAnswer: "To containerize applications",
         },
         {
            question: "Which cloud platform is NOT commonly used for deploying Node.js applications?",
            options: ["Heroku", "AWS", "Google Cloud Platform", "Oracle Cloud"],
            correctAnswer: "Oracle Cloud",
         },
      ],
   };

   return questionSets[milestoneName] || [];
};

export { generateQuizQuestions };
