import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component{

    renderSquare(i) {
        var winLine = this.props.winLine;
        if (winLine)
        {
            for (let j = 0; j < winLine.length; j++)
            {   
                if (i === winLine[j])
                {
                    winLine.splice(j, 1);
                    return <Square key={i} className="square win" value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
                }
                
            }
        }
       return <Square key={i} className="square" value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }
    
    render() { 
   
        var rows = [];
        var squares = [];
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                squares.push(this.renderSquare(i*5 + j));   
            }
            rows.push( 
                <div className="board-row" key={i}>
                    {squares.map((square, i) => square)}                      
                </div>
            );
            squares.splice(0, squares.length);
        }

        return (
          <div>
              {rows.map((object, i) => object)}
          </div>
        );
      }
}
  
class Game extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(25).fill(null),
            move: {
                row: null,
                col: null
            }
          }],
          xIsNext: true,
          stepNumber: 0,
          isAsc: true,
        };
      }

      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinLine(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
            move: {
                row: Math.floor((i / 5) + 1),
                col: (i % 5) + 1
            }
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext
        });
    }

    
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    sort(){
        this.setState({
            isAsc: !this.state.isAsc
        });
    }

    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winLine = calculateWinLine(current.squares);
        const isAsc = this.state.isAsc;
        

        const moves = history.map((step, move) => {
            let desc = 'Start a new game';

            if (move){
                move = (isAsc) ? move : history.length - move;
                const moveLocation = {
                    row: step.move.row,
                    col: step.move.col
                }
     
                desc = 'Go to move #' + move + " (" + moveLocation.col + ", " + moveLocation.row + ")";
            }

            if (this.state.stepNumber === move) 
                return (
                    <li key={move}>                      
                         <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>                 
                    </li>
                );
            return (
                <li key={move}>                      
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>                 
                </li>
            );
          });

        let status;
        if (winLine) {
          status = 'Winner: ' + current.squares[winLine[0]];
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return(
        <div className="game">
            <div className="game-board">
            <Board
                squares={current.squares}
                winLine = {winLine}
                onClick={(i) => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
               <div>{status}</div>
               <label className="switch">
                    <input type="checkbox" onClick={() => this.sort()}></input>
                    <span className="slider round"></span>
                </label>
               <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById('root'));

function createWinLines(){
    var lines = [];
    var k = 0;
    for (let i = 0; i < 5 * 2 + 2; i++)
    {
        let line = [];
        for (let j = 0; j < 5; j++)
        {
            if (i < 5){
                line[j] = j + i * 5;
            }else if (i >= 10){          
                if (k < 5)
                    line[j] = j * 5 + k++;
                else line[j] = (4 - j) * 5 + (k++ - 5);
            }else line[j] = j * 5 + (i - 5);     
        }
        lines.push(line);
    }
    return lines;
}

function calculateWinLine(squares) {
    var lines = createWinLines();
   
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d, e] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] &&
            squares[a] === squares[d] && squares[a] === squares[e]) 
      {
        return lines[i];
      }
    }
    return null;
  }