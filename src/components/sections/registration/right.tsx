import React, { FC, useContext, useEffect, useState } from "react";
import { HttpError, useList } from "@pankod/refine-core";
import {
  Create,
  Box,
  TextField,
  Button,
  SaveButton,
  Step,
  StepButton,
  Stepper,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  CardActions,
  NumberField,
  Stack,
  IconButton,
} from "@pankod/refine-mui";

import { Controller, useStepsForm } from "@pankod/refine-react-hook-form";

import {
  fieldRules,
  fieldsCategory,
  fieldsUpsells,
  resourceCategory,
  resourceRules,
  resourceUpsells,
} from "@components/sections/registration/constants";
import {
  IRaceCategory,
  IRaceCategoryRule,
  IRaceUpsell,
  IRegistrationDto,
  IRegistrationUpsells,
  RegistrationProps,
} from "@components/sections/registration/interfaces";
import { useRouter } from "next/dist/client/router";
import { FormContext } from "@contexts/form";

import { PriceComponent } from "@components/sections/registration/priceComponent";
import {
  AddCircleOutlineOutlined,
  ArrowBack,
  RemoveCircleOutlineOutlined,
} from "@mui/icons-material";
import Link from "next/link";

const stepTitles = ["Kategorie", "Závodníci", "Doplňky"];
export interface InputValue {
  [key: string]: string;
}
export const RegistrationRight: FC<RegistrationProps> = ({ race }) => {
  const formContext = useContext(FormContext);
  const {
    getValues,
    setValue,
    saveButtonProps,
    refineCore: { formLoading, onFinish, mutationResult },
    register,
    handleSubmit,
    control,
    reset,
    watch,
    clearErrors,
    formState: { errors },
    steps: { currentStep, gotoStep },
  } = useStepsForm<IRegistrationDto, HttpError, IRegistrationDto>({
    refineCoreProps: {
      resource: "registrations",
      redirect: false,

      metaData: {
        fields: [
          "id",
          "team_name",
          "club_name",
          "id_race",
          {
            registration_competitors: ["first_name", "last_name", "email"],
            registration_accompaniments: ["first_name", "last_name", "phone"],
            registration_upsells: [
              "id",

              "id_race_upsell", // propojí se na "race_upsells" podle kterého se určí o co jde
              "amount",
              "price",
            ],
          },
        ],
      },
    },
    defaultValues: {
      ...formContext?.state.data,
    } ?? {
      team_name: "",
      id_race: race.id_race,
      club_name: "",
    },
  });

  const { data: dataRules, isLoading: isLoadingRules } = useList<
    IRaceCategoryRule,
    HttpError
  >({
    resource: resourceRules,
    metaData: fieldRules,
    config: {
      filters: [
        {
          field: "id_race_category",
          operator: "eq",
          value: getValues().id_race_categories,
        },
      ],
    },
  });

  const { data, isLoading } = useList<IRaceCategory, HttpError>({
    resource: resourceCategory,
    metaData: fieldsCategory,
    config: {
      filters: [
        {
          field: "id_race",
          operator: "eq",
          value: race?.id_race,
        },
      ],
    },
  });
  const { data: dataUpsell, isLoading: isLoadingUpsell } = useList<
    IRaceUpsell,
    HttpError
  >({
    resource: resourceUpsells,
    metaData: fieldsUpsells,
    config: {
      filters: [
        {
          field: "id_race",
          operator: "eq",
          value: race?.id_race,
        },
      ],
    },
  });

  const router = useRouter();
  const { push } = router;

  const onSubmit = async (data: IRegistrationDto) => {
    await onFinish({
      ...data,
      id_race: race.id_race,
      price: parseInt(formContext?.state.price ?? "0"),
    });
  };

  useEffect(() => {
    if (mutationResult.isSuccess) {
      if (mutationResult?.data?.data?.id && !mutationResult.error) {
        formContext?.dispatch({
          type: "setSuccessId",
          payload: mutationResult.data.data.id,
        });
        push(`/${race.route}/registrace-dokoncena`);
      }
    }
  }, [mutationResult?.isSuccess]);
  const [upsellsValues, setUpsellsValues] = useState<IRegistrationUpsells[]>(
    []
  );
  useEffect(() => {
    const subscription = watch((value) => {
      setUpsellsValues(getValues().registration_upsells?.data);
      formContext?.dispatch({
        type: "setData",
        payload: JSON.stringify(value),
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    formContext?.dispatch({
      type: "setStep",
      payload: currentStep.toString(),
    });
  }, [currentStep]);

  const [category, setCategory] = useState<string>();
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [setupCategories, setSetupCategories] = useState<{
    doprovod: boolean;
    price: number;
  }>();
  async function waitFce() {
    const selectedCategory = data?.data?.find((value) => value.id === category);
    await reset({
      ...getValues(),
      registration_upsells: {
        data: dataUpsell?.data.map((item, index) => {
          return {
            id_race_upsell: item.id as string | undefined,
            amount:
              (getValues()?.registration_upsells?.data?.[index]?.amount as
                | string
                | undefined) ?? "0",
            price: item?.price?.toString() as string | undefined,
          };
        }),
      },
      registration_competitors: {
        data: dataRules?.data.map((item, index) => {
          return {
            first_name:
              getValues()?.registration_competitors?.data?.[index]
                ?.first_name ?? "",
            last_name:
              getValues()?.registration_competitors?.data?.[index]?.last_name ??
              "",
            phone_number:
              getValues()?.registration_competitors?.data?.[index]
                ?.phone_number ?? "",
            email:
              getValues()?.registration_competitors?.data?.[index]?.email ?? "",
          };
        }),
      },
    });

    setSetupCategories({
      doprovod: selectedCategory?.accompaniment ?? false,
      price: selectedCategory?.price ?? 0,
    });
  }

  useEffect(() => {
    if (loadingCategories) {
      waitFce().then(() => {
        setLoadingCategories(false);
      });
    }
  }, [loadingCategories, dataRules?.data, dataUpsell?.data]);
  if (isLoading || isLoadingUpsell || isLoadingRules || loadingCategories)
    return <>Loading ...</>;

  const renderFormByStep = (step: number) => {
    switch (step) {
      case 0: {
        return (
          <>
            {!!errors.id_race_categories && (
              <Box
                sx={{
                  paddingBottom: 0,
                  border: !!errors.id_race_categories
                    ? "1px solid #d32f2f"
                    : "none",
                  padding: !!errors.id_race_categories ? "0px" : "",
                  borderRadius: !!errors.id_race_categories ? "4px" : "",
                  marginBottom: 1,
                }}
              >
                <Alert severity="error">Vyberte kategorii</Alert>
              </Box>
            )}
            <Box sx={{ display: "flex", rowGap: 1, columnGap: 1 }}>
              <Controller
                control={control}
                name={`team_name`}
                rules={{ required: "Název týmu nesmí být prázdý" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size={"small"}
                    onChange={(value) => {
                      clearErrors(field.name);
                      field.onChange(value.target.value);
                    }}
                    error={!!errors.team_name}
                    helperText={errors.team_name?.message}
                    margin="normal"
                    fullWidth
                    label="Název týmu"
                    autoFocus
                  />
                )}
              />

              <Controller
                control={control}
                name="club_name"
                render={({ field }) => (
                  <TextField
                    {...field}
                    size={"small"}
                    onChange={(value) => {
                      clearErrors(field.name);
                      field.onChange(value.target.value);
                    }}
                    error={!!errors.club_name}
                    helperText={errors.club_name?.message}
                    margin="normal"
                    fullWidth
                    label="Název klubu"
                  />
                )}
              />
            </Box>
            <Box
              display={"flex"}
              sx={{
                border: !!errors.id_race_categories
                  ? "1px solid #d32f2f"
                  : "none",
                flexWrap: "wrap",
                padding: !!errors.id_race_categories ? "5px" : "",
                borderRadius: !!errors.id_race_categories ? "4px" : "",
              }}
            >
              <Controller
                name="id_race_categories"
                control={control}
                rules={{ required: "Vyberte kategorii" }}
                render={({ field }) => (
                  <>
                    {data?.data.map((item, index) => (
                      <Box
                        {...field}
                        key={item.id}
                        sx={{
                          cursor: "pointer",
                          width: {
                            xs: "100%",
                            sm: `calc(100% / ${Math.min(
                              data?.data?.length,
                              2
                            )})`,
                            md: `calc(100% / ${Math.min(
                              data?.data?.length,
                              3
                            )})`,
                            xl: `calc(100% / ${Math.max(
                              data?.data?.length,
                              Math.min(data?.data?.length, 4)
                            )})`,
                          },
                          paddingRight: {
                            sx: 0,
                            sm:
                              (index + 1) % Math.min(data?.data?.length, 2) ===
                              0
                                ? 0
                                : 1,
                            md:
                              (index + 1) % Math.min(data?.data?.length, 3) ===
                              0
                                ? 0
                                : 1,
                            xl:
                              (index + 1) %
                                Math.max(
                                  data?.data?.length,
                                  Math.min(data?.data?.length, 4)
                                ) ===
                              0
                                ? 0
                                : 1,
                          },

                          paddingBottom: 1,

                          display: "grid",
                          alignItems: "stretch",
                        }}
                        onClick={() => {
                          field.onChange(item.id);
                          setCategory(item.id);
                          setLoadingCategories(true);
                          clearErrors("id_race_categories");
                          gotoStep(currentStep + 1);
                        }}
                      >
                        <Card
                          sx={{
                            display: "grid",
                            backgroundColor:
                              field.value === item.id ? "#ff9f29" : undefined,
                          }}
                        >
                          <Stack
                            direction={"column"}
                            justifyContent={"space-between"}
                          >
                            <Box>
                              <CardContent>
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {item?.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  component="div"
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item?.description,
                                    }}
                                  />
                                </Typography>
                              </CardContent>
                            </Box>
                            <Box sx={{ width: "100%" }}>
                              <CardActions
                                sx={{ width: "100%", justifyContent: "right" }}
                              >
                                <NumberField
                                  value={item?.price}
                                  typography={"h6"}
                                  sx={{ fontWeight: "bold" }}
                                />{" "}
                                <Typography
                                  component="div"
                                  typography={"h6"}
                                  sx={{ paddingLeft: 0.5 }}
                                >
                                  Kč / hlídka
                                </Typography>
                              </CardActions>
                            </Box>
                          </Stack>
                        </Card>
                      </Box>
                    ))}
                  </>
                )}
              />
            </Box>
            <Box
              sx={{
                color: "#d32f2f",
                fontSize: "0.75rem",
                marginTop: "5px",
                marginRight: "14px",
                marginBottom: 0,
                marginLeft: "14px",
              }}
            >
              {errors.id_race_categories?.message}
            </Box>
          </>
        );
      }
      case 1: {
        const { ref, ...inputProps } = register("note");

        return (
          <>
            {dataRules?.data?.map((item, index) => (
              <Box
                key={`registration_competitors${item.id}`}
                sx={{
                  padding: 1,
                  border: "1px solid #1A4D2E",
                  borderRadius: "4px",
                  marginBottom: index === 0 ? "8px" : 0,
                }}
              >
                <Typography variant={"subtitle1"}>
                  Zavodník č.{index + 1}
                </Typography>
                <Box sx={{ display: "flex", rowGap: 1, columnGap: 1 }}>
                  <Controller
                    control={control}
                    name={`registration_competitors.data.${index}.first_name`}
                    rules={{ required: "Jméno nesmí být prázdné" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          size={"small"}
                          onChange={(value) => {
                            clearErrors(field.name);
                            field.onChange(value.target.value);
                          }}
                          autoFocus={index === 0}
                          error={
                            !!errors.registration_competitors?.data?.[index]
                              ?.first_name
                          }
                          helperText={
                            errors.registration_competitors?.data?.[index]
                              ?.first_name?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_competitors.${index}.first_name`}
                          label={`Jméno`}
                        />
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name={`registration_competitors.data.${index}.last_name`}
                    rules={{ required: "Příjmení nesmí být prázdné" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          size={"small"}
                          onChange={(value) => {
                            clearErrors(field.name);
                            field.onChange(value.target.value);
                          }}
                          error={
                            !!errors.registration_competitors?.data?.[index]
                              ?.last_name
                          }
                          helperText={
                            errors.registration_competitors?.data?.[index]
                              ?.last_name?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_competitors.data.${index}.last_name`}
                          label={`Prijmeni`}
                        />
                      );
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", rowGap: 1, columnGap: 1 }}>
                  <Controller
                    control={control}
                    rules={{
                      required: "Email nesmí být prázdý",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Email není platný",
                      },
                    }}
                    name={`registration_competitors.data.${index}.email`}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          size={"small"}
                          onChange={(value) => {
                            clearErrors(field.name);
                            field.onChange(value.target.value);
                          }}
                          error={
                            !!errors.registration_competitors?.data?.[index]
                              ?.email
                          }
                          helperText={
                            errors.registration_competitors?.data?.[index]
                              ?.email?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_competitors.data.${index}.email`}
                          label={`Email`}
                        />
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name={`registration_competitors.data.${index}.phone_number`}
                    rules={{
                      required: "Telefon nesmí být prázdný",
                      pattern: {
                        value:
                          /^(\+420|\+421|\+48)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
                        message: "Telefon není platný",
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          size={"small"}
                          onChange={(value) => {
                            clearErrors(field.name);
                            field.onChange(value.target.value);
                          }}
                          value={field?.value ?? ""}
                          error={
                            !!errors.registration_competitors?.data?.[index]
                              ?.phone_number
                          }
                          helperText={
                            errors.registration_competitors?.data?.[index]
                              ?.phone_number?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_competitors.data.${index}.phone_number`}
                          label={`Telefon`}
                        />
                      );
                    }}
                  />
                </Box>
              </Box>
            ))}
            {setupCategories?.doprovod && (
              <Box
                sx={{
                  padding: 1,
                  border: "1px solid #1A4D2E",
                  borderRadius: "4px",
                  marginTop: "8px",
                }}
              >
                <Typography>Doprovod</Typography>
                <Box sx={{ display: "flex", rowGap: 1, columnGap: 1 }}>
                  <Controller
                    control={control}
                    name={`registration_accompaniments.data.0.first_name`}
                    rules={{ required: "Jméno nesmí být prázdné" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          size={"small"}
                          onChange={(value) => {
                            clearErrors(field.name);
                            field.onChange(value.target.value);
                          }}
                          error={
                            !!errors.registration_accompaniments?.data?.[0]
                              ?.first_name
                          }
                          helperText={
                            errors.registration_accompaniments?.data?.[0]
                              ?.first_name?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_competitors.${0}.first_name`}
                          label={`Jméno`}
                        />
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name={`registration_accompaniments.data.${0}.last_name`}
                    rules={{ required: "Příjmení nesmí být prázdné" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          size={"small"}
                          onChange={(value) => {
                            clearErrors(field.name);
                            field.onChange(value.target.value);
                          }}
                          error={
                            !!errors.registration_accompaniments?.data?.[0]
                              ?.last_name
                          }
                          helperText={
                            errors.registration_accompaniments?.data?.[0]
                              ?.last_name?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_accompaniments.data.${0}.last_name`}
                          label={`Prijmeni`}
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name={`registration_accompaniments.data.${0}.phone`}
                    rules={{
                      required: "Telefon nesmí být prázdný",
                      pattern: {
                        value:
                          /^(\+420|\+421|\+48)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
                        message: "Telefon není platný",
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          size={"small"}
                          onChange={(value) => {
                            clearErrors(field.name);
                            field.onChange(value.target.value);
                          }}
                          value={field?.value ?? ""}
                          error={
                            !!errors.registration_accompaniments?.data?.[0]
                              ?.phone
                          }
                          helperText={
                            errors.registration_accompaniments?.data?.[0]?.phone
                              ?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_accompaniments.data.${0}.phone`}
                          label={`Telefon`}
                        />
                      );
                    }}
                  />
                </Box>
              </Box>
            )}
            <Box
              sx={{
                marginTop: 1,
                paddingBottom: 0,
                border: "1px solid #1A4D2E",
                paddingX: 1,
                textAlign: "right",
                // padding: !!errors.id_race_categories ? "0px" : "",
                borderRadius: "4px",
                marginBottom: 1,
              }}
            >
              <TextField
                {...inputProps}
                size={"small"}
                key={"note"}
                margin="normal"
                inputRef={ref}
                fullWidth
                label="Poznámka"
              />
            </Box>
            <PriceComponent
              cenaCategory={setupCategories?.price}
              upsells={upsellsValues}
            />
          </>
        );
      }
      case 2: {
        return (
          <>
            <Box
              sx={{
                paddingBottom: 0,
                border: "1px solid #1A4D2E",
                padding: 1,
                // padding: !!errors.id_race_categories ? "0px" : "",
                borderRadius: "4px",
                marginBottom: 1,
              }}
            >
              {dataUpsell?.data?.map((item, index) => (
                <Grid
                  container
                  sx={{
                    alignItems: "center",
                    width: "100%",
                  }}
                  key={`dataUpsell${item.id}`}
                >
                  <Grid item xs>
                    {item.title}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{ textAlign: "right", paddingRight: 5 }}
                  >
                    <NumberField value={item.price} />
                  </Grid>

                  <Grid item xs>
                    <Stack direction={"row"}>
                      <Controller
                        control={control}
                        name={`registration_upsells.data.${index}.amount`}
                        rules={{
                          required: true,
                          min: 0,
                          max: 10,
                        }}
                        render={({ field }) => {
                          return (
                            <TextField
                              {...field}
                              type="number"
                              sx={{ paddingRight: 1 }}
                              inputProps={{
                                min: 0,
                                max: 10,
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              }}
                              size={"small"}
                              value={field?.value ?? 0}
                              margin="normal"
                              fullWidth
                              id={`registration_upsells.data.${index}.amount`}
                              label={`Pocet`}
                            />
                          );
                        }}
                      />
                      <IconButton
                        size={"small"}
                        onClick={() => {
                          const pocet =
                            parseInt(
                              getValues().registration_upsells.data[index]
                                .amount ?? 0
                            ) - 1;

                          setValue(
                            `registration_upsells.data.${index}.amount`,
                            pocet > 0 ? pocet.toString() : "0"
                          );
                        }}
                      >
                        <RemoveCircleOutlineOutlined sx={{ color: "#000" }} />
                      </IconButton>
                      <IconButton
                        size={"small"}
                        onClick={() => {
                          const pocet =
                            parseInt(
                              getValues().registration_upsells.data[index]
                                .amount ?? 0
                            ) + 1;

                          setValue(
                            `registration_upsells.data.${index}.amount`,
                            pocet <= 10 ? pocet.toString() : "10"
                          );
                        }}
                      >
                        <AddCircleOutlineOutlined sx={{ color: "#000" }} />
                      </IconButton>
                    </Stack>
                  </Grid>
                </Grid>
              ))}
            </Box>
            <PriceComponent
              cenaCategory={setupCategories?.price}
              upsells={upsellsValues}
            />
          </>
        );
      }
    }
  };
  return (
    <Create
      goBack={
        <Link
          href={`/${race.route}`}
          style={{ color: "black", marginBottom: "-3px" }}
        >
          <ArrowBack />
        </Link>
      }
      title={<Typography variant={"h5"}>Registrace</Typography>}
      wrapperProps={{
        sx: { backgroundColor: "transparent", boxShadow: "none", padding: 0 },
      }}
      footerButtonProps={{
        sx: {
          padding: 0,
          paddingX: { xs: 1, md: 0 },
          textAlign: "right",
          float: "right",
        },
      }}
      contentProps={{ sx: { padding: 0 } }}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      footerButtons={
        <>
          {currentStep > 0 && (
            <Button
              onClick={() => {
                gotoStep(currentStep - 1);
              }}
            >
              Předchozí krok
            </Button>
          )}
          {currentStep < stepTitles.length - 1 && currentStep > 0 && (
            <Button
              variant="contained"
              onClick={() => {
                gotoStep(currentStep + 1);
              }}
            >
              Další
            </Button>
          )}
          {currentStep === stepTitles.length - 1 && (
            <SaveButton color={"secondary"} onClick={handleSubmit(onSubmit)}>
              Dokončit registraci
            </SaveButton>
          )}
        </>
      }
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <Box sx={{ paddingX: { xs: 1, md: 0 }, paddingBottom: 2 }}>
          <Stepper
            nonLinear
            activeStep={currentStep}
            orientation={"horizontal"}
          >
            {stepTitles.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={() => gotoStep(index)}>
                  <Typography>{label}</Typography>
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box sx={{ paddingX: { xs: 1, md: 0 } }}>
          {renderFormByStep(currentStep)}
        </Box>
      </Box>
    </Create>
  );
};
