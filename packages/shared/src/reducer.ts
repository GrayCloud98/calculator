import { evaluate } from "./calculator";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
} as const;

export type ActionType = keyof typeof ACTIONS;

export interface Action {
  type: ActionType | string;
  payload?: {
    digit?: string;
    operation?: string;
  };
}

export interface CalculatorState {
  currentOperand: string | null;
  previousOperand: string | null;
  operation: string | null;
  overwrite?: boolean;
}

export function reducer(
  state: CalculatorState,
  { type, payload }: Action,
): CalculatorState {
  switch (type) {
    case ACTIONS.ADD_DIGIT: {
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload?.digit ?? null,
          overwrite: false,
        };
      }

      if (state.currentOperand && state.currentOperand.length >= 15)
        return state;

      if (payload?.digit === "." || payload?.digit === ",") {
        if (state.currentOperand && state.currentOperand.includes("."))
          return state;
        return {
          ...state,
          currentOperand: `${state.currentOperand ?? "0"}${payload.digit}`,
        };
      }

      if (payload?.digit === "." && state.currentOperand?.includes("."))
        return state;
      if (payload?.digit === "0" && state.currentOperand === "0") return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand ?? ""}${payload?.digit ?? ""}`,
      };
    }

    case ACTIONS.CHOOSE_OPERATION: {
      if (state.currentOperand == null && state.previousOperand == null)
        return state;

      if (state.currentOperand == null) {
        return { ...state, operation: payload?.operation ?? null };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload?.operation ?? null,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(
          state.currentOperand,
          state.previousOperand,
          state.operation,
        ),
        operation: payload?.operation ?? null,
        currentOperand: null,
      };
    }

    case ACTIONS.CLEAR:
      return {
        currentOperand: null,
        previousOperand: null,
        operation: null,
        overwrite: false,
      };

    case ACTIONS.DELETE_DIGIT: {
      if (state.overwrite) {
        return { ...state, overwrite: false, currentOperand: null };
      }
      if (!state.currentOperand) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return { ...state, currentOperand: state.currentOperand.slice(0, -1) };
    }

    case ACTIONS.EVALUATE: {
      if (!state.operation || !state.currentOperand || !state.previousOperand)
        return state;
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(
          state.currentOperand,
          state.previousOperand,
          state.operation,
        ),
      };
    }

    default:
      return state;
  }
}
