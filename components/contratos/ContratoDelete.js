import { DeleteOutlined } from "@ant-design/icons";
import { Popconfirm, Table } from "antd";
import React, { useContext } from "react";
import FirebaseContext from "../../firebase/context";
import useContratos from "../../hooks/useContratos";
import useServicios from "../../hooks/useServicios";
import useClientes from "../../hooks/useClientes";

const ContratoDelete = () => {
  const { contratos } = useContratos("fecha");
  const clientesload = useClientes("nombre");
  const serviciosload = useServicios("nombre");

  const { firebase } = useContext(FirebaseContext);

  const handleDelete = async (key) => {
    try {
      await firebase.db.collection("contratos").doc(key).delete();
    } catch (error) {
      console.log(error);
    }
  };

  const data = [];
  contratos.map((contrato) => {
    data.push({
      key: contrato.id,
      id_cliente: contrato.id_cliente,
      id_servicio: contrato.id_servicio,
      lugar: contrato.lugar,
      fecha: contrato.fecha,
    });
  });

  const columns = [
    {
      title: "Cliente",
      dataIndex: "id_cliente",
      key: "id_cliente",
      render: (_, record) => {
        const client = clientesload.clientes.filter(
          (cl) => cl.id === record.id_cliente[0]
        );
        if (client.length !== 0) {
          return client[0].nombre;
        }
      },
    },
    {
      title: "Servicio",
      dataIndex: "id_servicio",
      key: "id_servicio",
      render: (_, record) => {
        const service = serviciosload.servicios.filter(
          (se) => se.id === record.id_servicio[0]
        );
        if (service.length !== 0) {
          return service[0].nombre;
        }
      },
    },
    {
      title: "Lugar",
      dataIndex: "lugar",
      key: "lugar",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Eliminar",
      dataIndex: "eliminar",
      render: (_, record) =>
        data.length >= 1 ? (
          <Popconfirm
            title="¿Seguro que desea eliminar?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>
              <DeleteOutlined />
            </a>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default ContratoDelete;
