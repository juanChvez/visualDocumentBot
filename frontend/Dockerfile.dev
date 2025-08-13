FROM node:20.19.0

WORKDIR /app

# Copia dependencias y las instala
COPY package.json package-lock.json* ./
RUN npm install

# Copia el resto de los archivos
COPY . .

# Comando para entorno de desarrollo (Vite server)
CMD ["npm", "run", "dev"]