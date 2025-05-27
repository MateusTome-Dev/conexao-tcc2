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

- `.next`: Armazena arquivos temporários e configurações internas do Expo para rodar o aplicativo no ambiente de desenvolvimento.
- `node_modules`: Armazena arquivos temporários e configurações internas do Expo para rodar o aplicativo no ambiente de desenvolvimento.
- `public`: Armazena arquivos temporários e configurações internas do Expo para rodar o aplicativo no ambiente de desenvolvimento.
- `./src`: Armazena arquivos temporários e configurações internas do Expo para rodar o aplicativo no ambiente de desenvolvimento.
  - `./src/app`:
    - `./src/app/api`:
      - `./src/app/api/chat`:
        - `./src/app/api/chat/route.ts`:
    - `./src/app/institution`:
      - `./src/app/institution/class`:
        - `./src/app/institution/class/createclass`:
          - `./src/app/institution/class/createclass/page.tsx`:
        - `./src/app/institution/class/editeclass`:
          - `./src/app/institution/class/editeclass/page.tsx`:
        - `./src/app/institution/class/viewclass`:
          - `./src/app/institution/class/viewclass/[id]`:
            - `./src/app/institution/class/viewclass/[id]/page.tsx`:
          - `./src/app/institution/class/page.tsx`:
      - `./src/app/institution/event`:
        - `./src/app/institution/event/page.tsx`:
      - `./src/app/institution/student`:
        - `./src/app/institution/student/createStudent`:
          - `./src/app/institution/student/createStudent/[id]`:
            - `./src/app/institution/student/createStudent/[id]/page.tsx`:
          - `./src/app/institution/student/createStudent/csv`:
            - `./src/app/institution/student/createStudent/csv/page.tsx`:
        - `./src/app/institution/student/editprofile`:
          -`./src/app/institution/student/editprofile/[id]`:
            - `./src/app/institution/student/editprofile/[id]/page.tsx`:
        -`./src/app/institution/student/notes`:
          -`./src/app/institution/student/notes/[id]`:
            -`./src/app/institution/student/notes/[id]/page.tsx`:
        -`./src/app/institution/profile`:
          - `./src/app/institution/profile/[id]`:
            -`./src/app/institution/profile/[id]/page.tsx`:
          -`./src/app/institution/profile/feedback`:
            - `./src/app/institution/profile/feedback/[id]`:
              -`./src/app/institution/profile/feedback/[id]/page.tsx`:
      - `./src/app/institution/teacher`:
        - `./src/app/institution/teacher/profile`:
          - `./src/app/institution/teacher/profile/createprofile`:
            - `./src/app/institution/teacher/profile/createprofile/page.tsx`:
          - `./src/app/institution/teacher/profile/editprofile`:
            - `./src/app/institution/teacher/profile/editprofile/[id]`:
              - `./src/app/institution/teacher/profile/editprofile/[id]/page.tsx`:
            - `./src/app/institution/teacher/profile/viewprofile`:
              - `./src/app/institution/teacher/profile/viewprofile/[id]`:
                -`./src/app/institution/teacher/profile/viewprofile/[id]/page.tsx`:
            - `./src/app/institution/teacher/page.tsx`:
      - `./src/app/institution/page.tsx`:
      - `./src/app/student`:
        - `./src/app/student/chatbox`:
          - `./src/app/student/chatbox/page.tsx`:      
        - `./src/app/student/event`:
          - `./src/app/student/event/page.tsx`:
        - `./src/app/student/feedback`:
          - `./src/app/student/feedback/page.tsx`:
        - `./src/app/student/form`:
          - `./src/app/student/form/page.tsx`:
        - `./src/app/student/notes`:
          - `./src/app/student/notes/page.tsx`:
        - `./src/app/student/profile`:
          - `./src/app/student/profile/page.tsx`:
        - `./src/app/student/page.tsx`:
      - `./src/app/teacher`:
        - `./src/app/teacher/class`:
          - `./src/app/teacher/class/page.tsx`:
        - `./src/app/teacher/event`:
          - `./src/app/teacher/event/page.tsx`:
        - `./src/app/teacher/feedback`:
          - `./src/app/teacher/feedback/studentsFeedback`:
            - `./src/app/teacher/feedback/studentsFeedback/[id]`:
              - `./src/app/teacher/feedback/studentsFeedback/[id]/page.tsx`:
            - `./src/app/teacher/feedback/studentsFeedback/studentProfile`:
              - `./src/app/teacher/feedback/studentsFeedback/studentProfile/[id]`:
                - `./src/app/teacher/feedback/studentsFeedback/studentProfile/[id]/page.tsx`:
              - `./src/app/teacher/feedback/studentsFeedback/page.tsx`:
            - `./src/app/teacher/feedback/page.tsx`:
        - `./src/app/teacher/profile`:
          - `./src/app/teacher/profile/page.tsx`:
        - `./src/app/teacher/students`:
          - `./src/app/teacher/students/[id]`:
            - `./src/app/teacher/students/[id]/page.tsx`:
          - `./src/app/teacher/students/notes`:
            - `./src/app/teacher/students/notes/[id]`:
              - `./src/app/teacher/students/notes/[id]/page.tsx`:
            - `./src/app/teacher/students/profile`:
              - `./src/app/teacher/students/profile/[id]`:
                - `./src/app/teacher/students/profile/[id]/page.tsx`:
            - `./src/app/teacher/students/page.tsx`:
          - `./src/app/teacher/students/profile`:
        - `./src/app/institution/teacher/page.tsx`:
        
      - `./src/app/favicon.ico`:
      - `./src/app/layout.tsx`:
      - `./src/app/page.tsx`

  - `./src/app/assets`:
    - `./src/app/assets/images`:
  - `./src/app/components`:
      - `./src/app/components/layout`:
        - `./src/app/components/layout/sidbar.tsx`:
        - `./src/app/components/layout/sidbarInstitution.tsx`:
        - `./src/app/components/layout/sidbarTeacher.tsx`:
    - `./src/app/components/modals`:
      - `./src/app/components/modals/modalCreate.tsx`:
      - `./src/app/components/modals/modalFloatingButton.tsx`:
      - `./src/app/components/modals/modalSidebar.tsx`:
      - `./src/app/components/modals/modelDelete.tsx`:
    - `./src/app/components/ui`:
      - `./src/app/components/ui/alunos`:
        - `./src/app/components/ui/alunos/avatar.tsx`:
        - `./src/app/components/ui/alunos/biggerCalendar.tsx`:
        - `./src/app/components/ui/alunos/button.tsx`:
        - `./src/app/components/ui/alunos/calendar.tsx`:
        - `./src/app/components/ui/alunos/card.tsx`:
        - `./src/app/components/ui/alunos/cardFeedback.tsx`:
        - `./src/app/components/ui/alunos/cardFeedbackStudent.tsx`:
        - `./src/app/components/ui/alunos/chart.tsx`:
        - `./src/app/components/ui/alunos/chartFeedback.tsx`:
        - `./src/app/components/ui/alunos/downloadButton.tsx`:
        - `./src/app/components/ui/alunos/event-list.tsx`:
        - `./src/app/components/ui/alunos/event-sidebar.tsx`:
        - `./src/app/components/ui/alunos/gradeCard.tsx`:
        - `./src/app/components/ui/alunos/mediaCard.tsx`:
        - `./src/app/components/ui/alunos/messageList.tsx`:
        - `./src/app/components/ui/alunos/occurrences-table.tsx`:
        - `./src/app/components/ui/alunos/profile-card.tsx`:
        - `./src/app/components/ui/alunos/profile.tsx`:
        - `./src/app/components/ui/alunos/progress.tsx`:
        - `./src/app/components/ui/alunos/select.tsx`:
        - `./src/app/components/ui/alunos/smallselect.tsx`:
        - `./src/app/components/ui/alunos/table.tsx`:
       - `./src/app/components/ui/institution`:
         - `./src/app/components/ui/institution/biggerCalendar.tsx`:
         - `./src/app/components/ui/institution/button.tsx`:
         - `./src/app/components/ui/institution/buttonEdit.tsx`:
         - `./src/app/components/ui/institution/buttonSubmit.tsx`:
         - `./src/app/components/ui/institution/cardFeedback.tsx`:
         - `./src/app/components/ui/institution/checkbox.tsx`:
         - `./src/app/components/ui/institution/dialog.tsx`:
         - `./src/app/components/ui/institution/FloatingButton.tsx`:
         - `./src/app/components/ui/institution/floatingButtonClass.tsx`:
         - `./src/app/components/ui/institution/gradeTableStudents.tsx`:
         - `./src/app/components/ui/institution/input.tsx`:
         - `./src/app/components/ui/institution/InputImage.tsx`:
         - `./src/app/components/ui/institution/label.tsx`:
         - `./src/app/components/ui/institution/messageList.tsx`:
         - `./src/app/components/ui/institution/noticeCard.tsx`:
         - `./src/app/components/ui/institution/profile.tsx`:
         - `./src/app/components/ui/institution/select.tsx`:
         - `./src/app/components/ui/institution/smallselect.tsx`:
         - `./src/app/components/ui/institution/textarea.tsx`:
         - `./src/app/components/ui/institution/toast.tsx`:
         - `./src/app/components/ui/institution/use-toast.ts`:
      - `./src/app/components/ui/teacher`:
        - `./src/app/components/ui/teacher/calendar.tsx`:
        - `./src/app/components/ui/teacher/cardFeedbackTeacher.tsx`:
        - `./src/app/components/ui/teacher/class.tsx`:
        - `./src/app/components/ui/teacher/gradeTableStudents.tsx`:
        - `./src/app/components/ui/teacher/messageList.tsx`:
        - `./src/app/components/ui/teacher/noticeCard.tsx`:
        - `./src/app/components/ui/teacher/ocurrence.tsx`:
        - `./src/app/components/ui/teacher/ocurrenceTable.tsx`:
        - `./src/app/components/ui/teacher/profile.tsx`:
        - `./src/app/components/ui/teacher/profileStudent.tsx`:
        - `./src/app/components/ui/teacher/questions.tsx`:
        - `./src/app/components/ui/teacher/user.tsx`:
      - `./src/app/components/ui/globalTablePerformance.tsx`:
      - `./src/app/components/ui/lateralCalendar.tsx`:
      - `./src/app/components/ui/search.tsx`:
      - `./src/app/components/ui/smallSelect.tsx`:
      - `./src/app/components/ui/tablePerfomance.tsx`:
      - `./src/app/components/ui/welcomeMessage.tsx`:
      - `./src/app/components/ui/welcomeUser.tsx`:
    - `./src/app/components/ThemeProvider.tsx`:
