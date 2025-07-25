import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";
import ClientComponent from "@/components/clientComponent";


export async function createRoomServer(slug : string) {

  const token = localStorage.getItem('token');

  const res = await axios.post(
    `${BACKEND_URL}/room`,
    { name: slug },
    {
      headers: {
        authorization: token,
      },
    }
  );
  return res.data;

}

