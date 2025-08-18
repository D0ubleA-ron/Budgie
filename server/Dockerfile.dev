FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the Prisma schema
COPY prisma ./prisma

# Generate the Prisma client
RUN npx prisma generate

# Copy the rest of the backend
COPY . .

CMD ["npm", "run", "dev"]
