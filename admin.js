const form = document.getElementById('productForm');
const message = document.getElementById('formMessage');
const preview = document.getElementById('productPreview');
const imageFileInput = document.getElementById('imageFile');
const videoFileInput = document.getElementById('videoFile');

function getProducts() {
  return JSON.parse(localStorage.getItem('hovProducts') || '[]');
}

function setProducts(products) {
  localStorage.setItem('hovProducts', JSON.stringify(products));
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function readFilesAsDataURLs(files) {
  return Promise.all(Array.from(files).map(file => readFileAsDataURL(file)));
}

function renderProducts() {
  const products = getProducts();
  preview.innerHTML = products.length ? products.map(product => `
    <article class="product-card preview-card">
      <img src="${(product.imageUrls && product.imageUrls.length && product.imageUrls[0]) || product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${product.productName}" />
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.productName}</h3>
        <p>${product.shortDescription}</p>
        <div class="product-price">
          ${product.offerPrice ? `
            <span class="original-price">₹${product.price}</span>
            <span class="offer-price">₹${product.offerPrice}</span>
          ` : `
            <span class="price">₹${product.price}</span>
          `}
        </div>
        ${product.sizes ? `<p class="product-sizes">Sizes: ${product.sizes}</p>` : ''}
        ${product.imageUrls && product.imageUrls.length > 1 ? `<p class="media-count">${product.imageUrls.length} images uploaded</p>` : ''}
        ${product.videoUrls && product.videoUrls.length ? `<p class="media-count">${product.videoUrls.length} video${product.videoUrls.length > 1 ? 's' : ''} uploaded</p>` : ''}
      </div>
    </article>
  `).join('') : '<p class="empty-state">No products added yet.</p>';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const imageUrlValue = data.get('imageUrl').trim();
  const imageFiles = imageFileInput.files;
  const videoFiles = videoFileInput.files;
  const maxImages = 15;
  const maxVideos = 8;

  if (imageFiles.length > maxImages) {
    message.textContent = `Upload up to ${maxImages} images only.`;
    message.classList.add('error');
    return;
  }

  if (videoFiles.length > maxVideos) {
    message.textContent = `Upload up to ${maxVideos} videos only.`;
    message.classList.add('error');
    return;
  }

  let imageUrls = imageUrlValue ? [imageUrlValue] : [];
  let videoUrls = [];

  if (imageFiles.length) {
    imageUrls = await readFilesAsDataURLs(imageFiles);
  }

  if (videoFiles.length) {
    videoUrls = await readFilesAsDataURLs(videoFiles);
  }

  const product = {
    productName: data.get('productName').trim(),
    category: data.get('category'),
    price: data.get('price').trim(),
    offerPrice: data.get('offerPrice').trim(),
    sizes: data.get('sizes').trim(),
    shortDescription: data.get('shortDescription').trim(),
    imageUrls: imageUrls,
    videoUrls: videoUrls,
    material: data.get('material').trim(),
    care: data.get('care').trim(),
    delivery: data.get('delivery').trim(),
    fullDescription: data.get('fullDescription').trim(),
    tags: data.get('tags').trim(),
    inStock: data.get('inStock') === 'on',
    createdAt: new Date().toISOString(),
  };

  const products = getProducts();
  products.push(product);
  setProducts(products);
  renderProducts();
  form.reset();
  message.textContent = 'Product added successfully.';
  message.classList.add('success');
  setTimeout(() => {
    message.textContent = '';
    message.classList.remove('success');
  }, 3000);
});

renderProducts();
