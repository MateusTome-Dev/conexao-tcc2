# Entendendo decisões arquiteturais e a estrutura do projeto

## Requisitos para rodar o projeto

### Setup de ambiente:
- [Azure SQL](https://azure.microsoft.com/pt-br/free/sql-database/search/?ef_id=_k_Cj0KCQjwotDBBhCQARIsAG5pinPl_3spTLDl-EmaYRyhH0uJ1VzPHvoJbkzP_BvWI14rXi0JPkJW1hEaAjt-EALw_wcB_k_&OCID=AIDcmmzmnb0182_SEM__k_Cj0KCQjwotDBBhCQARIsAG5pinPl_3spTLDl-EmaYRyhH0uJ1VzPHvoJbkzP_BvWI14rXi0JPkJW1hEaAjt-EALw_wcB_k_&gad_source=1&gad_campaignid=1635077466&gbraid=0AAAAADcJh_vx6Btl9zUo7RlHHvXEZR0-y&gclid=Cj0KCQjwotDBBhCQARIsAG5pinPl_3spTLDl-EmaYRyhH0uJ1VzPHvoJbkzP_BvWI14rXi0JPkJW1hEaAjt-EALw_wcB)
- [Visual Studio Code](https://code.visualstudio.com/)

### Como rodar na minha máquina?
1. Clone o projeto: `https://github.com/MateusTome-Dev/conexao-tcc2`

2. Instale as dependências necessárias:
```
npm i --force
npm i dotenv --force
npm install lucide-react --force
npm install react-circular-progressbar --force
npm install -D tailwind-scrollbar --force
npm install @headlessui/react --force
npm i react-icons --force
npm install recharts react-select --force
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/timegrid @headlessui/react @heroicons/react --force
npm install jsonwebtoken --force
npm install js-cookie --force
npm i --save-dev @types/js-cookie --force
npm install @radix-ui/react-toast --force
npm install @radix-ui/react-label --force
npm install @radix-ui/react-dialog --force
npm install react-toastify --force
npm install react-loading-skeleton --force
```
Ou você pode instalar todas as dependências principais com o comando:
```
  npm install --force

```
3. Inicie a aplicação:
```
   npm run dev
```

4. Pronto 🎉
## OnAcademy
### Estrutura do Projeto

- `.next`: Diretório gerado automaticamente pelo Next.js contendo os arquivos otimizados para produção, cache de construção e configurações internas do framework. É recriado a cada build e não deve ser commitado no versionamento.

- `node_modules`: Armazena todas as dependências do projeto instaladas via npm. Cada pacote listado no package.json é baixado e instalado aqui. Este diretório é regenerado automaticamente quando você executa `npm install`.

- `public`: Diretório para arquivos estáticos acessíveis publicamente, incluindo:
  - Imagens compartilhadas
  - Ícones de favoritos (favicon)
  - Arquivos de fontes
  - Outros recursos que podem ser referenciados diretamente via URL

- `./src`: Contém todo o código-fonte da aplicação organizado de forma modular:
  - `./src/app`: Implementa o sistema de roteamento principal usando o App Router do Next.js 13+
    - `./src/app/api`: Endpoints da API interna
      - `./src/app/api/chat`: Funcionalidades relacionadas ao chat
        - `./src/app/api/chat/route.ts`: Implementação das rotas de API para o sistema de mensagens

    - `./src/app/institution`: Área administrativa da instituição de ensino
      - `./src/app/institution/class`: Gerenciamento de turmas
        - `./src/app/institution/class/createclass`: Criação de novas turmas
          - `./src/app/institution/class/createclass/page.tsx`: Formulário de cadastro de turmas
        - `./src/app/institution/class/editeclass`: Edição de turmas existentes
          - `./src/app/institution/class/editeclass/page.tsx`: Interface de edição
        - `./src/app/institution/class/viewclass`: Visualização de turmas
          - `./src/app/institution/class/viewclass/[id]`: Página dinâmica por ID
            - `./src/app/institution/class/viewclass/[id]/page.tsx`: Detalhes da turma específica

      - `./src/app/institution/event`: Gerenciamento de eventos acadêmicos
        - `./src/app/institution/event/page.tsx`: Calendário e lista de eventos

      - `./src/app/institution/student`: Gestão de alunos
        - `./src/app/institution/student/createStudent`: Cadastro de estudantes
          - `./src/app/institution/student/createStudent/[id]`: Edição por ID
            - `./src/app/institution/student/createStudent/[id]/page.tsx`: Formulário de aluno
          - `./src/app/institution/student/createStudent/csv`: Importação em massa
            - `./src/app/institution/student/createStudent/csv/page.tsx`: Upload de CSV

        - `./src/app/institution/student/editprofile`: Edição de perfis
          - `./src/app/institution/student/editprofile/[id]`: Edição específica
            - `./src/app/institution/student/editprofile/[id]/page.tsx`: Formulário de edição

        - `./src/app/institution/student/notes`: Gestão de notas
          - `./src/app/institution/student/notes/[id]`: Notas por aluno
            - `./src/app/institution/student/notes/[id]/page.tsx`: Lançamento de notas

        - `./src/app/institution/profile`: Perfis institucionais
          - `./src/app/institution/profile/[id]`: Visualização por ID
            - `./src/app/institution/profile/[id]/page.tsx`: Perfil completo
          - `./src/app/institution/profile/feedback`: Sistema de feedbacks
            - `./src/app/institution/profile/feedback/[id]`: Feedback específico
              - `./src/app/institution/profile/feedback/[id]/page.tsx`: Detalhes do feedback

      - `./src/app/institution/teacher`: Gestão de professores
        - `./src/app/institution/teacher/profile`: Perfis docentes
          - `./src/app/institution/teacher/profile/createprofile`: Criação de perfil
            - `./src/app/institution/teacher/profile/createprofile/page.tsx`: Formulário de cadastro
          - `./src/app/institution/teacher/profile/editprofile`: Edição de perfil
            - `./src/app/institution/teacher/profile/editprofile/[id]`: Edição por ID
              - `./src/app/institution/teacher/profile/editprofile/[id]/page.tsx`: Formulário de edição
          - `./src/app/institution/teacher/profile/viewprofile`: Visualização
            - `./src/app/institution/teacher/profile/viewprofile/[id]`: Perfil específico
              - `./src/app/institution/teacher/profile/viewprofile/[id]/page.tsx`: Detalhes do professor

    - `./src/app/student`: Área do estudante
      - `./src/app/student/chatbox`: Sistema de mensagens
        - `./src/app/student/chatbox/page.tsx`: Interface de chat
      - `./src/app/student/event`: Eventos acadêmicos
        - `./src/app/student/event/page.tsx`: Calendário estudantil
      - `./src/app/student/feedback`: Feedbacks recebidos
        - `./src/app/student/feedback/page.tsx`: Listagem de avaliações
      - `./src/app/student/form`: Formulários acadêmicos
        - `./src/app/student/form/page.tsx`: Formulários disponíveis
      - `./src/app/student/notes`: Notas do aluno
        - `./src/app/student/notes/page.tsx`: Boletim e resultados
      - `./src/app/student/profile`: Perfil pessoal
        - `./src/app/student/profile/page.tsx`: Dados do estudante

    - `./src/app/teacher`: Área do professor
      - `./src/app/teacher/class`: Gestão de turmas
        - `./src/app/teacher/class/page.tsx`: Lista de classes
      - `./src/app/teacher/event`: Eventos docentes
        - `./src/app/teacher/event/page.tsx`: Agenda do professor
      - `./src/app/teacher/feedback`: Sistema de avaliações
        - `./src/app/teacher/feedback/studentsFeedback`: Feedbacks por aluno
          - `./src/app/teacher/feedback/studentsFeedback/[id]`: Avaliação específica
            - `./src/app/teacher/feedback/studentsFeedback/[id]/page.tsx`: Formulário de feedback
          - `./src/app/teacher/feedback/studentsFeedback/studentProfile`: Perfis avaliados
            - `./src/app/teacher/feedback/studentsFeedback/studentProfile/[id]`: Perfil do aluno
              - `./src/app/teacher/feedback/studentsFeedback/studentProfile/[id]/page.tsx`: Dados do estudante

      - `./src/app/teacher/profile`: Perfil docente
        - `./src/app/teacher/profile/page.tsx`: Informações do professor
      - `./src/app/teacher/students`: Gestão de alunos
        - `./src/app/teacher/students/[id]`: Estudante específico
          - `./src/app/teacher/students/[id]/page.tsx`: Ficha do aluno
        - `./src/app/teacher/students/notes`: Lançamento de notas
          - `./src/app/teacher/students/notes/[id]`: Notas por aluno
            - `./src/app/teacher/students/notes/[id]/page.tsx`: Sistema de avaliações
        - `./src/app/teacher/students/profile`: Perfis estudantis
          - `./src/app/teacher/students/profile/[id]`: Perfil específico
            - `./src/app/teacher/students/profile/[id]/page.tsx`: Dados completos

    - `./src/app/favicon.ico`: Ícone exibido na aba do navegador
    - `./src/app/layout.tsx`: Layout principal da aplicação
    - `./src/app/page.tsx`: Página inicial do sistema

  - `./src/app/assets`: Recursos estáticos
    - `./src/app/assets/images`: Imagens utilizadas na aplicação

  - `./src/app/components`: Biblioteca de componentes reutilizáveis
    - `./src/app/components/layout`: Componentes estruturais
      - `./src/app/components/layout/sidbar.tsx`: Barra lateral principal
      - `./src/app/components/layout/sidbarInstitution.tsx`: Sidebar para administradores
      - `./src/app/components/layout/sidbarTeacher.tsx`: Navegação para professores

    - `./src/app/components/modals`: Janelas modais
      - `./src/app/components/modals/modalCreate.tsx`: Modal de criação genérica
      - `./src/app/components/modals/modalFloatingButton.tsx`: Modal com botão flutuante
      - `./src/app/components/modals/modalSidebar.tsx`: Modal lateral
      - `./src/app/components/modals/modelDelete.tsx`: Confirmação de exclusão

    - `./src/app/components/ui`: Biblioteca de componentes de interface agrupados por contexto
  - `./src/app/components/ui/alunos`: Componentes específicos para o perfil de estudante
    - **Elementos de Interface**:
      - `avatar.tsx`: Componente de avatar do aluno
      - `button.tsx`: Botões customizados para ações estudantis
      - `select.tsx` / `smallselect.tsx`: Dropdowns para seleção
    - **Cards & Containers**:
      - `card.tsx`: Card base reutilizável
      - `cardFeedback.tsx` / `cardFeedbackStudent.tsx`: Cards de feedback
      - `gradeCard.tsx`: Card de notas acadêmicas
      - `mediaCard.tsx`: Card para conteúdo multimídia
      - `profile-card.tsx`: Card resumo do perfil
    - **Visualização de Dados**:
      - `chart.tsx` / `chartFeedback.tsx`: Componentes gráficos
      - `table.tsx`: Tabela base
      - `occurrences-table.tsx`: Tabela de ocorrências
      - `progress.tsx`: Barra/indicador de progresso
    - **Agendamento**:
      - `calendar.tsx`: Calendário simplificado
      - `biggerCalendar.tsx`: Calendário expandido
      - `event-list.tsx`: Listagem de eventos
      - `event-sidebar.tsx`: Painel lateral de eventos
    - **Comunicação**:
      - `messageList.tsx`: Listagem de mensagens
      - `downloadButton.tsx`: Botão para downloads
    - **Perfil**:
      - `profile.tsx`: Página completa de perfil

  - `./src/app/components/ui/institution`: Componentes para administradores institucionais
    - **Formulários**:
      - `input.tsx`: Campo de entrada básico
      - `textarea.tsx`: Área de texto
      - `checkbox.tsx`: Checkbox customizado
      - `InputImage.tsx`: Upload de imagens
      - `select.tsx` / `smallselect.tsx`: Seletores
      - `label.tsx`: Rótulos para formulários
    - **Interação**:
      - `button.tsx` / `buttonEdit.tsx` / `buttonSubmit.tsx`: Botões primários
      - `FloatingButton.tsx` / `floatingButtonClass.tsx`: Botões flutuantes
      - `dialog.tsx`: Diálogos modais
    - **Feedback & Notificações**:
      - `toast.tsx`: Sistema de notificações toast
      - `use-toast.ts`: Hook para gerenciar toasts
      - `cardFeedback.tsx`: Cards de feedback
      - `noticeCard.tsx`: Cards de avisos
    - **Visualização de Dados**:
      - `biggerCalendar.tsx`: Calendário institucional
      - `gradeTableStudents.tsx`: Tabela de notas
      - `messageList.tsx`: Listagem de mensagens
      - `profile.tsx`: Componente de perfil institucional

  - `./src/app/components/ui/teacher`: Componentes para o perfil docente
    - **Gestão de Aula**:
      - `class.tsx`: Componente de turmas
      - `gradeTableStudents.tsx`: Lançador de notas
      - `ocurrence.tsx` / `ocurrenceTable.tsx`: Registro de ocorrências
      - `questions.tsx`: Gerenciador de questões
    - **Visualização**:
      - `calendar.tsx`: Agenda do professor
      - `cardFeedbackTeacher.tsx`: Cards de feedback
      - `noticeCard.tsx`: Cards de avisos
      - `profile.tsx`: Perfil do professor
      - `profileStudent.tsx`: Visualização de perfil de aluno
    - **Comunicação**:
      - `messageList.tsx`: Listagem de mensagens
      - `user.tsx`: Componente de listagem de usuários

  - **Componentes Compartilhados**:
    - `globalTablePerformance.tsx`: Tabela de desempenho global
    - `lateralCalendar.tsx`: Calendário lateral reutilizável
    - `search.tsx`: Componente de busca unificado
    - `smallSelect.tsx`: Select compacto
    - `tablePerfomance.tsx`: Tabela de performance
    - `welcomeMessage.tsx` / `welcomeUser.tsx`: Componentes de boas-vindas

- `./src/app/components/ThemeProvider.tsx`: Provedor de temas para estilização global
    - `./src/app/components/ThemeProvider.tsx`: Provedor de temas para estilização

  - `./src/app/hooks`: Hooks customizados
    - `./src/app/hooks/use-media-query.ts`: Hook para responsive design

  - `./src/app/lib`: Utilitários e helpers
    - `./src/app/lib/utils.ts`: Funções utilitárias compartilhadas

  - `./src/app/styles`: Estilos globais
    - `./src/app/styles/globals.css`: Estilos CSS aplicados globalmente

  - `./src/app/types`: Definições TypeScript
    - `./src/app/types/event.ts`: Tipos para eventos acadêmicos
    - `./src/app/types/select.ts`: Tipos para componentes de seleção

  - `./src/app/middleware.ts`: Middleware para tratamento de rotas e autenticação

- `.eslintignore`: Configura quais arquivos o ESLint deve ignorar na análise
- `.gitignore`: Especifica quais arquivos não devem ser versionados
- `CONTRIBUTING.md`: Diretrizes para contribuição no projeto
- `LICENSE`: Licença de uso do software
- `README.md`: Documentação principal do projeto
- `STRUCTURE.md`: Documentação da estrutura de arquivos
- `eslint.config.mjs`: Configuração do linter ESLint
- `next.config.ts`: Configurações customizadas do Next.js
- `package-lock.json`: Versões exatas das dependências
- `package.json`: Manifesto do projeto com scripts e dependências
- `postcss.config.mjs`: Configuração do PostCSS
- `tailwind.config.ts`: Configuração do Tailwind CSS
- `tsconfig.json`: Configuração do TypeScript

# Conclusão:
A estrutura do projeto On Academy foi meticulosamente organizada seguindo as melhores práticas de desenvolvimento web com Next.js.
