import React, { FC, useEffect } from "react";
import { HttpError, useList } from "@pankod/refine-core";
import {
  Create,
  Box,
  TextField,
  Autocomplete,
  useAutocomplete,
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
} from "@pankod/refine-mui";

import {
  Controller,
  useFieldArray,
  useStepsForm,
} from "@pankod/refine-react-hook-form";

import {
  fieldsCategory,
  fieldsShirts,
  fieldsUpsells,
  resourceCategory,
  resourceShirts,
  resourceUpsells,
} from "@components/sections/registration/constants";
import {
  IRaceCategory,
  IRaceShirt,
  IRaceUpsell,
  IRegistrationDto,
  RegistrationProps,
} from "@components/sections/registration/interfaces";

const stepTitles = ["1", "2", "3"];

export const Registration: FC<RegistrationProps> = ({ race }) => {
  const {
    getValues,
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    formState: { errors },
    steps: { currentStep, gotoStep },
  } = useStepsForm<IRegistrationDto, HttpError, IRegistrationDto>({
    refineCoreProps: {
      resource: "registrations",
      metaData: {
        fields: [
          "team_name",
          "club_name",
          "id_race",
          {
            registration_competitors: [
              "first_name",
              "personal_id",
              "last_name",
              "email",
            ],
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
      team_name: "",
      id_race: race.id_race,
      club_name: "",
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

  const { autocompleteProps } = useAutocomplete<IRaceShirt>({
    resource: resourceShirts,
    metaData: fieldsShirts,
    filters: [
      {
        field: "id_race",
        operator: "eq",
        value: race?.id_race,
      },
    ],
  });
  const { fields: competitors } = useFieldArray({
    name: "registration_competitors.data",
    control,
  });

  // const { fields: accompaniments } = useFieldArray({
  //   name: "registration_accompaniments.data",
  //   control,
  // });
  //const watchFieldArray = watch("registration_competitors");
  const controlledFields = competitors.map((field) => {
    return {
      ...field,
    };
  });

  useEffect(() => {
    if (dataUpsell?.data && dataUpsell?.data?.length > 0) {
      reset({
        id_race: race.id_race,
        registration_competitors: {
          data: [
            {
              first_name: "",
              last_name: "",
              email: "",
              personal_id: "",
              id_race_shirt: "",
              phone_number: "",
            },
            {
              first_name: "",
              last_name: "",
              email: "",
              personal_id: "",
              id_race_shirt: "",
              phone_number: "",
            },
          ],
        },
        registration_upsells: {
          data: dataUpsell?.data.map((item) => {
            return {
              id_race_upsell: item.id as string | undefined,
              amount: "0" as string | undefined,
              price: item.price.toString() as string | undefined,
            };
          }),
        },
      });
    }
  }, [dataUpsell?.data]);

  //const theme = useTheme();
  // const isSmallOrLess = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading || isLoadingUpsell) return <>Loading ...</>;

  console.log(getValues());

  const renderFormByStep = (step: number) => {
    switch (step) {
      case 0: {
        return (
          <>
            {!!errors.id_race_categories && (
              <Box
                sx={{
                  paddingBottom: 1,
                  border: !!errors.id_race_categories
                    ? "1px solid #d32f2f"
                    : "none",
                  padding: !!errors.id_race_categories ? "0px" : "",
                  borderRadius: !!errors.id_race_categories ? "4px" : "",
                  marginBottom: 2,
                }}
              >
                <Alert severity="error">Vyberte kategorii</Alert>
              </Box>
            )}
            <Box
              display={"flex"}
              sx={{
                border: !!errors.id_race_categories
                  ? "1px solid #d32f2f"
                  : "none",
                padding: !!errors.id_race_categories ? "5px" : "",
                borderRadius: !!errors.id_race_categories ? "4px" : "",
                rowGap: 1,
                columnGap: 1,
              }}
            >
              <Controller
                name="id_race_categories"
                control={control}
                rules={{ required: "Vyberte kategorii" }}
                render={({ field }) => (
                  <>
                    {data?.data.map((item) => (
                      <Card
                        {...field}
                        key={item.id}
                        sx={{
                          cursor: "pointer",
                          flex: 1,
                          backgroundColor:
                            field.value === item.id ? "#ff9f29" : undefined,
                        }}
                        onClick={() => {
                          field.onChange(item.id);
                          clearErrors("id_race_categories");
                        }}
                      >
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {item?.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item?.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              />
            </Box>
            <Box
              sx={{
                color: "#d32f2f",
                fontSize: "0.75rem",
                marginTop: "3px",
                marginRight: "14px",
                marginBottom: 0,
                marginLeft: "14px",
              }}
            >
              {errors.id_race_categories?.message}
            </Box>
            <Box sx={{ display: "flex", rowGap: 1, columnGap: 1 }}>
              <Controller
                control={control}
                name={`team_name`}
                rules={{ required: "Název týmu nesmí být prázdý" }}
                render={({ field }) => (
                  <TextField
                    {...field}
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
                rules={{ required: "Název klubu nesmí být prázdý" }}
                render={({ field }) => (
                  <TextField
                    {...field}
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
          </>
        );
      }
      case 1: {
        const { ref, ...inputProps } = register("note");

        return (
          <>
            {controlledFields.map((item, index) => (
              <Box key={`registration_competitors${item.id}`}>
                <Box sx={{ display: "flex", rowGap: 1, columnGap: 1 }}>
                  <Controller
                    control={control}
                    key={item.first_name}
                    name={`registration_competitors.data.${index}.first_name`}
                    rules={{ required: "Jmeno nesmí být prázde" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
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
                    rules={{ required: "Prijmeni nesmí být prázde" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
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
                  <Controller
                    control={control}
                    name={`registration_competitors.data.${index}.personal_id`}
                    rules={{ required: "RC nesmí být prázde" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          onChange={(value) => {
                            clearErrors(field.name);
                            field.onChange(value.target.value);
                          }}
                          error={
                            !!errors.registration_competitors?.data?.[index]
                              ?.personal_id
                          }
                          helperText={
                            errors.registration_competitors?.data?.[index]
                              ?.personal_id?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_competitors.${index}.personal_id`}
                          label={`Rodne cislo`}
                        />
                      );
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", rowGap: 1, columnGap: 1 }}>
                  <Controller
                    control={control}
                    rules={{ required: "email nesmí být prázde" }}
                    name={`registration_competitors.data.${index}.email`}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
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
                    rules={{ required: "phone_number nesmí být prázde" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
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

                  <Controller
                    control={control}
                    name={`registration_competitors.data.${index}.id_race_shirt`}
                    rules={{ required: "phone_number nesmí být prázde" }}
                    render={({ field }) => {
                      return (
                        <Autocomplete
                          {...autocompleteProps}
                          fullWidth
                          getOptionLabel={(option) => option.title ?? null}
                          isOptionEqualToValue={(option, value) =>
                            value === undefined ||
                            option?.id.toString() === value.toString()
                          }
                          defaultValue={autocompleteProps.options.find(
                            (value) => field.value === value.id
                          )}
                          value={
                            autocompleteProps.options.find(
                              (value) => field.value === value.id
                            ) ?? null
                          }
                          onChange={(event, newValue) => {
                            clearErrors(field.name);
                            field.onChange(newValue?.id ?? "");
                          }}
                          placeholder="Vyberte tricko"
                          renderInput={(params) => (
                            <TextField
                              error={
                                !!errors.registration_competitors?.data?.[index]
                                  ?.id_race_shirt
                              }
                              helperText={
                                errors.registration_competitors?.data?.[index]
                                  ?.id_race_shirt?.message
                              }
                              {...params}
                              label="Tricko"
                              margin="normal"
                              variant="outlined"
                              required
                            />
                          )}
                        />
                      );
                    }}
                  />
                </Box>
              </Box>
            ))}
            <Box>
              <TextField
                {...inputProps}
                key={"note"}
                margin="normal"
                inputRef={ref}
                fullWidth
                label="Note"
              />
            </Box>
          </>
        );
      }
      case 2: {
        return (
          <>
            {dataUpsell?.data.map((item, index) => (
              <Grid
                container
                sx={{
                  alignItems: "center",
                  width: "100%",
                }}
                key={`dataUpsell${item.id}`}
              >
                <Grid item xs={8}>
                  {item.title}
                </Grid>
                <Grid item xs={2}>
                  {item.price}
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    control={control}
                    name={`registration_upsells.data.${index}.amount`}
                    rules={{
                      required: "phone_number nesmí být prázde",
                      min: 0,
                      max: 10,
                    }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          type="number"
                          inputProps={{
                            min: 0,
                            max: 10,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: {
                              padding: 2,
                              paddingLeft: 10,
                              paddingRight: 10,
                            },
                          }}
                          value={field?.value ?? ""}
                          margin="normal"
                          fullWidth
                          id={`registration_upsells.data.${index}.amount`}
                          label={`Pocet`}
                        />
                      );
                    }}
                  />
                </Grid>
              </Grid>
            ))}
          </>
        );
      }
    }
  };
  return (
    <Create
      title={<Typography variant={"h5"}>Registrace</Typography>}
      wrapperProps={{
        sx: { backgroundColor: "transparent", boxShadow: "none" },
      }}
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
              Předchozí
            </Button>
          )}
          {currentStep < stepTitles.length - 1 && (
            <Button
              onClick={() => {
                gotoStep(currentStep + 1);
              }}
            >
              Další
            </Button>
          )}
          {currentStep === stepTitles.length - 1 && (
            <SaveButton color={"secondary"} onClick={handleSubmit(onFinish)} />
          )}
        </>
      }
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <Stepper nonLinear activeStep={currentStep} orientation={"horizontal"}>
          {stepTitles.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={() => gotoStep(index)}>{label}</StepButton>
            </Step>
          ))}
        </Stepper>
        <br />
        {renderFormByStep(currentStep)}
      </Box>
    </Create>
  );
};
