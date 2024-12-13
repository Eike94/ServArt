import { useState, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./recibo.css"; // Importa o CSS

const Receipt = ({ services }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Função para formatar data no formato dd/mm/aaaa
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Ajusta para corrigir o fuso
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Atualiza as datas de início e fim ao carregar o componente ou mudar de mês
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); // Primeiro dia do mês
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último dia do mês

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  }, []); // Esse efeito é executado apenas na montagem do componente

  // Filtra os serviços por data e ordena
  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const serviceDate = new Date(service.data);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || serviceDate >= start) && (!end || serviceDate <= end);
      })
      .sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordena por data
  }, [services, startDate, endDate]);

  const total = filteredServices.reduce((acc, item) => acc + item.valor, 0);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Recibo", 105, 10, { align: "center" });

    doc.setFontSize(12);
    doc.text(
      `${startDate ? formatDate(startDate) : "Início"} à ${
        endDate ? formatDate(endDate) : "Fim"
      }`,
      105,
      20,
      { align: "center" }
    );

    const tableData = filteredServices.map((service) => [
      service.cliente,
      `${service.servico1}${service.servico2 ? ` + ${service.servico2}` : ""}`,
      `R$ ${service.valor.toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [["Nome Cliente", "Serviços Realizados", "Valor"]],
      body: tableData,
      startY: 30,
      theme: "striped",
      styles: { halign: "center" },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total a Receber: R$ ${total.toFixed(2)}`, 105, finalY, {
      align: "center",
    });

    doc.save("recibo.pdf");
  };

  return (
    <div className="receipt-container">
      <h2>Recibo</h2>

      <div className="date-filter">
        <label>
          Data de Início:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Data de Fim:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <ul className="receipt-list">
        {filteredServices.map((service, index) => (
          <li key={index}>
            {service.cliente} - {service.servico1} {service.servico2 && `+ ${service.servico2}`} - R$
            {service.valor.toFixed(2)} - {formatDate(service.data)}
          </li>
        ))}
      </ul>

      <h3 className="receipt-total">Total: R$ {total.toFixed(2)}</h3>

      <button className="generate-pdf-button" onClick={generatePDF}>
        Gerar PDF
      </button>
    </div>
  );
};

export default Receipt;
