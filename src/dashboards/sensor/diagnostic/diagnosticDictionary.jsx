export const TRANSMISSION_DICTIONARY = [
  "NONE",
  "PULLEY",
  "GIMBAL",
  "INTEGRATED",
  "COUPLING",
];

export const BEARING_DICTIONARY = ["NONE", "ROLLING", "SLEEVE"];

export const MACHINE_TYPE_DICTIONARY = [
  "NONE",
  "ELECTRIC_MOTOR",
  "CENTRIFUGAL_PUMP",
  "FAN",
  "STEAM_TURBINE",
  "REDUCER",
  "GENERATOR",
  "ROTORS",
  "OTHERS",
];

export const RELATED_FAILURE_DICTIONARY = {
  ELECTRIC_MOTOR: {
    UNBALANCE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O motor elétrico apresenta sintomas característicos de desbalanceamento. Faça as seguintes verificações:",
        recommendation: [
          "Geralmente os sinais característicos de desbalanceamento são ocasionados pela máquina acoplada/anexada aos motores elétricos. Se houver um rotor acoplado/anexado ao motor elétrico, verifique se o desequilíquibrio de massa está sendo ocasionado por ele;",
          "Caso o item acima tenha sido descartado, verifique se a ventoinha do motor elétrico apresenta desequilíbrio de massa;",
          "Uma situação mais rara, porém possível, é que o rotor do próprio motor elétrico esteja desbalanceado;",
          "Solicite o balanceamento do rotor por um profissional capacitado.",
        ],
      },
    ],
    MISALIGNMENT: [
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: null,
        description:
          "O motor elétrico apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do acoplamento e elemento elástico (se houver);",
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Confira e corrija o alinhamento entre o motor elétrico e a máquina acoplada.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (cardã) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: null,
        description:
          "O motor elétrico apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade das polias e correias;",
          "Verifique o tensionamento das correias;",
          "Confira e corrija o alinhamento entre as polias do motor elétrico e da máquina acoplada.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (integrada) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: null,
        description:
          "O motor elétrico apresenta sintomas característicos de desalinhamento. Para um diagnóstico mais preciso é recomendado que seja informado o tipo de transmissão na tela de configuração.",
        recommendation: [],
      },
    ],
    LOOSENESS: [
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O motor elétrico apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O motor elétrico apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O motor elétrico apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O motor elétrico apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O motor elétrico apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O motor elétrico apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O motor elétrico apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O motor elétrico apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O motor elétrico apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O motor elétrico apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O motor elétrico apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, rolamento (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O motor elétrico apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O motor elétrico apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O motor elétrico apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O motor elétrico apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
    ],
    GEAR_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (motor elétrico) não é coerente ao tipo de defeito em alarme (defeito de engrenamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    BEARING_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O motor elétrico apresenta sintomas de defeito nos rolamentos. Faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O motor elétrico apresenta sintomas de defeito nos rolamentos. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e do modelo do rolamento, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O tipo de mancal selecionado (deslizamento) não é coerente ao tipo de defeito em alarme (defeito em rolamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    LUBRICATION_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O motor elétrico apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Se os rolamentos possuírem lubrificação forçada por graxa, é necessário fazer uma investigação para verificar se o problema está relacionado a ausência, excesso ou qualidade da graxa;",
          "Se os rolamentos possuírem lubrificação forçada por óleo, solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O motor elétrico apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a pressão e vazão nos mancais estão de acordo com as especificações do fabricante;",
          "Solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "Para sugerir recomendações efetivas para defeitos relacionados a lubrificação, é necessário que seja preenchido o tipo de mancal na tela de configurações do ponto de coleta.",
        recommendation: [],
      },
    ],
    SLIDING_BEARING_INSTABILITY: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O tipo de mancal selecionado (rolamento) não é coerente ao tipo de defeito em alarme (instabilidade do mancal de deslizamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O motor elétrico apresenta sintomas de instabilidade do mancal de deslizamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do motor elétrico.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O motor elétrico apresenta sintomas de instabilidade do mancal de deslizamento. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do motor elétrico.",
        ],
      },
    ],
    CAVITATION: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (motor elétrico) não é coerente ao tipo de defeito em alarme (cavitação). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    AERODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (motor elétrico) não é coerente ao tipo de defeito em alarme (defeito aerodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    HYDRODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (motor elétrico) não é coerente ao tipo de defeito em alarme (defeito hidrodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    STRUCTURAL_FRAGILITY: [
      {
        transmission: null,
        bearing: null,
        description:
          "O motor elétrico apresenta sintomas de fragilidade estrutural. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a rigidez da base de fixação do motor elétrico, pode ser que ela seja muito flexível e que necessite de reforços;",
          "Verifique se a base de fixação possui trincas ou se existem parafusos soltos;",
          "Verifique a integridade dos vibra stop (se houver).",
        ],
      },
    ],
    ELECTRICAL_FAULT: [
      {
        transmission: null,
        bearing: null,
        description:
          "O motor elétrico apresenta sintomas de defeito elétrico. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco" (se houver torção da carcaça pode gerar características de defeito elétrico);',
          "Faça uma inspeção visual e termográfica na caixa de ligação procurando por deficiência de contato ou pontos de aquecimento;",
          "Megar o motor elétrico;",
          "Verificar integridade do estator e rotor (ex. trincas, pontos de aquecimento, queimados, etc..);",
          "Monitore a evolução dos sintomas do defeito.",
        ],
      },
    ],
    VELOCITY_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O motor elétrico apresenta nível global de velocidade acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    ACCELERATION_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O motor elétrico apresenta nível global de aceleração acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    TEMPERATURE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O motor elétrico apresenta nível de temperatura acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a ventilação do motor elétrico está funcionando adequadamente. Certifique-se de que o fluxo de ar esteja livre de obstruções e que o sistema de resfriamento esteja funcionando corretamente;",
          "Verifique se a carga no motor elétrico está dentro da capacidade nominal do equipamento. Sobrecarga ou subcarga pode causar aquecimento excessivo;",
          "Verifique se a tensão de alimentação está dentro dos limites especificados para o motor elétrico. Uma tensão excessiva pode causar aquecimento excessivo;",
          "Verifique se os componentes do motor elétrico, como os enrolamentos, estão em boas condições e não apresentam sinais de danos.",
        ],
      },
    ],
    ENVELOPE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O motor elétrico apresenta nível global de envelope acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
  },
  CENTRIFUGAL_PUMP: {
    UNBALANCE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A bomba centrífuga apresenta sintomas característicos de desbalanceamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do rotor da bomba centrífuga e certifique que não haja trincas ou qualquer outro dano;",
          "Solicite o balanceamento do rotor por um profissional capacitado.",
        ],
      },
    ],
    MISALIGNMENT: [
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: null,
        description:
          "A bomba centrífuga apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do acoplamento e elemento elástico (se houver);",
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Confira e corrija o alinhamento entre a bomba centrífuga e a máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (cardã) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: null,
        description:
          "A bomba centrífuga apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade das polias e correias;",
          "Verifique o tensionamento das correias;",
          "Confira e corrija o alinhamento entre as polias da bomba centrífuga e da máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (integrada) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: null,
        description:
          "A bomba centrífuga apresenta sintomas característicos de desalinhamento. Para um diagnóstico mais preciso é recomendado que seja informado o tipo de transmissão na tela de configuração.",
        recommendation: [],
      },
    ],
    LOOSENESS: [
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, rolamento (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A bomba centrífuga apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
    ],
    GEAR_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (bomba centrífuga) não é coerente ao tipo de defeito em alarme (defeito de engrenamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    BEARING_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "A bomba centrífuga apresenta sintomas de defeito nos rolamentos. Faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "A bomba centrífuga apresenta sintomas de defeito nos rolamentos. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e do modelo do rolamento, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O tipo de mancal selecionado (deslizamento) não é coerente ao tipo de defeito em alarme (defeito em rolamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    LUBRICATION_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "A bomba centrífuga apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Bomba com reservatório - verifique nível de óleo, contaminação do mesmo e sua integridade, avalie a oxidação dos rolamentos;",
          "Bomba com lubrificação forçada por graxa, é necessário fazer uma investigação para verificar se o problema está relacionado a ausência, excesso ou qualidade da graxa.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "A bomba centrífuga apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a pressão e vazão nos mancais estão de acordo com as especificações do fabricante;",
          "Solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "Para sugerir recomendações efetivas para defeitos relacionados a lubrificação, é necessário que seja preenchido o tipo de mancal na tela de configurações do ponto de coleta.",
        recommendation: [],
      },
    ],
    SLIDING_BEARING_INSTABILITY: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O tipo de mancal selecionado (rolamento) não é coerente ao tipo de defeito em alarme (instabilidade do mancal de deslizamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "A bomba centrífuga apresenta sintomas de instabilidade do mancal de deslizamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, respeitando as tolerâncias do fabricante;",
          "Avalie a pressão do óleo nos mancais de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está em conformidade com as exigências do fabricante da bomba centrífuga.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "A bomba centrífuga apresenta sintomas de instabilidade do mancal de deslizamento. Recomenda-se a seleção do tipo de mancal e a realização das seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, respeitando as tolerâncias do fabricante;",
          "Avalie a pressão do óleo nos mancais de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está em conformidade com as exigências do fabricante da bomba centrífuga.",
        ],
      },
    ],
    CAVITATION: [
      {
        transmission: null,
        bearing: null,
        description:
          "A bomba centrífuga apresenta sintomas de cavitação. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a vazão e pressão, as condições de sucção e recalque e obstrução das válvulas, pois a cavitação pode ser causada por baixa pressão de sucção ou fluxo insuficiente;",
          "Verifique a condição das pás do rotor da bomba, já que elas podem estar desgastadas ou danificadas.",
        ],
      },
    ],
    AERODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (bomba centrífuga) não é coerente ao tipo de defeito em alarme (defeito aerodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    HYDRODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A bomba centrífuga apresenta sintomas de defeito hidrodinâmico. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a vazão e pressão, as condições de sucção e recalque e obstrução das válvulas, pois a cavitação pode ser causada por baixa pressão de sucção ou fluxo insuficiente;",
          "Verifique a condição das pás do rotor da bomba, já que elas podem estar desgastadas ou danificadas.",
        ],
      },
    ],
    STRUCTURAL_FRAGILITY: [
      {
        transmission: null,
        bearing: null,
        description:
          "A bomba centrífuga apresenta sintomas de fragilidade estrutural. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a rigidez da base de fixação da máquina, pode ser que ela seja muito flexível e que necessite de reforços;",
          "Verifique se a base de fixação possui trincas ou se existem parafusos soltos;",
          "Verifique a integridade dos vibra stop (se houver).",
        ],
      },
    ],
    ELECTRICAL_FAULT: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (bomba centrífuga) não é coerente ao tipo de defeito em alarme (defeito elétrico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    VELOCITY_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A bomba centrífuga apresenta nível global de velocidade acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    ACCELERATION_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A bomba centrífuga apresenta nível global de aceleração acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    TEMPERATURE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A bomba centrífuga apresenta nível de temperatura acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Certifique-se que não houve variação de fluido no processo;",
          "Verifique se a bomba está funcionando sem líquido suficiente ou se existe ar na linha de sucção;",
          "Verifique se a bomba está trabalhando acima de sua capacidade.",
        ],
      },
    ],
    ENVELOPE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A bomba centrífuga apresenta nível global de envelope acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
  },
  FAN: {
    UNBALANCE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O ventilador/exaustor apresenta sintomas característicos de desbalanceamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do rotor e certifique que não haja incrustações, desgaste, trincas ou qualquer outro dano;",
          "Solicite o balanceamento do rotor por um profissional capacitado.",
        ],
      },
    ],
    MISALIGNMENT: [
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: null,
        description:
          "O ventilador/exaustor apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do acoplamento e elemento elástico (se houver);",
          "Verifique a fixação dos pés das máquinas e/ou 'pé manco';",
          "Confira e corrija o alinhamento entre o ventilador/exaustor e a máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (cardã) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: null,
        description:
          "O ventilador/exaustor apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade das polias e correias;",
          "Verifique o tensionamento das correias;",
          "Confira e corrija o alinhamento entre as polias do ventilador/exaustor e da máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (integrada) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: null,
        description:
          "O ventilador/exaustor apresenta sintomas característicos de desalinhamento. Para um diagnóstico mais preciso é recomendado que seja informado o tipo de transmissão na tela de configuração.",
        recommendation: [],
      },
    ],
    LOOSENESS: [
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, rolamento (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O ventilador/exaustor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
    ],
    GEAR_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (ventilador/exaustor) não é coerente ao tipo de defeito em alarme (defeito de engrenamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    BEARING_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O ventilador/exaustor apresenta sintomas de defeito nos rolamentos. Faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O ventilador/exaustor apresenta sintomas de defeito nos rolamentos. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e do modelo do rolamento, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O tipo de mancal selecionado (deslizamento) não é coerente ao tipo de defeito em alarme (defeito em rolamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    LUBRICATION_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O ventilador/exaustor apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Se os rolamentos possuírem lubrificação forçada por graxa, é necessário fazer uma investigação para verificar se o problema está relacionado a ausência, excesso ou qualidade da graxa;",
          "Se os rolamentos possuírem lubrificação forçada por óleo, solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O ventilador/exaustor apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a pressão e vazão nos mancais estão de acordo com as especificações do fabricante;",
          "Solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "Para sugerir recomendações efetivas para defeitos relacionados a lubrificação, é necessário que seja preenchido o tipo de mancal na tela de configurações do ponto de coleta.",
        recommendation: [],
      },
    ],
    SLIDING_BEARING_INSTABILITY: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O tipo de mancal selecionado (rolamento) não é coerente ao tipo de defeito em alarme (instabilidade do mancal de deslizamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O ventilador/exaustor apresenta sintomas de instabilidade do mancal de deslizamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do ventilador/exaustor.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O ventilador/exaustor apresenta sintomas de instabilidade do mancal de deslizamento. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do ventilador/exaustor.",
        ],
      },
    ],
    AERODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O ventilador/exaustor apresenta sintomas de defeito aerodinâmico. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existem restrições no duto do ventilador/exaustor;",
          "Verifique a condição das pás do rotor do ventilador/exaustor, já que elas podem estar desgastadas ou danificadas.",
        ],
      },
    ],
    HYDRODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (ventilador/exaustor) não é coerente ao tipo de defeito em alarme (defeito hidrodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    STRUCTURAL_FRAGILITY: [
      {
        transmission: null,
        bearing: null,
        description:
          "O ventilador/exaustor apresenta sintomas de fragilidade estrutural. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a rigidez da base de fixação dos mancais, pode ser que ela seja muito flexível e que necessite de reforços;",
          "Verifique se a base de fixação possui trincas ou se existem parafusos soltos;",
          "Verifique a integridade dos vibra stop (se houver).",
        ],
      },
    ],
    ELECTRICAL_FAULT: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (ventilador/exaustor) não é coerente ao tipo de defeito em alarme (defeito elétrico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    VELOCITY_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O ventilador/exaustor apresenta nível global de velocidade acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    ACCELERATION_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O ventilador/exaustor apresenta nível global de aceleração acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    TEMPERATURE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O ventilador/exaustor apresenta nível de temperatura acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se os rolamentos estão bem lubrificados;",
          "Verifique o fluxo de ar e certifique que não haja obstruções que façam com que o rotor esteja operando com sobrecarga.",
        ],
      },
    ],
    ENVELOPE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O ventilador/exaustor apresenta nível global de envelope acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
  },
  STEAM_TURBINE: {
    UNBALANCE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A turbina a vapor apresenta sintomas característicos de desbalanceamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se houve variações no processo que possam ter gerado arraste e deslocamento do rotor que possam comprometer sua integridade, trincas ou qualquer outro dano nas palhetas;",
          "Verifique a integridade e folga excessiva dos mancais;",
          "Solicite o balanceamento do rotor por um profissional capacitado.",
        ],
      },
    ],
    MISALIGNMENT: [
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: null,
        description:
          "A turbina a vapor apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do acoplamento e elemento elástico (se houver);",
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Confira e corrija o alinhamento entre a turbina a vapor e a máquina movida.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (cardã) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: null,
        description:
          "A turbina a vapor apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade das polias e correias;",
          "Verifique o tensionamento das correias;",
          "Confira e corrija o alinhamento entre as polias da turbina a vapor e da máquina movida.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (integrada) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: null,
        description:
          "A turbina a vapor apresenta sintomas característicos de desalinhamento. Para um diagnóstico mais preciso é recomendado que seja informado o tipo de transmissão na tela de configuração.",
        recommendation: [],
      },
    ],
    LOOSENESS: [
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[1],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[2],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, rolamento (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[0],
        description:
          "A turbina a vapor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
    ],
    GEAR_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (turbina a vapor) não é coerente ao tipo de defeito em alarme (defeito de engrenamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    BEARING_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "A turbina a vapor apresenta sintomas de defeito nos rolamentos. Faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "A turbina a vapor apresenta sintomas de defeito nos rolamentos. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e do modelo do rolamento, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O tipo de mancal selecionado (deslizamento) não é coerente ao tipo de defeito em alarme (defeito em rolamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    LUBRICATION_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "A turbina a vapor apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Se os rolamentos possuírem lubrificação forçada por óleo, solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "A turbina a vapor apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a pressão e vazão nos mancais estão de acordo com as especificações do fabricante;",
          "Solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "Para sugerir recomendações efetivas para defeitos relacionados a lubrificação, é necessário que seja preenchido o tipo de mancal na tela de configurações do ponto de coleta.",
        recommendation: [],
      },
    ],
    SLIDING_BEARING_INSTABILITY: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O tipo de mancal selecionado (rolamento) não é coerente ao tipo de defeito em alarme (instabilidade do mancal de deslizamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "A turbina a vapor apresenta sintomas de instabilidade do mancal de deslizamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante da turbina a vapor.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "A turbina a vapor apresenta sintomas de instabilidade do mancal de deslizamento. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante da turbina a vapor.",
        ],
      },
    ],
    AERODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (turbina a vapor) não é coerente ao tipo de defeito em alarme (defeito aerodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    HYDRODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (turbina a vapor) não é coerente ao tipo de defeito em alarme (defeito hidrodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    STRUCTURAL_FRAGILITY: [
      {
        transmission: null,
        bearing: null,
        description:
          "A turbina a vapor apresenta sintomas de fragilidade estrutural. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a rigidez da base de fixação dos mancais, pode ser que ela seja muito flexível e que necessite de reforços;",
          "Verifique se a base de fixação possui trincas ou se existem parafusos soltos;",
          "Verifique a integridade dos vibra stop (se houver).",
        ],
      },
    ],
    ELECTRICAL_FAULT: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (turbina a vapor) não é coerente ao tipo de defeito em alarme (defeito elétrico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    VELOCITY_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A turbina a vapor apresenta nível global de velocidade acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    ACCELERATION_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A turbina a vapor apresenta nível global de aceleração acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    TEMPERATURE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A turbina a vapor apresenta nível de temperatura acima do alarme. Faça as seguintes verificações:",
        recommendation: ["Verifique se os rolamentos estão bem lubrificados."],
      },
    ],
    ENVELOPE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "A turbina a vapor apresenta nível global de envelope acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
  },
  REDUCER: {
    UNBALANCE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O redutor apresenta sintomas característicos de desbalanceamento. Faça as seguintes verificações:",
        recommendation: [
          "A característica de desbalanceamento em redutores pode ser da própria engrenagem ou então de polias, discos, ou outros elementos mecânicos que estejam acoplados ao eixo do redutor;",
          "Verifique se esses componentes mecânicos apresentam algum tipo de desgaste ou avarias que possam apresentar desbalanceamento em sua operação.",
        ],
      },
    ],
    MISALIGNMENT: [
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: null,
        description:
          "O redutor apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do acoplamento e elemento elástico (se houver);",
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Confira e corrija o alinhamento entre o redutor e a máquina acoplada.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (cardã) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: null,
        description:
          "O redutor apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade das polias e correias;",
          "Verifique o tensionamento das correias;",
          "Confira e corrija o alinhamento entre as polias do redutor e da máquina acoplada.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (integrada) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: null,
        description:
          "O redutor apresenta sintomas característicos de desalinhamento. Para um diagnóstico mais preciso é recomendado que seja informado o tipo de transmissão na tela de configuração.",
        recommendation: [],
      },
    ],
    LOOSENESS: [
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O redutor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O redutor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O redutor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O redutor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O redutor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O redutor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O redutor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O redutor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O redutor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O redutor apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O redutor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, rolamento (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O redutor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O redutor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:S:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O redutor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O redutor apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
    ],
    GEAR_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O redutor apresenta sintomas de defeito de engrenamento. Faça as seguintes verificações:",
        recommendation: [
          "Monitorar periodicamente a evolução dos sintomas do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade;",
          "Procurar empresa especializada no reparo de redutores.",
        ],
      },
    ],
    BEARING_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O redutor apresenta sintomas de defeito nos rolamentos. Faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description: ":",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O tipo de mancal selecionado (deslizamento) não é coerente ao tipo de defeito em alarme (defeito em rolamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    LUBRICATION_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O redutor apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Se os rolamentos possuírem lubrificação forçada por graxa, é necessário fazer uma investigação para verificar se o problema está relacionado a ausência, excesso ou qualidade da graxa;",
          "Se os rolamentos possuírem lubrificação forçada por óleo, solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante. Avalie tambem o sistema de resfiramento de óleo (se houver) quanto a pressão da linha e eficiencia do trocador de calor.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O redutor apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a pressão e vazão nos mancais estão de acordo com as especificações do fabricante;",
          "Solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante. Avalie tambem o sistema de resfiramento de óleo (se houver) quanto a pressão da linha e eficiencia do trocador de calor S.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "Para sugerir recomendações efetivas para defeitos relacionados a lubrificação, é necessário que seja preenchido o tipo de mancal na tela de configurações do ponto de coleta.",
        recommendation: [],
      },
    ],
    SLIDING_BEARING_INSTABILITY: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O tipo de mancal selecionado (rolamento) não é coerente ao tipo de defeito em alarme (instabilidade do mancal de deslizamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O redutor apresenta sintomas de instabilidade do mancal de deslizamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do redutor.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O redutor apresenta sintomas de instabilidade do mancal de deslizamento. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do redutor.",
        ],
      },
    ],
    AERODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (redutor) não é coerente ao tipo de defeito em alarme (defeito aerodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    HYDRODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (redutor) não é coerente ao tipo de defeito em alarme (defeito hidrodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    STRUCTURAL_FRAGILITY: [
      {
        transmission: null,
        bearing: null,
        description:
          "O redutor apresenta sintomas de fragilidade estrutural. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a rigidez da base de fixação dos mancais, pode ser que ela seja muito flexível e que necessite de reforços;",
          "Verifique se a base de fixação possui trincas ou se existem parafusos soltos;",
          "Verifique a integridade dos vibra stop (se houver).",
        ],
      },
    ],
    ELECTRICAL_FAULT: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (redutor) não é coerente ao tipo de defeito em alarme (defeito elétrico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    VELOCITY_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O redutor apresenta nível global de velocidade acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    ACCELERATION_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O redutor apresenta nível global de aceleração acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    TEMPERATURE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O redutor apresenta nível de temperatura acima do alarme. Faça as seguintes verificações:",
        recommendation: ["Verifique se os rolamentos estão bem lubrificados."],
      },
    ],
    ENVELOPE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O redutor apresenta nível global de envelope acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
  },
  GENERATOR: {
    UNBALANCE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O gerador apresenta sintomas característicos de desbalanceamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a ventoinha do gerador apresenta desequilíbrio de massa;",
          "Uma situação mais rara, porém possível, é que o rotor do próprio gerador esteja desbalanceado;",
          "Solicite o balanceamento do rotor por um profissional capacitado.",
        ],
      },
    ],
    MISALIGNMENT: [
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: null,
        description:
          "O gerador apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do acoplamento e elemento elástico (se houver);",
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Confira e corrija o alinhamento entre o gerador e a máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (cardã) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: null,
        description:
          "O gerador apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade das polias e correias;",
          "Verifique o tensionamento das correias;",
          "Confira e corrija o alinhamento entre as polias do gerador e da máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (integrada) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: null,
        description:
          "O gerador apresenta sintomas característicos de desalinhamento. Para um diagnóstico mais preciso é recomendado que seja informado o tipo de transmissão na tela de configuração.",
        recommendation: [],
      },
    ],
    LOOSENESS: [
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O gerador apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O gerador apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O gerador apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O gerador apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O gerador apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O gerador apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O gerador apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O gerador apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O gerador apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O gerador apresenta sintomas de folga. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O gerador apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, rolamento (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O gerador apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O gerador apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O gerador apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O gerador apresenta sintomas de folga. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
    ],
    GEAR_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (gerador) não é coerente ao tipo de defeito em alarme (defeito de engrenamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    BEARING_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O gerador apresenta sintomas de defeito nos rolamentos. Faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O gerador apresenta sintomas de defeito nos rolamentos. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e do modelo do rolamento, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O tipo de mancal selecionado (deslizamento) não é coerente ao tipo de defeito em alarme (defeito em rolamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    LUBRICATION_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O gerador apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Se os rolamentos possuírem lubrificação forçada por graxa, é necessário fazer uma investigação para verificar se o problema está relacionado a ausência, excesso ou qualidade da graxa;",
          "Se os rolamentos possuírem lubrificação forçada por óleo, solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O gerador apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a pressão e vazão nos mancais estão de acordo com as especificações do fabricante;",
          "Solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "Para sugerir recomendações efetivas para defeitos relacionados a lubrificação, é necessário que seja preenchido o tipo de mancal na tela de configurações do ponto de coleta.",
        recommendation: [],
      },
    ],
    SLIDING_BEARING_INSTABILITY: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O tipo de mancal selecionado (rolamento) não é coerente ao tipo de defeito em alarme (instabilidade do mancal de deslizamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O gerador apresenta sintomas de instabilidade do mancal de deslizamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do gerador.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O gerador apresenta sintomas de instabilidade do mancal de deslizamento. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do gerador.",
        ],
      },
    ],
    CAVITATION: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (gerador) não é coerente ao tipo de defeito em alarme (cavitação). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    AERODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (gerador) não é coerente ao tipo de defeito em alarme (defeito aerodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    HYDRODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (gerador) não é coerente ao tipo de defeito em alarme (defeito hidrodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    STRUCTURAL_FRAGILITY: [
      {
        transmission: null,
        bearing: null,
        description:
          "O gerador apresenta sintomas de fragilidade estrutural. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a rigidez da base de fixação do gerador, pode ser que ela seja muito flexível e que necessite de reforços;",
          "Verifique se a base de fixação possui trincas ou se existem parafusos soltos;",
          "Verifique a integridade dos vibra stop (se houver).",
        ],
      },
    ],
    ELECTRICAL_FAULT: [
      {
        transmission: null,
        bearing: null,
        description:
          "O gerador apresenta sintomas de defeito elétrico. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos pés das máquinas e/ou "pé manco" (se houver torção da carcaça pode gerar características de defeito elétrico);',
          "Realizar uma peritagem elétrica;",
          "Monitore a evolução dos sintomas do defeito.",
        ],
      },
    ],
    VELOCITY_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O gerador apresenta nível global de velocidade acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    ACCELERATION_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O gerador apresenta nível global de aceleração acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    TEMPERATURE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O gerador apresenta nível de temperatura acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se o sistema de refrigeração do Gerador está funcionando adequadamente;",
          "Verifique se o sistema de lubrificação do Gerador está funcionando adequadamente.",
        ],
      },
    ],
    ENVELOPE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O gerador apresenta nível global de envelope acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
  },
  ROTORS: {
    UNBALANCE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta sintomas de desbalanceamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do rotor e certifique que não haja desgaste, trincas ou qualquer outro dano;",
          "Verifique a integridade dos mancais;",
          "Solicite o balanceamento do rotor por um profissional capacitado.",
        ],
      },
    ],
    MISALIGNMENT: [
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: null,
        description:
          "O equipamento apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do acoplamento e elemento elástico (se houver);",
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Confira e corrija o alinhamento entre o equipamento e a máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (cardã) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: null,
        description:
          "O equipamento apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade das polias e correias;",
          "Verifique o tensionamento das correias;",
          "Confira e corrija o alinhamento entre as polias do equipamento e da máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (integrada) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: null,
        description:
          "O equipamento apresenta sintomas característicos de desalinhamento. Para um diagnóstico mais preciso é recomendado que seja informado o tipo de transmissão na tela de configuração.",
        recommendation: [],
      },
    ],
    LOOSENESS: [
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, rolamento (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
    ],
    GEAR_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (rotores em geral) não é coerente ao tipo de defeito em alarme (defeito de engrenamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    BEARING_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de defeito nos rolamentos. Faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de defeito nos rolamentos. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e do modelo do rolamento, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O tipo de mancal selecionado (deslizamento) não é coerente ao tipo de defeito em alarme (defeito em rolamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    LUBRICATION_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Se os rolamentos possuírem lubrificação forçada por graxa, é necessário fazer uma investigação para verificar se o problema está relacionado a ausência, excesso ou qualidade da graxa;",
          "Se os rolamentos possuírem lubrificação forçada por óleo, solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a pressão e vazão nos mancais estão de acordo com as especificações do fabricante;",
          "Solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "Para sugerir recomendações efetivas para defeitos relacionados a lubrificação, é necessário que seja preenchido o tipo de mancal na tela de configurações do ponto de coleta.",
        recommendation: [],
      },
    ],
    SLIDING_BEARING_INSTABILITY: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O tipo de mancal selecionado (rolamento) não é coerente ao tipo de defeito em alarme (instabilidade do mancal de deslizamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de instabilidade do mancal de deslizamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do equipamento.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de instabilidade do mancal de deslizamento. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do equipamento.",
        ],
      },
    ],
    AERODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (rotores em geral) não é coerente ao tipo de defeito em alarme (defeito aerodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    HYDRODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (rotores em geral) não é coerente ao tipo de defeito em alarme (defeito hidrodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    STRUCTURAL_FRAGILITY: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta sintomas de fragilidade estrutural. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a rigidez da base de fixação dos mancais, pode ser que ela seja muito flexível e que necessite de reforços;",
          "Verifique se a base de fixação possui trincas ou se existem parafusos soltos;",
          "Verifique a integridade dos vibra stop (se houver).",
        ],
      },
    ],
    ELECTRICAL_FAULT: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (rotores em geral) não é coerente ao tipo de defeito em alarme (defeito elétrico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    VELOCITY_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta nível global de velocidade acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    ACCELERATION_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta nível global de aceleração acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    TEMPERATURE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta nível de temperatura acima do alarme. Faça as seguintes verificações:",
        recommendation: ["Verifique se os rolamentos estão bem lubrificados."],
      },
    ],
    ENVELOPE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta nível global de envelope acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
  },
  OTHERS: {
    UNBALANCE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta sintomas de desbalanceamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do rotor e certifique que não haja desgaste, trincas ou qualquer outro dano;",
          "Verifique a integridade dos mancais;",
          "Solicite o balanceamento do rotor por um profissional capacitado.",
        ],
      },
    ],
    MISALIGNMENT: [
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: null,
        description:
          "O equipamento apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade do acoplamento e elemento elástico (se houver);",
          'Verifique a fixação dos pés das máquinas e/ou "pé manco";',
          "Confira e corrija o alinhamento entre o equipamento e a máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (cardã) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: null,
        description:
          "O equipamento apresenta sintomas característicos de desalinhamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a integridade das polias e correias;",
          "Verifique o tensionamento das correias;",
          "Confira e corrija o alinhamento entre as polias do equipamento e da máquina motora.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: null,
        description:
          "O tipo de transmissão selecionado (integrada) não é coerente ao tipo de defeito em alarme (desalinhamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: null,
        description:
          "O equipamento apresenta sintomas característicos de desalinhamento. Para um diagnóstico mais preciso é recomendado que seja informado o tipo de transmissão na tela de configuração.",
        recommendation: [],
      },
    ],
    LOOSENESS: [
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos; como eixo/mancal, chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[0],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo/mancal, rolamento (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[2],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[1],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se a tensão da correia está correta. A correia solta ou tensa demais pode causar vibrações excessivas que podem levar à folga mecânica;",
          "Verifique se existem folgas na fixação entre a polia e o eixo.",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[4],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças;",
          "Verifique se existem folgas excessivas no acoplamento e a integridade do elemento elástico (se houver);",
          "Verifique se existem folgas na fixação entre o eixo e o acoplamento (chaveta).",
        ],
      },
      {
        transmission: TRANSMISSION_DICTIONARY[3],
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de folga mecânica. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e transmissão, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          'Verifique a fixação dos mancais e/ou "pé manco";',
          "Verifique dimensional e folga excessiva dos componentes internos como eixo, rolamentos (se houver), chavetas ou outros componentes mecânicos. Se houver folga excessiva, será necessário ajustar ou substituir essas peças.",
        ],
      },
    ],
    GEAR_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (outros) não é coerente ao tipo de defeito em alarme (defeito de engrenamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    BEARING_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de defeito nos rolamentos. Faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de defeito nos rolamentos. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal e do modelo do rolamento, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Acompanhar a evolução do defeito;",
          "Verificar disponibilidade de peças de reposição;",
          "Programar inspeção, avaliar condições e integridade e substituir os rolamentos se necessário.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O tipo de mancal selecionado (deslizamento) não é coerente ao tipo de defeito em alarme (defeito em rolamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    LUBRICATION_FAILURE: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O equipamento apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Se os rolamentos possuírem lubrificação forçada por graxa, é necessário fazer uma investigação para verificar se o problema está relacionado a ausência, excesso ou qualidade da graxa;",
          "Se os rolamentos possuírem lubrificação forçada por óleo, solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de defeito de lubrificação. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se a pressão e vazão nos mancais estão de acordo com as especificações do fabricante;",
          "Solicite uma análise de óleo para verificar a qualidade e eficiência do lubrificante.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "Para sugerir recomendações efetivas para defeitos relacionados a lubrificação, é necessário que seja preenchido o tipo de mancal na tela de configurações do ponto de coleta.",
        recommendation: [],
      },
    ],
    SLIDING_BEARING_INSTABILITY: [
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[1],
        description:
          "O tipo de mancal selecionado (rolamento) não é coerente ao tipo de defeito em alarme (instabilidade do mancal de deslizamento). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[2],
        description:
          "O equipamento apresenta sintomas de instabilidade do mancal de deslizamento. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do equipamento.",
        ],
      },
      {
        transmission: null,
        bearing: BEARING_DICTIONARY[0],
        description:
          "O equipamento apresenta sintomas de instabilidade do mancal de deslizamento. Para um diagnóstico mais adequado, recomenda-se a seleção do tipo de mancal, de qualquer maneira faça as seguintes verificações:",
        recommendation: [
          "Verifique a folga entre o mancal de deslizamento e eixo, as tolerâncias devem ser respeitadas de acordo com a especificação do fabricante;",
          "Avalie se a pressão do óleo nos mancais está de acordo com a especificação do fabricante;",
          "Verifique se a especificação do óleo está de acordo com as exigências do fabricante do equipamento.",
        ],
      },
    ],
    AERODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (outros) não é coerente ao tipo de defeito em alarme (defeito aerodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    HYDRODYNAMIC_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (outros) não é coerente ao tipo de defeito em alarme (defeito hidrodinâmico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    STRUCTURAL_FRAGILITY: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta sintomas de fragilidade estrutural. Faça as seguintes verificações:",
        recommendation: [
          "Verifique a rigidez da base de fixação dos mancais, pode ser que ela seja muito flexível e que necessite de reforços;",
          "Verifique se a base de fixação possui trincas ou se existem parafusos soltos;",
          "Verifique a integridade dos vibra stop (se houver).",
        ],
      },
    ],
    ELECTRICAL_FAULT: [
      {
        transmission: null,
        bearing: null,
        description:
          "O tipo de máquina selecionado (outros) não é coerente ao tipo de defeito em alarme (defeito elétrico). Corrija as configurações do ponto de coleta ou se necessário entre em contato com nosso suporte técnico.",
        recommendation: [],
      },
    ],
    VELOCITY_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta nível global de velocidade acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    ACCELERATION_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta nível global de aceleração acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
    TEMPERATURE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta nível de temperatura acima do alarme. Faça as seguintes verificações:",
        recommendation: ["Verifique se os rolamentos estão bem lubrificados."],
      },
    ],
    ENVELOPE_FAILURE: [
      {
        transmission: null,
        bearing: null,
        description:
          "O equipamento apresenta nível global de envelope acima do alarme. Faça as seguintes verificações:",
        recommendation: [
          "Verifique se existe alguma condição operacional que possa ter acionado o alarme;",
          "Analise os espectros para um diagnóstico mais preciso.",
        ],
      },
    ],
  },
};
