import whatsapp from "../public/whatsapp.png";
import Image from "next/image";
import { css } from "@emotion/react";
import BarLoader from "react-spinners/ClipLoader";
import styled from "styled-components";
const Loading = () => {
  const override = css``;

  return (
    <center style={{width: "100%", dispaly: "grid", placeItems: "center", height: "100vh"}}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%"}}>
        <Image
          src={whatsapp}
          alt="Whatsapp loading"
          height="200"
          width="200"
          style={{ marginBottom: 10 }}
        />
        <BarLoader css={override} color="#1B9A11"/>
      </div>
    </center>
  );
};

export default Loading;



