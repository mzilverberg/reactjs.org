import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquares(indexes) {
    const row = indexes.map((i) => {
      // Get position of the square in the grid
      const position = {
        column: i % 3 + 1,
        row: calculateRow(i, this.props.rows)
      }
      return (
        <Square 
          key={i}
          value={this.props.squares[i]}
          onClick={() => {this.props.onClick(i, position)}}
        />
      )
    });

    return (
      <React.Fragment>
        {row}
      </React.Fragment>
    );
  }

  render() {    
    const grid = this.props.rows.map((squares, row) => {
      return (
        <div className="board-row" key={row}>
          {this.renderSquares(squares)}
        </div>
      );
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
  }

  handleClick(i, position) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    // Ignore click if someone has won the game or if the square is already filled
    if(calculateWinner(squares) || squares[i]) {
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

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Back to move #${move}` : 'Back to game start';
      
      // Disable the button if it will jump to a future move
      // For example, you can't jump back from step 2 to step 1, and then back to step 2 
      const disabled = move > this.state.stepNumber;
      const className = move === this.state.stepNumber ? 'active' : '';

      return (
        <li key={move} className={className}>
          <button disabled={disabled} onClick={() => this.jumpTo(move)}>{desc}</button>
          <em>({step.desc})</em>
        </li>
      )
    });

    let status;
    if(winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            rows={this.props.rows}
            squares={current.squares}
            onClick={(i, position) => this.handleClick(i, position)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// =========== HELPER FUNCTIONS ===========

function calculateRow(i, rows) {
  for(let j = 0; j < rows.length; j++) {
    if(rows[j].indexOf(i) >= 0) {
      return j + 1;
    }
  }
  return null;
}

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
      return squares[a];
    }
  }
  return null;
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

