import React, { useRef, useCallback } from "react";

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

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdateUser: (
    user: Omit<IUser, "id" | "created_at" | "updated_at">
  ) => void;
  editingUser: IUser;
}

interface IEditUserData {
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

const ModalAddUser: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  editingUser,
  handleUpdateUser,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: IEditUserData) => {
      handleUpdateUser(data);
      setIsOpen();
    },
    [handleUpdateUser, setIsOpen]
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingUser}>
        <h3>Editar Usuário</h3>
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
            <Input name="document" placeholder="Ex: 000.000.000-00" />
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
            />
          </div>

          <div className="col-lg-6 mb-3">
            <label>Senha</label>
            <Input
              name="password"
              type="password"
              placeholder="Informe aqui a senha"
            />
          </div>

          <div className="col-lg-4 mb-3">
            <label>CEP</label>
            <Input type="number" name="zipcode" placeholder="Qual o CEP?" />
          </div>

          <div className="col-lg-8 mb-3">
            <label>Endereço</label>
            <Input name="address" placeholder="Endereço" />
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
            <Input name="city" placeholder="Ex.: Russas" />
          </div>

          <div className="col-lg-4 mb-3">
            <label>UF</label>
            <Input name="state" placeholder="Ex.: CE" />
          </div>

          <div className="col-lg-4 mb-3">
            <label>País</label>
            <Input name="country" placeholder="Ex.: Brasil" />
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-labeled btn-primary"
              data-testid="edit-user-button"
              style={{ marginLeft: 12, borderRadius: 3, height: 40 }}
            >
              <span className="btn-label" style={{ height: 40 }}>
                <i className="fa fa-check"></i>
              </span>
              Editar usuário
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalAddUser;