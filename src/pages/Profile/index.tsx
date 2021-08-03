import React, { useEffect, useRef, useState, useCallback } from "react";
import api from "../../services/api";

import { FormHandles } from "@unform/core";
import { Form } from "./styles";
import Header from "../../components/Header";
import Saudation from "../../components/Saudation";
import Input from "../../components/Input";

interface IEditProfileData {
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

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [pis, setPis] = useState("");
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    async function loadData() {
      const response = await api.get("/users/1");
      setName(response.data.name);
      setDocument(response.data.document);
      setPis(response.data.pis);
      setEmail(response.data.email);
      setZipcode(response.data.zipcode);
      setAddress(response.data.address);
      setNumber(response.data.number);
      setComplement(response.data.complement);
      setCity(response.data.city);
      setUf(response.data.state);
      setCountry(response.data.country);
    }

    loadData();
  }, []);

  const handleUpdateSubmit = useCallback(async (data: IEditProfileData) => {
    try {
      const id = 1;
      await api.put(`/users/${id}`, [data]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Header />

      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <Saudation title="" subtitle="Meu Perfil" />
          </div>

          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="card">
              <div className="card-body">
                <Form ref={formRef} onSubmit={handleUpdateSubmit}>
                  <div className="row">
                    <div className="col-lg-12 mb-3">
                      <label>Nome do Usuário</label>
                      <Input
                        name="name"
                        placeholder="Digite o nome do usuário"
                        required
                        defaultValue={name}
                      />
                    </div>

                    <div className="col-lg-6 mb-3">
                      <label>CPF</label>
                      <Input
                        name="document"
                        placeholder="Ex: 000.000.000-00"
                        required
                        defaultValue={document}
                      />
                    </div>

                    <div className="col-lg-6 mb-3">
                      <label>Número do PIS</label>
                      <Input
                        name="pis"
                        placeholder="Ex: 000.00000.00-0"
                        defaultValue={pis}
                      />
                    </div>

                    <div className="col-lg-6 mb-3">
                      <label>Email</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Informe aqui o E-mail"
                        required
                        defaultValue={email}
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
                      <Input
                        type="number"
                        name="zipcode"
                        // onChange={handleChange}
                        placeholder="Qual o CEP?"
                        defaultValue={zipcode}
                      />
                    </div>

                    <div className="col-lg-8 mb-3">
                      <label>Endereço</label>
                      <Input
                        name="address"
                        placeholder="Endereço"
                        defaultValue={address}
                      />
                    </div>

                    <div className="col-lg-4 mb-3">
                      <label>Número</label>
                      <Input
                        name="number"
                        placeholder="Ex.: 123 ou S/N"
                        defaultValue={number}
                      />
                    </div>

                    <div className="col-lg-8 mb-3">
                      <label>Complemento</label>
                      <Input
                        name="complement"
                        placeholder="Ex.: Casa"
                        defaultValue={complement}
                      />
                    </div>

                    <div className="col-lg-4 mb-3">
                      <label>Cidade</label>
                      <Input
                        name="city"
                        placeholder="Ex.: Russas"
                        defaultValue={city}
                      />
                    </div>

                    <div className="col-lg-4 mb-3">
                      <label>UF</label>
                      <Input
                        name="state"
                        placeholder="Ex.: CE"
                        defaultValue={uf}
                      />
                    </div>

                    <div className="col-lg-4 mb-3">
                      <label>País</label>
                      <Input
                        name="country"
                        placeholder="Ex.: Brasil"
                        defaultValue={country}
                      />
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-labeled btn-primary"
                        data-testid="edit-profile-button"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;