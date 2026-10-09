import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function Admin() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState('products');
  const [viewState, setViewState] = useState('list'); // 'list' | 'form'
  
  // Category Form State
  const [catId, setCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  
  // Product Form State
  const [prodId, setProdId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('10');
  const [prodCategory, setProdCategory] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState<File | null>(null);
  
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  }

  async function fetchProducts() {
    const { data } = await supabase.from('products').select(`*, product_images ( image_url )`);
    if (data) setProducts(data);
  }

  // --- Category Handlers ---
  function openCategoryForm(cat?: any) {
    setViewState('form');
    setMessage('');
    if (cat) {
      setCatId(cat.id);
      setCatName(cat.name);
      setCatSlug(cat.slug);
    } else {
      setCatId(null);
      setCatName('');
      setCatSlug('');
    }
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    setMessage('Saving category...');
    
    let error;
    if (catId) {
      const { error: updateError } = await supabase.from('categories').update({ name: catName, slug: catSlug }).eq('id', catId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('categories').insert([{ name: catName, slug: catSlug }]);
      error = insertError;
    }
    
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Category saved successfully!');
      fetchCategories();
      setViewState('list');
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  }

  // --- Product Handlers ---
  function openProductForm(prod?: any) {
    setViewState('form');
    setMessage('');
    if (prod) {
      setProdId(prod.id);
      setProdName(prod.name);
      setProdSlug(prod.slug);
      setProdPrice(prod.price.toString());
      setProdStock(prod.stock_quantity.toString());
      setProdCategory(prod.category_id || '');
      setProdDesc(prod.description || '');
      setProdImage(null);
    } else {
      setProdId(null);
      setProdName('');
      setProdSlug('');
      setProdPrice('');
      setProdStock('10');
      setProdCategory('');
      setProdDesc('');
      setProdImage(null);
    }
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setMessage('Saving product...');
    
    const productData = {
      name: prodName,
      slug: prodSlug,
      price: parseFloat(prodPrice),
      stock_quantity: parseInt(prodStock),
      category_id: prodCategory || null,
      description: prodDesc
    };

    let savedProductId = prodId;
    let error;

    if (prodId) {
      const { error: updateError } = await supabase.from('products').update(productData).eq('id', prodId);
      error = updateError;
    } else {
      const { data: newProd, error: insertError } = await supabase.from('products').insert([productData]).select();
      error = insertError;
      if (newProd) savedProductId = newProd[0].id;
    }
    
    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    if (prodImage && savedProductId) {
      setMessage('Uploading image...');
      const fileExt = prodImage.name.split('.').pop();
      const fileName = `${savedProductId}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, prodImage);
        
      if (uploadError) {
        setMessage(`Product saved, but image upload failed: ${uploadError.message}`);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
        
      // Delete old image references
      await supabase.from('product_images').delete().eq('product_id', savedProductId);
      await supabase.from('product_images').insert([{
        product_id: savedProductId,
        image_url: publicUrl,
        display_order: 0
      }]);
    }
    
    setMessage('Product saved successfully!');
    fetchProducts();
    setViewState('list');
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your store inventory securely.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        <button className={activeTab === 'products' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => { setActiveTab('products'); setViewState('list'); }}>
          Products
        </button>
        <button className={activeTab === 'categories' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => { setActiveTab('categories'); setViewState('list'); }}>
          Categories
        </button>
      </div>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', color: '#166534', marginBottom: '1rem', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      {/* LIST VIEWS */}
      {viewState === 'list' && activeTab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2>Categories</h2>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => openCategoryForm()}>
              <Plus size={16} /> Add Category
            </button>
          </div>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
                <span style={{ fontWeight: '500' }}>{cat.name}</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => openCategoryForm(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
            {categories.length === 0 && <div style={{ padding: '1rem', textAlign: 'center' }}>No categories found.</div>}
          </div>
        </div>
      )}

      {viewState === 'list' && activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2>Products</h2>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => openProductForm()}>
              <Plus size={16} /> Add Product
            </button>
          </div>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {products.map(prod => (
              <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                    {prod.product_images?.[0]?.image_url && <img src={prod.product_images[0].image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <span style={{ fontWeight: '500' }}>{prod.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span>{prod.price} MAD</span>
                  <button onClick={() => openProductForm(prod)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDeleteProduct(prod.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
            {products.length === 0 && <div style={{ padding: '1rem', textAlign: 'center' }}>No products found.</div>}
          </div>
        </div>
      )}

      {/* FORM VIEWS */}
      {viewState === 'form' && activeTab === 'categories' && (
        <div style={{ maxWidth: '500px' }}>
          <h2>{catId ? 'Edit Category' : 'Create New Category'}</h2>
          <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div><label className="form-label">Category Name</label><input type="text" className="form-input" required value={catName} onChange={e => setCatName(e.target.value)} /></div>
            <div><label className="form-label">Slug (URL friendly)</label><input type="text" className="form-input" required value={catSlug} onChange={e => setCatSlug(e.target.value)} /></div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">{catId ? 'Update Category' : 'Save Category'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setViewState('list')}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {viewState === 'form' && activeTab === 'products' && (
        <div style={{ maxWidth: '600px' }}>
          <h2>{prodId ? 'Edit Product' : 'Create New Product'}</h2>
          <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div><label className="form-label">Product Name</label><input type="text" className="form-input" required value={prodName} onChange={e => setProdName(e.target.value)} /></div>
            <div><label className="form-label">Slug (URL friendly)</label><input type="text" className="form-input" required value={prodSlug} onChange={e => setProdSlug(e.target.value)} /></div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}><label className="form-label">Price</label><input type="number" step="0.01" className="form-input" required value={prodPrice} onChange={e => setProdPrice(e.target.value)} /></div>
              <div style={{ flex: 1 }}><label className="form-label">Stock Quantity</label><input type="number" className="form-input" required value={prodStock} onChange={e => setProdStock(e.target.value)} /></div>
            </div>
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" value={prodCategory} onChange={e => setProdCategory(e.target.value)} required>
                <option value="">Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div><label className="form-label">Description (Optional)</label><textarea className="form-input" rows={4} value={prodDesc} onChange={e => setProdDesc(e.target.value)} /></div>
            <div>
              <label className="form-label">Product Image {prodId && "(Leave empty to keep existing)"}</label>
              <input type="file" accept="image/*" className="form-input" onChange={e => setProdImage(e.target.files?.[0] || null)} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">{prodId ? 'Update Product' : 'Save Product'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setViewState('list')}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
