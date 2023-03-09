import React, { FC, useContext } from "react";
import { FormContext } from "@contexts/form";
import { Box } from "@pankod/refine-mui";

export const Success: FC = () => {
  const formContext = useContext(FormContext);

  return (
    <Box>
      <Box sx={{ paddingTop: 5 }}>
        <Box
          sx={{
            backgroundColor: "#ff9f29",
            width: "fit-content",
            paddingX: 2,
            paddingY: 1.5,
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Registrace úspěšně dokončena
        </Box>
      </Box>
      <Box sx={{ paddingX: 3, paddingTop: 3 }}>
        {formContext?.state.successId}
      </Box>
    </Box>
  );
};
