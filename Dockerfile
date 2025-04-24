FROM node:18-alpine

# 创建应用目录
WORKDIR /app

# 先复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 清理开发依赖，只保留生产依赖
RUN npm ci --only=production

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV MAX_USAGE_COUNT=10

# 暴露端口
EXPOSE 3000

# 添加npm配置
RUN npm config set registry https://registry.npmmirror.com

# 启动应用
CMD ["node", "server.js"] 