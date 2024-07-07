import React from "react";
import { FaGlobe } from "react-icons/fa";
import BaseNode from "./base-node";
import {NodeInput} from "../types";


const WebScrapperNode: React.FC<NodeInput> = ({ data }) => {
  return (
    <BaseNode
      data={data}
      title="Web Scraper"
      inputLabel={"URL to scrape"}
      inputIcon={<FaGlobe />}
      inputType="url"
    />
  );
};

export default WebScrapperNode;