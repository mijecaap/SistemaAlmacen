import { ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Steps,
  Table,
  message,
  Row,
  Col,
  Input,
  Form,
  Select,
  DatePicker,
  Cascader,
} from "antd";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import FirebaseContext from "../../firebase/context";
import useContratos from "../../hooks/useContratos";
import useServicios from "../../hooks/useServicios";
import useClientes from "../../hooks/useClientes";

import moment from "moment";

const ContratoUpdate = () => {
  const [current, setCurrent] = useState(0);
  const [id, setId] = useState("");

  const { contratos } = useContratos("fecha");
  const clientesload = useClientes("nombre");
  const serviciosload = useServicios("nombre");

  const { usuario, firebase } = useContext(FirebaseContext);

  const [clientes, guardarClientes] = useState([]);
  const [servicios, guardarServicios] = useState([]);
  const [fecha, getFecha] = useState("");

  const [form] = Form.useForm();
  const router = useRouter();

  const onChange = (date, dateString) => {
    getFecha(dateString);
  };

  useEffect(() => {
    const obtenerClientes = async () => {
      await firebase.db
        .collection("clientes")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const cliente = {
              id: doc.id,
              nombre: doc.data().nombre,
            };
            guardarClientes((clientes) => [...clientes, cliente]);
          });
        });
    };
    const obtenerServicios = async () => {
      await firebase.db
        .collection("servicios")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const servicio = {
              id: doc.id,
              nombre: doc.data().nombre,
            };
            guardarServicios((servicios) => [...servicios, servicio]);
          });
        });
    };

    obtenerClientes();
    obtenerServicios();
  }, []);

  const optionsc = [];
  clientes.map((cliente) => {
    optionsc.push({
      value: cliente.id,
      label: `${cliente.nombre}`,
    });
  });

  const optionss = [];
  servicios.map((servicio) => {
    optionss.push({
      value: servicio.id,
      label: `${servicio.nombre}`,
    });
  });

  const handleUpdate = (key) => {
    try {
      setId(key);
      const temp = contratos.filter((contrato) => contrato.id === key)[0];
      setCurrent(current + 1);
      getFecha(temp.fecha);
      form.setFieldsValue({
        id_cliente: temp.id_cliente,
        id_servicio: temp.id_servicio,
        lugar: temp.lugar,
        fecha: temp.fecha ? moment(temp.fecha, "DD/MM/YYYY") : null,
        cancelado: temp.cancelado,
        estado: temp.estado,
      });
    } catch (error) {
      console.log(error);
    }
  };

  async function actualizarContrato(values) {
    if (!usuario) {
      return router.push("/login");
    }

    const { id_cliente, id_servicio, lugar, cancelado, estado } = values;

    const contrato = {
      id_cliente,
      id_servicio,
      lugar,
      fecha,
      cancelado,
      estado,
    };

    firebase.db.collection("contratos").doc(id).update(contrato);

    message.success("¡Actualización completada!");

    form.resetFields();
    setId("");
    setCurrent(current - 1);
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const prev = () => {
    form.resetFields();
    setId("");
    setCurrent(current - 1);
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
      title: "Actualizar",
      dataIndex: "actualizar",
      render: (_, record) =>
        data.length >= 1 ? (
          <Popconfirm
            title="¿Seguro que desea actualizar?"
            onConfirm={() => handleUpdate(record.key)}
          >
            <a>
              <ReloadOutlined />
            </a>
          </Popconfirm>
        ) : null,
    },
  ];

  const tab = <Table columns={columns} dataSource={data} />;

  const upd = (
    <Form
      name="basic"
      form={form}
      initialValues={{ remember: true }}
      onFinish={actualizarContrato}
      onFinishFailed={onFinishFailed}
    >
      <Row gutter={12}>
        <Col span={9}>
          <Form.Item
            name="id_cliente"
            rules={[
              {
                required: true,
                message: "Ingrese un cliente",
              },
            ]}
          >
            <Cascader
              size="large"
              options={optionsc}
              placeholder="Escoja un cliente"
            />
          </Form.Item>
        </Col>

        <Col span={9}>
          <Form.Item
            name="id_servicio"
            rules={[
              {
                required: true,
                message: "Ingrese un Servicio",
              },
            ]}
          >
            <Cascader
              size="large"
              options={optionss}
              placeholder="Escoja un servicio"
            />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            name="cancelado"
            rules={[
              {
                required: true,
                message: "Ingrese si fue cancelado",
              },
            ]}
          >
            <Select placeholder="Estado de pago" size="large">
              <Select.Option value="cancelado">Cancelado</Select.Option>
              <Select.Option value="espera">En Espera</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item
            name="lugar"
            rules={[
              {
                required: true,
                message: "Ingrese el lugar",
              },
            ]}
          >
            <Input placeholder="Lugar" size="large" />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item
            name="fecha"
            rules={[
              {
                required: true,
                message: "Ingrese la fecha",
              },
            ]}
          >
            <DatePicker
              placeholder="Fecha de elaboración"
              size="large"
              format={"DD/MM/YYYY"}
              style={{ width: "100%" }}
              onChange={onChange}
            />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item
            name="estado"
            rules={[
              {
                required: true,
                message: "Escoja un estado",
              },
            ]}
          >
            <Select placeholder="Seleccione un estado" size="large">
              <Select.Option value="incompleto">Incompleto</Select.Option>
              <Select.Option value="terminado">Terminado</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Actualizar
          </Button>
          <Button style={{ marginLeft: "8px" }} onClick={() => prev()}>
            Atrás
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );

  const steps = [
    {
      title: "Lista de Contratos",
      description: "Escoja un contrato",
      content: tab,
    },
    {
      title: "Actualizar",
      description: "Seleccione y edite",
      content: upd,
    },
  ];

  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Steps.Step
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </Steps>
      <div
        style={{
          minHeight: "200px",
          marginTop: "32px",
        }}
      >
        {steps[current].content}
      </div>
    </>
  );
};

export default ContratoUpdate;
