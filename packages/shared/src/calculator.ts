export function evaluate(
  currentOperand: string | null,
  previousOperand: string | null,
  operation: string | null,
): string {
  const prev = parseFloat(previousOperand || "");
  const curr = parseFloat(currentOperand || "");
  if (isNaN(prev) || isNaN(curr)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = (prev + curr).toString();
      break;
    case "-":
      computation = (prev - curr).toString();
      break;
    case "*":
      computation = (prev * curr).toString();
      break;
    case "/":
      computation = (prev / curr).toString();
      break;
    default:
      return "";
  }
  return computation;
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function formatOperand(
  operand: string | null | undefined,
): string | undefined {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(parseFloat(integer));
  return `${INTEGER_FORMATTER.format(parseFloat(integer))}.${decimal}`;
}
