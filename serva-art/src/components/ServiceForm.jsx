import { useState } from "react";
import api from "../api"; // Importa o cliente Axios configurado
import "./serviceform.css";

const ServiceForm = ({ setServices, values }) => {
  const [formData, setFormData] = useState({
    cliente: "",
    servico1: "",
    servico2: "",
    valor: 0,
    data: new Date().toISOString().split("T")[0], // Data atual no formato YYYY-MM-DD
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calcula o valor baseado nos serviços selecionados
    const valor =
      (values[formData.servico1] || 0) + (values[formData.servico2] || 0);

    try {
      // Envia os dados para o backend
      const response = await api.post("/servicos", {
        ...formData,
        valor,
      });

      // Atualiza o estado local com o novo serviço
      setServices((prev) => [...prev, response.data]);

      // Reseta o formulário
      setFormData({
        cliente: "",
        servico1: "",
        servico2: "",
        valor: 0,
        data: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Serviços do Dia</h2>

      {/* Campo para o Cliente */}
      <label>
        <input placeholder="Digite o Nome do Cliente..."
          type="text"
          value={formData.cliente}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, cliente: e.target.value }))
          }
        />
      </label>

      {/* Contêiner para Serviços 1 e 2 */}
      <div className="services-container">
        {/* Campo para Serviço 1 */}
        <label>
          
          <select
            value={formData.servico1}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, servico1: e.target.value }))
            }
          >
            <option value="">Selecione</option>
            <option value="vetorSimples">Vetorização Simples</option>
            <option value="vetorMediana">Vetorização Mediana</option>
            <option value="vetorComplexa">Vetorização Complexa</option>
          </select>
        </label>

        {/* Campo para Serviço 2 */}
        <label>
          
          <select
            value={formData.servico2}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, servico2: e.target.value }))
            }
          >
            <option value="">Selecione</option>
            <option value="layout">Layout</option>
            <option value="orcamento">Orçamento</option>
            <option value="separacaoCor"> Separação de Cor </option>
          </select>
        </label>
      </div>

      {/* Campo para Data */}
      <label>
        <input
          type="date"
          value={formData.data}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, data: e.target.value }))
          }
        />
      </label>

      {/* Botão para Salvar */}
      <button type="submit">Salvar</button>
    </form>
  );
};

export default ServiceForm;
