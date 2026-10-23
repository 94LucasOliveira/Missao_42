// --- INICIALIZAÇÃO COM JQUERY ---

// Requisito: Carrega o código assim que a estrutura do DOM estiver pronta.
// O $(function() { ... }) é o atalho do jQuery para $(document).ready()
$(function() {

  // Seleciona os elementos principais da tela usando seletores jQuery ($)
  const $ft_list = $('#ft_list');
  const $btn_add = $('#btn_add');

  // --- FUNÇÕES DE PERSISTÊNCIA (COOKIES) ---

  // Função responsável por ler o estado atual do DOM e salvá-lo em um cookie
  function atualizarCookie() {
    const tarefas = [];

    // Localiza todas as divs filhas de #ft_list e itera sobre elas usando o .each() do jQuery
    $ft_list.children('div').each(function() {
      // $(this).text() captura o conteúdo de texto da div atual da iteração
      tarefas.push($(this).text());
    });

    // Converte o array para string JSON e codifica os caracteres especiais
    const textoCodificado = encodeURIComponent(JSON.stringify(tarefas));

    // Define o cookie com validade de 1 ano (max-age em segundos)
    document.cookie = "lista_tarefas=" + textoCodificado + ";path=/;max-age=31536000";
  }

  // Função que recupera os dados salvos no cookie do navegador
  function obterTarefasDoCookie() {
    // Acessa a string de cookies e divide os cookies individuais por ponto e vírgula
    const cookies = document.cookie.split('; ');

    for (let i = 0; i < cookies.length; i++) {
      const partes = cookies[i].split('=');
      
      // Verifica se encontrou o cookie correto
      if (partes[0] === 'lista_tarefas') {
        // Decodifica e converte a string JSON de volta para um Array JavaScript
        return JSON.parse(decodeURIComponent(partes[1]));
      }
    }
    return []; // Retorna lista vazia caso o cookie não exista
  }

  // --- MANIPULAÇÃO DINÂMICA DO DOM COM JQUERY ---

  // Função para criar o elemento da tarefa na tela e gerenciar suas regras
  function adicionarTarefaNaTela(texto, noTopo) {
    // Cria uma nova tag <div> com a classe 'tarefa' e insere o texto de forma segura
    const $novaTarefa = $('<div></div>').addClass('tarefa').text(texto);

    // Requisito: Ao clicar na tarefa, abre a janela para decidir se remove
    $novaTarefa.on('click', function() {
      // Abre a janela de confirmação nativa (confirm)
      if (confirm("Deseja realmente remover esta TAREFA?")) {
        // O método .remove() do jQuery deleta o elemento permanentemente do DOM
        $novaTarefa.remove();
        // Sincroniza o cookie com o novo estado da lista
        atualizarCookie();
      }
    });

    // Requisito: Define o local correto de inserção (Sempre no topo para novas tarefas)
    if (noTopo) {
      // .prepend() insere o elemento no início do contêiner $ft_list
      $ft_list.prepend($novaTarefa);
    } else {
      // .append() adiciona no final do contêiner (usado apenas no carregamento inicial)
      $ft_list.append($novaTarefa);
    }
  }

  // --- COMPORTAMENTOS DE EVENTOS ---

  // Requisito: Captura o clique no botão de adicionar usando o método .on() do jQuery
  $btn_add.on('click', function() {
    // Abre a janela de prompt solicitada
    const texto = prompt("Digite a nova TAREFA:");

    // Valida se o texto não é nulo e limpa espaços extras usando $.trim() do jQuery
    if (texto !== null && $.trim(texto) !== "") {
      // Adiciona a tarefa forçando a inserção no topo da lista (true)
      adicionarTarefaNaTela($.trim(texto), true);
      // Salva a alteração nos cookies
      atualizarCookie();
    }
  });

  // --- FLUXO INICIAL DA APLICAÇÃO ---

  // Recupera o Array armazenado nos cookies do navegador
  const tarefasSalvas = obterTarefasDoCookie();

  // Executa uma iteração para cada item recuperado do cookie
  $.each(tarefasSalvas, function(indice, texto) {
    // Insere sequencialmente no final para manter a ordem cronológica original (false)
    adicionarTarefaNaTela(texto, false);
  });

});
