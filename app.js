/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */


function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const root = ReactDOM.createRoot(document.getElementById('root'));

const wordList = ['apple', 'banana', 'cherry', 'date', 'fig', 'grape', 'kiwi', 'lemon', 'mango', 'orange'];

function App() {
  const [word, setWord] = React.useState(wordList[0]);
  const [scrambled, setScrambled] = React.useState(shuffle(word));
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [message, setMessage] = React.useState('');
  const [pass, setPass] = React.useState(3);
  const [playAgain, setPlayAgain] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(null);
  const [display, setDisplay] = React.useState(false);
  
  React.useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem('scrambleGame'));
    if (savedGame) {
      setWord(savedGame.word);
      setPoints(savedGame.points);
      setStrikes(savedGame.strikes);
      setMessage(savedGame.message);
      setPass(savedGame.pass);
      setPlayAgain(savedGame.playAgain);
      setScrambled(shuffle(savedGame.word));
    } else {
      gameRestart();
    }
  }, []);

  // Setting them in local storage
  React.useEffect(() => {
    localStorage.setItem('scrambleGame', JSON.stringify({
      word,
      points,
      strikes,
      message,
      pass,
      playAgain
    })); 
  }, [word, points, strikes, message, pass, playAgain]);

 

  function handlePass(){
    if(pass > 0){
      setPass(pass - 1);
      setWord(wordList[Math.floor(Math.random() * wordList.length)]);
      setScrambled(shuffle(word));
      setMessage('You Passed, Next Word.');
      setIsCorrect("pass");
      setDisplay(true);
      
    }
  }

  function handleGuess(event) {
    event.preventDefault();
    const guess = event.target.elements.guess.value.trim().toLowerCase();
    if (guess === word) {
      if (wordList.length === 0){
        setMessage('You Won');
      }else {
        setPoints(points + 1);
        const newWord = wordList[Math.floor(Math.random() * wordList.length)];
        setWord(newWord);
          if (wordList.includes(newWord)){
            const removeWord = newWord;
            const index = wordList.indexOf(removeWord);
            wordList.splice(index, 1);
            console.log(wordList);
          }
        setMessage('Correct, Next Word.');
        setScrambled(shuffle(newWord));
        setIsCorrect(true);
        setDisplay(true);
      }
    } else {
      setStrikes(strikes + 1);
      setMessage('Incorrect, Try Again.');
      setIsCorrect(false);
      setDisplay(true);
    }; 
    
    event.target.reset();
  }

 

  React.useEffect(() => {
    if (strikes >= 3) {
      setPlayAgain(true);
      setMessage(`You Lost`);
      setPoints(0);
      setStrikes(0);
      setPass(3);
      const newWord = wordList[Math.floor(Math.random() * wordList.length)];
      setWord(newWord);
      setScrambled(shuffle(newWord));
      setIsCorrect("false");
    }
  }, [strikes, points]);

  function gameRestart(){
    setPlayAgain(false);
    setPoints(0);
    setStrikes(0);
    setPass(3);
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWord(newWord);
    setScrambled(shuffle(newWord));
    setIsCorrect(true);
    setDisplay(false);
    localStorage.removeItem('scrambleGame');
  };




  
  return (
    <div className="game-container">
      <h1>Welcome to Scramble.</h1>
      <div className="second-column">
        <div>
          <p className="number">{points}</p>
          <p className="word">POINTS</p>
        </div>
        <div>
          <p className="number">{strikes}</p>
          <p className="word">STRIKES</p>
        </div>
      </div>
      <div 
      style={{
        display: display ? "block" : "none",
        textAlign: "center",
        marginTop: "20px",
        marginBottom: "20px",
        padding: "8px 90px",
        backgroundColor: isCorrect === null ? "transparent" : isCorrect === true ? "#d4edda" : isCorrect === "pass" ? "#a9e0fd" : "#ff9696",
        color: isCorrect === null ? "transparent" : isCorrect === true ? "#155724" : isCorrect === "pass" ? "#0c5460" : "#620000",
        border: isCorrect === null ? "transparent" : isCorrect === true ? "1px solid #c3e6cb" : isCorrect === "pass" ? "1px solid #bce8f1" : "1px solid #f5c6cb",
        borderRadius: "5px",
        width: "400px",
      }}><p>{message}</p></div>
      
      <h2>{scrambled}</h2>
      <form onSubmit={handleGuess}>
        <input name="guess" autoComplete="off" />
      </form>
      <button onClick={handlePass}>{pass} Passes Remaining</button>
      <div>
       {playAgain && <button  style={{
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        marginTop: "20px"
       }} onClick={gameRestart}>Play Again</button>}
      </div>
      
      
      
    </div>
  );


}

root.render(<App />);
