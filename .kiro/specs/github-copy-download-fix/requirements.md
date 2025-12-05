# Requirements Document

## Introduction

Esta funcionalidade corrige um bug crítico no fluxo de análise via GitHub URL onde os botões "Copy" e "Download" não funcionam corretamente. Quando o usuário utiliza a opção de GitHub URL para análise, o conteúdo do arquivo é baixado e analisado, mas os botões de Copy e Download não conseguem acessar o conteúdo atualizado, resultando em cópia/download de conteúdo vazio ou incorreto. O problema não ocorre no fluxo "Paste" porque neste caso o estado `fileContent` é corretamente atualizado.

## Requirements

### Requirement 1

**User Story:** Como um desenvolvedor que usa a análise via GitHub URL, eu quero que o botão "Copy" copie a versão atualizada do arquivo de dependências, para que eu possa usar o conteúdo corrigido em meu projeto.

#### Acceptance Criteria

1. WHEN o usuário completa uma análise via GitHub URL THEN o sistema SHALL armazenar o conteúdo original do arquivo no estado da aplicação
2. WHEN o usuário clica no botão "Copy" após análise via GitHub URL THEN o sistema SHALL gerar o conteúdo atualizado baseado no arquivo original do GitHub
3. WHEN o conteúdo é copiado THEN o sistema SHALL usar o conteúdo original correto do GitHub, não conteúdo vazio
4. WHEN a operação de cópia é concluída THEN o sistema SHALL exibir uma mensagem de sucesso indicando quantos pacotes foram atualizados

### Requirement 2

**User Story:** Como um desenvolvedor que usa a análise via GitHub URL, eu quero que o botão "Download" baixe a versão atualizada com o formato correto do arquivo, para que eu possa substituir o arquivo original em meu projeto.

#### Acceptance Criteria

1. WHEN o usuário clica no botão "Download" após análise via GitHub URL THEN o sistema SHALL gerar o arquivo atualizado baseado no conteúdo original do GitHub
2. WHEN o arquivo é baixado THEN o sistema SHALL usar o nome correto do arquivo (package.json, requirements.txt, ou pubspec.yaml)
3. WHEN o arquivo é baixado THEN o sistema SHALL usar o tipo MIME correto baseado no tipo de arquivo detectado
4. WHEN o download é concluído THEN o sistema SHALL exibir uma mensagem de sucesso com o nome correto do arquivo

### Requirement 3

**User Story:** Como um usuário, eu quero que os botões Copy e Download funcionem consistentemente entre todos os métodos de entrada (Upload, Paste, GitHub URL), para que eu tenha uma experiência uniforme independente de como forneço o arquivo.

#### Acceptance Criteria

1. WHEN o usuário usa qualquer método de entrada THEN o sistema SHALL manter o mesmo comportamento para Copy e Download
2. WHEN o conteúdo original é obtido via GitHub URL THEN o sistema SHALL armazenar as mesmas informações que armazena para Upload e Paste
3. WHEN os botões são clicados THEN o sistema SHALL usar a mesma lógica de geração de conteúdo atualizado para todos os métodos
4. IF o usuário troca entre diferentes métodos de entrada THEN o sistema SHALL limpar corretamente o estado anterior

### Requirement 4

**User Story:** Como um desenvolvedor, eu quero que o sistema preserve corretamente o nome do arquivo quando uso GitHub URL, para que o download tenha o nome correto do arquivo de dependências.

#### Acceptance Criteria

1. WHEN um arquivo é baixado via GitHub URL THEN o sistema SHALL preservar o nome original do arquivo (ex: package.json)
2. WHEN o arquivo é do tipo package.json THEN o sistema SHALL usar "package.json" como nome do arquivo
3. WHEN o arquivo é do tipo requirements.txt THEN o sistema SHALL usar "requirements.txt" como nome do arquivo  
4. WHEN o arquivo é do tipo pubspec.yaml THEN o sistema SHALL usar "pubspec.yaml" como nome do arquivo

### Requirement 5

**User Story:** Como um usuário, eu quero que o sistema mantenha o estado correto quando eu mudo entre diferentes repositórios ou arquivos, para que não haja interferência entre análises diferentes.

#### Acceptance Criteria

1. WHEN o usuário inicia uma nova análise via GitHub URL THEN o sistema SHALL limpar o estado da análise anterior
2. WHEN o usuário seleciona um arquivo diferente no mesmo repositório THEN o sistema SHALL atualizar o estado com o novo arquivo
3. WHEN o usuário muda para um método de entrada diferente THEN o sistema SHALL limpar o estado do GitHub URL
4. WHEN uma nova análise é iniciada THEN o sistema SHALL garantir que Copy e Download usem os dados da análise atual, não da anterior