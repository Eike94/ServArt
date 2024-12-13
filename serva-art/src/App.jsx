import { useState, useEffect } from "react";
import ServiceForm from "./components/ServiceForm";
import Receipt from "./components/Receipt";
import ServiceList from "./components/ServiceList";
import EditValues from "./components/EditValues";
import api from "./api"; // Certifique-se de que o cliente Axios está configurado corretamente

function App() {
  const [currentPage, setCurrentPage] = useState("form");
  const [services, setServices] = useState([]);
  const [values, setValues] = useState({
    vetorSimples: 10,
    vetorMediana: 15,
    vetorComplexa: 20,
    layout: 7,
    orcamento: 7,
    separacaoCor: 7,
  });

  // Carrega os dados do banco de dados na montagem do componente
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/servicos"); // Faz a requisição ao backend
        setServices(response.data); // Atualiza o estado com os dados recebidos
      } catch (error) {
        console.error("Erro ao carregar serviços do banco de dados:", error);
      }
    };

    fetchServices();
  }, []); // Executa apenas na montagem do componente

  const renderPage = () => {
    switch (currentPage) {
      case "form":
        return <ServiceForm setServices={setServices} values={values} />;
      case "receipt":
        return <Receipt services={services} />;
      case "list":
        return <ServiceList services={services} setServices={setServices} />;
      case "editValues":
        return <EditValues values={values} setValues={setValues} />;
      default:
        return <ServiceForm setServices={setServices} values={values} />;
    }
  };

  return (
    <div>
      <header>
        <button onClick={() => setCurrentPage("form")}>Formulário</button>
        <button onClick={() => setCurrentPage("receipt")}>Recibo</button>
        <button onClick={() => setCurrentPage("list")}>Serviços</button>
        <button onClick={() => setCurrentPage("editValues")}>Editar Valores</button>
      </header>
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
