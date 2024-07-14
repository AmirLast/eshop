<script>
    export let product;
    export let closeModal;
  
    let quantity = 1;
    let size = '3x3';
  
    function addToCart() {
      // Add logic to add the product to the cart
      console.log(`Adding ${quantity} of size ${size} to cart`);
    }
  </script>
  
  <div class="modal-background" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-button" on:click={closeModal}>×</button>
      <img src={product.image} alt={product.name} class="product-image" />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price.toFixed(2)}</p>
      <div class="quantity-size">
        <label>
          Qty:
          <select bind:value={quantity}>
            {#each Array(10).fill(0) as _, i}
              <option value={i+1}>{i+1}</option>
            {/each}
          </select>
        </label>
        <label>
          Size:
          <select bind:value={size}>
            <option>3x3</option>
            <option>4x4</option>
            <option>5x5</option>
          </select>
        </label>
      </div>
      <button on:click={addToCart} class="add-to-cart-button">Add To Cart</button>
    </div>
  </div>
  
  <style>
    .modal-background {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 300px;
      position: relative;
    }
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.5rem;
    }
    .product-image {
      width: 100%;
      height: auto;
    }
    .quantity-size {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }
    .add-to-cart-button {
      background: purple;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
  </style>
  