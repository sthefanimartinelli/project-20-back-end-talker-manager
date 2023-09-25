
# :microphone: Projeto Talker Manager :microphone:

### Objetivos:
- Desenvolver uma API de um CRUD de palestrantes (talkers).
- Desenvolver endpoints que irão ler e escrever em um arquivo utilizando o módulo fs.

O código da API foi desenvolvido nos arquivos:
- index.js
- randomToken.js
- validations.js 
Os demais arquivos foram desenvolvidos pela Trybe.

### Para iniciar o projeto:
- git clone git@github.com:sthefanimartinelli/project-20-back-end-talker-manager.git
- docker compose up -d
- docker exec -it talker_manager bash
- npm run dev

### Requisitos do projeto:
| Requisito | Descrição |
|-----------|-----------|
| 01 | Crie o endpoint GET /talker |
| 02 | Crie o endpoint GET /talker/:id |
| 03 | Crie o endpoint POST /login |
| 04 | Adicione as validações para o endpoint /login |
| 05 | Crie o endpoint POST /talker |
| 06 | Crie o endpoint PUT /talker/:id |
| 07 | Crie o endpoint DELETE /talker/:id |
| 08 | Crie o endpoint GET `/talker/search` e o parâmetro de consulta `q=searchTerm` |
| 09 | Crie no endpoint GET `/talker/search` o parâmetro de consulta `rate=rateNumber` |
| 10 | Crie no endpoint GET `/talker/search` o parâmetro de consulta `date=watchedDate` |
| 11 | Crie o endpoint PATCH `/talker/rate/:id` |
| 12 | Crie o endpoint GET `/talker/db` |
