import { useEffect, useState } from "react";
import { getEmployees } from "../api/employeeApi";
import EmployeeTable from "../components/EmployeeTable";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  const load = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <EmployeeTable employees={employees} />
    </div>
  );
}