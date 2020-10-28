const converterTaxaParaAnual = (valor, periodicidade = 'mensal') => {
  const n = periodicidade == 'mensal' ? 12 : 360;
  valor /= 100;
  return (Math.pow(valor + 1, n) - 1).toFixed(2);
};

const calculaSeguro = (e) => {
  e.preventDefault();
  const FORM_FIELDS = [
    'cobertura',
    'apolice',
    'segurados',
    'probabilidade',
    'probTaxa',
    'despesaSeguradora',
    'rentabilidade',
    'rentTaxa',
  ];

  const inputs = [];

  FORM_FIELDS.forEach((element) => {
    const elemList = [
      ...document.querySelectorAll(`#seguro input[name= '${element}']`),
    ];
    // Se tiver mais de 1 elemento, é um radio button
    const elem =
      elemList.length > 1
        ? elemList.find((option) => option.checked)
        : elemList[0];

    if (!elem.value) {
      elem.classList.add('is-invalid');
    } else {
      elem.classList.remove('is-invalid');
      inputs[element] = elem.value;
    }
  });
  switch (inputs['probTaxa']) {
    case 'aa':
      inputs['probabilidade'] /= 100;
      break;

    case 'am':
      inputs['probabilidade'] = converterTaxaParaAnual(inputs['probabilidade']);
      break;

    case 'ad':
      inputs['probabilidade'] = converterTaxaParaAnual(
        inputs['probabilidade'],
        'diaria'
      );
      break;
  }
  switch (inputs['rentTaxa']) {
    case 'aa':
      inputs['rentabilidade'] /= 100;
      break;

    case 'am':
      inputs['rentabilidade'] = converterTaxaParaAnual(inputs['rentabilidade']);
      break;

    case 'ad':
      inputs['rentabilidade'] = converterTaxaParaAnual(
        inputs['rentabilidade'],
        'diaria'
      );
      break;
  }

  const a = inputs['probabilidade'] * inputs['apolice'];
  const b = Math.pow(1 + inputs['rentabilidade'], inputs['cobertura']);
  const c = inputs['despesaSeguradora'] / inputs['segurados'];

  const result = a / b + c;

  document.querySelector('#seguro #valorParcela').textContent = result.toFixed(
    2
  );
};
