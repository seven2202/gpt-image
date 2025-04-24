FROM node:18-alpine

# 创建应用目录
WORKDIR /app

# 安装应用依赖
# 先复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV MAX_USAGE_COUNT=3

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"] 