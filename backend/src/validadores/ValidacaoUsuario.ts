export function validarCPF(value: string) {
    if (typeof value !== 'string') {
    return false;
  }
   
  value = value.replace(/[^\d]+/g, '');
  
  if (value.length !== 11 || !!value.match(/(\d)\1{10}/)) {
    return false;
  }

  const values = value.split('').map(el => +el);
  const resto = (count: number) => (values.slice(0, count-12).reduce( (soma, el, index) => (soma + el * (count-index)), 0 )*10) % 11 % 10;

  return resto(10) === values[9] && resto(11) === values[10];
}

export function validarEmail(value: string)  : boolean  {
    const emailFormato = /^[a-z0-9._]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
   
    return emailFormato.test(value)
}

// senha com uma letra maiscula e um numero obrigatorio 
export function validarSenha(value: string) : boolean {
    const senhaFormato = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return senhaFormato.test(value);
}

export function validarDataNascimento (value: Date) : boolean {
    const dataAtual = new Date();
    const dataNascimento = new Date(value);
    const idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
    return idade >= 18;
}