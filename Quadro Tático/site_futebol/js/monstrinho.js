        // Classe que representa o Campo de Futebol
        class Campo {
            // O construtor é o ponto de entrada da classe, inicializando as propriedades e métodos necessários
            constructor() {
                // Obtém o elemento HTML que representa o campo de futebol no DOM através de seu ID
                this.elemento = document.getElementById('campo'); 

                // Obtém o elemento HTML que representa o contêiner para setas (arrows) no campo
                this.arrowsSVG = document.getElementById('arrows');

                // Inicializa um array vazio para armazenar os jogadores da equipe principal
                this.jogadores = []; 

                // Inicializa um array vazio para armazenar as bolas no campo
                this.bolas = []; 

                // Inicializa um array vazio para armazenar o goleiro da equipe principal
                this.goleiros = []; 

                // Inicializa um array vazio para armazenar os jogadores da equipe adversária
                this.jogadoresAdversarios = []; 

                // Inicializa um array vazio para armazenar o goleiro da equipe adversária
                this.goleirosAdversarios = []; 

                // Inicializa um array vazio para armazenar as setas desenhadas no campo
                this.setas = []; 

                // Define uma variável para armazenar a seta que está sendo manipulada atualmente; começa como `null`
                this.currentArrow = null; 

                // Define uma variável para armazenar o elemento que é a origem de uma seta (ex.: jogador, bola); começa como `null`
                this.originElement = null; 

                // Inicializa um array para armazenar os movimentos planejados pelos jogadores
                this.movimentosPlanejados = []; 

                // Inicializa a funcionalidade de arrastar e soltar no campo
                this.initDragAndDrop(); 

                // Inicializa os controles do campo, como eventos de clique ou ações do usuário
                this.initControls(); 

                // Inicializa a funcionalidade de desenhar setas no campo, provavelmente conectando jogadores ou indicando direções
                this.initArrowDrawing(); 

                // Inicializa as formações de jogadores no campo, que podem ser pré-definidas ou dinâmicas
                this.initFormacoes(); 
            }


            // Método para inicializar a funcionalidade de arrastar e soltar (drag and drop)
        initDragAndDrop() {
            // Seleciona todos os elementos dentro da toolbar que têm a classe 'elemento'
            const toolbarElements = document.querySelectorAll('#toolbar .elemento');

            // Adiciona um listener para o evento 'dragstart' em cada elemento da toolbar
            toolbarElements.forEach(elem => {
                // Quando o usuário começa a arrastar, executa a função handleDragStart
                // Passa o evento e o tipo de elemento, armazenado no atributo 'data-type'
                elem.addEventListener('dragstart', (e) => this.handleDragStart(e, elem.dataset.type));
            });

            // Adiciona um listener para o evento 'dragover' no elemento do campo
            // Necessário para permitir o comportamento de "soltar" sobre o campo
            this.elemento.addEventListener('dragover', (e) => e.preventDefault());

            // Adiciona um listener para o evento 'drop' no campo
            this.elemento.addEventListener('drop', (e) => {
                // Verifica se o tipo de elemento foi definido no dataTransfer ao iniciar o drag
                if (!e.dataTransfer.getData('tipo')) {
                    // Se nenhum tipo for encontrado, exibe um erro no console
                    console.error("Nenhum tipo de elemento detectado durante o drop.");
                    return; // Encerra a função para evitar erros adicionais
                }

                // Chama a função handleDrop para processar o elemento solto no campo
                this.handleDrop(e);
            });
        }

            

        // Método que é acionado quando o evento 'dragstart' ocorre (ou seja, quando um item começa a ser arrastado)
        handleDragStart(e, tipo) {
            // Usa o objeto 'dataTransfer' associado ao evento de drag para armazenar informações
            // Aqui, armazena o tipo do elemento (por exemplo: jogador, goleiro, bola)
            e.dataTransfer.setData('tipo', tipo);
        }


            // Método que é acionado quando o evento 'drop' ocorre (quando um item é solto no campo)
        handleDrop(e) {
            // Previne o comportamento padrão de 'soltar' o item
            e.preventDefault();

            // Recupera o tipo de elemento armazenado durante o 'dragstart' (ex.: jogador, goleiro, bola)
            const tipo = e.dataTransfer.getData('tipo');

            // Calcula a posição do mouse em relação ao campo no momento do drop
            const pos = this.getMousePosition(e);

            // Verifica se na posição calculada já existe um elemento do mesmo tipo, evitando duplicação
            if (this.jogadores.some(jogador => 
                jogador.posicao.x === pos.x && 
                jogador.posicao.y === pos.y && 
                tipo === 'jogador')) {
                return; // Sai do método se já existir um jogador na mesma posição
            }

            // Determina o comportamento com base no tipo de elemento solto
            if (tipo === 'jogador') {
                // Adiciona um jogador no campo na posição especificada
                this.adicionarJogador(pos.x, pos.y); 
            } else if (tipo === 'goleiro') {
                // Adiciona um goleiro na posição especificada
                this.adicionarGoleiro(pos.x, pos.y);
            } else if (tipo === 'jogador2') {
                // Adiciona um jogador adversário na posição especificada
                this.adicionarJogadorAdversario(pos.x, pos.y);
            } else if (tipo === 'goleiro2') {
                // Adiciona um goleiro adversário na posição especificada
                this.adicionarGoleiroAdversario(pos.x, pos.y);
            } else if (tipo === 'bola') {
                // Adiciona uma bola na posição especificada
                this.adicionarBola(pos.x, pos.y);
            }
        }

            

        // Método que obtém a posição do mouse em relação ao campo
        getMousePosition(event) {
            // Obtém o retângulo delimitador do elemento do campo no viewport
            // O objeto retornado contém as propriedades: top, left, bottom, right, width e height
            const rect = this.elemento.getBoundingClientRect();

            // Calcula a posição X do mouse relativa ao campo
            // Subtrai a posição 'left' do campo (bordo esquerdo) da posição X do mouse no viewport
            const x = event.clientX - rect.left;

            // Calcula a posição Y do mouse relativa ao campo
            // Subtrai a posição 'top' do campo (bordo superior) da posição Y do mouse no viewport
            const y = event.clientY - rect.top;

            // Retorna as coordenadas X e Y como um objeto
            return { x, y };
        }


        // Função para adicionar um jogador da equipe na posição especificada
        adicionarJogador(x, y) {
            // Verifica se já existe um jogador na mesma posição para evitar duplicações
            if (this.jogadores.some(jogador => 
                jogador.posicao.x === x && jogador.posicao.y === y)) {
                return; // Se um jogador já existe nessa posição, interrompe a execução
            }

            // Cria uma nova instância da classe Jogador
            // Passa o ID baseado no tamanho atual do array, as coordenadas (x, y) e uma referência à classe Campo
            const jogador = new Jogador(this.jogadores.length, x, y, this);

            // Adiciona o jogador recém-criado ao array que gerencia todos os jogadores da equipe
            this.jogadores.push(jogador);

            // Insere o elemento HTML do jogador no campo, tornando-o visível na interface
            this.elemento.appendChild(jogador.elemento);
        }

            
        // Função para adicionar o goleiro da equipe na posição especificada
        adicionarGoleiro(x, y) {
            // Verifica se já existe um goleiro na mesma posição para evitar duplicações
            if (this.goleiros.some(goleiro => 
                goleiro.posicao.x === x && goleiro.posicao.y === y)) {
                return; // Se um goleiro já existe nessa posição, interrompe a execução
            }

            // Cria uma nova instância da classe Goleiro
            // Passa o ID baseado no tamanho atual do array, as coordenadas (x, y) e uma referência à classe Campo
            const goleiro = new Goleiro(this.goleiros.length, x, y, this);

            // Adiciona o goleiro recém-criado ao array que gerencia todos os goleiros da equipe
            this.goleiros.push(goleiro);

            // Insere o elemento HTML do goleiro no campo, tornando-o visível na interface
            this.elemento.appendChild(goleiro.elemento);
        }

            
        // Função para adicionar a bola na posição especificada
        adicionarBola(x, y) {
            // Verifica se já existe uma bola na mesma posição para evitar duplicações
            if (this.bolas.some(bola => 
                bola.posicao.x === x && bola.posicao.y === y)) {
                return; // Se uma bola já existe nessa posição, interrompe a execução
            }

            // Cria uma nova instância da classe Bola
            // Passa o ID baseado no tamanho atual do array, as coordenadas (x, y) e uma referência à classe Campo
            const bola = new Bola(this.bolas.length, x, y, this);

            // Adiciona a bola recém-criada ao array que gerencia todas as bolas no campo
            this.bolas.push(bola);

            // Insere o elemento HTML da bola no campo, tornando-a visível na interface
            this.elemento.appendChild(bola.elemento);
        }

            
        // Função para adicionar um jogador adversário na posição especificada
        adicionarJogadorAdversario(x, y) {
            // Cria uma nova instância da classe JogadorAdversario
            // Passa o ID baseado no tamanho atual do array de jogadores adversários, as coordenadas (x, y) e uma referência à classe Campo
            const jogador2 = new JogadorAdversario(this.jogadoresAdversarios.length, x, y, this);

            // Adiciona o jogador adversário recém-criado ao array que gerencia todos os jogadores adversários
            this.jogadoresAdversarios.push(jogador2);

            // Insere o elemento HTML do jogador adversário no campo, tornando-o visível na interface
            this.elemento.appendChild(jogador2.elemento);
        }

            
        // Função para adicionar o goleiro adversário na posição especificada
        adicionarGoleiroAdversario(x, y) {
            // Cria uma nova instância da classe GoleiroAdversario
            // Passa o ID baseado no tamanho atual do array de goleiros adversários, as coordenadas (x, y) e uma referência à classe Campo
            const goleiro2 = new GoleiroAdversario(this.goleirosAdversarios.length, x, y, this);

            // Adiciona o goleiro adversário recém-criado ao array que gerencia todos os goleiros adversários
            this.goleirosAdversarios.push(goleiro2);

            // Insere o elemento HTML do goleiro adversário no campo, tornando-o visível na interface
            this.elemento.appendChild(goleiro2.elemento);
        }


        // Método para inicializar os controles do campo
        initControls() {
            // Obtém o botão de iniciar a partida pelo seu ID no DOM
            const startBtn = document.getElementById('start');

            // Obtém o botão de resetar o campo pelo seu ID no DOM
            const resetBtn = document.getElementById('reset');

            // Adiciona um evento de clique ao botão de iniciar a partida
            // Quando clicado, chama o método 'iniciarJogada' para começar a jogada
            startBtn.addEventListener('click', () => this.iniciarJogada());

            // Adiciona um evento de clique ao botão de resetar o campo
            // Quando clicado, chama o método 'resetarCampo' para limpar e reiniciar o campo
            resetBtn.addEventListener('click', () => this.resetarCampo());

            // Adiciona um evento que escuta mudanças no tamanho da janela (resize)
            // Quando a janela é redimensionada, o campo é resetado para manter a consistência
            window.addEventListener('resize', () => this.resetarCampo());
        }


        // Método para iniciar a jogada, executando os movimentos planejados
        iniciarJogada() {
            // Itera sobre cada movimento armazenado no array de movimentos planejados
            this.movimentosPlanejados.forEach(({ element, x, y }) => {
                // Chama o método 'mover' no elemento, passando as coordenadas X e Y de destino
                element.mover(x, y);
            });

            // Após executar todos os movimentos planejados, limpa o array para preparar novas jogadas
            this.movimentosPlanejados = [];
        }


            // Função para resetar o campo
        resetarCampo() {
            // --------------------------- Remove tudo no campo ---------------------------

            // Remove todos os elementos visuais e limpa os arrays relacionados a jogadores
            this.jogadores.forEach(jogador => jogador.remove());
            this.goleiros.forEach(goleiro => goleiro.remove());
            this.bolas.forEach(bola => bola.remove());
            this.jogadoresAdversarios.forEach(jogador => jogador.remove());
            this.goleirosAdversarios.forEach(goleiro => goleiro.remove());
            this.setas.forEach(seta => seta.remove());

            // Limpa os arrays que armazenam os objetos relacionados ao estado do campo
            this.jogadores = [];
            this.goleiros = [];
            this.bolas = [];
            this.jogadoresAdversarios = [];
            this.goleirosAdversarios = [];
            this.setas = [];
            this.movimentosPlanejados = [];

            // Remove todos os filhos do elemento SVG que contém as setas
            while (this.arrowsSVG.firstChild) {
                this.arrowsSVG.removeChild(this.arrowsSVG.firstChild);
            }

            // ---------------------------------------------------------------------------
        }


        // Método para inicializar a funcionalidade de desenho de setas
        initArrowDrawing() {
            // Adiciona um evento de clique no elemento do campo
            // Quando o campo é clicado, executa o método 'handleFieldClick'
            this.elemento.addEventListener('click', (e) => this.handleFieldClick(e));
        }


        // Método para lidar com cliques no campo, gerenciando seleção de elementos e desenho de setas
        handleFieldClick(e) {
            // Obtém o elemento clicado mais próximo que seja um jogador, goleiro ou bola
            const target = e.target.closest('.jogador, .goleiro, .bola');

            // Obtém a posição do mouse relativa ao campo no momento do clique
            const pos = this.getMousePosition(e);

            if (target) {
                // Obtém a referência do elemento correspondente ao elemento DOM clicado
                const element = this.getElementByDOM(target);

                if (!this.originElement) {
                    // Se nenhum elemento de origem está selecionado, seleciona o elemento atual
                    this.originElement = element;
                    target.classList.add('selected'); // Adiciona uma classe CSS para destacar o elemento
                } else if (this.originElement === element) {
                    // Se o mesmo elemento é clicado novamente, deseleciona-o
                    this.originElement = null;
                    target.classList.remove('selected'); // Remove a classe de destaque
                } else {
                    // Se um elemento de origem está selecionado e outro elemento é clicado, desenha uma seta entre eles
                    this.adicionarSeta(this.originElement, element); // Adiciona a seta
                    this.originElement.elemento.classList.remove('selected'); // Remove o destaque do elemento de origem
                    this.originElement = null; // Reseta o elemento de origem
                }
            } else {
                // Caso o clique não seja em um elemento específico, verifica se há um elemento de origem selecionado
                if (this.originElement) {
                    // Move o elemento de origem para a posição clicada no campo
                    this.moverParaPosicaoClique(this.originElement, pos.x, pos.y);
                    this.originElement.elemento.classList.remove('selected'); // Remove o destaque do elemento de origem
                    this.originElement = null; // Reseta o elemento de origem
                }
            }
        }


        // Método para planejar o movimento de um elemento para uma posição clicada
        moverParaPosicaoClique(element, x, y) {
            // Adiciona um objeto ao array de movimentos planejados
            // O objeto contém:
            // - `element`: referência ao elemento que será movido
            // - `x`: coordenada X de destino
            // - `y`: coordenada Y de destino
            this.movimentosPlanejados.push({ element, x, y });
        }


            // Método para obter o objeto associado a um elemento DOM específico
        getElementByDOM(domElement) {
            // Percorre todos os jogadores do time e verifica se o elemento DOM corresponde
            for (let jogador of this.jogadores) {
                if (jogador.elemento === domElement) return jogador;
            }

            // Percorre todos os goleiros do time e verifica se o elemento DOM corresponde
            for (let goleiro of this.goleiros) {
                if (goleiro.elemento === domElement) return goleiro;
            }

            // Percorre todas as bolas no campo e verifica se o elemento DOM corresponde
            for (let bola of this.bolas) {
                if (bola.elemento === domElement) return bola;
            }

            // Percorre todos os jogadores adversários e verifica se o elemento DOM corresponde
            for (let jogador of this.jogadoresAdversarios) {
                if (jogador.elemento === domElement) return jogador;
            }

            // Percorre todos os goleiros adversários e verifica se o elemento DOM corresponde
            for (let goleiro of this.goleirosAdversarios) {
                if (goleiro.elemento === domElement) return goleiro;
            }

            // Se nenhum objeto correspondente for encontrado, retorna null
            return null;
        }


        // Método para adicionar uma seta entre dois elementos
        adicionarSeta(origem, destino) {
            // Cria uma nova instância da classe Seta
            // Passa o elemento de origem, o elemento de destino e o contêiner SVG para desenhar a seta
            const seta = new Seta(origem, destino, this.arrowsSVG);

            // Adiciona a seta recém-criada ao array de setas, que gerencia todas as setas do campo
            this.setas.push(seta);

            // Planeja o movimento do elemento de origem para a posição do destino
            this.movimentosPlanejados.push({
                element: origem, // Elemento que será movido
                x: destino.posicao.x, // Coordenada X do destino
                y: destino.posicao.y, // Coordenada Y do destino
            });
        }


        // Método para obter as coordenadas do centro de um elemento
        getElementCenter(element) {
            // Obtém as dimensões e a posição do elemento no viewport
            const rect = element.getBoundingClientRect();

            // Calcula as coordenadas X e Y do centro do elemento
            return {
                x: rect.left + rect.width / 2, // Posição esquerda + metade da largura
                y: rect.top + rect.height / 2  // Posição superior + metade da altura
            };
        }



        // Método para inicializar as formações predefinidas
        initFormacoes() {
            // Obtém todos os botões de formação para a equipe principal
            const botoesEquipe = document.querySelectorAll('.botao-formacao-equipe');

            // Obtém todos os botões de formação para a equipe adversária
            const botoesAdversario = document.querySelectorAll('.botao-formacao-adversario');

            // Obtém todos os botões de formação para a equipe principal na interface mobile
            const botoesEquipeMobile = document.querySelectorAll('.botao-formacao-equipe-mobile');

            // Obtém todos os botões de formação para a equipe adversária na interface mobile
            const botoesAdversarioMobile = document.querySelectorAll('.botao-formacao-adversario-mobile');

            // Adiciona eventos de clique para botões de formação da equipe principal
            botoesEquipe.forEach(botao => {
                // No clique, aplica a formação correspondente
                botao.addEventListener('click', () => {
                    this.aplicarFormacaoEquipe(botao.dataset.formacao); // `dataset.formacao` contém o identificador da formação
                });
            });

            // Adiciona eventos de clique para botões de formação da equipe principal na interface mobile
            botoesEquipeMobile.forEach(botao => {
                // No clique, aplica a formação correspondente para o mobile
                botao.addEventListener('click', () => {
                    this.aplicarFormacaoEquipeMobile(botao.dataset.formacao); // Usando a formação apropriada para mobile
                });
            });

            // Adiciona eventos de clique para botões de formação da equipe adversária
            botoesAdversario.forEach(botao => {
                // No clique, aplica a formação correspondente para o adversário
                botao.addEventListener('click', () => {
                    this.aplicarFormacaoAdversario(botao.dataset.formacao);
                });
            });

            // Adiciona eventos de clique para botões de formação da equipe adversária na interface mobile
            botoesAdversarioMobile.forEach(botao => {
                // No clique, aplica a formação correspondente para o adversário no mobile
                botao.addEventListener('click', () => {
                    this.aplicarFormacaoAdversarioMobile(botao.dataset.formacao);
                });
            });
        }



            // Função para aplicar a formação de equipe
            aplicarFormacaoEquipe(formacao) {
                // reseta o campo de equipe
                this.resetarCampoEquipe();

                // Para cada caso de formação predefinida
                switch (formacao) {
                    case '4-4-2':
                        this.adicionarJogador(280, 150); // Meio-campista Lateral x
                        this.adicionarJogador(280, 250); // Meio-campista Central x
                        this.adicionarJogador(280, 350); // Centroavante x
                        this.adicionarJogador(280, 450); // Meio-campista Central x
                        this.adicionarJogador(500, 150); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(500, 250); // Lateral x
                        this.adicionarJogador(500, 350); // Zagueiro Central x
                        this.adicionarJogador(500, 450); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(625, 250); // Zagueiro Central x
                        this.adicionarJogador(625, 350); // Lateral x
                        this.adicionarGoleiro(50, 300); // Goleiro x 
                        break;

                    case '4-3-3':
                        this.adicionarJogador(280, 150); // Meio-campista Lateral x
                        this.adicionarJogador(280, 250); // Meio-campista Central x
                        this.adicionarJogador(280, 350); // Centroavante x
                        this.adicionarJogador(280, 450); // Meio-campista Central x
                        this.adicionarJogador(500, 200); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(500, 300); // Lateral x
                        this.adicionarJogador(500, 400); // Zagueiro Central x
                        this.adicionarJogador(625, 200); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(625, 300); // Zagueiro Central x
                        this.adicionarJogador(625, 400); // Lateral x
                        this.adicionarGoleiro(50, 300); // Goleiro x 
                        break;

                    case '3-5-2':
                        this.adicionarJogador(280, 200); // Meio-campista Lateral x
                        this.adicionarJogador(280, 300); // Meio-campista Central x
                        this.adicionarJogador(280, 400); // Centroavante x
                        this.adicionarJogador(500, 100); // Meio-campista Central x
                        this.adicionarJogador(500, 200); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(500, 300); // Lateral x
                        this.adicionarJogador(500, 400); // Zagueiro Central x
                        this.adicionarJogador(500, 500); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(625, 250); // Zagueiro Central x
                        this.adicionarJogador(625, 350); // Lateral x
                        this.adicionarGoleiro(50, 300); // Goleiro x 
                        break;

                    case '4-2-3-1':
                        this.adicionarJogador(280, 150); // Meio-campista Lateral x
                        this.adicionarJogador(280, 250); // Meio-campista Central x
                        this.adicionarJogador(280, 350); // Centroavante x
                        this.adicionarJogador(280, 450); // Meio-campista Central x
                        this.adicionarJogador(400, 250); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(400, 350); // Lateral x
                        this.adicionarJogador(520, 200); // Zagueiro Central x
                        this.adicionarJogador(520, 300); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(520, 400); // Zagueiro Central x
                        this.adicionarJogador(625, 300); // Lateral x
                        this.adicionarGoleiro(50, 300); // Goleiro x  
                        break;

                    case '5-3-2':
                        this.adicionarJogador(280, 100); // Meio-campista Lateral x
                        this.adicionarJogador(280, 200); // Meio-campista Central x
                        this.adicionarJogador(280, 300); // Centroavante x
                        this.adicionarJogador(280, 400); // Meio-campista Central x
                        this.adicionarJogador(280, 500); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(500, 100); // Lateral x
                        this.adicionarJogador(500, 300); // Zagueiro Central x
                        this.adicionarJogador(500, 500); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(625, 250); // Zagueiro Central x
                        this.adicionarJogador(625, 350); // Lateral x
                        this.adicionarGoleiro(50, 300); // Goleiro x 
                        break;

                    case '3-4-3':
                        this.adicionarJogador(280, 200); // Meio-campista Lateral x
                        this.adicionarJogador(280, 300); // Meio-campista Central x
                        this.adicionarJogador(280, 400); // Centroavante x
                        this.adicionarJogador(500, 150); // Meio-campista Central x
                        this.adicionarJogador(500, 250); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(500, 350); // Lateral x
                        this.adicionarJogador(500, 450); // Zagueiro Central x
                        this.adicionarJogador(625, 200); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(625, 300); // Zagueiro Central x
                        this.adicionarJogador(625, 400); // Lateral x
                        this.adicionarGoleiro(50, 300); // Goleiro x 
                        break;

                    case '4-1-4-1':
                        this.adicionarJogador(280, 150); // Meio-campista Lateral x
                        this.adicionarJogador(280, 250); // Meio-campista Central x
                        this.adicionarJogador(280, 350); // Centroavante x
                        this.adicionarJogador(280, 450); // Meio-campista Central x
                        this.adicionarJogador(400, 300); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(520, 150); // Lateral x
                        this.adicionarJogador(520, 250); // Zagueiro Central x
                        this.adicionarJogador(520, 350); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(520, 450); // Zagueiro Central x
                        this.adicionarJogador(625, 300); // Lateral x
                        this.adicionarGoleiro(50, 300); // Goleiro x        
                        break;
                }
            }

            // Função para aplicar a formação de equipe adversária
            aplicarFormacaoAdversario(formacao) {
                this.resetarCampoAdversario(); // Isso aqui limpa, para que toda vez que clicarem para alterar ele limpa o que estiver antes.
                
                // Para cada caso de formação predefinida
                switch (formacao) {
                    case '4-4-2':
                        this.adicionarJogadorAdversario(625, 150); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(625, 250); // Meio-campista Central x
                        this.adicionarJogadorAdversario(625, 350); // Centroavante x
                        this.adicionarJogadorAdversario(625, 450); // Meio-campista Central x
                        this.adicionarJogadorAdversario(400, 150); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(400, 250); // Lateral x
                        this.adicionarJogadorAdversario(400, 350); // Zagueiro Central x
                        this.adicionarJogadorAdversario(400, 450); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(280, 250); // Zagueiro Central x
                        this.adicionarJogadorAdversario(280, 350); // Lateral x
                        this.adicionarGoleiroAdversario(840, 300); // Goleiro x  
                        break;

                    case '4-3-3':
                        this.adicionarJogadorAdversario(625, 150); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(625, 250); // Meio-campista Central x
                        this.adicionarJogadorAdversario(625, 350); // Centroavante x
                        this.adicionarJogadorAdversario(625, 450); // Meio-campista Central x
                        this.adicionarJogadorAdversario(400, 200); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(400, 300); // Lateral x
                        this.adicionarJogadorAdversario(400, 400); // Zagueiro Central x
                        this.adicionarJogadorAdversario(280, 200); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(280, 300); // Zagueiro Central x
                        this.adicionarJogadorAdversario(280, 400); // Lateral x
                        this.adicionarGoleiroAdversario(840, 300); // Goleiro x  
                        break;

                    case '3-5-2':
                        this.adicionarJogadorAdversario(625, 200); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(625, 300); // Meio-campista Central x
                        this.adicionarJogadorAdversario(625, 400); // Centroavante x
                        this.adicionarJogadorAdversario(400, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(400, 200); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(400, 300); // Lateral x
                        this.adicionarJogadorAdversario(400, 400); // Zagueiro Central x
                        this.adicionarJogadorAdversario(400, 500); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(280, 250); // Zagueiro Central x
                        this.adicionarJogadorAdversario(280, 350); // Lateral x
                        this.adicionarGoleiroAdversario(840, 300); // Goleiro x  
                        break;

                    case '4-2-3-1':
                        this.adicionarJogadorAdversario(625, 150); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(625, 250); // Meio-campista Central x
                        this.adicionarJogadorAdversario(625, 350); // Centroavante x
                        this.adicionarJogadorAdversario(625, 450); // Meio-campista Central x
                        this.adicionarJogadorAdversario(500, 250); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(500, 350); // Lateral x
                        this.adicionarJogadorAdversario(350, 200); // Zagueiro Central x
                        this.adicionarJogadorAdversario(350, 300); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(350, 400); // Zagueiro Central x
                        this.adicionarJogadorAdversario(250, 300); // Lateral x
                        this.adicionarGoleiroAdversario(840, 300); // Goleiro x   
                        break;

                    case '5-3-2':
                        this.adicionarJogadorAdversario(625, 100); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(625, 200); // Meio-campista Central x
                        this.adicionarJogadorAdversario(625, 300); // Centroavante x
                        this.adicionarJogadorAdversario(625, 400); // Meio-campista Central x
                        this.adicionarJogadorAdversario(625, 500); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(400, 100); // Lateral x
                        this.adicionarJogadorAdversario(400, 300); // Zagueiro Central x
                        this.adicionarJogadorAdversario(400, 500); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(280, 250); // Zagueiro Central x
                        this.adicionarJogadorAdversario(280, 350); // Lateral x
                        this.adicionarGoleiroAdversario(840, 300); // Goleiro x   
                        break;

                    case '3-4-3':
                        this.adicionarJogadorAdversario(625, 200); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(625, 300); // Meio-campista Central x
                        this.adicionarJogadorAdversario(625, 400); // Centroavante x
                        this.adicionarJogadorAdversario(400, 150); // Meio-campista Central x
                        this.adicionarJogadorAdversario(400, 250); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(400, 350); // Lateral x
                        this.adicionarJogadorAdversario(400, 450); // Zagueiro Central x
                        this.adicionarJogadorAdversario(280, 200); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(280, 300); // Zagueiro Central x
                        this.adicionarJogadorAdversario(280, 400); // Lateral x
                        this.adicionarGoleiroAdversario(840, 300); // Goleiro x   
                        break;

                    case '4-1-4-1':
                        this.adicionarJogadorAdversario(625, 150); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(625, 250); // Meio-campista Central x
                        this.adicionarJogadorAdversario(625, 350); // Centroavante x
                        this.adicionarJogadorAdversario(625, 450); // Meio-campista Central x
                        this.adicionarJogadorAdversario(500, 300); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(350, 150); // Lateral x
                        this.adicionarJogadorAdversario(350, 250); // Zagueiro Central x
                        this.adicionarJogadorAdversario(350, 350); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(350, 450); // Zagueiro Central x
                        this.adicionarJogadorAdversario(250, 300); // Lateral x
                        this.adicionarGoleiroAdversario(840, 300); // Goleiro x        
                        break;
                }
            }


            // Função para aplicar a formação de equipe (Mobile)
            aplicarFormacaoEquipeMobile(formacao) {
                this.resetarCampoEquipe();
                switch (formacao) {
                    case '4-4-2':
                        this.adicionarJogador(50, 220); // Meio-campista Lateral x
                        this.adicionarJogador(90, 220); // Meio-campista Central x
                        this.adicionarJogador(130, 220); // Centroavante x
                        this.adicionarJogador(170, 220); // Meio-campista Central x
                        this.adicionarJogador(50, 140); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(90, 140); // Lateral x
                        this.adicionarJogador(130, 140); // Zagueiro Central x
                        this.adicionarJogador(170, 140); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(90, 100); // Zagueiro Central x
                        this.adicionarJogador(130, 100); // Lateral x
                        this.adicionarGoleiro(110, 300); // Goleiro x 
                        break;

                    case '4-3-3':
                        this.adicionarJogador(50, 220); // Meio-campista Lateral x
                        this.adicionarJogador(90, 220); // Meio-campista Central x
                        this.adicionarJogador(130, 220); // Centroavante x
                        this.adicionarJogador(170, 220); // Meio-campista Central x
                        this.adicionarJogador(70, 140); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(110, 140); // Lateral x
                        this.adicionarJogador(150, 140); // Zagueiro Central x
                        this.adicionarJogador(70, 100); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(110, 100); // Zagueiro Central x
                        this.adicionarJogador(150, 100); // Lateral x
                        this.adicionarGoleiro(110, 300); // Goleiro x 
                        break;

                    case '3-5-2':
                        this.adicionarJogador(70, 220); // Meio-campista Lateral x
                        this.adicionarJogador(110, 220); // Meio-campista Central x
                        this.adicionarJogador(150, 220); // Centroavante x
                        this.adicionarJogador(50, 140); // Meio-campista Central x
                        this.adicionarJogador(80, 140); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(110, 140); // Lateral x
                        this.adicionarJogador(140, 140); // Zagueiro Central x
                        this.adicionarJogador(170, 140); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(90, 100); // Zagueiro Central x
                        this.adicionarJogador(130, 100); // Lateral x
                        this.adicionarGoleiro(110, 300); // Goleiro x 
                        break;

                    case '4-2-3-1':
                        this.adicionarJogador(50, 220); // Meio-campista Lateral x
                        this.adicionarJogador(90, 220); // Meio-campista Central x
                        this.adicionarJogador(130, 220); // Centroavante x
                        this.adicionarJogador(170, 220); // Meio-campista Central x
                        this.adicionarJogador(90, 180); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(130, 180); // Lateral x
                        this.adicionarJogador(70, 140); // Zagueiro Central x
                        this.adicionarJogador(110, 140); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(150, 140); // Zagueiro Central x
                        this.adicionarJogador(110, 100); // Lateral x
                        this.adicionarGoleiro(110, 300); // Goleiro x  
                        break;

                    case '5-3-2':
                        this.adicionarJogador(50, 220); // Meio-campista Lateral x
                        this.adicionarJogador(80, 220); // Meio-campista Central x
                        this.adicionarJogador(110, 220); // Centroavante x
                        this.adicionarJogador(140, 220); // Meio-campista Central x
                        this.adicionarJogador(170, 220); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(50, 140); // Lateral x
                        this.adicionarJogador(110, 140); // Zagueiro Central x
                        this.adicionarJogador(170, 140); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(90, 100); // Zagueiro Central x
                        this.adicionarJogador(130, 100); // Lateral x
                        this.adicionarGoleiro(110, 300); // Goleiro x 
                        break;

                    case '3-4-3':
                        this.adicionarJogador(70, 220); // Meio-campista Lateral x
                        this.adicionarJogador(110, 220); // Meio-campista Central x
                        this.adicionarJogador(150, 220); // Centroavante x
                        this.adicionarJogador(50, 140); // Meio-campista Central x
                        this.adicionarJogador(90, 140); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(130, 140); // Lateral x
                        this.adicionarJogador(170, 140); // Zagueiro Central x
                        this.adicionarJogador(70, 100); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(110, 100); // Zagueiro Central x
                        this.adicionarJogador(150, 100); // Lateral x
                        this.adicionarGoleiro(110, 300); // Goleiro x 
                        break;

                    case '4-1-4-1':
                        this.adicionarJogador(50, 220); // Meio-campista Lateral x
                        this.adicionarJogador(90, 220); // Meio-campista Central x
                        this.adicionarJogador(130, 220); // Centroavante x
                        this.adicionarJogador(170, 220); // Meio-campista Central x
                        this.adicionarJogador(110, 180); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogador(50, 140); // Lateral x
                        this.adicionarJogador(90, 140); // Zagueiro Central x
                        this.adicionarJogador(130, 140); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogador(170, 140); // Zagueiro Central x
                        this.adicionarJogador(110, 100); // Lateral x
                        this.adicionarGoleiro(110, 300); // Goleiro x        
                        break;
                }
            }

            // Função para aplicar a formação de equipe adversária (Mobile)
            aplicarFormacaoAdversarioMobile(formacao) {
                this.resetarCampoAdversario(); // Isso aqui limpa, para que toda vez que clicarem para alterar ele limpa o que estiver antes.
                switch (formacao) {
                    case '4-4-2':
                        this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(90, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(130, 100); // Centroavante x
                        this.adicionarJogadorAdversario(170, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(50, 180); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(90, 180); // Lateral x
                        this.adicionarJogadorAdversario(130, 180); // Zagueiro Central x
                        this.adicionarJogadorAdversario(170, 180); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(90, 220); // Zagueiro Central x
                        this.adicionarJogadorAdversario(130, 220); // Lateral x
                        this.adicionarGoleiroAdversario(110, 30); // Goleiro x  
                        break;

                    case '4-3-3':
                        this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(90, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(130, 100); // Centroavante x
                        this.adicionarJogadorAdversario(170, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(70, 180); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(110, 180); // Lateral x
                        this.adicionarJogadorAdversario(150, 180); // Zagueiro Central x
                        this.adicionarJogadorAdversario(70, 220); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(110, 220); // Zagueiro Central x
                        this.adicionarJogadorAdversario(150, 220); // Lateral x
                        this.adicionarGoleiroAdversario(110, 30); // Goleiro x 
                        break;

                    case '3-5-2':
                        this.adicionarJogadorAdversario(70, 100); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(110, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(150, 100); // Centroavante x
                        this.adicionarJogadorAdversario(50, 180); // Meio-campista Central x
                        this.adicionarJogadorAdversario(80, 180); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(110, 180); // Lateral x
                        this.adicionarJogadorAdversario(140, 180); // Zagueiro Central x
                        this.adicionarJogadorAdversario(170, 180); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(90, 220); // Zagueiro Central x
                        this.adicionarJogadorAdversario(130, 220); // Lateral x
                        this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                        break;

                    case '4-2-3-1':
                        this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(90, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(130, 100); // Centroavante x
                        this.adicionarJogadorAdversario(170, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(90, 140); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(130, 140); // Lateral x
                        this.adicionarJogadorAdversario(70, 180); // Zagueiro Central x
                        this.adicionarJogadorAdversario(110, 180); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(150, 180); // Zagueiro Central x
                        this.adicionarJogadorAdversario(110, 220); // Lateral x
                        this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                        break;

                    case '5-3-2':
                        this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(80, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(110, 100); // Centroavante x
                        this.adicionarJogadorAdversario(140, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(170, 100); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(50, 180); // Lateral x
                        this.adicionarJogadorAdversario(110, 180); // Zagueiro Central x
                        this.adicionarJogadorAdversario(170, 180); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(90, 220); // Zagueiro Central x
                        this.adicionarJogadorAdversario(130, 220); // Lateral x
                        this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                        break;

                    case '3-4-3':
                        this.adicionarJogadorAdversario(70, 100); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(110, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(150, 100); // Centroavante x
                        this.adicionarJogadorAdversario(50, 180); // Meio-campista Central x
                        this.adicionarJogadorAdversario(90, 180); // Zagueiro Central x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(130, 180); // Lateral x
                        this.adicionarJogadorAdversario(170, 180); // Zagueiro Central x
                        this.adicionarJogadorAdversario(70, 220); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(110, 220); // Zagueiro Central x
                        this.adicionarJogadorAdversario(150, 220); // Lateral x
                        this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                        break;

                    case '4-1-4-1':
                        this.adicionarJogadorAdversario(50, 100); // Meio-campista Lateral x
                        this.adicionarJogadorAdversario(90, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(130, 100); // Centroavante x
                        this.adicionarJogadorAdversario(170, 100); // Meio-campista Central x
                        this.adicionarJogadorAdversario(110, 140); // Meio-campista Lateral x
                        //------------- Acima é a parte de cima do campo ⬆️👍😁----------//
                        //------------------ Passou do meio de campo ---------------------//
                        this.adicionarJogadorAdversario(50, 180); // Lateral x
                        this.adicionarJogadorAdversario(90, 180); // Zagueiro Central x
                        this.adicionarJogadorAdversario(130, 180); // Volante (Meio-campista Defensivo) x
                        this.adicionarJogadorAdversario(170, 180); // Zagueiro Central x
                        this.adicionarJogadorAdversario(110, 220); // Lateral x
                        this.adicionarGoleiroAdversario(110, 30); // Goleiro x
                        break;
                }
            }

        // Função para limpar o campo da equipe
        resetarCampoEquipe() {
            // Remove cada jogador do campo
            this.jogadores.forEach(jogador => jogador.remove());

            // Remove cada goleiro do campo
            this.goleiros.forEach(goleiro => goleiro.remove());

            // Esvazia o array de jogadores para limpar o estado interno
            this.jogadores = [];

            // Esvazia o array de goleiros para limpar o estado interno
            this.goleiros = [];
        }



        // Função para limpar o campo do adversário
        resetarCampoAdversario() { 
            // Remove cada jogador adversário do campo
            this.jogadoresAdversarios.forEach(jogador => jogador.remove());

            // Remove cada goleiro adversário do campo
            this.goleirosAdversarios.forEach(goleiro => goleiro.remove());

            // Esvazia o array de jogadores adversários para limpar o estado interno
            this.jogadoresAdversarios = [];

            // Esvazia o array de goleiros adversários para limpar o estado interno
            this.goleirosAdversarios = [];
        }

        }


        // Classe que representa um jogador
        class Jogador {
            constructor(id, x, y, campo) {
                // ID único do jogador
                this.id = id;

                // Referência ao campo em que o jogador está inserido
                this.campo = campo;

                // Define a posição inicial do jogador como um objeto com coordenadas X e Y
                this.posicao = { x, y };

                // Cria o elemento HTML que representará o jogador no DOM
                this.elemento = this.criarElemento();

                // Define a posição inicial do elemento no campo, com base nas coordenadas fornecidas
                this.definirPosicaoInicial();

                // Ativa a funcionalidade de arrastar o jogador para novas posições
                this.initDrag();
            }


        // Método para criar o elemento HTML do jogador
        criarElemento() {
            // Cria um elemento <div> que representará o jogador no campo
            const jogador = document.createElement('div');

            // Adiciona a classe CSS 'jogador' para estilização específica do jogador
            jogador.classList.add('jogador');

            // Define o atributo 'draggable' como false para desativar o comportamento padrão de arraste do navegador
            jogador.setAttribute('draggable', 'false');

            // Garante que a div esteja vazia, removendo qualquer conteúdo preexistente (segurança e consistência)
            jogador.innerHTML = '';

            // Cria um elemento <img> para representar visualmente o jogador
            const img = document.createElement('img');
            img.src = 'img/jogador.png'; // Define o caminho para a imagem do jogador
            img.alt = 'Jogador'; // Adiciona texto alternativo para acessibilidade

            // Adiciona o elemento <img> como filho da div do jogador
            jogador.appendChild(img);

            // Retorna o elemento HTML completo para uso no DOM
            return jogador;
        }

            

        // Método para definir a posição inicial do jogador no campo
        definirPosicaoInicial() {
            // Usa um timeout de 0ms para garantir que o DOM esteja atualizado antes de calcular dimensões
            setTimeout(() => {
                // Define a posição horizontal (esquerda) do jogador no campo
                // Subtrai metade da largura do elemento para centralizá-lo em relação à posição X
                this.elemento.style.left = `${this.posicao.x - this.elemento.offsetWidth / 2}px`;

                // Define a posição vertical (superior) do jogador no campo
                // Subtrai metade da altura do elemento para centralizá-lo em relação à posição Y
                this.elemento.style.top = `${this.posicao.y - this.elemento.offsetHeight / 2}px`;
            }, 0);
        }


        // Método para inicializar a funcionalidade de arrastar o jogador
        initDrag() {
            let isDragging = false; // Variável para indicar se o jogador está sendo arrastado
            let offset = { x: 0, y: 0 }; // Objeto para armazenar o deslocamento inicial do clique

            // Evento de mousedown: inicia o arraste
            this.elemento.addEventListener('mousedown', (e) => {
                isDragging = true; // Marca que o jogador está sendo arrastado

                // Obtém as dimensões e a posição do elemento
                const rect = this.elemento.getBoundingClientRect();

                // Calcula o deslocamento do clique dentro do elemento
                offset.x = e.clientX - rect.left; // Calcula o deslocamento no eixo X
                offset.y = e.clientY - rect.top; // Calcula o deslocamento no eixo Y

                // Altera o cursor para indicar que o jogador está sendo arrastado
                this.elemento.style.cursor = 'grabbing';

                // Previne comportamentos padrão do navegador, como seleção de texto
                e.preventDefault();
            });

            // Evento de mousemove: movimenta o jogador
            document.addEventListener('mousemove', (e) => {
                if (isDragging) { // Verifica se o jogador está sendo arrastado
                    const campoRect = this.campo.elemento.getBoundingClientRect();

                    // Calcula a nova posição relativa ao campo, respeitando os limites
                    let x = e.clientX - campoRect.left - offset.x + this.elemento.offsetWidth / 2;
                    let y = e.clientY - campoRect.top - offset.y + this.elemento.offsetHeight / 2;

                    // Restringe a posição para que o jogador permaneça dentro dos limites do campo
                    x = Math.max(0, Math.min(x, this.campo.elemento.offsetWidth));
                    y = Math.max(0, Math.min(y, this.campo.elemento.offsetHeight));

                    // Atualiza a posição visual do elemento no campo
                    this.elemento.style.left = `${x - this.elemento.offsetWidth / 2}px`;
                    this.elemento.style.top = `${y - this.elemento.offsetHeight / 2}px`;

                    // Atualiza a posição lógica do jogador
                    this.posicao = { x, y };
                }
            });

            // Evento de mouseup: finaliza o arraste
            document.addEventListener('mouseup', () => {
                if (isDragging) { // Verifica se o jogador estava sendo arrastado
                    isDragging = false; // Desativa o modo de arraste
                    this.elemento.style.cursor = 'grab'; // Restaura o cursor padrão
                }
            });
        }


        // Função para mover o jogador para uma nova posição
        mover(x, y) {
            // Define a animação de transição para o movimento
            this.elemento.style.transition = 'left 1.5s, top 1.5s';

            // Atualiza a posição horizontal do jogador no DOM
            // Subtrai metade da largura para centralizar no ponto de destino
            this.elemento.style.left = `${x - this.elemento.offsetWidth / 2}px`;

            // Atualiza a posição vertical do jogador no DOM
            // Subtrai metade da altura para centralizar no ponto de destino
            this.elemento.style.top = `${y - this.elemento.offsetHeight / 2}px`;

            // Atualiza a posição lógica do jogador, garantindo que a lógica interna esteja sincronizada com a interface
            this.posicao = { x, y };

            // Remove a animação de transição após sua conclusão
            setTimeout(() => {
                this.elemento.style.transition = ''; // Remove o estilo de transição
            }, 1500); // Duração em milissegundos deve corresponder ao tempo da animação
        }


        // Método para remover o elemento HTML do jogador
        remove() {
            // Remove o elemento associado ao jogador do DOM
            this.elemento.remove();
        }

        }



        // Classe que representa o goleiro, herdando da classe Jogador
        class Goleiro extends Jogador {
            // Sobrescreve o método criarElemento para personalizar o elemento HTML do goleiro
            criarElemento() {
                // Cria um elemento <div> para representar o goleiro no campo
                const goleiro = document.createElement('div');

                // Adiciona a classe CSS 'goleiro' para aplicar estilizações específicas
                goleiro.classList.add('goleiro');

                // Define o atributo 'draggable' como false, desativando o comportamento padrão de arraste do navegador
                goleiro.setAttribute('draggable', 'false');

                // Define o conteúdo HTML da div, incluindo uma imagem específica para o goleiro
                goleiro.innerHTML = `<img src="img/goleiro.png" alt="Goleiro">`;

                // Retorna o elemento HTML criado para uso no DOM
                return goleiro;
            }
        }


        // Classe que representa a bola, herdando da classe Jogador
        class Bola extends Jogador {
            // Sobrescreve o método criarElemento para personalizar o elemento HTML da bola
            criarElemento() {
                // Cria um elemento <div> para representar a bola no campo
                const bola = document.createElement('div');

                // Adiciona a classe CSS 'bola' para estilizações específicas da bola
                bola.classList.add('bola');

                // Define o atributo 'draggable' como false para desativar o comportamento padrão de arraste do navegador
                bola.setAttribute('draggable', 'false');

                // Define o conteúdo HTML da div com uma imagem da bola
                bola.innerHTML = `<img src="img/bola.png" alt="Bola">`;

                // Retorna o elemento HTML criado para uso no DOM
                return bola;
            }

            // Sobrescreve o método mover para personalizar o movimento da bola
            mover(x, y) {
                // Define uma transição mais rápida para o movimento da bola
                this.elemento.style.transition = 'left 0.5s, top 0.5s';

                // Atualiza a posição horizontal (esquerda) no DOM
                this.elemento.style.left = `${x - this.elemento.offsetWidth / 2}px`;

                // Atualiza a posição vertical (superior) no DOM
                this.elemento.style.top = `${y - this.elemento.offsetHeight / 2}px`;

                // Atualiza a posição lógica da bola
                this.posicao = { x, y };

                // Remove o estilo de transição após a movimentação
                setTimeout(() => {
                    this.elemento.style.transition = '';
                }, 500); // Duração deve coincidir com o tempo da transição
            }
        }


        // Classe que representa o jogador adversário, herdando da classe Jogador
        class JogadorAdversario extends Jogador {
            // Sobrescreve o método criarElemento para personalizar o elemento HTML do jogador adversário
            criarElemento() {
                // Cria um elemento <div> para representar o jogador adversário no campo
                const jogador2 = document.createElement('div');

                // Adiciona a classe CSS 'jogador' para aplicar estilizações específicas
                jogador2.classList.add('jogador');

                // Define o atributo 'draggable' como false para desativar o comportamento padrão de arraste do navegador
                jogador2.setAttribute('draggable', 'false');

                // Define o conteúdo HTML da div com uma imagem específica para o jogador adversário
                jogador2.innerHTML = `<img src="img/jogador2.png" alt="Jogador Adversário">`;

                // Retorna o elemento HTML criado para uso no DOM
                return jogador2;
            }
        }


        // Classe que representa o goleiro adversário, herdando da classe Goleiro
        class GoleiroAdversario extends Goleiro {
            // Sobrescreve o método criarElemento para personalizar o elemento HTML do goleiro adversário
            criarElemento() {
                // Cria um elemento <div> para representar o goleiro adversário no campo
                const goleiro2 = document.createElement('div');

                // Adiciona a classe CSS 'goleiro' para aplicar estilizações específicas do goleiro
                goleiro2.classList.add('goleiro');

                // Define o atributo 'draggable' como false para desativar o comportamento padrão de arraste do navegador
                goleiro2.setAttribute('draggable', 'false');

                // Define o conteúdo HTML da div com uma imagem específica para o goleiro adversário
                goleiro2.innerHTML = `<img src="img/goleiro2.png" alt="Goleiro Adversário">`;

                // Retorna o elemento HTML criado para uso no DOM
                return goleiro2;
            }
        }


        // Classe que representa uma seta
        class Seta {
            constructor(origem, destino, svgElement) {
                this.origem = origem; // Referência ao ponto de origem da seta (elemento ou posição)
                this.destino = destino; // Referência ao ponto de destino da seta (elemento ou posição)
                this.svgElement = svgElement; // Contêiner SVG onde a seta será desenhada
                this.line = null; // Referência ao elemento SVG da linha da seta
                this.desenharSeta(); // Chama o método para desenhar a seta no campo
            }

            // Método para desenhar a seta no campo
            desenharSeta() {
                // Cria um elemento SVG <line> para representar a seta
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

                // Define o ponto inicial da seta com base na posição do elemento de origem
                line.setAttribute("x1", this.origem.posicao.x);
                line.setAttribute("y1", this.origem.posicao.y);

                // Define o ponto final da seta com base na posição do elemento de destino
                line.setAttribute("x2", this.destino.posicao.x);
                line.setAttribute("y2", this.destino.posicao.y);

                // Define a cor e o estilo da linha
                line.setAttribute("stroke", "var(--cor-seta)"); // Cor da linha (usando CSS custom property)
                line.setAttribute("stroke-width", "2"); // Largura da linha
                line.setAttribute("marker-end", "url(#arrowhead)"); // Define um marcador (seta) na extremidade da linha

                // Adiciona a linha ao contêiner SVG
                this.svgElement.appendChild(line);

                // Armazena uma referência à linha para manipulações futuras
                this.line = line;
            }

            // Método para remover a seta do campo
            remove() {
                if (this.line) {
                    this.line.remove(); // Remove o elemento SVG <line> do DOM
                    this.line = null; // Limpa a referência à linha
                }
            }
        }



        // Seleciona todos os itens do menu lateral com a classe 'item-menu'
        var menuItem = document.querySelectorAll('.item-menu');

        // Função para ativar um link do menu quando selecionado
        function selectLink() {
            // Remove a classe 'ativo' de todos os itens do menu
            menuItem.forEach((item) => item.classList.remove('ativo'));

            // Adiciona a classe 'ativo' ao item que foi clicado
            this.classList.add('ativo');
        }


        // Adiciona um evento de clique a cada item do menu para executar a função selectLink
        menuItem.forEach((item) =>
            item.addEventListener('click', selectLink)
        );

        // Seleciona o botão de expandir/recolher o menu lateral pelo ID 'btn-exp'
        var btnExp = document.querySelector('#btn-exp');

        // Seleciona o menu lateral pela classe 'menu-lateral'
        var menuSide = document.querySelector('.menu-lateral');


        // Adiciona um evento de clique ao botão de expandir/recolher o menu lateral
        btnExp.addEventListener('click', function() {
            // Alterna a classe 'expandir' no menu lateral para expandi-lo ou recolhê-lo
            menuSide.classList.toggle('expandir');

            // Verifica se o menu está expandido
            if (menuSide.classList.contains('expandir')) {
                // Se o menu estiver expandido, permite rolagem interna
                menuSide.style.overflow = 'auto';
            } else {
                // Se o menu estiver recolhido, desativa a rolagem interna
                menuSide.style.overflow = 'hidden';
            }

            // Alterna a classe 'open' no elemento com ID 'toolbar'
            // Mostra ou esconde a seleção de jogadores
            document.getElementById('toolbar').classList.toggle('open');
        });




