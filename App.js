import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Buttons from "./components/Buttons";
import { Appearance, useColorScheme } from "react-native";

import COLOURS from "./config/colours";

export default function App() {
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [operation, setOperation] = useState("");
  const [result, setResult] = useState(null);

  let colorScheme = useColorScheme();

  if (colorScheme === "dark") {
    // render some dark thing
  } else {
    // render some light thing
  }

  const LIGHT_THEME = {
    container: {
      flex: 1,
      backgroundColor: "#FAF9F6",
      alignItems: "center",
      justifyContent: "center",
    },
    keypad: {
      height: "60%",
      flex: 0.95,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "100%",
    },
    screen: {
      flex: 0.45,
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    firstNumber: {
      color: "#3B3B3B",
      fontSize: 90,
      fontWeight: "200",
      paddingRight: 10,
    },
    topDisplay: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    operation: {
      color: "#3B3B3B",
      fontSize: 42,
    },
    secondNumber: {
      color: "#3B3B3B",
      fontSize: 42,
      fontWeight: "300",
    },
  };

  const handleNumberPress = (value) => {
    if (value !== "" && value !== "0" && !firstNumber && result) {
      clear();
      setFirstNumber(value);
      return;
    }

    if (firstNumber?.length < 10) {
      setFirstNumber(firstNumber + value);
    }
    if (
      firstNumber &&
      (firstNumber === "." || (firstNumber.includes(".") && value === "."))
    ) {
      setFirstNumber(firstNumber);
    }
    if (firstNumber && firstNumber === "." && value !== ".") {
      setFirstNumber(firstNumber + value);
    }

    if (firstNumber === 0 || firstNumber === "0") {
      setFirstNumber("0");
    }
    if (value === "+/-" && firstNumber !== "") {
      setFirstNumber("-");
    }
    if (value === "+/-" && (firstNumber === "0" || firstNumber === "")) {
      setFirstNumber("0");
    }
    if (firstNumber && firstNumber === "0") {
      setFirstNumber(firstNumber.slice(1) + value);
    }
    if (firstNumber && value === "+/-") {
      setFirstNumber("-" + firstNumber);
    }
    if (firstNumber.includes("-") && value === "+/-") {
      setFirstNumber(firstNumber);
    }

    if (value === "%" && !secondNumber && !firstNumber) {
      setResult("0");
    }

    if (value === "%" && !secondNumber) {
      if (!firstNumber) {
        setResult("0");
        return;
      }
      setResult(parseFloat(firstNumber) / 100);
    }

    if (
      firstNumber.includes("%") ||
      (value.includes("%") && firstNumber.includes("%"))
    ) {
      clear();
      setResult("0");
      return;
    }

    if (value === "%" && secondNumber && firstNumber) {
      const percentage = parseFloat(firstNumber / 100);
      const percentDiff = secondNumber * percentage;

      if (operation === "-") {
        clear();
        setResult(parseFloat(secondNumber - percentDiff));
      }
      if (operation === "+") {
        clear();
        setResult(parseFloat(secondNumber + percentDiff));
      }
      if (operation === "*") {
        clear();
        setResult(parseFloat(secondNumber * percentage));
      }
      if (operation === "/") {
        clear();
        setResult(parseFloat(secondNumber / percentage));
      }
    }
  };

  const handleContinousOperation = (value) => {
    switch (operation) {
      case "+":
        setSecondNumber(parseFloat(secondNumber) + parseFloat(firstNumber));
        setOperation(value);
        break;
      case "-":
        setSecondNumber(parseFloat(secondNumber) - parseFloat(firstNumber));
        setOperation(value);
        break;
      case "*":
        setSecondNumber(parseFloat(secondNumber) * parseFloat(firstNumber));
        setOperation(value);
        break;

      case "/":
        if (firstNumber === "0") {
          setResult("Error");
          break;
        }
        setSecondNumber(parseFloat(secondNumber) / parseFloat(firstNumber));
        setOperation(value);
        break;
      default:
        clear();
        setResult(0);
        break;
    }
  };

  const handleOperationPress = (value) => {
    setOperation(value);
    setSecondNumber(firstNumber);
    setFirstNumber("");

    if (result) {
      setSecondNumber(result);
      setResult(null);
      return;
    }

    if (firstNumber === "%" && value) {
      setOperation(null);
      clear();
      return;
    }

    if (!firstNumber && value) {
      setOperation(null);
      clear();
      return;
    }

    if (firstNumber && secondNumber && operation) {
      handleContinousOperation(value);
    }
  };

  const clear = () => {
    setFirstNumber("");
    setSecondNumber("");
    setOperation("");
    setResult(null);
  };

  const getResult = () => {
    if (result && firstNumber && secondNumber && operation) {
      setFirstNumber(result);
    }

    switch (operation) {
      case "+":
        clear();
        setResult(parseFloat(secondNumber) + parseFloat(firstNumber));
        break;
      case "-":
        clear();
        setResult(parseFloat(secondNumber) - parseFloat(firstNumber));
        break;
      case "*":
        clear();
        setResult(parseFloat(firstNumber) * parseFloat(secondNumber));
        break;
      case "/":
        clear();
        if (firstNumber === "0") {
          setResult("Error");
          break;
        }
        setResult(parseFloat(secondNumber) / parseFloat(firstNumber));
        break;
      default:
        clear();
        break;
    }
  };

  const firstNumberDisplay = () => {
    if (String(result)?.length > 10) {
      setResult(result?.toExponential());
    }

    if (result !== null) {
      return (
        <Text
          style={
            result < 99999
              ? [styles.firstNumber]
              : [styles.firstNumber, { fontSize: 50, color: "#3B3B3B" }]
          }
        >
          {result?.toLocaleString("en-US")}
        </Text>
      );
    }

    if (firstNumber && firstNumber?.length < 6) {
      return (
        <Text
          selectable={true}
          selectionColor={COLOURS.black}
          style={styles.firstNumber}
        >
          {firstNumber}
        </Text>
      );
    }
    if (firstNumber === "") {
      return <Text style={styles.firstNumber}>{0}</Text>;
    }
    if (firstNumber?.length > 5 && firstNumber?.length < 8) {
      return (
        <Text selectable={true} style={[styles.firstNumber, { fontSize: 70 }]}>
          {firstNumber}
        </Text>
      );
    }
    if (firstNumber?.length > 7) {
      return (
        <Text selectable={true} style={[styles.firstNumber, { fontSize: 50 }]}>
          {firstNumber}
        </Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <View style={styles.topDisplay}>
          <Text style={styles.secondNumber}>{secondNumber}</Text>
          <Text style={styles.operation}>{operation}</Text>
        </View>
        {firstNumberDisplay()}
      </View>
      <View style={styles.keypad}>
        <View style={styles.row}>
          <Buttons
            text={!firstNumber && !secondNumber ? "AC" : "C"}
            onPress={() => clear()}
            colour={COLOURS.lightGray}
          />
          <Buttons
            text={"+/-"}
            onPress={() => handleNumberPress("+/-")}
            colour={COLOURS.lightGray}
          />
          <Buttons
            text={"%"}
            onPress={() => handleNumberPress("%")}
            colour={COLOURS.lightGray}
          />
          <Buttons
            text={"÷"}
            colour={COLOURS.blue}
            onPress={() => handleOperationPress("/")}
          />
        </View>
        <View style={styles.row}>
          <Buttons text={7} onPress={() => handleNumberPress("7")} />
          <Buttons text={8} onPress={() => handleNumberPress("8")} />
          <Buttons text={9} onPress={() => handleNumberPress("9")} />
          <Buttons
            text={"x"}
            colour={COLOURS.blue}
            onPress={() => handleOperationPress("*")}
          />
        </View>
        <View style={styles.row}>
          <Buttons text={4} onPress={() => handleNumberPress("4")} />
          <Buttons text={5} onPress={() => handleNumberPress("5")} />
          <Buttons text={6} onPress={() => handleNumberPress("6")} />
          <Buttons
            text={"-"}
            colour={COLOURS.blue}
            onPress={() => handleOperationPress("-")}
          />
        </View>
        <View style={styles.row}>
          <Buttons text={1} onPress={() => handleNumberPress("1")} />
          <Buttons text={2} onPress={() => handleNumberPress("2")} />
          <Buttons text={3} onPress={() => handleNumberPress("3")} />
          <Buttons
            text={"+"}
            colour={COLOURS.blue}
            onPress={() => handleOperationPress("+")}
          />
        </View>
        <View style={styles.row}>
          <Buttons text={0} onPress={() => handleNumberPress("0")} />
          <Buttons text={"."} onPress={() => handleNumberPress(".")} />
          <Buttons
            text={"⌫"}
            onPress={() => setFirstNumber(firstNumber.slice(0, -1))}
          />
          <Buttons
            text={"="}
            colour={COLOURS.blue}
            onPress={() => getResult()}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    alignItems: "center",
    justifyContent: "center",
  },
  keypad: {
    height: "60%",
    flex: 0.95,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  screen: {
    flex: 0.45,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  firstNumber: {
    color: "#3B3B3B",
    fontSize: 90,
    fontWeight: "200",
    paddingRight: 10,
  },
  topDisplay: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  operation: {
    color: "#3B3B3B",
    fontSize: 42,
  },
  secondNumber: {
    color: "#3B3B3B",
    fontSize: 42,
    fontWeight: "300",
  },
});
