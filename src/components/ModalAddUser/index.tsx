import React, { useState, useRef, useCallback } from "react";
import axios from "axios";

import { FormHandles } from "@unform/core";
import { Form } from "./styles";
import Modal from "../Modal";
import Input from "../Input";

interface IUser {
  id: number;
  name: string;
  document: string;
  pis: string;
  email: string;
  password: string;
  zipcode: number;
  address: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  country: string;
}

interface ICreateUserData {
  id: number;
  name: string;
  document: string;
  pis: string;
  email: string;
  password: string;
  zipcode: number;
  address: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  country: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleAddUser: (
    user: Omit<IUser, "id" | "created_at" | "updated_at">
  ) => void;
}

const ModalAddUser: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleAddUser,
}) => {
  const formRef = useRef<FormHandles>(null);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = useCallback(
    async (data: ICreateUserData) => {
      handleAddUser(data);
      setIsOpen();
    },
    [handleAddUser, setIsOpen]
  );

  async function handleChange(event: React.FormEvent<HTMLInputElement>) {
    const zicode = event.currentTarget.value;
    if (zicode.length < 8) {
      return;
    } else {
      await axios
        .get(`http://viacep.com.br/ws/${zicode}/json/`)
        .then((response) => {
          setAddress(response.data["logradouro"]);
          setCity(response.data["localidade"]);
          setUf(response.data["uf"]);
          setCountry("Brasil");
        });
    }
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h3>Novo usuário</h3>
        <div className="row">
          <div className="col-lg-12 mb-3">
            <label>Nome do Usuário</label>
            <Input
              name="name"
              placeholder="Digite o nome do usuário"
              required
            />
          </div>

          <div className="col-lg-6 mb-3">
            <label>CPF</label>
            <Input name="document" placeholder="Ex: 000.000.000-00" required />
          </div>

          <div className="col-lg-6 mb-3">
            <label>Número do PIS</label>
            <Input name="pis" placeholder="Ex: 000.00000.00-0" />
          </div>

          <div className="col-lg-6 mb-3">
            <label>Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Informe aqui o E-mail"
              required
            />
          </div>

          <div className="col-lg-6 mb-3">
            <label>Senha</label>
            <Input
              name="password"
              type="password"
              placeholder="Informe aqui a senha"
              required
            />
          </div>

          <div className="col-lg-4 mb-3">
            <label>CEP</label>
            <Input
              type="number"
              name="zipcode"
              onChange={handleChange}
              placeholder="Qual o CEP?"
            />
          </div>

          <div className="col-lg-8 mb-3">
            <label>Endereço</label>
            <Input
              name="address"
              value={`${address}`}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Endereço"
            />
          </div>

          <div className="col-lg-4 mb-3">
            <label>Número</label>
            <Input name="number" placeholder="Ex.: 123 ou S/N" />
          </div>

          <div className="col-lg-8 mb-3">
            <label>Complemento</label>
            <Input name="complement" placeholder="Ex.: Casa" />
          </div>

          <div className="col-lg-4 mb-3">
            <label>Cidade</label>
            <Input
              name="city"
              placeholder="Ex.: Russas"
              value={`${city}`}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="col-lg-4 mb-3">
            <label>UF</label>
            <Input
              name="state"
              placeholder="Ex.: CE"
              value={`${uf}`}
              onChange={(e) => setUf(e.target.value)}
            />
          </div>

          <div className="col-lg-4 mb-3">
            <label>País</label>
            <Input
              name="country"
              placeholder="Ex.: Brasil"
              value={`${country}`}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-labeled btn-success"
              data-testid="add-user-button"
              style={{ marginLeft: 12, borderRadius: 3, height: 40 }}
            >
              <span className="btn-label" style={{ height: 40 }}>
                <i className="fa fa-check"></i>
              </span>
              Adicionar usuário
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalAddUser;
