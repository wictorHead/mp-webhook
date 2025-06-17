import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const TOKEN_MP = "APP_USR-8581410906528367-061713-ca153ee00cb409a001997f2e20d896da-2448358894; 

app.post("/webhook", async (req, res) => {
  const paymentId = req.body.data?.id;
  if (!paymentId) return res.sendStatus(400);

  try {
    const { data: pagamento } = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${TOKEN_MP}`
      }
    });

    if (pagamento.status === "approved") {
      await axios.post("https://SEUSITE.wixsite.com/_functions/atualizarStatus", {
        idPagamento: pagamento.id
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Erro no webhook:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook ativo na porta ${PORT}`));
