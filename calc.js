function Calculator() {
    var [calculation, setCalcalculation] = React.useState("");
  
    var ops = ["/", "*", "+", "-", "."];
  
    var updateCalculator = (input) => {
      var pattern = /[+\-*/]/;
      if (calculation === "" && input === "0") {
        return;
      }
      if (input === ".") {
        var items = calculation.split(pattern);
        if (items[items.length - 1].includes(".")) {
          return;
        }
      }
      if (input !== "-" && pattern.test(input)) {
        var lastChar = calculation[calculation.length - 1] || "";
        var secondLastChar = calculation[calculation.length - 2] || "";
        if (pattern.test(lastChar)) {
          if (lastChar === "-" && pattern.test(secondLastChar)) {
            setCalcalculation(calculation.slice(0, -2) + input);
            return;
          }
          setCalcalculation(calculation.slice(0, -1) + input);
          return;
        }
      }
  
      setCalcalculation(calculation + input);
    };
    var calculate = () => {
      setCalcalculation(eval(calculation).toString());
    };
    var deleteLast = () => {
      if (calculation === "") {
        return;
      }
  
      var value = calculation.slice(0, -1);
      setCalcalculation(value);
    };
  
    var clearAll = () => {
      setCalcalculation("");
    };
  
    return (
      <div className="App">
        <div className="calculator">
          <div className="display" id="display">
            {calculation || "0"}
          </div>
          <button id="del" onClick={deleteLast}>
            DEL
          </button>
          <button id="clear" onClick={clearAll}>
            AC
          </button>
          <button
            id="add"
            onClick={() => {
              updateCalculator("+");
            }}
          >
            +
          </button>
          <button
            id="subtract"
            onClick={() => {
              updateCalculator("-");
            }}
          >
            -
          </button>
  
          <button
            id="one"
            onClick={() => {
              updateCalculator("1");
            }}
          >
            1
          </button>
          <button
            id="two"
            onClick={() => {
              updateCalculator("2");
            }}
          >
            2
          </button>
          <button
            id="three"
            onClick={() => {
              updateCalculator("3");
            }}
          >
            3
          </button>
          <button
            id="multiply"
            onClick={() => {
              updateCalculator("*");
            }}
          >
            *
          </button>
          <button
            id="four"
            onClick={() => {
              updateCalculator("4");
            }}
          >
            4
          </button>
          <button
            id="five"
            onClick={() => {
              updateCalculator("5");
            }}
          >
            5
          </button>
          <button
            id="six"
            onClick={() => {
              updateCalculator("6");
            }}
          >
            6
          </button>
          <button
            id="divide"
            onClick={() => {
              updateCalculator("/");
            }}
          >
            /
          </button>
          <button
            id="seven"
            onClick={() => {
              updateCalculator("7");
            }}
          >
            7
          </button>
          <button
            id="eight"
            onClick={() => {
              updateCalculator("8");
            }}
          >
            8
          </button>
          <button
            id="nine"
            onClick={() => {
              updateCalculator("9");
            }}
          >
            9
          </button>
          <button
            id="zero"
            onClick={() => {
              updateCalculator("0");
            }}
          >
            0
          </button>
          <button
            id="decimal"
            onClick={() => {
              updateCalculator(".");
            }}
          >
            .
          </button>
          <button id="equals" onClick={calculate}>
            =
          </button>
        </div>
      </div>
    );
  }
  
  ReactDOM.render(<Calculator />, document.getElementById("root"));
  