import React, { useReducer, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { reducer, ACTIONS, formatOperand } from "@calc/shared";

const { width } = Dimensions.get("window");
const BTN = width / 5;

type CalcAction =
  | { type: string }
  | { type: string; payload?: { digit?: string; operation?: string } };

type ButtonVariant = "digit" | "op" | "accent";

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
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={["#120625", "#09091c", "#02030a"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.root}>
          <View style={styles.displayArea}>
            <View style={styles.display}>
              <Text style={styles.previous}>
                {formatOperand(previousOperand)} {operation}
              </Text>
              <Text style={styles.current}>
                {formatOperand(currentOperand)}
              </Text>
            </View>
          </View>
          <View style={styles.pad}>
            <Row>
              <CalcButton
                label="AC"
                variant="accent"
                onPress={() => dispatch({ type: ACTIONS.CLEAR })}
              />
              <CalcButton
                label="DEL"
                variant="op"
                onPress={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
              />
              <CalcButton
                label="%"
                variant="digit"
                onPress={() => {}}
              />
              <Operation label="/" dispatch={dispatch} />
            </Row>

            <Row>
              <Digit label="7" dispatch={dispatch} />
              <Digit label="8" dispatch={dispatch} />
              <Digit label="9" dispatch={dispatch} />
              <Operation label="*" dispatch={dispatch} />
            </Row>

            <Row>
              <Digit label="4" dispatch={dispatch} />
              <Digit label="5" dispatch={dispatch} />
              <Digit label="6" dispatch={dispatch} />
              <Operation label="-" dispatch={dispatch} />
            </Row>

            <Row>
              <Digit label="1" dispatch={dispatch} />
              <Digit label="2" dispatch={dispatch} />
              <Digit label="3" dispatch={dispatch} />
              <Operation label="+" dispatch={dispatch} />
            </Row>

            <Row>
              <CalcButton
                label="±"
                variant="digit"
                onPress={() => {}}
              />
              <Digit label="0" dispatch={dispatch} />
              <Digit label="." dispatch={dispatch} />
              <CalcButton
                label="="
                variant="accent"
                onPress={() => dispatch({ type: ACTIONS.EVALUATE })}
              />
            </Row>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

function Digit({
  label,
  dispatch,
}: {
  label: string;
  dispatch: React.Dispatch<CalcAction>;
}) {
  return (
    <CalcButton
      label={label}
      variant="digit"
      onPress={() =>
        dispatch({
          type: ACTIONS.ADD_DIGIT,
          payload: { digit: label },
        })
      }
    />
  );
}

function Operation({
  label,
  dispatch,
}: {
  label: string;
  dispatch: React.Dispatch<CalcAction>;
}) {
  return (
    <CalcButton
      label={label}
      variant="op"
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
  variant = "digit",
  flex = 1,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  flex?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.timing(scale, {
      toValue: 0.9,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 7,
    }).start();
  };

  const colors =
    variant === "accent"
      ? ["#ff6ac1", "#ffb86c"]
      : variant === "op"
      ? ["#33c9ff", "#7b5cff"]
      : ["#27293a", "#191b28"];

  const textColor = variant === "digit" ? "#f7f7ff" : "#ffffff";

  return (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
      style={{ flex }}
    >
      <Animated.View
        style={[
          styles.btnOuter,
          { transform: [{ scale }] },
          variant !== "digit" && styles.btnOuterStrong,
        ]}
      >
        <LinearGradient colors={colors} style={styles.btnInner}>
          <Text style={[styles.btnText, { color: textColor }]}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  displayArea: {
    flex: 1.0,
    justifyContent: "flex-end",
    alignItems: "stretch",
    paddingHorizontal: 22,
    paddingTop: 12,
    marginBottom: 12,
  },
  display: {
    backgroundColor: "rgba(10,10,20,0.85)",
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.35)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  previous: {
    color: "rgba(230,230,255,0.7)",
    fontSize: 20,
    marginBottom: 4,
  },
  current: {
    color: "#ffffff",
    fontSize: 52,
    fontWeight: "600",
  },
  pad: {
    flex: 1.4,
    paddingHorizontal: 14,
    paddingBottom: 8,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    gap: 14,
    height: BTN,
  },
  btnOuter: {
    flex: 1,
    height: "100%",
    borderRadius: BTN / 2,
    overflow: "hidden",
    backgroundColor: "rgba(20,20,35,0.9)",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  btnOuterStrong: {
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 14,
  },
  btnInner: {
    flex: 1,
    borderRadius: BTN / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 26,
    fontWeight: "600",
  },
});
