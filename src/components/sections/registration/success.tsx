import React, { FC, useContext, useEffect } from "react";
import { FormContext } from "@contexts/form";
import { Box, NumberField, Stack, Typography } from "@pankod/refine-mui";
import { BaseKey, HttpError, useOne } from "@pankod/refine-core";
import {
  IRaceCategory,
  RegistrationCompetitors,
} from "@components/sections/registration/interfaces";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import { PageProps } from "../../../../pages/[race]/[section]";

interface IRegistration {
  race_category: IRaceCategory;
  variable_number: string;
  registration_competitors: RegistrationCompetitors[];
  team_name: string;
  registration_upsells: {
    price: string;
    amount: string;
    race_upsell: { title: string };
  }[];
  price: string;
}

export const Success: FC<PageProps> = ({ race }) => {
  const formContext = useContext(FormContext);
  const router = useRouter();

  useEffect(() => {
    if (
      formContext?.state?.successId === undefined ||
      !formContext?.state?.successId
    )
      router.push(`/${race.route}`);
    formContext?.dispatch({ type: "setData", payload: "{}" });
    formContext?.dispatch({ type: "setStep", payload: "0" });
  }, [formContext?.state?.successId]);

  const { data, isLoading } = useOne<IRegistration, HttpError>({
    resource: "registrations",

    metaData: {
      fields: [
        "id",
        "team_name",
        "club_name",
        "id_race",
        "price",
        "variable_number",
        { race_category: ["title", "price", "title"] },
        {
          registration_competitors: [
            "first_name",
            "personal_id",
            "last_name",
            "email",
          ],
        },
        { registration_accompaniments: ["first_name", "last_name", "phone"] },
        {
          registration_upsells: ["amount", "price", { race_upsell: ["title"] }],
        },
      ],
    },
    id: formContext?.state?.successId as BaseKey,
  });
  const sum =
    data?.data.registration_upsells.reduce(
      (act, val) => parseInt(val?.price) * parseInt(val?.amount) + act,
      0
    ) ?? 0;

  if (isLoading) return <>Loading ...</>;
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
      <Box
        sx={{ display: { sx: "grid", md: "flex" } }}
        justifyContent={"space-between"}
      >
        <Box>
          <Stack
            sx={{
              paddingX: 1,
              paddingTop: 3,
            }}
          >
            <Stack direction={"row"} sx={{ paddingBottom: 2 }}>
              <Typography>Registrovaná kategorie:</Typography>
              <Typography sx={{ fontWeight: "bold", paddingX: 0.5 }}>
                {data?.data.race_category.title}
              </Typography>
            </Stack>
            {sum > 0 && (
              <Stack direction={"row"} sx={{ paddingBottom: 2 }}>
                <Typography>Doplňky:</Typography>
                <Typography sx={{ fontWeight: "bold", paddingX: 0.5 }}>
                  {data?.data.registration_upsells
                    .map((u) => `${u.race_upsell.title}`)
                    .join(", ")}
                </Typography>
              </Stack>
            )}
            <Stack direction={"column"} sx={{ paddingBottom: 2 }}>
              <Box>
                Pro dokončení registrace je nutné provést platbu ve výši{" "}
                <NumberField
                  display={"inline"}
                  variant={"body1"}
                  value={data?.data.price ?? ""}
                  options={{
                    style: "currency",
                    currency: "czk",
                    maximumFractionDigits: 0,
                  }}
                  sx={{ fontWeight: "bold" }}
                />{" "}
                na následující bankovní účet:{" "}
                <Box
                  component={"span"}
                  sx={{ fontWeight: "bold" }}
                  display={"inline"}
                >
                  2000396876/2010.
                </Box>
              </Box>
            </Stack>
            <Box paddingBottom={2}>
              Pro automatickou identifikaci platby prosím použijte variabilní
              symbol{" "}
              <Box
                component={"span"}
                sx={{ fontWeight: "bold" }}
                display={"inline"}
              >
                {data?.data.variable_number}.
              </Box>
            </Box>
            <Box paddingBottom={2}>
              Souhrn Vaší registrace jsme zaslali na email{" "}
              <b>{data?.data.registration_competitors[0]?.email}.</b>
            </Box>
            <Stack direction={"row"} sx={{ paddingBottom: 2 }}>
              <Typography>
                Děkujeme za registraci, budeme se na Vás těšit na startu{" "}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Box>
          <Stack
            direction={"column"}
            alignItems={"center"}
            sx={{ paddingRight: 2 }}
          >
            <Typography variant={"h6"}>QR Platba</Typography>
            <QRCode
              bgColor={"#FAF3E3"}
              value={`SPD*1.0*ACC:CZ2020100000002000396876+FIOBCZPP*AM:${data?.data.price}*CC:CZK*X-VS:${data?.data.variable_number}*MSG:Registrace: ${data?.data.team_name}`}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
