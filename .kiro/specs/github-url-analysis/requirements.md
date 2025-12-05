# Requirements Document

## Introduction

Esta funcionalidade adiciona uma terceira opção de entrada para análise de dependências no Pack-Man, permitindo que usuários insiram URLs de repositórios públicos do GitHub para análise automática de arquivos de dependências. O sistema deve detectar e analisar automaticamente arquivos como package.json, requirements.txt ou pubspec.yaml diretamente do repositório.

## Requirements

### Requirement 1

**User Story:** Como um desenvolvedor, eu quero inserir a URL de um repositório público do GitHub, para que eu possa analisar as dependências sem precisar fazer download ou copiar manualmente os arquivos.

#### Acceptance Criteria

1. WHEN o usuário acessa a página de análise THEN o sistema SHALL exibir uma terceira opção "GitHub Repository URL" junto com as opções existentes de upload e paste
2. WHEN o usuário seleciona a opção "GitHub Repository URL" THEN o sistema SHALL exibir um campo de input para inserção da URL
3. WHEN o usuário insere uma URL válida do GitHub THEN o sistema SHALL validar o formato da URL antes de processar
4. IF a URL não for válida THEN o sistema SHALL exibir uma mensagem de erro clara

### Requirement 2

**User Story:** Como um usuário, eu quero que o sistema detecte automaticamente qual arquivo de dependências analisar, para que eu não precise especificar manualmente o tipo de projeto.

#### Acceptance Criteria

1. WHEN o sistema recebe uma URL válida do GitHub THEN o sistema SHALL buscar pelos arquivos package.json, requirements.txt e pubspec.yaml na raiz do repositório
2. IF múltiplos arquivos de dependências forem encontrados THEN o sistema SHALL permitir que o usuário escolha qual analisar
3. IF nenhum arquivo de dependências for encontrado THEN o sistema SHALL exibir uma mensagem informativa
4. WHEN um arquivo de dependências é encontrado THEN o sistema SHALL baixar o conteúdo do arquivo via GitHub API

### Requirement 3

**User Story:** Como um desenvolvedor, eu quero que apenas repositórios públicos sejam suportados inicialmente, para que a funcionalidade seja implementada de forma simples sem necessidade de autenticação.

#### Acceptance Criteria

1. WHEN o sistema tenta acessar um repositório THEN o sistema SHALL usar apenas endpoints públicos da GitHub API
2. IF o repositório for privado THEN o sistema SHALL exibir uma mensagem informando que apenas repositórios públicos são suportados
3. WHEN o repositório é público e acessível THEN o sistema SHALL prosseguir com a análise normalmente

### Requirement 4

**User Story:** Como um usuário, eu quero receber feedback claro sobre o progresso da análise, para que eu saiba que o sistema está processando minha solicitação.

#### Acceptance Criteria

1. WHEN o usuário submete uma URL THEN o sistema SHALL exibir um indicador de loading
2. WHEN o sistema está buscando arquivos de dependências THEN o sistema SHALL mostrar o status "Searching for dependency files..."
3. WHEN o sistema está baixando o arquivo THEN o sistema SHALL mostrar o status "Downloading dependency file..."
4. IF ocorrer um erro durante o processo THEN o sistema SHALL exibir uma mensagem de erro específica e clara

### Requirement 5

**User Story:** Como um usuário, eu quero que a análise via GitHub URL tenha a mesma qualidade e funcionalidades das outras opções, para que eu tenha uma experiência consistente.

#### Acceptance Criteria

1. WHEN a análise via GitHub URL é concluída THEN o sistema SHALL exibir os mesmos resultados e estatísticas das outras opções
2. WHEN o arquivo é processado THEN o sistema SHALL aplicar a mesma lógica de análise de dependências
3. WHEN os resultados são exibidos THEN o sistema SHALL incluir links para documentação e informações de versão como nas outras opções

### Requirement 6

**User Story:** Como um desenvolvedor, eu quero que o sistema trate diferentes formatos de URL do GitHub, para que eu possa usar URLs copiadas diretamente do navegador.

#### Acceptance Criteria

1. WHEN o usuário insere uma URL no formato https://github.com/owner/repo THEN o sistema SHALL processar corretamente
2. WHEN o usuário insere uma URL com branch específica THEN o sistema SHALL usar a branch especificada ou main/master como padrão
3. WHEN o usuário insere uma URL com trailing slash ou parâmetros extras THEN o sistema SHALL normalizar a URL
4. IF a URL contém caracteres especiais ou formato inválido THEN o sistema SHALL exibir erro de validação