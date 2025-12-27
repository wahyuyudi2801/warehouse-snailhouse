import { sanctumRequest } from "@/services/sanctumRequest";

const Authenticate = async (email: string, password: string) => {
  const response = await sanctumRequest('POST', '/login', { email, password });

  return response;
};

export default Authenticate;
