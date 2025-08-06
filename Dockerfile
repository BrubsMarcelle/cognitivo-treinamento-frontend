# Multi-stage build para otimizar o tamanho da imagem

# Stage 1: Build da aplicação
FROM node:20-alpine as build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# Stage 2: Servidor de produção com Nginx
FROM nginx:alpine

# Copiar arquivos buildados do stage anterior
COPY --from=build /app/dist/cognitivo-treinamento-frontend /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
