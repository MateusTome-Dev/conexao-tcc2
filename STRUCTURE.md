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
