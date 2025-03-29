// Não queroooooooooooooooooo codarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
// Parte 10/todas do codigo javascript 😭


            // Classe para controlar os frames (takes) no campo
        class FrameController {
            constructor(campo) {
                // Referência ao campo de jogo
                this.campo = campo;

                // Array que armazena os takes capturados
                // Inicializa com um take capturado no estado atual do campo
                this.takes = [this.captureTake()];

                // Índice do take atualmente ativo
                this.currentTakeIndex = 0;

                // Indicador de reprodução
                this.isPlaying = false;

                // Tempo total da sequência de takes em milissegundos
                this.totalDuration = 0;

                // Inicializa os botões da interface de controle
                this.initButtons();

                // Cria a barra de progresso para exibir o status de reprodução
                this.createProgressBar();

                // Atualiza a lista de takes na interface do usuário
                this.updateTakesList();
            }



        // Método para inicializar os botões de controle
        initButtons() {
            // Obtém o botão para adicionar um take
            const addTakeButton = document.getElementById('btn-pause');

            // Obtém o botão para remover um take
            const removeTakeButton = document.getElementById('btn-remove-take');

            // Obtém o botão para reproduzir os takes
            const playButton = document.getElementById('btn-play');

            // Obtém o botão para parar a reprodução dos takes
            const stopButton = document.getElementById('btn-stop');

            // Obtém o botão para adicionar um take
            const addTakeButtonMobile = document.getElementById('btn-pause-mobile');

            // Obtém o botão para remover um take
            const removeTakeButtonMobile = document.getElementById('btn-remove-take-mobile');

            // Obtém o botão para reproduzir os takes
            const playButtonMobile = document.getElementById('btn-play-mobile');

            // Obtém o botão para parar a reprodução dos takes
            const stopButtonMobile = document.getElementById('btn-stop-mobile');

            // Adiciona um evento de clique ao botão de adicionar um take
            addTakeButton.addEventListener('click', () => this.addTake());

            // Adiciona um evento de clique ao botão de remover um take
            removeTakeButton.addEventListener('click', () => this.removeTake());

            // Adiciona um evento de clique ao botão de reproduzir os takes
            playButton.addEventListener('click', () => this.playTakes());

            // Adiciona um evento de clique ao botão de parar a reprodução dos takes
            stopButton.addEventListener('click', () => this.stopTakes());
            

            // Adiciona um evento de clique ao botão de adicionar um take
            addTakeButtonMobile.addEventListener('click', () => this.addTake());

            // Adiciona um evento de clique ao botão de remover um take
            removeTakeButtonMobile.addEventListener('click', () => this.removeTake());

            // Adiciona um evento de clique ao botão de reproduzir os takes
            playButtonMobile.addEventListener('click', () => this.playTakes());

            // Adiciona um evento de clique ao botão de parar a reprodução dos takes
            stopButtonMobile.addEventListener('click', () => this.stopTakes());
        }


        // Método para criar a barra de progresso
        createProgressBar() {
            const progressBarArea = document.getElementById('progress-bar-area');

            // Verifica se a barra de progresso já existe
            if (progressBarArea.querySelector('.progress-bar-container')) {
                // Caso já exista, apenas referencia a barra de progresso para manipulações futuras
                this.progressBar = progressBarArea.querySelector('.progress-bar');
                return;
            }

            // Criação do contêiner da barra de progresso
            const progressBarContainer = document.createElement('div');
            progressBarContainer.classList.add('progress-bar-container'); // Adiciona a classe para estilização

            // Criação da barra de progresso interna
            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar'); // Adiciona a classe para estilização

            // Adiciona a barra de progresso dentro do contêiner
            progressBarContainer.appendChild(progressBar);

            // Adiciona o contêiner ao elemento progress-bar-area
            progressBarArea.appendChild(progressBarContainer);

            // Salva a referência à barra de progresso para manipulações futuras
            this.progressBar = progressBar;
        }

                
                

        // Método para atualizar a barra de progresso
        updateProgressBar(currentTime, totalTime) {
            // Calcula o progresso como uma porcentagem do tempo total
            const progress = Math.min((currentTime / totalTime) * 100, 100);

            // Atualiza a largura da barra de progresso com o valor calculado
            this.progressBar.style.width = `${progress}%`;
        }

                

        // Método para adicionar um novo take
        addTake() {
            // Salva o estado atual no índice do take atual
            this.takes[this.currentTakeIndex] = this.captureTake();

            // Cria uma cópia profunda do estado capturado para evitar referências compartilhadas
            const newTake = JSON.parse(JSON.stringify(this.takes[this.currentTakeIndex]));

            // Adiciona o novo take ao final do array de takes
            this.takes.push(newTake);

            // Atualiza a duração total, considerando 3.5 segundos por take
            this.totalDuration = this.takes.length * 3500;

            // Define o índice do take atual como o último
            this.currentTakeIndex = this.takes.length - 1;

            // Atualiza a lista de takes na interface do usuário
            this.updateTakesList();
        }


        // Método para remover o take atual
        removeTake() {
            // Verifica se há mais de um take, pois pelo menos um deve ser mantido
            if (this.takes.length > 1) {
                // Remove o take no índice atual
                this.takes.splice(this.currentTakeIndex, 1);

                // Atualiza o índice do take atual para o anterior, garantindo que não seja negativo
                this.currentTakeIndex = Math.max(0, this.currentTakeIndex - 1);

                // Atualiza a duração total, assumindo 3.5 segundos por take
                this.totalDuration = this.takes.length * 3500;

                // Exibe imediatamente o take atualizado no índice atual
                this.showTakeInstantly(this.takes[this.currentTakeIndex]);

                // Atualiza a lista de takes na interface do usuário
                this.updateTakesList();
            }
        }


        // Método para capturar o estado atual do campo de jogo
        captureTake() {
            return {
                // Captura a posição e o tipo de cada jogador no campo
                jogadores: this.campo.jogadores.map(jogador => ({
                    id: jogador.id, // Identificador único do jogador
                    x: jogador.posicao.x, // Posição X atual
                    y: jogador.posicao.y, // Posição Y atual
                    type: 'jogador' // Tipo do elemento
                })),

                // Captura a posição e o tipo de cada bola no campo
                bolas: this.campo.bolas.map(bola => ({
                    x: bola.posicao.x, // Posição X atual
                    y: bola.posicao.y, // Posição Y atual
                    type: 'bola' // Tipo do elemento
                })),

                // Captura a posição, identificador e o tipo de cada goleiro no campo
                goleiros: this.campo.goleiros.map(goleiro => ({
                    id: goleiro.id, // Identificador único do goleiro
                    x: goleiro.posicao.x, // Posição X atual
                    y: goleiro.posicao.y, // Posição Y atual
                    type: 'goleiro' // Tipo do elemento
                })),

                // Captura a posição, identificador e o tipo de cada jogador adversário no campo
                jogadoresAdversarios: this.campo.jogadoresAdversarios.map(jogador => ({
                    id: jogador.id, // Identificador único do jogador adversário
                    x: jogador.posicao.x, // Posição X atual
                    y: jogador.posicao.y, // Pposição Y atual
                    type: 'jogadorAdversario' // Tipo do elemento
                })),

                // Captura a posição, identificador e o tipo de cada goleiro adversário no campo
                goleirosAdversarios: this.campo.goleirosAdversarios.map(goleiro => ({
                    id: goleiro.id, // Identificador único do goleiro adversário
                    x: goleiro.posicao.x, // Posição X atual
                    y: goleiro.posicao.y, // Posição Y atual
                    type: 'goleiroAdversario' // Tipo do elemento
                }))
            };
        }

                
                

        // Método para iniciar a reprodução dos takes
        playTakes() {
            // Verifica se já está reproduzindo ou se há menos de 2 takes disponíveis
            if (this.isPlaying || this.takes.length < 2) return;

            // Marca o estado como "reproduzindo"
            this.isPlaying = true;

            // Reinicia o índice do take atual para o primeiro
            this.currentTakeIndex = 0;

            // Reseta o campo para o estado do primeiro take
            this.showTakeInstantly(this.takes[0]);

            // Inicia a animação dos takes
            this.animateTakes();
        }


        animateTakes() {
            const duration = 3500; // Duração de cada take em ms
            const startTime = performance.now();
            const currentTake = this.takes[this.currentTakeIndex];
            const nextTake = this.takes[this.currentTakeIndex + 1];
        
            const animate = () => {
                if (!this.isPlaying) return;
        
                const elapsedTime = performance.now() - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
        
                // Interpola posições
                this.interpolateTake(currentTake, nextTake, progress);
        
                // Atualiza a barra de progresso
                const totalProgress = ((this.currentTakeIndex + progress) / (this.takes.length - 1)) * 105;
                this.updateProgressBar(totalProgress, 100);
        
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Move para o próximo take ou para quando terminar
                    if (this.currentTakeIndex < this.takes.length - 1) {
                        this.currentTakeIndex++;
                        this.setActiveTake(this.currentTakeIndex); // Marca o próximo take como ativo
                        this.animateTakes();
                    } else {
                        this.stopTakes();
                    }
                }
            };
        
            requestAnimationFrame(animate);
        }

        setActiveTake(index) {
            this.currentTakeIndex = index; // Atualiza o take atual
            const buttons = document.querySelectorAll('.take-button');
            buttons.forEach((button, i) => {
                button.classList.toggle('active', i === index); // Adiciona ou remove a classe 'active'
            });
        }
        
        

        interpolateTake(currentTake, nextTake, progress) {
            const lerp = (start, end, t) => start + (end - start) * t;
        
            // Interpola posições dos jogadores
            this.campo.jogadores.forEach((jogador, index) => {
                if (index < nextTake.jogadores.length) {
                    const start = currentTake.jogadores[index];
                    const end = nextTake.jogadores[index];
                    jogador.posicao.x = lerp(start.x, end.x, progress);
                    jogador.posicao.y = lerp(start.y, end.y, progress);
                    jogador.elemento.style.left = `${jogador.posicao.x}px`;
                    jogador.elemento.style.top = `${jogador.posicao.y}px`;
                }
            });
        
            // Interpola posições das bolas
            this.campo.bolas.forEach((bola, index) => {
                if (index < nextTake.bolas.length) {
                    const start = currentTake.bolas[index];
                    const end = nextTake.bolas[index];
                    bola.posicao.x = lerp(start.x, end.x, progress);
                    bola.posicao.y = lerp(start.y, end.y, progress);
                    bola.elemento.style.left = `${bola.posicao.x}px`;
                    bola.elemento.style.top = `${bola.posicao.y}px`;
                }
            });
        
            // Interpola posições dos goleiros
            this.campo.goleiros.forEach((goleiro, index) => {
                if (index < nextTake.goleiros.length) {
                    const start = currentTake.goleiros[index];
                    const end = nextTake.goleiros[index];
                    goleiro.posicao.x = lerp(start.x, end.x, progress);
                    goleiro.posicao.y = lerp(start.y, end.y, progress);
                    goleiro.elemento.style.left = `${goleiro.posicao.x}px`;
                    goleiro.elemento.style.top = `${goleiro.posicao.y}px`;
                }
            });
        
            // Interpola posições dos jogadores adversários
            this.campo.jogadoresAdversarios.forEach((jogador, index) => {
                if (index < nextTake.jogadoresAdversarios.length) {
                    const start = currentTake.jogadoresAdversarios[index];
                    const end = nextTake.jogadoresAdversarios[index];
                    jogador.posicao.x = lerp(start.x, end.x, progress);
                    jogador.posicao.y = lerp(start.y, end.y, progress);
                    jogador.elemento.style.left = `${jogador.posicao.x}px`;
                    jogador.elemento.style.top = `${jogador.posicao.y}px`;
                }
            });
        
            // Interpola posições dos goleiros adversários
            this.campo.goleirosAdversarios.forEach((goleiro, index) => {
                if (index < nextTake.goleirosAdversarios.length) {
                    const start = currentTake.goleirosAdversarios[index];
                    const end = nextTake.goleirosAdversarios[index];
                    goleiro.posicao.x = lerp(start.x, end.x, progress);
                    goleiro.posicao.y = lerp(start.y, end.y, progress);
                    goleiro.elemento.style.left = `${goleiro.posicao.x}px`;
                    goleiro.elemento.style.top = `${goleiro.posicao.y}px`;
                }
            });
        }
        

        stopTakes() {
            this.isPlaying = false;
            this.currentTakeIndex = 0;
            this.showTakeInstantly(this.takes[0]);
            this.updateProgressBar(0, 100);
        }

        updateTakesList() {
            const takesList = document.getElementById('takes-list');
            takesList.innerHTML = '';
        
            this.takes.forEach((_, index) => {
                const takeButton = document.createElement('button');
                takeButton.classList.add('take-button');
                takeButton.textContent = `${index + 1}`;
                if (index === this.currentTakeIndex) {
                    takeButton.classList.add('active');
                }
        
                takeButton.addEventListener('click', () => {
                    this.takes[this.currentTakeIndex] = this.captureTake(); // Salva o estado atual do take
                    this.currentTakeIndex = index; // Define o take clicado como o atual
                    this.setActiveTake(index); // Marca o botão como ativo
                    this.showTakeInstantly(this.takes[index]); // Mostra o estado do take selecionado
                });
        
                takesList.appendChild(takeButton);
            });
        }        

        showTakeInstantly(take) {
        // Atualiza as posições dos jogadores
        this.campo.jogadores.forEach((jogador, index) => {
            if (index < take.jogadores.length) {
                jogador.posicao.x = take.jogadores[index].x;
                jogador.posicao.y = take.jogadores[index].y;
                jogador.elemento.style.left = `${take.jogadores[index].x}px`;
                jogador.elemento.style.top = `${take.jogadores[index].y}px`;
            }
        });

        // Atualiza as posições das bolas
        this.campo.bolas.forEach((bola, index) => {
            if (index < take.bolas.length) {
                bola.posicao.x = take.bolas[index].x;
                bola.posicao.y = take.bolas[index].y;
                bola.elemento.style.left = `${take.bolas[index].x}px`;
                bola.elemento.style.top = `${take.bolas[index].y}px`;
            }
        });

        // Atualiza as posições dos goleiros
        this.campo.goleiros.forEach((goleiro, index) => {
            if (index < take.goleiros.length) {
                goleiro.posicao.x = take.goleiros[index].x;
                goleiro.posicao.y = take.goleiros[index].y;
                goleiro.elemento.style.left = `${take.goleiros[index].x}px`;
                goleiro.elemento.style.top = `${take.goleiros[index].y}px`;
            }
        });

        // Atualiza as posições dos jogadores adversários
        this.campo.jogadoresAdversarios.forEach((jogador, index) => {
            if (index < take.jogadoresAdversarios.length) {
                jogador.posicao.x = take.jogadoresAdversarios[index].x;
                jogador.posicao.y = take.jogadoresAdversarios[index].y;
                jogador.elemento.style.left = `${take.jogadoresAdversarios[index].x}px`;
                jogador.elemento.style.top = `${take.jogadoresAdversarios[index].y}px`;
            }
        });

        // Atualiza as posições dos goleiros adversários
        this.campo.goleirosAdversarios.forEach((goleiro, index) => {
            if (index < take.goleirosAdversarios.length) {
                goleiro.posicao.x = take.goleirosAdversarios[index].x;
                goleiro.posicao.y = take.goleirosAdversarios[index].y;
                goleiro.elemento.style.left = `${take.goleirosAdversarios[index].x}px`;
                goleiro.elemento.style.top = `${take.goleirosAdversarios[index].y}px`;
            }
        });
    }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const campo = new Campo();
        new FrameController(campo);
        let currentSpeed = 1; // Velocidade padrão é 1x
        const speedButton = document.getElementById("btn-speed");
        const speedIcon = document.getElementById("speed-icon");
        const speedIconMobile = document.getElementById("speed-icon-mobile");
        const speedOptions = document.querySelectorAll(".speed-option");

        // Define tempos exatos para cada velocidade
        const speeds = {
            1: 3500,
            2: 1750,
            3: 1166
        };

        // Função para atualizar as durações diretamente
        const updateDurations = (newDuration) => {
            // Alterar manualmente as durações nas funções necessárias
            FrameController.prototype.addTake = function () {
                this.takes[this.currentTakeIndex] = this.captureTake();
                const newTake = JSON.parse(JSON.stringify(this.takes[this.currentTakeIndex]));
                this.takes.push(newTake);
                this.totalDuration = this.takes.length * newDuration; // Atualiza duração
                this.currentTakeIndex = this.takes.length - 1;
                this.updateTakesList();
            };

            FrameController.prototype.removeTake = function () {
                if (this.takes.length > 1) {
                    this.takes.splice(this.currentTakeIndex, 1);
                    this.currentTakeIndex = Math.max(0, this.currentTakeIndex - 1);
                    this.totalDuration = this.takes.length * newDuration; // Atualiza duração
                    this.showTakeInstantly(this.takes[this.currentTakeIndex]);
                    this.updateTakesList();
                }
            };

            FrameController.prototype.animateTakes = function () {
                const duration = newDuration; // Atualiza a duração
                const startTime = performance.now();
                const currentTake = this.takes[this.currentTakeIndex];
                const nextTake = this.takes[this.currentTakeIndex + 1];

                const animate = () => {
                    if (!this.isPlaying) return;

                    const elapsedTime = performance.now() - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);

                    this.interpolateTake(currentTake, nextTake, progress);

                    const totalProgress = ((this.currentTakeIndex + progress) / (this.takes.length - 1)) * 105;
                    this.updateProgressBar(totalProgress, 100);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        if (this.currentTakeIndex < this.takes.length - 1) {
                            this.currentTakeIndex++;
                            this.setActiveTake(this.currentTakeIndex);
                            this.animateTakes();
                        } else {
                            this.stopTakes();
                        }
                    }
                };

                requestAnimationFrame(animate);
            };
        };

        // Função para atualizar o ícone e a velocidade
        const updateSpeed = (speed) => {
            currentSpeed = speed;

            // Atualiza o ícone no botão principal
            if (speed === 1) {
                // Atualiza para o ícone de `1x` explicitamente após a interação
                speedIcon.className = "bi bi-1-square";
                speedIconMobile.className = "bi bi-1-square";
            } else {
                // Ícones 2x ou 3x
                speedIcon.className = `bi bi-${speed}-square`;
                speedIconMobile.className = `bi bi-${speed}-square`;
            }

            // Atualiza as funções com a nova duração
            updateDurations(speeds[speed]);

            console.log(`Velocidade alterada para: ${speed}x`);
        };

        // Configura eventos para as opções de velocidade
        speedOptions.forEach((option) => {
            option.addEventListener("click", (event) => {
                const selectedSpeed = parseInt(event.currentTarget.getAttribute("data-speed"));
                updateSpeed(selectedSpeed);
            });
        });

        // Inicialize com o ícone de relógio (3500ms por padrão)
        speedIcon.className = `bi bi-speedometer`;
        updateDurations(speeds[1]); // Define a duração inicial para 1x (3500ms)
        console.log("Velocidade inicial: Relógio (1x)");
    });
