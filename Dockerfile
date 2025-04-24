FROM node:18-alpine

# 创建应用目录
WORKDIR /app

# 添加npm配置 - 提前设置，加速下载
RUN npm config set registry https://registry.npmmirror.com
RUN npm config set fetch-timeout 600000

# 先复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖（使用npm install而不是npm ci，避免版本锁定问题）
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV MAX_USAGE_COUNT=10

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"] 