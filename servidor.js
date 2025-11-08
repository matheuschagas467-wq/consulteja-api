// Importação dos módulos necessários
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Inicialização do aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para permitir requisições de qualquer origem
app.use(cors());

// Caminho para o nosso "banco de dados" JSON
const productsFilePath = path.join(__dirname, 'products.json');

// Endpoint da API para buscar um produto pelo código de barras
app.get('/api/products/:barcode', (req, res) => {
  const { barcode } = req.params;

  // Lê o arquivo JSON de forma assíncrona
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo de produtos:", err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }

    try {
      const products = JSON.parse(data);

      // Procura o produto com o código de barras correspondente
      const product = products.find(p => p.barcode === barcode);

      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: 'Produto não encontrado.' });
      }
    } catch (parseErr) {
      console.error("Erro ao fazer o parse do JSON:", parseErr);
      return res.status(500).json({ error: 'Erro no formato do arquivo de dados.' });
    }
  });
});

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor da API "ConsulteJá" rodando na porta ${PORT}`);
  console.log(`Use a rota: http://localhost:${PORT}/api/products/:barcode`);
});
