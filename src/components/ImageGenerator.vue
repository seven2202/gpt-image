<template>
  <div class="image-generator">
    <div class="card">
      <div class="form-group">
        <label for="prompt">
          <span class="label-icon">💬</span>
          输入提示词生成图片
        </label>
        <textarea
          id="prompt"
          class="form-control"
          placeholder="例如：一只可爱的小猫咪坐在窗台上，阳光照射，背景是蓝天"
          v-model="prompt"
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-controls">
        <div class="form-controls-row">
          <div class="form-group select-group">
            <label for="quality" class="small-label">画面质量</label>
            <select id="quality" class="form-control select-control" v-model="imageQuality">
              <option value="low">低质量</option>
              <option value="medium">中等质量</option>
              <option value="high">高质量</option>
            </select>
          </div>
          
          <div class="form-group select-group">
            <label for="size" class="small-label">图片尺寸</label>
            <select id="size" class="form-control select-control" v-model="imageSize">
              <option value="1024x1024">正方形</option>
              <option value="1024x1536">竖向</option>
              <option value="1536x1024">横向</option>
            </select>
          </div>
        </div>
        
        <button 
          class="btn btn-primary generate-btn" 
          @click="generateImage" 
          :disabled="isGenerating || !prompt"
        >
          <span class="loading" v-if="isGenerating"></span>
          <span class="btn-icon" v-if="!isGenerating">🪄</span>
          {{ isGenerating ? '生成中...' : '生成图片' }}
        </button>
      </div>
      
      <div class="status-message" v-if="statusMessage">
        <span class="status-icon">ℹ️</span>
        {{ statusMessage }}
      </div>
      
      <div class="error-message" v-if="error">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>
    </div>
    
    <div class="result-container" v-if="generatedImage">
      <div class="result-card">
        <img 
          :src="generatedImage" 
          alt="Generated" 
          class="image-preview"
        />
        <div class="action-buttons">
          <button class="btn btn-icon" @click="viewOriginalImage" title="查看原图">
            <span>🔍</span>
          </button>
          <button class="btn btn-icon" @click="downloadImage" title="下载图片">
            <span>💾</span>
          </button>
        </div>
      </div>
      <div class="prompt-display" v-if="prompt">
        <div class="prompt-content">
          <span class="prompt-icon">💬</span>
          <p>{{ prompt }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImageGenerator',
  props: {
    apiEndpoint: {
      type: String,
      default: '/api'
    }
  },
  data() {
    return {
      prompt: '',
      imageQuality: 'medium',
      imageSize: '1024x1024',
      generatedImage: null,
      isGenerating: false,
      error: '',
      statusMessage: ''
    }
  },
  mounted() {
    // 检查API服务器状态
    this.checkApiStatus();
  },
  methods: {
    async checkApiStatus() {
      try {
        const response = await axios.get(`${this.apiEndpoint}/status`);
        if (response.data.status === 'ok') {
          console.log('API服务器状态正常');
        }
      } catch (error) {
        console.error('API服务器状态检查失败:', error);
        this.error = '无法连接到API服务器，请确保服务器已启动';
      }
    },
    async generateImage() {
      if (!this.prompt) {
        this.error = '请输入提示词';
        return;
      }

      this.error = '';
      this.statusMessage = '正在连接服务器...';
      this.isGenerating = true;
      
      try {
        console.log('发送图像生成请求:', {
          endpoint: `${this.apiEndpoint}/images/generations`,
          data: {
            prompt: this.prompt,
            quality: this.imageQuality,
            size: this.imageSize
          }
        });
        
        this.statusMessage = '正在生成图像，这可能需要一点时间...';
        
        const response = await axios({
          method: 'post',
          url: `${this.apiEndpoint}/images/generations`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            prompt: this.prompt,
            quality: this.imageQuality,
            size: this.imageSize
          }
        });
        
        console.log('图像生成响应:', response);
        
        if (response.data && response.data.data && response.data.data[0] && response.data.data[0].url) {
          this.generatedImage = response.data.data[0].url;
          this.statusMessage = '';
        } else {
          throw new Error('响应数据格式不正确');
        }
      } catch (error) {
        console.error('生成图片错误:', error);
        
        if (error.response) {
          console.error('错误响应:', error.response.data);
          this.error = error.response.data?.error?.message || `请求失败 (${error.response.status})`;
        } else if (error.request) {
          console.error('无响应:', error.request);
          this.error = '服务器没有响应，请检查网络连接或服务器状态';
        } else {
          this.error = error.message || '图像生成失败';
        }
      } finally {
        this.isGenerating = false;
        this.statusMessage = '';
      }
    },
    viewOriginalImage() {
      if (this.generatedImage) {
        window.open(this.generatedImage, '_blank');
      }
    },
    downloadImage() {
      if (this.generatedImage) {
        const link = document.createElement('a');
        link.href = this.generatedImage;
        link.download = `ai-image-${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}
</script>

<style scoped>
.image-generator {
  max-width: 1200px;
}

label {
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: #4a5568;
}

.label-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.small-label {
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  color: #6c757d;
}

.form-controls {
  margin-top: 1.5rem;
}

.form-controls-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.select-group {
  min-width: 150px;
}

.select-control {
  background-color: white;
  cursor: pointer;
  padding: 0.7rem 1rem;
}

.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.btn-icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.status-message {
  display: flex;
  align-items: center;
  color: #3182ce;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(49, 130, 206, 0.1);
  border-radius: 8px;
}

.status-icon {
  margin-right: 0.5rem;
}

.error-message {
  display: flex;
  align-items: center;
  color: #e53e3e;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(229, 62, 62, 0.1);
  border-radius: 8px;
}

.error-icon {
  margin-right: 0.5rem;
}

.result-container {
  margin-top: 2rem;
}

.result-card {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}

.action-buttons {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  font-size: 1.2rem;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.btn-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.prompt-display {
  margin-top: 1rem;
}

.prompt-content {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #6c5ce7;
  display: flex;
  align-items: flex-start;
}

.prompt-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.prompt-content p {
  margin: 0;
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.5;
}

.loading {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  margin-right: 0.7em;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .form-controls-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .select-group {
    width: 100%;
  }
}
</style>
