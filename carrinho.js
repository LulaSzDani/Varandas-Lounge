function adicionarAoCarrinho(botao) {
  const produto = botao.parentElement.parentElement;
  const nomeProduto = produto.querySelector(".producttitle").textContent;
  const precoProduto = parseFloat(botao.getAttribute("data-preco"));
  const imagemProduto = produto.querySelector("img").src;

  const item = {
    id: Date.now(),
    nome: nomeProduto,
    preco: precoProduto,
    imagem: imagemProduto,
    quantidade: 1,
  };

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const existingProduct = carrinho.find((prod) => prod.nome === nomeProduto);
  if (existingProduct) {
    existingProduct.quantidade += 1;
  } else {
    carrinho.push(item);
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  alert(`${nomeProduto} foi adicionado ao carrinho!`);
  exibirCarrinho();
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      adicionarAoCarrinho(this);
    });
  });
  exibirCarrinho();
});

function exibirCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const carrinhoContainer = document.getElementById("carrinhoContainer");
  carrinhoContainer.innerHTML = "";

  if (carrinho.length === 0) {
    carrinhoContainer.innerHTML = "<p>O carrinho está vazio.</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ITEM</th>
        <th>PREÇO</th>
        <th>QUANTIDADE</th>
        <th>AÇÕES</th>
      </tr>
    </thead>
    <tbody id="carrinhoTableBody"></tbody>
  `;

  carrinho.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <img src="${item.imagem}" alt="${item.nome}" style="width: 50px;">
        <br>
        <span>${item.nome}</span>
      </td>
      <td>R$${(item.preco * item.quantidade).toFixed(2)}</td>
      <td>
        <input type="number" value="${
          item.quantidade
        }" min="1" style="width: 50px;" onchange="atualizarQuantidade(${index}, this.value)">
      </td>
      <td>
        <button class="btn-remove" onclick="removerDoCarrinho(${index})">Remover</button>
      </td>
    `;

    table.querySelector("tbody").appendChild(row);
  });

  carrinhoContainer.appendChild(table);

  const finalizarCompraButton = document.createElement("button");
  finalizarCompraButton.textContent = "Finalizar Compra";
  finalizarCompraButton.className = "btn-finalizar";
  finalizarCompraButton.onclick = finalizarCompra;
  carrinhoContainer.appendChild(finalizarCompraButton);

  const compartilharWhatsAppButton = document.createElement("button");
  compartilharWhatsAppButton.textContent = "Compartilhar no WhatsApp";
  compartilharWhatsAppButton.className = "btn-compartilhar-whatsapp";
  compartilharWhatsAppButton.onclick = compartilharNoWhatsApp;
  carrinhoContainer.appendChild(compartilharWhatsAppButton);
}

function atualizarQuantidade(index, quantidade) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho[index].quantidade = parseInt(quantidade);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  exibirCarrinho();
}

function removerDoCarrinho(index) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  exibirCarrinho();
}

function finalizarCompra() {
  alert("Obrigado pela preferência!");
  localStorage.removeItem("carrinho");
  exibirCarrinho();
}

function compartilharNoWhatsApp() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (carrinho.length === 0) {
    alert("O carrinho está vazio. Adicione itens antes de compartilhar.");
    return;
  }

  let mensagem = "Meu carrinho de compras:\n\n";
  let total = 0;

  carrinho.forEach((item) => {
    mensagem += `${item.nome} - Quantidade: ${item.quantidade} - R$${(
      item.preco * item.quantidade
    ).toFixed(2)}\n`;
    total += item.preco * item.quantidade;
  });

  mensagem += `\nTotal: R$${total.toFixed(2)}`;

  const mennsagem = "Sua mensagem aqui";
  const numeroTelefone = ""; // Insira o número de telefone no formato internacional, sem o sinal de +.
  const urlEncodedMensagem = encodeURIComponent(mensagem);
  const whatsappURL = `https://wa.me/${numeroTelefone}?text=${urlEncodedMensagem}`;
  
  // Agora você pode redirecionar o usuário para a URL
  window.location.href = whatsappURL;
  
  window.open(whatsappURL, "_blank");
}

document.addEventListener("DOMContentLoaded", exibirCarrinho);
