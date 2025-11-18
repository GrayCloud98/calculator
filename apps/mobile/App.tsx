import React, { useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "react-native-linear-gradient";

import { reducer, ACTIONS, formatOperand } from "@calc/shared";

const BUTTON_SIZE = Dimensions.get("window").width / 4;

export default function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {
      currentOperand: null,
      previousOperand: null,
      operation: null,
      overwrite: false,
    }
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#a38cf3", "#1d19eb"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.output}>
            <Text style={styles.previousOperand}>
              {formatOperand(previousOperand)} {operation}
            </Text>

            <Text style={styles.currentOperand}>
              {formatOperand(currentOperand)}
            </Text>
          </View>

          <View style={styles.row}>
            <CalcButton
              label="AC"
              spanTwo
              onPress={() => dispatch({ type: ACTIONS.CLEAR })}
            />
            <CalcButton
              label="DEL"
              onPress={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
            />
            <CalcButton
              label="/"
              onPress={() =>
                dispatch({
                  type: ACTIONS.CHOOSE_OPERATION,
                  payload: { operation: "/" },
                })
              }
            />
          </View>

          <View style={styles.row}>
            <Digit label="7" dispatch={dispatch} />
            <Digit label="8" dispatch={dispatch} />
            <Digit label="9" dispatch={dispatch} />
            <Operation label="*" dispatch={dispatch} />
          </View>

          <View style={styles.row}>
            <Digit label="4" dispatch={dispatch} />
            <Digit label="5" dispatch={dispatch} />
            <Digit label="6" dispatch={dispatch} />
            <Operation label="+" dispatch={dispatch} />
          </View>

          <View style={styles.row}>
            <Digit label="1" dispatch={dispatch} />
            <Digit label="2" dispatch={dispatch} />
            <Digit label="3" dispatch={dispatch} />
            <Operation label="-" dispatch={dispatch} />
          </View>

          <View style={styles.row}>
            <Digit label="0" dispatch={dispatch} />
            <Digit label="." dispatch={dispatch} />
            <CalcButton
              label="="
              spanTwo
              onPress={() => dispatch({ type: ACTIONS.EVALUATE })}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Digit({
  label,
  dispatch,
}: {
  label: string;
  dispatch: React.Dispatch<any>;
}) {
  return (
    <CalcButton
      label={label}
      onPress={() =>
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: label } })
      }
    />
  );
}

function Operation({
  label,
  dispatch,
}: {
  label: string;
  dispatch: React.Dispatch<any>;
}) {
  return (
    <CalcButton
      label={label}
      onPress={() =>
        dispatch({
          type: ACTIONS.CHOOSE_OPERATION,
          payload: { operation: label },
        })
      }
    />
  );
}

function CalcButton({
  label,
  onPress,
  spanTwo = false,
}: {
  label: string;
  onPress: () => void;
  spanTwo?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        spanTwo && styles.spanTwo,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 20,
  },

  output: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.33)",
    minHeight: BUTTON_SIZE,
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 12,
  },

  previousOperand: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 24,
  },

  currentOperand: {
    color: "white",
    fontSize: 40,
  },

  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: "rgba(255,255,255,0.69)",
    borderWidth: 0.5,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonPressed: {
    backgroundColor: "rgba(255,255,255,0.85)",
  },

  buttonText: {
    fontSize: 32,
    color: "black",
  },

  spanTwo: {
    width: BUTTON_SIZE * 2,
  },
});
