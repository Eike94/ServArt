import { useEffect, useState } from "react";
import api from "../api";
import "./servicelist.css"; // Importe o CSS aqui

const ServiceList = ({ services, setServices }) => {
  const [editingId, setEditingId] = useState(null); // ID do item em edição
  const [editData, setEditData] = useState({
    cliente: "",
    servico1: "",
    valor: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/servicos");
        setServices(response.data);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    };

    fetchServices();
  }, [setServices]);

  const handleEditClick = (service) => {
    setEditingId(service.id);
    setEditData({
      cliente: service.cliente,
      servico1: service.servico1,
      valor: service.valor.toFixed(2),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (id) => {
    try {
      const response = await api.put(`/servicos/${id}`, {
        ...editData,
        valor: parseFloat(editData.valor),
      });
      setServices((prev) =>
        prev.map((service) =>
          service.id === id ? { ...service, ...response.data } : service
        )
      );
      setEditingId(null); // Sair do modo de edição
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await api.delete(`/servicos/${id}`);
        setServices((prev) => prev.filter((service) => service.id !== id));
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
      }
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Cliente</th>
          <th>Serviços</th>
          <th>Valor</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.id}>
            <td>{new Date(service.data).toLocaleDateString()}</td>
            <td>
              {editingId === service.id ? (
                <input
                  type="text"
                  name="cliente"
                  value={editData.cliente}
                  onChange={handleInputChange}
                />
              ) : (
                service.cliente
              )}
            </td>
            <td>
              {editingId === service.id ? (
                <input
                  type="text"
                  name="servico1"
                  value={editData.servico1}
                  onChange={handleInputChange}
                />
              ) : (
                service.servico1
              )}
            </td>
            <td>
              {editingId === service.id ? (
                <input
                  type="number"
                  name="valor"
                  step="0.01"
                  value={editData.valor}
                  onChange={handleInputChange}
                />
              ) : (
                `R$ ${service.valor.toFixed(2)}`
              )}
            </td>
            <td>
              {editingId === service.id ? (
                <>
                  <button onClick={() => handleSave(service.id)}>Salvar</button>
                  <button onClick={() => setEditingId(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditClick(service)}>Editar</button>
                  <button onClick={() => handleDelete(service.id)}>Excluir</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServiceList;
