import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Middleware para capturar erros globais
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno no servidor" });
});

// Teste de conexão com o Prisma
(async () => {
  try {
    await prisma.$connect();
    console.log("Conectado ao banco de dados com Prisma!");
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    process.exit(1); // Encerra o processo caso a conexão falhe
  }
})();

// Rota para criar um novo serviço
app.post("/servicos", async (req, res) => {
  const { cliente, servico1, servico2, valor, data } = req.body;

  if (!cliente || !servico1 || !valor || !data) {
    return res.status(400).json({ error: "Dados obrigatórios estão faltando" });
  }

  try {
    const novoServico = await prisma.servico.create({
      data: {
        cliente,
        servico1,
        servico2: servico2 || null,
        valor: parseFloat(valor),
        data: new Date(data),
      },
    });
    res.status(201).json(novoServico);
  } catch (error) {
    console.error("Erro ao criar o serviço:", error);
    res.status(500).json({ error: "Erro ao criar o serviço" });
  }
});

// Rota para listar todos os serviços
app.get("/servicos", async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { data: "asc" }, // Ordena os serviços pela data (opcional)
    });
    res.json(servicos);
  } catch (error) {
    console.error("Erro ao buscar os serviços:", error);
    res.status(500).json({ error: "Erro ao buscar os serviços" });
  }
});

// Rota para atualizar um serviço
app.put("/servicos/:id", async (req, res) => {
  const { id } = req.params;
  const { cliente, servico1, servico2, valor, data } = req.body;

  try {
    const servicoAtualizado = await prisma.servico.update({
      where: { id: parseInt(id) }, // Certifique-se de que o ID é um número
      data: {
        cliente,
        servico1,
        servico2: servico2 || null,
        valor: parseFloat(valor),
        data: new Date(data),
      },
    });
    res.json(servicoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar o serviço:", error);
    res.status(500).json({ error: "Erro ao atualizar o serviço" });
  }
});

// Rota para deletar um serviço
app.delete("/servicos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.servico.delete({
      where: { id: parseInt(id) }, // Certifique-se de que o ID é um número
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar o serviço:", error);
    res.status(500).json({ error: "Erro ao deletar o serviço" });
  }
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
