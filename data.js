window.STUDY_DATA = (() => {
  const refs = {
    resumo: "Sistema distribuidos.pdf",
    completo: "Sistema_distribuidos_COMPLETO_25_questoes.pdf"
  };

  const baseQuestions = [
    {
      topic: "Sistema distribuido",
      prompt: "O que e um sistema distribuido?",
      correct: "Varios computadores conectados trabalham juntos e dividem tarefas, podendo parecer um unico sistema para o usuario.",
      wrong: [
        "Um unico computador central executa todas as tarefas sem comunicacao com outras maquinas.",
        "Um programa local que roda apenas em uma maquina e nao compartilha recursos.",
        "Um tipo de criptografia usado apenas para proteger paginas HTTPS.",
        "Um banco de dados que nao permite concorrencia nem comunicacao em rede."
      ],
      remember: "Distribuido = varias maquinas trabalhando juntas."
    },
    {
      topic: "Cliente-servidor e P2P",
      prompt: "Qual alternativa diferencia corretamente cliente-servidor e P2P?",
      correct: "No cliente-servidor, o cliente pede e o servidor responde; no P2P, os nos podem pedir e servir recursos entre si.",
      wrong: [
        "No P2P existe obrigatoriamente um servidor central para toda operacao.",
        "No cliente-servidor todos os computadores possuem sempre o mesmo papel.",
        "Cliente-servidor elimina comunicacao em rede; P2P usa apenas memoria local.",
        "P2P e cliente-servidor sao exatamente o mesmo modelo."
      ],
      remember: "Cliente-servidor = cliente pede, servidor serve. P2P = ambos podem pedir e servir."
    },
    {
      topic: "Desafios",
      prompt: "Qual grupo apresenta desafios tipicos de sistemas distribuidos?",
      correct: "Sincronizacao, concorrencia, falhas, seguranca e comunicacao pela rede.",
      wrong: [
        "Apenas formatacao de tela, escolha de fonte e impressao de relatorios.",
        "Somente heranca, encapsulamento e polimorfismo.",
        "Apenas calculos locais sem falhas, sem rede e sem concorrencia.",
        "Somente armazenamento em um unico ponto central sem comunicacao."
      ],
      remember: "Desafios = coordenar, controlar, resolver falhas, proteger e comunicar."
    },
    {
      topic: "Arquiteturas",
      prompt: "Qual associacao sobre arquiteturas de sistemas distribuidos esta correta?",
      correct: "Camadas separam funcoes; nuvem usa recursos pela rede; objetos interagem; eventos geram reacoes.",
      wrong: [
        "Camadas elegem coordenador; nuvem significa ausencia total de rede.",
        "Arquitetura baseada em eventos executa apenas um processo local sem comunicacao.",
        "Objetos servem apenas para balancear carga entre servidores.",
        "Nuvem significa depender somente de uma maquina fisica local."
      ],
      remember: "Camadas = separar; nuvem = rede; objetos = interagir; eventos = reagir."
    },
    {
      topic: "Processos",
      prompt: "Como o material define processo?",
      correct: "Um programa em execucao que possui seu proprio espaco de memoria.",
      wrong: [
        "Uma tarefa dentro de outro processo que sempre compartilha memoria.",
        "Um pacote perdido durante a comunicacao TCP/IP.",
        "Um algoritmo de consenso usado para eleger lider.",
        "Uma copia de dados mantida em CDN."
      ],
      remember: "Processo = programa rodando + memoria propria."
    },
    {
      topic: "Threads",
      prompt: "Qual e a principal caracteristica de uma thread?",
      correct: "E uma tarefa dentro de um processo e compartilha a memoria desse processo com outras threads.",
      wrong: [
        "Sempre possui memoria totalmente separada de qualquer processo.",
        "Substitui o TCP e garante entrega ordenada dos pacotes.",
        "Serve apenas para criptografar comunicacao HTTPS.",
        "E uma maquina independente dentro de um sistema P2P."
      ],
      remember: "Thread = tarefa dentro do processo + memoria compartilhada."
    },
    {
      topic: "Processos x Threads",
      prompt: "Qual diferenca entre processos e threads deve ser lembrada?",
      correct: "Processos possuem memoria separada; threads do mesmo processo compartilham memoria.",
      wrong: [
        "Processos compartilham memoria sempre; threads nunca compartilham memoria.",
        "Processos so existem em nuvem; threads so existem em sistemas centralizados.",
        "Threads sao protocolos de rede e processos sao portas TCP.",
        "Nao existe diferenca pratica entre processo e thread."
      ],
      remember: "Processo separa memoria; thread compartilha memoria."
    },
    {
      topic: "IPC",
      prompt: "O que e IPC em sistemas distribuidos?",
      correct: "E a forma usada para dois ou mais processos se comunicarem e trocarem informacoes.",
      wrong: [
        "Um mecanismo exclusivo para criptografar paginas HTTPS.",
        "Uma tecnica para impedir qualquer comunicacao entre processos.",
        "Um algoritmo que sempre escolhe o maior ID como coordenador.",
        "Um tipo de cache usado para reduzir latencia em CDN."
      ],
      remember: "IPC = comunicacao entre processos."
    },
    {
      topic: "TCP e UDP",
      prompt: "Qual alternativa compara corretamente TCP e UDP?",
      correct: "TCP prioriza entrega correta e em ordem; UDP tem menor controle, menor sobrecarga e mais rapidez.",
      wrong: [
        "UDP garante entrega correta e ordenada, enquanto TCP nao oferece confiabilidade.",
        "TCP e UDP sao mecanismos de exclusao mutua para regiao critica.",
        "UDP so funciona com memoria compartilhada e TCP so funciona com semaforos.",
        "TCP e UDP sao algoritmos de consenso como Paxos e Raft."
      ],
      remember: "TCP = confianca. UDP = rapidez."
    },
    {
      topic: "RPC",
      prompt: "Para que serve RPC (Remote Procedure Call)?",
      correct: "Permite que um programa chame uma funcao que esta em outro computador pela rede.",
      wrong: [
        "Permite que apenas um processo acesse um recurso por vez.",
        "Divide conteudo em pontos proximos ao usuario final.",
        "Detecta ciclos de espera em deadlock automaticamente.",
        "Converte uma thread em processo com memoria propria."
      ],
      remember: "RPC = chamar funcao de longe."
    },
    {
      topic: "Comunicacao sincrona e assincrona",
      prompt: "Qual e a diferenca entre comunicacao sincrona e assincrona?",
      correct: "Na sincrona, a solicitacao espera resposta; na assincrona, a tarefa continua sem esperar naquele momento.",
      wrong: [
        "Na assincrona sempre ha bloqueio ate a resposta chegar.",
        "Na sincrona nunca existe espera por resposta.",
        "Ambas impedem comunicacao entre maquinas diferentes.",
        "Sincrona e apenas para UDP; assincrona e apenas para TLS."
      ],
      remember: "Sincrona = espera. Assincrona = nao espera."
    },
    {
      topic: "Concorrencia e corrida",
      prompt: "Quando ocorre uma condicao de corrida?",
      correct: "Quando varias tarefas acessam ou alteram o mesmo dado ao mesmo tempo e o resultado depende da ordem de execucao.",
      wrong: [
        "Quando um usuario acessa um site HTTPS com TLS.",
        "Quando todos os processos concordam com um valor por consenso.",
        "Quando os dados ficam em cache para reduzir latencia.",
        "Quando um processo possui memoria separada de outro."
      ],
      remember: "Concorrencia sem controle pode gerar resultado inconsistente."
    },
    {
      topic: "Mutex, semaforo e monitor",
      prompt: "Qual alternativa esta correta sobre mutex, semaforo e monitor?",
      correct: "Mutex permite um por vez; semaforo controla quantos acessam; monitor organiza o acesso protegido.",
      wrong: [
        "Mutex e usado para CDN; semaforo e usado para TLS; monitor e usado para IP.",
        "Semaforo sempre permite acesso ilimitado a todos os processos.",
        "Monitor elimina a necessidade de qualquer sincronizacao.",
        "Mutex escolhe coordenador pelo maior ID ativo."
      ],
      remember: "Mutex = um. Semaforo = quantidade. Monitor = acesso organizado."
    },
    {
      topic: "Deadlock",
      prompt: "O que e deadlock?",
      correct: "Processos ficam esperando recursos uns dos outros e nenhum consegue continuar.",
      wrong: [
        "Conteudo fica mais perto do usuario para reduzir atraso.",
        "Uma operacao repetida nao gera efeito duplicado.",
        "O TCP organiza a entrega e o IP endereca pacotes.",
        "Uma thread compartilha memoria dentro do processo."
      ],
      remember: "Deadlock = todos esperando, ninguem continua."
    },
    {
      topic: "Lamport e relogios vetoriais",
      prompt: "Qual alternativa compara corretamente Lamport e relogios vetoriais?",
      correct: "Lamport usa numeros logicos para ordenar eventos; relogios vetoriais identificam melhor relacoes entre eventos e concorrencia.",
      wrong: [
        "Lamport criptografa dados e relogio vetorial e um tipo de CDN.",
        "Relogio vetorial sempre substitui TCP e UDP.",
        "Lamport e uma tecnica de rollback de transacoes.",
        "Ambos servem apenas para armazenar arquivos em cache."
      ],
      remember: "Lamport ordena; vetorial ajuda a enxergar causalidade e concorrencia."
    },
    {
      topic: "Coordenador, Bully e barreiras",
      prompt: "Qual alternativa descreve coordenador, Bully e barreira?",
      correct: "Coordenador organiza tarefas; Bully elege novo coordenador; barreira faz participantes esperarem todos chegarem.",
      wrong: [
        "Coordenador criptografa dados; Bully reduz latencia; barreira faz rollback.",
        "Bully e um protocolo de transporte para entrega ordenada.",
        "Barreira e uma tecnica para duplicar cobrancas sem controle.",
        "Coordenador e sempre uma CDN geografica."
      ],
      remember: "Bully escolhe coordenador; barreira sincroniza ponto de espera."
    },
    {
      topic: "Retry e replicacao",
      prompt: "Como retry e replicacao ajudam na tolerancia a falhas?",
      correct: "Retry tenta executar novamente apos falha; replicacao mantem copias de dados ou servicos.",
      wrong: [
        "Retry impede concorrencia e replicacao e um algoritmo de criptografia.",
        "Retry e a porta de rede; replicacao e o endereco IP.",
        "Retry e usado apenas para formatar respostas na tela.",
        "Replicacao significa apagar todas as copias para evitar disponibilidade."
      ],
      remember: "Retry = tentar de novo. Replicacao = ter copias."
    },
    {
      topic: "Checkpointing, logs e monitoramento",
      prompt: "Qual alternativa esta correta?",
      correct: "Checkpoint salva estado; logs registram eventos; monitoramento acompanha funcionamento e identifica problemas.",
      wrong: [
        "Checkpoint e um protocolo UDP; logs sao semaforos; monitoramento e um algoritmo Bully.",
        "Logs impedem qualquer recuperacao de falhas.",
        "Monitoramento serve para eliminar a necessidade de observar erros.",
        "Checkpointing e apenas troca de mensagens entre clientes P2P."
      ],
      remember: "Checkpoint = salvar. Logs = registrar. Monitoramento = observar."
    },
    {
      topic: "Balanceamento e escalabilidade",
      prompt: "Qual e a relacao entre balanceamento de carga e escalabilidade?",
      correct: "Balanceamento divide solicitacoes entre servidores; escalabilidade aumenta recursos para atender maior demanda.",
      wrong: [
        "Balanceamento e criptografia; escalabilidade e uma thread local.",
        "Escalabilidade significa reduzir todos os servidores para um unico ponto.",
        "Balanceamento impede crescimento do sistema.",
        "Ambos servem apenas para detectar deadlock."
      ],
      remember: "Balanceamento = dividir trabalho. Escalabilidade = crescer."
    },
    {
      topic: "SSL/TLS",
      prompt: "Para que serve SSL/TLS?",
      correct: "Protege os dados durante a comunicacao pela rede, principalmente por meio de criptografia.",
      wrong: [
        "Elege coordenador pelo maior ID ativo.",
        "Controla quantas tarefas acessam um recurso compartilhado.",
        "Salva checkpoint para recuperar execucao.",
        "Garante que apenas uma thread exista no sistema."
      ],
      remember: "SSL/TLS = proteger comunicacao."
    },
    {
      topic: "Centralizado x distribuido",
      prompt: "Qual alternativa diferencia sistema centralizado e distribuido?",
      correct: "No centralizado, operacoes e armazenamento ficam concentrados em um ponto; no distribuido, varias maquinas coordenam um objetivo comum.",
      wrong: [
        "No distribuido existe obrigatoriamente um unico servidor fazendo tudo sozinho.",
        "Centralizado sempre usa varios computadores independentes coordenados.",
        "Distribuido nao possui comunicacao entre maquinas.",
        "Centralizado e distribuido significam exatamente a mesma coisa."
      ],
      remember: "Centralizado = um ponto. Distribuido = varias maquinas."
    },
    {
      topic: "Microsservicos",
      prompt: "Qual e a ideia de microsservicos?",
      correct: "Dividir a aplicacao em servicos independentes para facilitar manutencao e atualizacoes.",
      wrong: [
        "Concentrar toda a aplicacao em um unico bloco impossivel de atualizar separadamente.",
        "Impedir qualquer comunicacao entre partes do sistema.",
        "Substituir IP, portas e sockets por uma unica thread.",
        "Criar deadlock de forma intencional para testar falhas."
      ],
      remember: "Microsservicos = dividir em servicos independentes."
    },
    {
      topic: "TCP/IP, IP, latencia, perda, portas e sockets",
      prompt: "Qual alternativa interpreta corretamente esses conceitos de rede?",
      correct: "TCP/IP transmite dados; IP endereca pacotes; latencia e atraso; perda ocorre quando dados nao chegam; portas/sockets direcionam a comunicacao.",
      wrong: [
        "IP e um tipo de semaforo e portas sao algoritmos de consenso.",
        "Latencia significa garantia de entrega correta e ordenada.",
        "Perda de pacotes e quando os dados chegam duplicados por idempotencia.",
        "Sockets servem apenas para salvar logs de checkpoint."
      ],
      remember: "IP = endereco. Latencia = atraso. Perda = nao chegou. Porta/socket = direcionar."
    },
    {
      topic: "Exclusao mutua e Ricart-Agrawala",
      prompt: "Como exclusao mutua e Ricart-Agrawala aparecem no material?",
      correct: "Exclusao mutua garante um processo por vez na regiao critica; Ricart-Agrawala pede acesso por mensagens com timestamp logico.",
      wrong: [
        "Exclusao mutua permite acesso simultaneo ilimitado a regiao critica.",
        "Ricart-Agrawala e um servico de CDN para reduzir latencia.",
        "Exclusao mutua e usada para duplicar cobrancas.",
        "Ricart-Agrawala substitui TLS na criptografia HTTPS."
      ],
      remember: "Exclusao mutua = um por vez. Ricart-Agrawala = pedir acesso com mensagens e tempo logico."
    },
    {
      topic: "Produtor-consumidor e leitores-escritores",
      prompt: "Qual alternativa resume produtor-consumidor e leitores-escritores?",
      correct: "Produtor-consumidor controla buffer cheio ou vazio; leitores-escritores controla leitura conjunta e escrita para evitar inconsistencia.",
      wrong: [
        "Produtor-consumidor e uma tecnica de criptografia; leitores-escritores e uma CDN.",
        "Leitores-escritores permite escrita simultanea sem qualquer controle.",
        "Produtor-consumidor elimina a necessidade de mutex e semaforo.",
        "Ambos sao modelos de endereco IP."
      ],
      remember: "Produtor/consumidor = buffer. Leitor/escritor = leitura e alteracao."
    },
    {
      topic: "Paxos e Raft",
      prompt: "Para que servem Paxos e Raft?",
      correct: "Sao algoritmos de consenso que ajudam computadores a concordarem com uma decisao ou valor mesmo diante de falhas.",
      wrong: [
        "Sao tecnologias para criptografar paginas HTTPS.",
        "Sao protocolos de transporte mais rapidos que UDP.",
        "Sao formas de cache para aproximar conteudo do usuario.",
        "Sao estruturas para permitir acesso ilimitado a regiao critica."
      ],
      remember: "Paxos/Raft = concordar mesmo com falhas."
    },
    {
      topic: "Deadlock: prevencao, deteccao e recuperacao",
      prompt: "Qual alternativa diferencia prevencao, deteccao e recuperacao de deadlock?",
      correct: "Prevenir cria regras para evitar; detectar encontra ciclos de espera; recuperar libera recursos ou reinicia processos travados.",
      wrong: [
        "Prevenir significa criar deadlock; detectar ignora ciclos; recuperar duplica cobrancas.",
        "Deteccao e apenas criptografia TLS.",
        "Recuperacao e sempre cachear conteudo em CDN.",
        "Prevencao, deteccao e recuperacao sao nomes de portas TCP."
      ],
      remember: "Prevenir = evitar. Detectar = encontrar. Recuperar = destravar."
    },
    {
      topic: "Cache e CDN",
      prompt: "Como cache e CDN reduzem latencia?",
      correct: "Mantem conteudo mais proximo ou usado com frequencia para diminuir o tempo de acesso.",
      wrong: [
        "Obrigam todos os dados a passarem por um unico servidor distante.",
        "Controlam regiao critica com timestamp logico.",
        "Elegem coordenador pelo maior ID ativo.",
        "Impedem qualquer replicacao de dados."
      ],
      remember: "Cache/CDN = conteudo mais perto = menos atraso."
    },
    {
      topic: "Idempotencia, rollback e consistencia",
      prompt: "Qual alternativa explica idempotencia, rollback e consistencia?",
      correct: "Idempotencia evita duplicacao em repeticoes; rollback desfaz operacao problematica; consistencia mantem dados corretos e confiaveis.",
      wrong: [
        "Idempotencia duplica cobrancas; rollback impede recuperacao; consistencia cria divergencias.",
        "Rollback e um protocolo para entrega ordenada de pacotes.",
        "Consistencia significa permitir dados divergentes entre todos os nos.",
        "Idempotencia e uma forma de eleger coordenador pelo maior ID."
      ],
      remember: "Idempotencia = nao duplicar. Rollback = desfazer. Consistencia = manter certo."
    }
  ];

  const questions = baseQuestions.map((item, index) => ({
    id: `SD-${String(index + 1).padStart(2, "0")}`,
    number: index + 1,
    discipline: "Sistemas Distribuidos",
    topic: item.topic,
    difficulty: index < 15 ? "Parte 1" : "Parte 2",
    prompt: `${index + 1}. ${item.prompt}`,
    options: [
      { id: "a", text: item.correct },
      { id: "b", text: item.wrong[0] },
      { id: "c", text: item.wrong[1] },
      { id: "d", text: item.wrong[2] },
      { id: "e", text: item.wrong[3] }
    ],
    correctOptionId: "a",
    explanation: `A resposta correta segue o item ${index + 1} do material completo: ${item.correct}`,
    remember: item.remember,
    reference: refs.completo,
    source: refs.completo
  }));

  const review = baseQuestions.map((item, index) => ({
    topic: `${index + 1}. ${item.topic}`,
    body: item.correct,
    example: "Revise este ponto dentro dos cenarios de comunicacao, falhas, concorrencia e coordenacao entre maquinas.",
    remember: item.remember,
    practiceTopic: item.topic
  }));

  const subjects = {
    sistemas: {
      id: "sistemas",
      name: "Sistemas Distribuidos",
      shortName: "Sistemas Distribuidos",
      description: "Simulado em duas partes baseado nas 29 questoes/topicos do arquivo completo.",
      questions,
      parts: {
        part1: questions.slice(0, 15).map(q => q.id),
        part2: questions.slice(15).map(q => q.id),
        full29: questions.map(q => q.id)
      },
      review
    }
  };

  return {
    version: "2026.09.29.2",
    sources: Object.values(refs),
    subjects
  };
})();
