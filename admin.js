const form = document.getElementById('productForm');
const message = document.getElementById('formMessage');
const preview = document.getElementById('productPreview');

function getProducts() {
  return JSON.parse(localStorage.getItem('hovProducts') || '[]');
}

function setProducts(products) {
  localStorage.setItem('hovProducts', JSON.stringify(products));
}

function renderProducts() {
  const products = getProducts();
  preview.innerHTML = products.length ? products.map(product => `
    <article class="product-card preview-card">
      <img src="${product.imageUrl}" alt="${product.productName}" />
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.productName}</h3>
        <p>${product.shortDescription}</p>
        <span class="price">₹${product.price}</span>
      </div>
    </article>
  `).join('') : '<p class="empty-state">No products added yet.</p>';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const product = {
    productName: data.get('productName').trim(),
    category: data.get('category'),
    price: data.get('price').trim(),
    sku: data.get('sku').trim(),
    shortDescription: data.get('shortDescription').trim(),
    imageUrl: data.get('imageUrl').trim(),
    material: data.get('material').trim(),
    fit: data.get('fit').trim(),
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
