import React, { Component } from "react";
import "./App.css";

Array.prototype.getRandom = function() {
  return this[Math.floor(Math.random() * this.length)];
};


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class App extends React.Component {
  state = {
    value: "",
    randomVal: getRandomIntInclusive(1, 100),
    numOfGuess: 5,
    guessed: false,
    randImg: [...Array(8).keys()].getRandom(),
    hint: [false, ""] // think of this as a tuple
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    if (this.state.value === "") return;

    event.preventDefault();

    let num = this.state.numOfGuess - 1;
    let val = Number(this.state.value);


    console.log("random val: ", this.state.randomVal);

    if (val === this.state.randomVal) {
      return this.setState({ guessed: true });
    }

    this.setState({
      numOfGuess: num,
      value: "",
      randImg: [...Array(8).keys()].getRandom(),
      hint: [false, ""],
      moreHint: false
    });
  };

  startOver = () => {
    this.setState({
      value: "",
      randomVal: getRandomIntInclusive(1, 100),
      numOfGuess: 5,
      guessed: false,
      randImg: [...Array(8).keys()].getRandom()
    });
  };

  hint = moreHint => {
    
    if (moreHint) return this.setState({ moreHint: !this.state.moreHint });

    let hintFlag = this.state.hint[0];
    let compare = this.state.randomVal > 50 ? "greater" : "samaller";
    this.setState({ hint: [!hintFlag, compare] });
  };

  choosedVal = val =>
    this.setState({
      value: val,
      hint: [false, ""],
      moreHint: false
    });

  render() {
    let animations = [
      { animation: `flicker-in-1 3.5s linear 1s infinite alternate` },
      { animation: `slidein 3.5s linear 1s infinite alternate` }
    ];

    const guess = () => {
      const guessNum = this.state.numOfGuess;

      if (guessNum !== 0 && !this.state.guessed) {
        return (
          <p className="my-1 status">
            Number of &nbsp; ☕️ &nbsp; left: {this.state.numOfGuess}
          </p>
        );
      } else {
        let aa = [];
        if (this.state.guessed) {
          aa.push(
            <p key={this.state.value} className="status my-2">
              Yaaaahoo! you gussed it!! here &nbsp; ☕️ &nbsp; nice and worm.
            </p>
          );
        } else {
          aa.push(
            <p className="status my-1">
              Nope! Game over... No &nbsp; ☕️ &nbsp; for you...
            </p>
          );
        }

        aa.push(
          <button
            key={this.state.value + 1}
            className="btn btn-dark my-1"
            onClick={this.startOver}
          >
            Play again!
          </button>
        );

        return aa;
      }
    };

    const gussedNum = this.state.numOfGuess

    const options = [...Array(5).keys()].map((elm, indx) => {
      const add = (a, b) => a + b;
      const sub = (a, b) => a - b;

      const val = [...Array(9).keys()].getRandom();
      const opt = [add, sub].getRandom();

      const res = Math.abs(opt(val, this.state.randomVal));
      return (
        <button
          className="btn btn-dark m-1 slide-in-right"
          onClick={() => this.choosedVal(res)}
          key={indx}
        >
          {res}
        </button>
      );
    });

    return (
      <div className="App">
        <header className="App-header">
          <img
            src={require(`./images/maze${this.state.randImg}.svg`)}
            className="App-logo"
            style={animations.getRandom()}
            alt="logo"
          />

          <div className="form-group">
            <label htmlFor="guessGame" className="text-dark my-2">
              Guess a Number <p className="my-1">(bwtween 1-100)</p>
            </label>

            <form onSubmit={this.handleSubmit}>
              <input
                type="number"
                min="1"
                max="100"
                className="form-control"
                id="guessGame"
                aria-describedby="numHelp"
                placeholder={gussedNum ? "Your Guess..." : ''}
                value={this.state.value}
                onChange={this.handleChange}
                disabled={(!gussedNum || this.state.guessed) && true}
              />

              <small id="numHelp" className="form-text text-dark">
                It's always samaller than you think...
              </small>

              <button className="btn btn-dark my-2">☕️</button>
            </form>
            <button
              className="btn btn-light mx-2"
              onClick={() => this.hint(false)}
            >
              Hint
            </button>
          </div>

          {this.state.hint[0] && (
            <p className="text-dark slide-in-blurred-top">
              it's {this.state.hint[1]} than 50!
              <button
                className="btn-sm btn-dark mx-2"
                onClick={() => this.hint(true)}
              >
                More Hint
              </button>
              {this.state.moreHint && options}
            </p>
          )}

          {guess()}
        </header>
      </div>
    );
  }
}

export default App;