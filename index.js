let currentActive = "seguro";

const converterTaxaParaAnual = (valor, periodicidade = 'mensal') => {
  const n = periodicidade == 'mensal' ? 12 : 360;
  valor /= 100;
  return (Math.pow(valor + 1, n) - 1).toFixed(2);
};

const showCalculator = (e, calc) => {
  e.target.classList.add("active");
  document.getElementById(`${currentActive}Btn`).classList.remove("active");
  document.getElementById(currentActive).classList.add("d-none");
  currentActive = calc;
  document.getElementById(calc).classList.remove("d-none");
}

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
  let invalid = false;
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
      invalid = true;
    } else {
      elem.classList.remove('is-invalid');
      inputs[element] = elem.value;
    }
  });

  if(invalid) return;
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

const calculaWacc = (e) => {
  e.preventDefault();
  const FORM_FIELDS = [
    'patrimonio',
    'divida',
    'capitalProprio',
    'capitalTerceiros',
    'beneficioFiscal',
  ];

  const inputs = [];
  let invalid = false;
  FORM_FIELDS.forEach((element) => {
    const elemList = document.querySelectorAll(`#wacc input[name= '${element}']`);
    const elem = elemList[0];

    if (!elem.value) {
      elem.classList.add('is-invalid');
      invalid = true;
    } else {
      elem.classList.remove('is-invalid');
      inputs[element] = elem.value/100;
    }
  });
  
  if(invalid) return;
  const a = inputs["patrimonio"]*inputs["capitalProprio"];
  const b = inputs["divida"]*inputs["capitalTerceiros"]*(1 - inputs["beneficioFiscal"]);
  const result = (a + b)*100;
  document.querySelector('#wacc #valorWacc').textContent = `${result.toFixed(2)}%`;
}

const calculaCAPM = (e) => {
  e.preventDefault();
  const FORM_FIELDS = [
    'portifolio',
    'livreRisco',
    'beta',
  ];

  const inputs = [];
  let invalid = false;
  FORM_FIELDS.forEach((element) => {
    const elemList = document.querySelectorAll(`#capm input[name= '${element}']`);
    const elem = elemList[0];
    if (!elem.value) {
      elem.classList.add('is-invalid');
      invalid = true;
    } else {
      elem.classList.remove('is-invalid');
      inputs[element] = element == "beta" ? elem.value : elem.value/100;
    }
  });
  
  if(invalid) return;

  let result = inputs["livreRisco"] + (inputs["beta"]*(inputs["portifolio"] - inputs["livreRisco"]));
  result *= 100;
  document.querySelector('#capm #valorCAPM').textContent = `${result.toFixed(2)}%`;

}