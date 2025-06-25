export function geradorDeCpfTest(formatado: boolean = true): string {
  const cpf: number[] = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10)
  );

  cpf.push(calcularDigito(cpf));
  cpf.push(calcularDigito(cpf));

  const num = cpf.join("");
  return formatado
    ? `${num.slice(0, 3)}.${num.slice(3, 6)}.${num.slice(6, 9)}-${num.slice(9)}`
    : num;
}

function calcularDigito(digits: number[]): number {
  const soma = digits.reduce(
    (acc, digit, index) => acc + digit * (digits.length + 1 - index),
    0
  );
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function validarCpf(cpf: string): boolean {
  const num = cpf.replace(/\D/g, "");
  if (num.length !== 11 || /^(\d)\1+$/.test(num)) return false;

  const arr = num.split("").map(Number);
  const d1 = calcularDigito(arr.slice(0, 9));
  const d2 = calcularDigito(arr.slice(0, 10));

  return arr[9] === d1 && arr[10] === d2;
}
