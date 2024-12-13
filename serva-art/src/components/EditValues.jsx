import { useState } from "react";
import "./valor.css"

const EditValues = ({ values, setValues }) => {
  const [formValues, setFormValues] = useState(values);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues(formValues);
    alert("Valores atualizados com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Valores</h2>
      {Object.keys(formValues).map((key) => (
        <label key={key}>
          {key.replace(/([A-Z])/g, " $1").toUpperCase()}:
          <input
            type="number"
            value={formValues[key]}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                [key]: parseFloat(e.target.value),
              }))
            }
          />
        </label>
      ))}
      <button type="submit">Salvar</button>
    </form>
  );
};

export default EditValues;
