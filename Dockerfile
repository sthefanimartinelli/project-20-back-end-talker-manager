FROM node:16.14.2

# Diretório padrão de execução
WORKDIR /app

# Instala as dependências Node
COPY package*.json ./ 
RUN npm install

# Copia arquivos do projeto
COPY .eslint* seed.sql

RUN chown -R 1001:1001 /app

# Usuário linux padrão do container, não é recomendado usar root
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
USER 1001

# Substitui o comando padrão da imagem do node
CMD [ "/bin/bash" ]
