# 智灵绘图 - AI图像生成与编辑工具

智灵绘图是一个基于OpenAI的GPT-image-1模型构建的在线AI图像生成和编辑应用。用户可以通过简单的文字描述生成高质量图像，或上传已有图片进行编辑修改。

## 功能特点

- 🖌️ **AI图像生成**：通过文字提示词生成高质量图像
- ✏️ **图像编辑**：上传图片进行AI编辑和修改
- 🎨 **多主题切换**：支持紫色、蓝色、暗黑、渐变四种UI主题
- 📱 **响应式设计**：在各种设备上都有良好的使用体验
- 🔐 **安全API调用**：后端处理API请求，保护API密钥安全

## 技术栈

- **前端**：Vue 3、Vue Router、Axios
- **后端**：Node.js、Express
- **样式**：CSS变量实现主题切换
- **API**：OpenAI GPT-image-1 API

## 安装与运行

### 前提条件

- Node.js (>=14.0.0)
- OpenAI API密钥

### 安装步骤

1. 克隆项目到本地：

```bash
git clone [https://github.com/yourusername/zhiling-image-app.git](https://github.com/seven2202/gpt-image)
cd zhiling-image-app
```

2. 安装依赖：

```bash
npm install
```

3. 创建并配置环境变量文件：

```bash
cp .env.example .env
```

然后编辑`.env`文件，填入你的OpenAI API密钥：

```
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
PORT=3000
MAX_USAGE_COUNT=3
```

4. 构建前端：

```bash
npm run build
```

5. 启动服务器：

```bash
npm start
```

6. 访问应用：

打开浏览器，访问 `http://localhost:3000`

### 开发模式

如果你想在开发模式下运行，可以使用：

```bash
npm run dev
```

## 使用说明

### 图像生成

1. 点击顶部导航栏中的"画图"选项
2. 在文本框中输入详细的图像描述
3. 选择图像质量和尺寸
4. 点击"生成图片"按钮
5. 生成的图像可以查看原图或下载

### 图像编辑

1. 点击顶部导航栏中的"改图"选项
2. 上传一张需要编辑的图片
3. 输入编辑提示词，描述你希望如何修改图片
4. 选择输出质量和尺寸
5. 点击"开始编辑"按钮
6. 编辑后的图像可以查看原图或下载

## 许可证

MIT

## 致谢

- OpenAI提供的强大API
- 所有项目贡献者和用户

## 本地开发

1. 克隆代码仓库
2. 安装依赖：
   ```
   npm install
   ```
3. 创建`.env`文件，设置OpenAI API密钥：
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_BASE_URL=https://api.openai.com/v1
   MAX_USAGE_COUNT=3
   ```
4. 启动开发服务器：
   ```
   npm run dev
   ```

## 构建和部署

### 本地构建

```
npm run build
node server.js
```

### Docker部署

本项目支持Docker容器化部署，有两种方式：

#### 方式1：使用Dockerfile构建

```bash
# 构建镜像
docker build -t image-editor-app .

# 运行容器
docker run -p 3000:3000 -e VITE_OPENAI_API_KEY=your_api_key -d image-editor-app
```

#### 方式2：使用Docker Compose（推荐）

```bash
# 设置环境变量
export VITE_OPENAI_API_KEY=your_api_key

# 启动服务
docker-compose up -d
```

## 环境变量

- `VITE_OPENAI_API_KEY`：OpenAI API密钥（必需）
- `VITE_OPENAI_BASE_URL`：OpenAI API基础URL（默认为https://api.openai.com/v1）
- `PORT`：服务运行端口（默认为3000）
- `MAX_USAGE_COUNT`：每个用户的最大使用次数（默认为3）

## 使用次数限制

应用默认限制每个IP地址最多使用3次编辑/生成功能。可以通过设置环境变量`MAX_USAGE_COUNT`来调整这个限制。

用户可以通过访问`/api/status`接口查看自己的使用情况。
