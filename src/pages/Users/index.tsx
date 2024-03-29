import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Cookies } from "react-cookie";
import api from "../../services/api";

import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../../components/Header";
import Saudation from "../../components/Saudation";
import ModalAddUser from "../../components/ModalAddUser";
import ModalEditUser from "../../components/ModalEditUser";
import CardUser from "../../components/CardUser";
import ButtonAddUser from "../../components/ButtonAddUser";
import Loader from "../../components/Loader";

interface IUser {
  id: number;
  name: string;
  document: string;
  pis: string;
  email: string;
  password: string | null;
  zipcode: number;
  address: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  country: string;
}

const Users: React.FC = () => {
  const cookie = new Cookies();
  const history = useHistory();

  const [username, setUserName] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [editingUser, setEditingUser] = useState<IUser>({} as IUser);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const dataStorage = localStorage.getItem("@newmission:data");
    const username = JSON.parse(`${dataStorage}`);
    setUserName(username.user.name);

    async function loadUsers(): Promise<void> {
      const dataStorage = localStorage.getItem("@newmission:data");
      const data = JSON.parse(`${dataStorage}`);
      const token = cookie.get("@newmission:access_token");
      if (!token) {
        setAuthorized(false);
      }

      try {
        const response = await api.get(
          `/users/withoutCurrentUser/${data.user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    loadUsers();
    loadToastInitial();
    redirectPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddUser(
    user: Omit<IUser, "id" | "created_at" | "updated_at">
  ): Promise<void> {
    const token = cookie.get("@newmission:access_token");

    try {
      const response = await api.post("users", user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast(`👏🏼 Usuário criado com sucesso`, {
        position: "top-right",
      });

      setUsers([...users, response.data]);
    } catch (error) {
      toast(`Ooops! ${error.response.data["detail"]}`, {
        position: "top-right",
      });
    }
  }

  async function handleUpdateUser(
    user: Omit<IUser, "id" | "created_at" | "updated_at">
  ): Promise<void> {
    try {
      const token = cookie.get("@newmission:access_token");
      const response = await api.put(
        `/users/${editingUser.id}`,
        { ...user, id: editingUser.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(
        users.map((mappedUser) =>
          mappedUser.id === editingUser.id ? { ...response.data } : mappedUser
        )
      );

      toast(`👏🏼 Usuário atualizado com sucesso`, {
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteUser(id: number): Promise<void> {
    const dataStorage = localStorage.getItem("@newmission:data");
    const data = JSON.parse(`${dataStorage}`);

    if (id === 2) {
      toast.warn(`🖐🏻 Não é permitido deletar esse usuário`, {
        position: "top-right",
      });
    } else if (id === data.user.id) {
      try {
        const token = cookie.get("@newmission:access_token");
        await api
          .delete(`/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            localStorage.removeItem("@newmission:data");
            sessionStorage.removeItem("@newmission:toast");
            cookie.remove("@newmission:access_token");

            toast.info(
              `👋🏼 Bye Bye! Desculpa está forçando, mas vou te deslogaaar...`,
              {
                position: "top-right",
              }
            );

            setTimeout(() => {
              history.replace("/");
            }, 5000);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const token = cookie.get("@newmission:access_token");
        await api.delete(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user.id !== id));

        toast(`👏🏼 Usuário deletado com sucesso`, {
          position: "top-right",
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditUser(user: IUser): void {
    setEditingUser(user);
    toggleEditModal();
  }

  async function redirectPage() {
    if (authorized) {
      return;
    } else {
      localStorage.removeItem("@newmission:data");
      cookie.remove("@newmission:access_token");
      history.replace("/");
    }
  }

  function loadToastInitial() {
    const toastSessionStorage = sessionStorage.getItem("@newmission:toast");

    if (!toastSessionStorage) {
      const dataStorage = localStorage.getItem("@newmission:data");
      const data = JSON.parse(`${dataStorage}`);

      toast(`🎉 Seja Bem-vindo(a) ${data.user.name}`, {
        position: "top-right",
      });

      /* Create cookie */
      sessionStorage.setItem("@newmission:toast", "true");
    }
  }

  return (
    <>
      <ToastContainer transition={Flip} />

      <Header />

      <div className="container">
        <ModalAddUser
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddUser={handleAddUser}
        />

        <ModalEditUser
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingUser={editingUser}
          handleUpdateUser={handleUpdateUser}
        />

        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <Saudation title="Olá," subtitle={`${username}`} />

            <ButtonAddUser openModal={toggleModal} />
          </div>
        </div>

        {loading && <Loader />}

        <div className="row mt-3" data-testid="user-list">
          {users &&
            users.map((user) => (
              <CardUser
                key={`user-${user.document}`}
                user={user}
                handleDelete={handleDeleteUser}
                handleEditUser={handleEditUser}
              />
            ))}
        </div>

        {!loading && users.length <= 0 && (
          <div className="alert alert-info">
            <i className="fa fa-exclamation-circle mr-3"></i>
            Ainda não existem usuários cadastrados
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
