window.STUDY_DATA = (() => {
  const refs = {
    revisao: "Sistema_distribuidos_COMPLETO_25_questoes.pdf",
    atividade: "Atividade 230926 SD.pdf"
  };

  const reviewItems = [
    ["Sistema distribuído", "Vários computadores conectados trabalham juntos e, para o usuário, podem parecer um único sistema.", "Centralizado = um ponto principal; distribuído = várias máquinas coordenadas."],
    ["Escalabilidade e disponibilidade", "Escalabilidade permite crescer para atender mais usuários; disponibilidade mantém o serviço ativo mesmo com falhas.", "Escalar é crescer; disponibilidade é continuar acessível."],
    ["Cliente-servidor x P2P", "No cliente-servidor, cliente pede e servidor responde. No P2P, nós podem pedir e servir entre si.", "Cliente-servidor centraliza mais; P2P distribui mais responsabilidades."],
    ["Arquiteturas", "Camadas separam funções; nuvem usa recursos pela rede; objetos interagem; eventos reagem a acontecimentos.", "Associe: camadas = funções; nuvem = rede; objetos = interação; eventos = reação."],
    ["Processos e threads", "Processo é programa em execução com memória própria. Thread é tarefa dentro do processo e compartilha memória.", "Processo separa memória; thread compartilha memória."],
    ["IPC, TCP, UDP e RPC", "IPC permite processos trocarem informações. TCP prioriza entrega correta; UDP prioriza rapidez; RPC chama função em outro computador.", "TCP = confiança; UDP = rapidez; RPC = função de longe."],
    ["Comunicação síncrona e assíncrona", "Síncrona espera resposta para continuar. Assíncrona envia e continua executando outras tarefas.", "Síncrona espera; assíncrona não espera."],
    ["Concorrência", "Várias tarefas disputam ou compartilham recursos. Condição de corrida ocorre quando a ordem de acesso altera o resultado.", "Concorrência sem controle pode gerar inconsistência."],
    ["Mutex, semáforo e monitor", "Mutex permite um por vez; semáforo controla quantos acessam; monitor organiza o acesso protegido.", "Mutex = um; semáforo = quantidade; monitor = estrutura organizada."],
    ["Deadlock", "Processos ficam esperando recursos uns dos outros e ninguém continua.", "Prevenir evita; detectar encontra; recuperar destrava."],
    ["Relógios lógicos", "Lamport usa contador lógico; relógio vetorial usa vetor para identificar melhor causalidade e concorrência.", "Lamport ordena; vetorial identifica relações entre eventos."],
    ["Bully, coordenador e barreiras", "Coordenador organiza tarefas; Bully elege novo coordenador, geralmente o ativo de maior ID; barreira espera todos chegarem.", "Bully escolhe coordenador; barreira sincroniza ponto de espera."],
    ["Tolerância a falhas", "Retry tenta novamente; replicação mantém cópias; checkpoint salva estado; logs registram; monitoramento observa problemas.", "Retry = tentar de novo; replicação = cópias; checkpoint = salvar estado."],
    ["Balanceamento, cache e CDN", "Balanceamento distribui trabalho. Cache e CDN aproximam conteúdo para reduzir latência.", "Load balancer divide; cache/CDN aproxima."],
    ["Segurança, idempotência e rollback", "SSL/TLS protege comunicação; idempotência evita duplicação; rollback desfaz operação problemática.", "TLS protege; idempotência não duplica; rollback desfaz."]
  ];

  const concepts = [
    ["Sistema distribuído", "conjunto de computadores que se comunicam e coordenam para atingir um objetivo comum", "um único computador isolado que concentra todas as operações", refs.revisao],
    ["Escalabilidade", "capacidade de aumentar recursos para atender uma demanda maior", "garantia de que todos os pacotes chegarão em ordem", refs.revisao],
    ["Disponibilidade", "capacidade de manter o serviço acessível mesmo diante de falhas", "divisão interna de um processo em tarefas menores", refs.revisao],
    ["Tolerância a falhas", "capacidade de continuar funcionando quando uma parte falha", "obrigação de sempre usar apenas um servidor central", refs.atividade],
    ["Cliente-servidor", "modelo em que o cliente solicita e o servidor fornece ou responde o serviço", "modelo em que todos os nós necessariamente têm o mesmo papel", refs.revisao],
    ["P2P", "modelo em que os computadores se comunicam diretamente e podem pedir e servir recursos", "modelo com servidor principal obrigatório para toda operação", refs.revisao],
    ["Sincronização", "coordenação de processos e organização da ordem dos eventos", "criptografia dos dados durante a comunicação HTTPS", refs.revisao],
    ["Concorrência", "várias tarefas acontecendo no mesmo período e disputando ou compartilhando recursos", "armazenamento de conteúdo próximo ao usuário final", refs.revisao],
    ["Arquitetura em camadas", "divisão do sistema em camadas com funções específicas", "eleição automática do processo ativo de maior ID", refs.revisao],
    ["Arquitetura em nuvem", "uso de recursos e serviços disponíveis pela rede", "execução sem qualquer comunicação entre máquinas", refs.revisao],
    ["Arquitetura baseada em objetos", "sistema formado por objetos com dados e comportamentos que interagem", "sistema que só reage a falhas de pacotes UDP", refs.revisao],
    ["Arquitetura baseada em eventos", "acontecimento gera uma reação no sistema", "programa com memória própria executando isoladamente", refs.revisao],
    ["Processo", "programa em execução com seu próprio espaço de memória", "tarefa dentro de um processo compartilhando a mesma memória", refs.revisao],
    ["Thread", "tarefa executada dentro de um processo e compartilhando memória com outras threads", "computador remoto chamado por RPC", refs.revisao],
    ["IPC", "mecanismos para processos se comunicarem e trocarem informações", "algoritmo de consenso para eleger líder", refs.atividade],
    ["Troca de mensagens", "processos enviam informações uns aos outros", "processos usam obrigatoriamente o mesmo espaço físico de memória", refs.revisao],
    ["Memória compartilhada", "processos usam um mesmo espaço para trocar informações", "protocolo que não garante entrega em ordem", refs.revisao],
    ["TCP", "protocolo que prioriza entrega correta e ordenada dos dados", "protocolo escolhido quando perda pontual é sempre preferível à confiabilidade", refs.atividade],
    ["UDP", "protocolo com menor sobrecarga, mais rápido, sem garantir entrega ou ordem", "protocolo que confirma e reordena todos os dados obrigatoriamente", refs.atividade],
    ["RPC", "permite chamar uma função em outro computador pela rede como se fosse local", "bloqueio distribuído para região crítica", refs.atividade],
    ["Comunicação síncrona", "solicitação espera a resposta para continuar", "solicitação continua sem precisar esperar resposta no momento", refs.revisao],
    ["Comunicação assíncrona", "solicitação é enviada e a tarefa continua sem esperar naquele momento", "comunicação que sempre bloqueia até a resposta chegar", refs.revisao],
    ["Condição de corrida", "resultado fica errado dependendo da ordem de acesso simultâneo ao mesmo dado", "nós concordam com uma decisão usando quórum", refs.revisao],
    ["Mutex", "controle que permite apenas uma tarefa por vez em um recurso protegido", "controle que permite sempre três acessos simultâneos sem bloqueio", refs.revisao],
    ["Semáforo", "controle que define quantas tarefas podem acessar um recurso ao mesmo tempo", "contador lógico usado para ordenar eventos distribuídos", refs.revisao],
    ["Monitor", "estrutura que organiza e protege acesso a dados compartilhados", "serviço de CDN para reduzir latência geográfica", refs.revisao],
    ["Deadlock", "processos esperam recursos uns dos outros e nenhum consegue continuar", "entrega de conteúdo a partir de pontos próximos", refs.atividade],
    ["Relógio de Lamport", "contador lógico usado para ajudar a ordenar eventos", "vetor com contadores de todos os nós para causalidade precisa", refs.atividade],
    ["Relógio vetorial", "conjunto de valores que identifica melhor relações entre eventos e concorrência", "único contador simples que não identifica toda causalidade", refs.atividade],
    ["Coordenador", "processo escolhido para organizar tarefas no sistema", "protocolo de transporte focado em baixa latência", refs.revisao],
    ["Algoritmo de Bully", "algoritmo de eleição em que normalmente vence o processo ativo de maior ID", "técnica para cachear vídeos perto do usuário", refs.revisao],
    ["Barreira", "mecanismo que faz participantes esperarem até todos chegarem ao mesmo ponto", "repetição automática de uma operação falha", refs.revisao],
    ["Retry", "nova tentativa de executar uma operação após falha temporária", "registro definitivo que impede qualquer recuperação", refs.atividade],
    ["Replicação", "manter cópias de dados ou serviços para disponibilidade e tolerância a falhas", "dividir uma aplicação apenas por telas de interface", refs.revisao],
    ["Checkpointing", "salvar um estado para recuperar a execução sem recomeçar do zero", "criar uma porta de rede para cada pacote perdido", refs.revisao],
    ["Logs", "registros de eventos, erros e operações do sistema", "memória compartilhada que substitui consenso", refs.revisao],
    ["Monitoramento", "acompanhar o funcionamento do sistema para identificar problemas", "bloquear todos os leitores para sempre", refs.revisao],
    ["Balanceamento de carga", "distribuição de solicitações entre servidores para evitar sobrecarga", "criação de timestamp para pedir região crítica", refs.atividade],
    ["SSL/TLS", "tecnologias que protegem dados na comunicação pela rede, principalmente com criptografia", "algoritmos de consenso para replicar logs", refs.revisao],
    ["Microsserviços", "divisão da aplicação em serviços independentes para facilitar manutenção e atualização", "um servidor único que concentra toda aplicação obrigatoriamente", refs.atividade],
    ["TCP/IP", "modelo em que TCP organiza a entrega e IP cuida do endereçamento dos pacotes", "estrutura de sincronização para buffer cheio", refs.atividade],
    ["Latência", "atraso no envio e recebimento dos dados", "garantia de que o pacote sempre chegará ao destino", refs.atividade],
    ["Perda de pacotes", "dados enviados não chegam ao destino", "execução de uma thread dentro do mesmo processo", refs.atividade],
    ["Portas e sockets", "identificam e direcionam comunicação para o serviço ou processo correto", "mecanismo de recuperação que desfaz operação", refs.atividade],
    ["Exclusão mútua", "garantia de que apenas um processo acessa região crítica por vez", "vários leitores escrevendo simultaneamente sem controle", refs.atividade],
    ["Ricart-Agrawala", "algoritmo que pede acesso a recurso por mensagens com timestamp lógico", "protocolo de streaming baseado em UDP sem coordenação", refs.atividade],
    ["Produtor-consumidor", "problema de sincronização envolvendo buffer cheio ou vazio", "eleição de líder pelo maior ID ativo", refs.atividade],
    ["Leitores-escritores", "problema em que leitores podem ler juntos, mas escrita exige controle para evitar inconsistência", "protocolo de endereçamento de pacotes", refs.atividade],
    ["Paxos e Raft", "algoritmos de consenso para nós concordarem com uma decisão mesmo com falhas", "mecanismos de criptografia usados em HTTPS", refs.atividade],
    ["Cache e CDN", "mantêm conteúdo mais próximo para reduzir tempo de acesso e latência", "bloqueiam região crítica com timestamp lógico", refs.revisao],
    ["Idempotência", "uso de identificação única para evitar duplicar cobranças ou reservas em repetição", "técnica que obriga toda operação repetida a gerar novo efeito", refs.revisao],
    ["Rollback", "desfaz operação pendente ou problemática para recuperar consistência", "aumenta recursos automaticamente para atender demanda", refs.atividade],
    ["Consistência", "busca manter dados corretos e sem divergências entre nós", "perda intencional de pacotes para reduzir carga", refs.revisao]
  ];

  const letters = ["a", "b", "c", "d", "e"];
  function options(correct, wrong, seed) {
    const pool = concepts;
    const raw = [correct, wrong, pool[(seed + 7) % pool.length][1], pool[(seed + 13) % pool.length][2], pool[(seed + 19) % pool.length][1]];
    const seen = new Set();
    return raw.map((text, i) => {
      let t = text;
      if (seen.has(t)) t += " em outro contexto do conteúdo";
      seen.add(t);
      return { id: letters[i], text: t };
    });
  }

  const questions = [];
  concepts.forEach((c, i) => {
    const [topic, correct, wrong, reference] = c;
    const next = concepts[(i + 1) % concepts.length];
    questions.push({
      id: `SD-${String(i + 1).padStart(2, "0")}-conceito`,
      discipline: "Sistemas Distribuídos",
      topic,
      difficulty: i % 3 === 0 ? "Difícil" : "Média",
      prompt: `Qual alternativa interpreta melhor "${topic}" conforme os materiais de Sistemas Distribuídos?`,
      options: options(correct, wrong, i),
      correctOptionId: "a",
      explanation: `${topic} está ligado a ${correct}. A alternativa marcada como confusão se aproxima de outro conceito, mas não define corretamente esse assunto.`,
      remember: `Para a prova: ${topic} = ${correct}.`,
      reference,
      source: reference
    });
    if (i < 35) {
      questions.push({
        id: `SD-${String(i + 1).padStart(2, "0")}-cenario`,
        discipline: "Sistemas Distribuídos",
        topic,
        difficulty: "Difícil",
        prompt: `Um aluno confundiu "${topic}" com "${next[0]}". Qual comparação corrige melhor essa confusão?`,
        options: options(`${topic} trata de ${correct}, enquanto ${next[0]} trata de ${next[1]}.`, `${topic} e ${next[0]} são sempre o mesmo conceito, sem diferença prática.`, i + 5),
        correctOptionId: "a",
        explanation: `A comparação correta separa o papel de ${topic} do papel de ${next[0]}.`,
        remember: "Em questões de comparação, observe o objetivo principal de cada mecanismo.",
        reference,
        source: reference
      });
    }
  });

  const subjects = {
    sistemas: {
      id: "sistemas",
      name: "Sistemas Distribuídos",
      shortName: "Sistemas Distribuídos",
      description: "Simulado baseado na revisão completa e na atividade de 23/09/2026.",
      questions,
      review: reviewItems.map(([topic, body, remember]) => ({
        topic,
        body,
        remember,
        practiceTopic: concepts.find(c => c[0] === topic)?.[0] || concepts.find(c => topic.includes(c[0]) || c[0].includes(topic.split(" ")[0]))?.[0] || "Sistema distribuído",
        example: "Use o conceito em cenários com múltiplas máquinas, comunicação em rede, falhas, concorrência e sincronização."
      }))
    }
  };

  return {
    version: "2026.09.29.1",
    sources: Object.values(refs),
    subjects
  };
})();
