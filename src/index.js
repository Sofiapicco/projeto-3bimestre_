import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// ------------------- USUÁRIOS -------------------

// Criar usuário
app.post("/usuarios", async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Listar usuários
app.get("/usuarios", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Atualizar usuário
app.put("/usuarios/:id", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(user);
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(400).json({ error: e.message });
  }
});

// Deletar usuário
app.delete("/usuarios/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Usuário removido com sucesso" });
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(400).json({ error: e.message });
  }
});

// ------------------- PRODUTOS -------------------

// Criar produto
app.post("/products", async (req, res) => {
  try {
    const product = await prisma.product.create({ data: req.body });
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Listar produtos
app.get("/products", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ 
      include: { store: { include: { user: true } } }
    });
    res.json(products);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Atualizar produto
app.put("/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(product);
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(400).json({ error: e.message });
  }
});

// Deletar produto
app.delete("/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Produto removido com sucesso" });
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(400).json({ error: e.message });
  }
});

// ------------------- LOJAS -------------------

// Criar loja
app.post("/stores", async (req, res) => {
  try {
    const store = await prisma.store.create({ data: req.body });
    res.json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 🔹 Listar todas as lojas
app.get("/stores", async (_req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: { user: true, products: true } // opcional: traz dono e produtos
    });
    res.json(stores);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Buscar loja por ID
app.get("/stores/:id", async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true, products: true }
    });
    res.json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Atualizar loja
app.put("/stores/:id", async (req, res) => {
  try {
    const store = await prisma.store.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Deletar loja
app.delete("/stores/:id", async (req, res) => {
  try {
    const store = await prisma.store.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json(store);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ------------------- SERVIDOR -------------------

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
