import { BACKEND_URL } from "@repo/common/urls";
import axios from "axios";

export async function createRoomServer(slug : string) {

  const token = localStorage.getItem('token');

  try {
      const res = await axios.post(
      `${BACKEND_URL}/room`,
      { name: slug },
      {
        headers: {
          authorization: token,
        },
      }
    );

    console.log("creating room in server , " , res.data);
    
    return res.data;
  } catch (e) {
    throw new Error;    
  }

}

