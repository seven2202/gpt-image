const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// 加载环境变量
dotenv.config();

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 简单的测试端点
app.get('/api/test', (req, res) => {
  console.log('收到测试请求');
  res.json({ status: 'ok', message: '测试端点工作正常' });
});

// 状态端点
app.get('/api/status', (req, res) => {
  console.log('收到状态请求');
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 简单的代理转发到OpenAI
app.post('/api/images/generations', async (req, res) => {
  console.log('收到图片生成请求', req.body);
  
  // 简单返回测试响应，不实际调用OpenAI
  res.json({
    data: [
      {
        url: 'https://placehold.co/600x400?text=测试图片',
        revised_prompt: req.body.prompt || '测试提示词'
      }
    ]
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`调试服务器已启动，端口: ${port}`);
  console.log('请尝试访问以下URL测试连接:');
  console.log(`- http://localhost:${port}/api/test (测试端点)`);
  console.log(`- http://localhost:${port}/api/status (状态端点)`);
  
  // 尝试自动测试API端点
  setTimeout(async () => {
    try {
      console.log('\n正在测试API端点...');
      
      // 测试状态端点
      const statusResponse = await axios.get(`http://localhost:${port}/api/status`);
      console.log('状态端点响应:', statusResponse.data);
      
      // 测试图片生成端点
      const genResponse = await axios.post(`http://localhost:${port}/api/images/generations`, {
        prompt: '测试提示词'
      });
      console.log('图片生成端点响应:', genResponse.data);
      
      console.log('\n所有测试通过，API端点正常工作！');
      console.log('\n请确保前端应用正确配置了API端点。');
    } catch (error) {
      console.error('\n测试API端点时出错:', error.message);
      if (error.response) {
        console.error('服务器响应:', error.response.data);
      }
    }
  }, 1000);
}); 