import React, { useState, useEffect, useContext } from "react";
import FirebaseContext from "../firebase/context";

const usePersonal = (orden) => {
  const [empleados, guardarEmpleados] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const productsQuery = firebase.db
      .collection("empleados")
      .orderBy(orden, "desc")
      .onSnapshot(manejarSnapshot);

    const unsubscribe = productsQuery;

    const getProducts = async () => {
      await productsQuery;
    };

    getProducts();

    return () => {
      unsubscribe();
    };
  }, []);

  function manejarSnapshot(snapshot) {
    const empleados = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    guardarEmpleados(empleados);
  }

  return {
    empleados,
  };
};

export default usePersonal;
