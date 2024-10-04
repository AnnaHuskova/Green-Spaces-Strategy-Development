import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { trackEvent } from '../utils/trackingUtils';
import envVars from "../../js/env";

const BACKEND_URL = envVars.REACT_APP_BACKEND_URL as string;
const FORM_ENDPOINT = envVars.REACT_APP_FORM_ENDPOINT as string;
const city = "Dnipro";
const type = "Algorithm_GSSD.pdf";

const getPdf = async (filename: string) => {
  const res_form = await fetch(`${BACKEND_URL}${FORM_ENDPOINT}?city=${city}&type=${type}`);
  const form_blob = await res_form.blob();
  const url = window.URL.createObjectURL(new Blob([form_blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);

  document.body.append(link);
  link.click();
  document.body.removeChild(link);
};

const handleGetPdfClick = () => {
  trackEvent('Button', 'Click', 'Get PDF');
  const filename = "Green_Space_Strategy_Development_HowTo.pdf"; // Replace with your desired filename
  getPdf(filename);
};

interface PdfButtonProps extends ButtonProps {
  buttonName: string;
}

export const PdfButton: React.FC<PdfButtonProps> = ({ buttonName, ...props }) => (
  <Button
    {...props}
    onClick={handleGetPdfClick}
  >
    {buttonName}
  </Button>
);