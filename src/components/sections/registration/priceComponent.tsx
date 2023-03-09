import React, { FC, useContext, useEffect } from "react";
import { Box, NumberField, Stack } from "@pankod/refine-mui";
import { IRegistrationUpsells } from "@components/sections/registration/interfaces";
import { FormContext } from "@contexts/form";

interface CenaProps {
  cenaCategory: number | undefined;
  upsells?: IRegistrationUpsells[];
}
export const PriceComponent: FC<CenaProps> = ({ cenaCategory, upsells }) => {
  const formContext = useContext(FormContext);
  const sum = upsells?.reduce(
    (acc, val) => acc + parseInt(val.price) * parseInt(val.amount ?? 0),
    0
  );
  console.log(upsells);
  const cenaFull = (sum || 0) + (cenaCategory || 0);
  useEffect(() => {
    formContext?.dispatch({
      type: "setPrice",
      payload: cenaFull.toString(),
    });
  }, [cenaFull]);

  return (
    <Box
      sx={{
        paddingBottom: 0,
        border: "1px solid #1A4D2E",
        padding: 1,
        textAlign: "right",
        // padding: !!errors.id_race_categories ? "0px" : "",
        borderRadius: "4px",
        marginBottom: 1,
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>Startovné</Box>
        <NumberField
          sx={{ paddingTop: "2px" }}
          typography={"h6"}
          value={cenaCategory ?? 0}
          options={{
            style: "currency",
            currency: "czk",
            maximumFractionDigits: 0,
          }}
        />
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>Cena za doplňky</Box>
        <NumberField
          sx={{ paddingTop: "2px" }}
          typography={"h6"}
          value={sum ?? 0}
          options={{
            style: "currency",
            currency: "czk",
            maximumFractionDigits: 0,
          }}
        />
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ fontWeight: "bold" }}
      >
        <Box>Celková cena</Box>
        <NumberField
          sx={{ paddingTop: "2px" }}
          typography={"h6"}
          value={cenaFull ?? 0}
          options={{
            style: "currency",
            currency: "czk",
            maximumFractionDigits: 0,
          }}
        />
      </Stack>
    </Box>
  );
};
