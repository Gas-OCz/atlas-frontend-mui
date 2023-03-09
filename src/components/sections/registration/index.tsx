import React, { FC, useContext, useEffect, useState } from "react";
import { HttpError, useList } from "@pankod/refine-core";
import {
  Create,
  Box,
  TextField,
  Autocomplete,
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
  Tooltip,
  useAutocomplete,
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
import { useRouter } from "next/dist/client/router";
import { FormContext } from "@contexts/form";
import { validRC } from "../../../utilites/validate";

const stepTitles = ["Kategorie", "Hlídka", "Doplňky"];
export interface InputValue {
  [key: string]: string;
}
export const Registration: FC<RegistrationProps> = ({ race }) => {
  const formContext = useContext(FormContext);
  const {
    getValues,
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
    stepsProps: { defaultStep: Number(formContext?.state?.step ?? "0") ?? 0 },
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
    defaultValues: formContext?.state.data ?? {
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
    onSearch: (value) => [
      {
        field: "title",
        operator: "contains",
        value,
      },
    ],
  });
  const [inputValue, setInputValue] = useState<InputValue>({});

  const { fields: competitors } = useFieldArray({
    name: "registration_competitors.data",
    control,
  });

  const controlledFields = competitors.map((field) => {
    return {
      ...field,
    };
  });
  const router = useRouter();
  const { push } = router;

  const onSubmit = async (data: IRegistrationDto) => {
    console.log(data);
    console.log(mutationResult);
    await onFinish(data);
  };

  useEffect(() => {
    if (mutationResult.isSuccess) {
      console.log(mutationResult.data.data);
      console.log(mutationResult);

      if (mutationResult?.data?.data?.id && !mutationResult.error) {
        formContext?.dispatch({
          type: "setSuccessId",
          payload: mutationResult.data.data.id,
        });
        push(`/${race.route}/registrace-dokoncena`);
      }

      //formContext?.dispatch({type: "setSuccessId", payload: mutationResult.data.data});
      //
    }
  }, [mutationResult?.isSuccess]);

  useEffect(() => {
    const subscription = watch(() => {
      formContext?.dispatch({
        type: "setData",
        payload: JSON.stringify(getValues()),
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

  useEffect(() => {
    if (
      dataUpsell?.data &&
      dataUpsell?.data?.length > 0 &&
      !formContext?.state?.data
    ) {
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
        registration_accompaniments: {
          data: [{ first_name: "", last_name: "", phone: "" }],
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
  const [setupCategories, setSetupCategories] = useState<{
    doprovod: boolean;
  }>();
  //const theme = useTheme();
  // const isSmallOrLess = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const selectedCategory = data?.data?.find(
      (value) => value.id === getValues().id_race_categories
    );
    setSetupCategories({ doprovod: selectedCategory?.accompaniment ?? false });
  }, [getValues().id_race_categories]);

  useEffect(() => {
    console.log(setupCategories);
  }, [setupCategories]);

  if (isLoading || isLoadingUpsell) return <>Loading ...</>;
  console.log(errors);
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
                rules={{ required: "Název klubu nesmí být prázdý" }}
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
          </>
        );
      }
      case 1: {
        const { ref, ...inputProps } = register("note");

        return (
          <>
            {controlledFields.map((item, index) => (
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
                    key={item.first_name}
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

                  <Controller
                    control={control}
                    name={`registration_competitors.data.${index}.personal_id`}
                    rules={{
                      required: "Rodné číslo nesmí být prázdné",
                      validate: validRC,
                    }}
                    render={({ field }) => {
                      return (
                        <Tooltip
                          title={
                            "Každý závodník je pojištěny, rodné číslo je podmínka platnosti."
                          }
                        >
                          <TextField
                            {...field}
                            size={"small"}
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
                            label={`Rodné číslo`}
                          />
                        </Tooltip>
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

                  <Controller
                    control={control}
                    name={`registration_competitors.data.${index}.id_race_shirt`}
                    rules={{
                      required:
                        "Triko nesmí být prázdné, je součástí startovného",
                    }}
                    render={({ field }) => {
                      return (
                        <Autocomplete
                          options={autocompleteProps.options || []}
                          fullWidth
                          getOptionLabel={(option) => option.title ?? null}
                          inputValue={inputValue?.[index] ?? ""}
                          onInputChange={(event, value1) => {
                            setInputValue({
                              ...inputValue,
                              [index]: value1,
                            });
                            return value1;
                          }}
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
                          placeholder="Vyberte triko"
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
                              size={"small"}
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
            <Box>
              <TextField
                {...inputProps}
                size={"small"}
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
        sx: { backgroundColor: "transparent", boxShadow: "none", padding: 0 },
      }}
      footerButtonProps={{
        sx: { padding: 0, textAlign: "right", float: "right" },
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
              Předchozí
            </Button>
          )}
          {currentStep < stepTitles.length - 1 && (
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
            <SaveButton color={"secondary"} onClick={handleSubmit(onSubmit)} />
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
