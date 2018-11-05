# ReactJS.org tic-tac-toe tutorial
In this repository you can find my solutions for the [tic-tac-toe tutorial](https://reactjs.org/tutorial/tutorial.html) files from the ReactJS website, including the suggested improvements:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Additionally, as a personal challenge, I prevented jumping back and forth in history. For example, when jumping from step 4 to 3, you can't go back to step 4. Only the buttons for steps 1-3 are enabled. You can easily disable this feature by changing line 31 of [src/index.js](https://github.com/mzilverberg/reactjs.org/blob/master/src/index.js):
```js
// Original line 31 code
const disabled = stepIndex > this.props.stepNumber;
// Disable feature by changing the line above to the following
const disabled = false;
```

## Setup

In the project directory, you can run: `npm start`. This will run the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## Other information

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). I changed the README file created `create-react-app` for overview reasons, but you can find the the most recent version of the original README [here](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).