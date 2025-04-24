// OpenAI API 调用函数

// 图像生成函数
export const generateImage = async (apiKey, prompt, baseURL = 'https://api.openai.com/v1', quality = 'medium', size = '1024x1024') => {
  try {
    const response = await fetch(`${baseURL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n: 1,
        quality,
        size,
        response_format: "url"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || '图像生成失败');
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('生成图片错误:', error);
    throw error;
  }
};

// 图像编辑函数
export const editImage = async (apiKey, image, prompt, baseURL = 'https://api.openai.com/v1', quality = 'medium', size = '1024x1024') => {
  try {
    // 创建FormData对象
    const formData = new FormData();
    
    // 添加必要的参数
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt);
    formData.append('quality', quality);
    formData.append('size', size);
    formData.append('response_format', 'url');
    
    // 添加图片文件
    formData.append('image', image);

    const response = await fetch(`${baseURL}/images/edits`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
        // 注意：使用FormData时不要设置Content-Type，浏览器会自动设置正确的boundary
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || '图像编辑失败');
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('编辑图片错误:', error);
    throw error;
  }
};
