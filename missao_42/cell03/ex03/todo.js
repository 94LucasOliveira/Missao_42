// --- SELEÇÃO DE ELEMENTOS DO DOM ---

// Seleciona a div contêiner onde a lista de tarefas será renderizada.
const ft_list = document.getElementById('ft_list');

// Seleciona o botão que o usuário clica para disparar a criação de uma nova tarefa.
const btn_add = document.getElementById('btn_add');


// --- FUNÇÕES DE PERSISTÊNCIA (COOKIES) ---

// Função responsável por ler o estado atual do DOM e guardá-lo no navegador.
function atualizarCookie() {
  // Cria uma lista (array) vazia para armazenar temporariamente os textos das tarefas.
  const tarefas = [];
  
  // Localiza todas as divs filhas dentro de 'ft_list' e passa por cada uma delas.
  ft_list.querySelectorAll('div').forEach(div => {
    // Pega o texto visível da div (o nome da tarefa) e adiciona no array.
    tarefas.push(div.textContent);
  });
  
  // Converte o array em uma string de texto formatada (JSON).
  const stringJson = JSON.stringify(tarefas);
  
  // Codifica caracteres especiais para garantir que o formato do cookie não quebre.
  const textoCodificado = encodeURIComponent(stringJson);
  
  // Grava o cookie "lista_tarefas" acessível em todo o site (path=/) válido por 1 ano (max-age em segundos).
  document.cookie = "lista_tarefas=" + textoCodificado + ";path=/;max-age=31536000";
}

// Função que recupera os dados salvos no navegador quando a página é reaberta.
function obterTarefasDoCookie() {
  // Divide a string completa de cookies do navegador em um array de cookies individuais.
  const cookies = document.cookie.split('; ');
  
  // Percorre cada cookie individual encontrado.
  for (let i = 0; i < cookies.length; i++) {
    // Divide o cookie atual entre o seu nome [0] e o seu valor.
    const partes = cookies[i].split('=');
    
    // Verifica se o nome do cookie atual é exatamente "lista_tarefas".
    if (partes[0] === 'lista_tarefas') {
      // Decodifica o valor do cookie para reverter os caracteres especiais.
      const textoDecodificado = decodeURIComponent(partes[1]);
      
      // Transforma o texto formatado (JSON) de volta em um array nativo do JavaScript e o retorna.
      return JSON.parse(textoDecodificado);
    }
  }
  
  // Se o laço terminar e não encontrar o cookie, retorna um array vazio (lista em branco).
  return [];
}


// --- MANIPULAÇÃO Dinâmica do DOM ---

// Função que cria visualmente a estrutura de uma tarefa e define como ela interage.
function adicionarTarefaNaTela(texto, noTopo) {
  // Cria um novo elemento HTML do tipo 'div' totalmente na memória.
  const novaTarefa = document.createElement('div');
  
  // Atribui a classe CSS 'tarefa' para que o elemento herde a estilização básica.
  novaTarefa.className = 'tarefa';
  
  // Define o conteúdo de texto da div com a mensagem/nome da tarefa enviada.
  novaTarefa.textContent = texto;

  // Escuta o clique do usuário diretamente nesta div criada para iniciar o processo de remoção.
  novaTarefa.addEventListener('click', function() {
    // Abre a janela de confirmação nativa (Sim/Não) perguntando sobre a exclusão.
    if (confirm("Deseja realmente remover esta TAREFA?")) {
      // Se confirmado, o método remove() deleta este elemento de forma definitiva do DOM.
      novaTarefa.remove();
      
      // Atualiza o cookie imediatamente para salvar a lista sem a tarefa deletada.
      atualizarCookie();
    }
  });

  // Decide em qual posição da lista a tarefa deve ser encaixada.
  if (noTopo) {
    // Se 'noTopo' for verdadeiro, insere o novo elemento antes do primeiro filho atual de 'ft_list'.
    ft_list.insertBefore(novaTarefa, ft_list.firstChild);
  } else {
    // Se falso, apenas anexa ao final da lista (usado na inicialização para manter a ordem salva).
    ft_list.appendChild(novaTarefa);
  }
}


// --- FLUXOS DE EVENTOS E START DA APLICAÇÃO ---

// Escuta o clique no botão principal para criar uma nova tarefa.
btn_add.addEventListener('click', function() {
  // Abre uma caixa de entrada de texto nativa pedindo o nome da tarefa.
  const texto = prompt("Digite a nova TAREFA:");
  
  // Valida se o usuário não cancelou a janela (null) e se não digitou apenas espaços vazios.
  if (texto !== null && texto.trim() !== "") {
    // Cria a tarefa enviando o texto limpo (sem espaços nas pontas) e força a inserção no topo (true).
    adicionarTarefaNaTela(texto.trim(), true);
    
    // Atualiza o cookie para registrar de forma permanente a nova tarefa adicionada.
    atualizarCookie();
  }
});

// Escuta o momento exato em que a estrutura da página HTML terminou de carregar no navegador.
window.addEventListener('DOMContentLoaded', function() {
  // Busca o array de tarefas armazenado no cookie (ou um array vazio se não existir).
  const tarefasSalvas = obterTarefasDoCookie();
  
  // Passa item por item do array recuperado.
  tarefasSalvas.forEach(texto => {
    // Renderiza cada tarefa na tela de forma sequencial mantendo a ordem correta (noTopo como false).
    adicionarTarefaNaTela(texto, false);
  });
});
