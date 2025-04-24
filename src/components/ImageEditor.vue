<template>
  <div class="image-editor">
    <div class="card">
      <div class="edit-card-content">
        <div class="upload-section">
          <div class="upload-container">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              class="file-input"
              @change="handleImageUpload"
              multiple
            />
            <div 
              class="upload-area"
              @paste="handlePaste"
              tabindex="0"
            >
              <div class="upload-icon">🖼️</div>
              <div class="upload-text">
                <span class="primary-text">选择图片</span>
                <span class="secondary-text">点击、拖放或粘贴图片</span>
              </div>
              <div class="multi-image-hint" v-if="images.length > 0">
                已上传 {{ images.length }} 张图片
              </div>
            </div>
          </div>
          <div class="image-thumbnails" v-if="images.length > 0">
            <div 
              v-for="(image, index) in images" 
              :key="index" 
              class="image-thumbnail"
              :class="{ 'active': currentImageIndex === index }"
              @click="selectImage(index)"
            >
              <img :src="image.preview" alt="Thumbnail" />
              <button class="remove-image-btn" @click.stop="removeImage(index)">✕</button>
            </div>
          </div>
        </div>
        
        <div class="prompt-section">
          <div class="form-group">
            <label for="edit-prompt">
              <span class="label-icon">💬</span>
              输入编辑提示词
            </label>
            <textarea
              id="edit-prompt"
              class="form-control"
              placeholder="输入编辑提示词，例如：将背景改为蓝色"
              v-model="editPrompt"
              rows="3"
            ></textarea>
            <div class="preset-styles">
              <div class="preset-styles-label">快速风格选择:</div>
              <div class="preset-buttons">
                <button 
                  class="preset-button" 
                  @click="applyPresetStyle('吉卜力风格')"
                  title="吉卜力风格"
                >
                  <span class="preset-icon">🏞️</span>
                  <span class="preset-name">吉卜力风格</span>
                </button>
                <button 
                  class="preset-button" 
                  @click="applyPresetStyle('3D渲染风格')"
                  title="3D渲染风格"
                >
                  <span class="preset-icon">🧊</span>
                  <span class="preset-name">3D风格</span>
                </button>
                <button 
                  class="preset-button" 
                  @click="applyPresetStyle('Q版公仔风格')"
                  title="Q版公仔风格"
                >
                  <span class="preset-icon">🧸</span>
                  <span class="preset-name">Q版公仔风格</span>
                </button>
                <button 
                  class="preset-button" 
                  @click="applyPresetStyle('赛博朋克风格')"
                  title="赛博朋克风格"
                >
                  <span class="preset-icon">🌃</span>
                  <span class="preset-name">赛博朋克</span>
                </button>
                <button 
                  class="preset-button" 
                  @click="applyPresetStyle('日式动漫风格')"
                  title="日式动漫风格"
                >
                  <span class="preset-icon">🎭</span>
                  <span class="preset-name">动漫风格</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="preview-section" v-if="currentImage">
        <div class="preview-image-container">
          <img 
            :src="currentImage.preview" 
            alt="Uploaded" 
            class="uploaded-image-preview"
          />
          <div class="preview-label">原图</div>
        </div>
        
        <div class="settings-panel">
          <div class="settings-title">图片设置</div>
          <div class="form-controls">
            <div class="form-controls-row">
              <div class="form-group select-group">
                <label for="edit-quality" class="small-label">画面质量</label>
                <select id="edit-quality" class="form-control select-control" v-model="imageQuality">
                  <option value="low">低质量</option>
                  <option value="medium">中等质量</option>
                  <option value="high">高质量</option>
                </select>
              </div>
              
              <div class="form-group select-group">
                <label for="edit-size" class="small-label">图片尺寸</label>
                <select id="edit-size" class="form-control select-control" v-model="imageSize">
                  <option value="1024x1024">正方形</option>
                  <option value="1024x1536">竖向</option>
                  <option value="1536x1024">横向</option>
                </select>
              </div>
            </div>
            
            <button 
              class="btn btn-primary edit-btn" 
              @click="editImage" 
              :disabled="isEditing || !currentImage || !editPrompt"
            >
              <span class="loading" v-if="isEditing"></span>
              <span class="btn-icon" v-if="!isEditing">✏️</span>
              {{ isEditing ? '编辑中...' : '开始编辑' }}
            </button>
          </div>
          
          <div class="error-message" v-if="error">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>
          
          <div class="status-indicator" v-if="statusMessage">
            <span class="status-icon">{{ statusIcon }}</span>
            {{ statusMessage }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="result-container" v-if="editedImage">
      <div class="result-card">
        <div class="result-image-container" @click="enlargeImage">
          <img 
            :src="editedImage" 
            alt="Edited" 
            class="image-preview"
          />
          <div class="image-overlay">
            <span class="zoom-hint">点击放大</span>
          </div>
        </div>
        <div class="action-buttons">
          <button class="btn btn-icon" @click="viewOriginalImage" title="查看原图">
            <span>🔍</span>
          </button>
          <button class="btn btn-icon" @click="downloadImage" title="下载图片">
            <span>💾</span>
          </button>
        </div>
      </div>
      <div class="prompt-display" v-if="editPrompt">
        <div class="prompt-content">
          <span class="prompt-icon">💬</span>
          <p>{{ editPrompt }}</p>
        </div>
      </div>
    </div>
    
    <div class="image-modal" v-if="showImageModal" @click="closeModal">
      <div class="modal-content">
        <img :src="editedImage" alt="Enlarged" class="modal-image" />
        <button class="close-modal-btn" @click="closeModal">×</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImageEditor',
  props: {
    apiEndpoint: {
      type: String,
      default: '/api'
    }
  },
  data() {
    return {
      images: [],
      currentImageIndex: -1,
      editPrompt: '',
      imageQuality: 'medium',
      imageSize: '1024x1024',
      editedImage: null,
      isEditing: false,
      error: '',
      statusMessage: '',
      statusIcon: '',
      showImageModal: false
    }
  },
  computed: {
    currentImage() {
      return this.images.length > 0 && this.currentImageIndex >= 0 
        ? this.images[this.currentImageIndex] 
        : null;
    }
  },
  methods: {
    handleImageUpload(e) {
      const files = e.target.files;
      if (files && files.length > 0) {
        this.addImages(files);
      }
    },
    
    addImages(files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.images.push({
              file: file,
              preview: reader.result
            });
            
            if (this.currentImageIndex === -1) {
              this.currentImageIndex = 0;
            }
          };
          reader.readAsDataURL(file);
        }
      });
    },
    
    handlePaste(e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      let hasImage = false;
      
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          hasImage = true;
          const blob = item.getAsFile();
          this.addImages([blob]);
        }
      }
      
      if (hasImage) {
        e.preventDefault();
      }
    },
    
    selectImage(index) {
      if (index >= 0 && index < this.images.length) {
        this.currentImageIndex = index;
      }
    },
    
    removeImage(index) {
      this.images.splice(index, 1);
      if (this.images.length === 0) {
        this.currentImageIndex = -1;
      } else if (this.currentImageIndex >= this.images.length) {
        this.currentImageIndex = this.images.length - 1;
      }
    },
    
    async editImage() {
      if (!this.currentImage) {
        this.error = '请先上传图片';
        return;
      }
      
      if (!this.editPrompt) {
        this.error = '请输入编辑提示词';
        return;
      }

      this.error = '';
      this.statusMessage = '正在处理您的请求...';
      this.statusIcon = '⏳';
      this.isEditing = true;
      
      try {
        // 创建FormData对象
        const formData = new FormData();
        formData.append('prompt', this.editPrompt);
        formData.append('quality', this.imageQuality);
        formData.append('size', this.imageSize);
        
        // 简化上传逻辑，添加更明确的日志
        console.log('准备上传图片数量:', this.images.length);
        
        // 使用唯一的字段名，避免字段名冲突
        // 只上传第一张图片
        if (this.images.length > 0) {
          formData.append('image', this.currentImage.file);
          // 如果有多张图片，暂时只处理第一张
          if (this.images.length > 1) {
            console.log('注意: 当前选中的是第一张图片，其他图片暂不处理');
          }
        }
        
        console.log('开始发送请求...');
        
        const response = await axios({
          method: 'post',
          url: `${this.apiEndpoint}/images/edits`,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        });
        
        this.editedImage = response.data.data[0].url;
        this.statusMessage = '图片编辑成功！';
        this.statusIcon = '✅';
        
        // 3秒后清除状态消息
        setTimeout(() => {
          if (this.statusMessage === '图片编辑成功！') {
            this.statusMessage = '';
          }
        }, 3000);
      } catch (error) {
        console.error('编辑图片错误:', error);
        this.error = error.response?.data?.error?.message || error.message || '图像编辑失败';
        this.statusMessage = '';
      } finally {
        this.isEditing = false;
      }
    },
    viewOriginalImage() {
      if (this.editedImage) {
        window.open(this.editedImage, '_blank');
      }
    },
    downloadImage() {
      if (this.editedImage) {
        const link = document.createElement('a');
        link.href = this.editedImage;
        link.download = `ai-edited-image-${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    applyPresetStyle(style) {
      // If there's existing content, append the style
      if (this.editPrompt && this.editPrompt.trim() !== '') {
        // Check if the prompt already ends with punctuation
        const endsWithPunctuation = /[，,。.!！?？]$/.test(this.editPrompt.trim());
        this.editPrompt = this.editPrompt.trim() + (endsWithPunctuation ? ' ' : '，') + style;
      } else {
        // Set the style as the prompt
        this.editPrompt = style;
      }
    },
    enlargeImage() {
      this.showImageModal = true;
      // 防止滚动
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.showImageModal = false;
      // 恢复滚动
      document.body.style.overflow = 'auto';
    }
  }
}
</script>

<style scoped>
.image-editor {
  max-width: 1200px;
}

.edit-card-content {
  display: flex;
  gap: 1.5rem;
}

.upload-section {
  flex: 0 0 auto;
}

.prompt-section {
  flex: 1;
}

.upload-container {
  position: relative;
  width: 180px;
  height: 180px;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  transition: all 0.3s;
  padding: 1rem;
  outline: none;
}

.upload-container:hover .upload-area,
.upload-area:focus {
  border-color: #6c5ce7;
  background-color: rgba(108, 92, 231, 0.05);
}

.upload-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #6c5ce7;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.primary-text {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.3rem;
}

.secondary-text {
  font-size: 0.8rem;
  color: #718096;
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

.preview-section {
  margin-top: 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.preview-image-container {
  position: relative;
  flex: 0 0 150px;
}

.uploaded-image-preview {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.preview-label {
  position: absolute;
  top: -10px;
  left: 10px;
  background-color: #6c5ce7;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.settings-panel {
  flex-grow: 1;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.2rem;
}

.settings-title {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.settings-title::before {
  content: "⚙️";
  margin-right: 0.5rem;
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

.edit-btn {
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

.result-image-container {
  position: relative;
  cursor: pointer;
  max-height: 300px;
  overflow: hidden;
  border-radius: 8px;
}

.image-preview {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  display: block;
  transition: transform 0.3s ease;
}

.result-image-container:hover .image-preview {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.result-image-container:hover .image-overlay {
  opacity: 1;
}

.zoom-hint {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.zoom-hint::before {
  content: "🔍";
  margin-right: 0.5rem;
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
  .edit-card-content {
    flex-direction: column;
  }
  
  .upload-container {
    width: 100%;
    height: 120px;
  }
  
  .preview-section {
    flex-direction: column;
  }
  
  .preview-image-container {
    width: 100%;
    flex: auto;
  }
  
  .form-controls-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .select-group {
    width: 100%;
  }
}

.image-thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  max-width: 300px;
}

.image-thumbnail {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.image-thumbnail.active {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.3);
}

.image-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-thumbnail:hover .remove-image-btn {
  opacity: 1;
}

.multi-image-hint {
  font-size: 0.75rem;
  color: #6c5ce7;
  margin-top: 0.5rem;
  font-weight: 500;
}

.preset-styles {
  margin-top: 1rem;
}

.preset-styles-label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preset-button {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.preset-button:hover {
  background-color: #f8f5ff;
  border-color: #6c5ce7;
  transform: translateY(-2px);
}

.preset-icon {
  margin-right: 0.3rem;
  font-size: 1rem;
}

.preset-name {
  font-size: 0.85rem;
  color: #4a5568;
}

.status-indicator {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #4a5568;
  display: flex;
  align-items: center;
}

.status-icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

/* Modal styles */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
}

.close-modal-btn {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 40px;
  height: 40px;
  background-color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.close-modal-btn:hover {
  background-color: #f8f5ff;
}
</style>
