import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class SortableHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reversed: false
    }
    this.onHandleHistorySort = this.onHandleHistorySort.bind(this);
    this.onHandleHistoryJump = this.onHandleHistoryJump.bind(this);
  }

  onHandleHistorySort() {
    this.setState({
      reversed: !this.state.reversed
    });
  }

  onHandleHistoryJump(stepIndex) {
    this.props.onHandleHistoryJump(stepIndex);
  }

  render() {
    const sortLabel = 'Sort history ' + (this.state.reversed ? 'ascending' : 'descending');
    const moves = this.props.history.map((step, stepIndex) => {
      const desc = stepIndex ? `Back to move #${stepIndex}` : 'Back to game start';
      // Disable the button if it will jump to a future move
      // For example, you can't jump back from step 2 to step 1, and then back to step 2 
      const disabled = stepIndex > this.props.stepNumber;
      const className = stepIndex === this.props.stepNumber ? 'active' : '';

      return (
        <li key={stepIndex} className={className}>
          <button disabled={disabled} onClick={() => this.onHandleHistoryJump(stepIndex)}>
            {desc}
          </button>
          <em>({step.desc})</em>
        </li>
      );
    });

    if(this.state.reversed) {
      moves.reverse();
    }

    return (
      <React.Fragment>
        <ol reversed={this.state.reversed}>{moves}</ol>
        <button onClick={this.onHandleHistorySort}>
          {sortLabel}
        </button>
      </React.Fragment>
    );
  }
}

function Square(props) {
  const className = `square ${props.isWinningSquare ? 'winning' : ''}`;
  return (
    <button
      className={className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  render() {
    const winningSquares = this.props.winningSquares;
    let grid = [];
    
    this.props.rows.forEach((squares, i) => {
      let row = [];
      squares.forEach((square, j) => {
        // Mark the the current square if it is found in the winningSquares array
        const isWinningSquare = winningSquares && winningSquares.indexOf(square) >= 0 ? true : false;
        // Pass position in grid to onClick handler to provide feedback about a move
        const position = {
          row: i + 1,
          column: j + 1
        }

        row.push(
          <Square 
            key={square}
            value={this.props.squares[square]}
            isWinningSquare={isWinningSquare}
            onClick={() => {this.props.onClick(square, position)}}
          />
        );
      });
      grid.push(<div className='board-row' key={i}>{row}</div>);
    });

    return (
      <div>
        {grid}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        desc: 'Game started'
      }],
      stepNumber: 0,
      xIsNext: true
    }
    this.onHandleHistoryJump = this.onHandleHistoryJump.bind(this);
  }

  onHandleHistoryJump(stepIndex) {
    this.setState({
      stepNumber: stepIndex,
      xIsNext: (stepIndex % 2) === 0
    });
  }

  onHandleClick(i, position) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    // Ignore click if someone has won the game or if the square is already filled
    if(calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const desc = `${squares[i]} put in row ${position.row}, column ${position.column}`;
    
    this.setState({
      history: history.concat([{
        squares: squares,
        desc: desc
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const winningSquares = calculateWinner(current.squares).winningSquares;

    /* 
     * Determine whether the game ended as a draw by making sure that:
     * - all the squares are filled
     * - there is no winner (the win could take place in the last move)
     */
    const allSquaresFilled = current.squares.slice(0).filter(function(item) {
      return item !== null;
    }).length === 9;
    const endedAsDraw = allSquaresFilled && !winner;

    let status;
    if(winner) {
      status = `Winner: ${winner}`;
    } else if(endedAsDraw) {
      status = 'The game ended as a draw';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            rows={this.props.rows}
            squares={current.squares}
            winningSquares={winningSquares}
            onClick={(i, position) => this.onHandleClick(i, position)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <SortableHistory
            onHandleHistoryJump={(stepIndex) => this.onHandleHistoryJump(stepIndex)}
            stepNumber={this.state.stepNumber}
            history={history}
          />
        </div>
      </div>
    );
  }
}

// =========== HELPER FUNCTIONS ===========

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: [a, b, c]
      }
    }
  }
  return {
    winner: null,
    winningSquares: null
  }
}

// ========================================

var grid = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

ReactDOM.render(
  <Game rows={grid} />,
  document.getElementById('root')
);

