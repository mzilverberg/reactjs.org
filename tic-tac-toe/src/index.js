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
  const className = `square ${props.winningClass}`;
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
  renderSquares(indexes, winningSquares) {
    const row = indexes.map((i) => {
      // Get position of the square in the grid
      const position = {
        column: i % 3 + 1,
        row: calculateRow(i, this.props.rows)
      }
      const className = winningSquares && winningSquares.indexOf(i) >= 0 ? 'winning' : '';
      return (
        <Square 
          key={i}
          winningClass={className}
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
    const winningSquares = this.props.winningSquares;
    const grid = this.props.rows.map((squares, row) => {
      return (
        <div className="board-row" key={row}>
          {this.renderSquares(squares, winningSquares)}
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

