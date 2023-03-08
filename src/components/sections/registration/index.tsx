import React, { FC } from "react";
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
} from "@pankod/refine-mui";

import {
  Controller,
  useFieldArray,
  useStepsForm,
} from "@pankod/refine-react-hook-form";

import {
  fieldsCategory,
  fieldsShirts,
  resourceCategory,
  resourceShirts,
} from "@components/sections/registration/constants";
import {
  IRaceCategory,
  IRaceShirt,
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
    formState: { errors },
    steps: { currentStep, gotoStep },
  } = useStepsForm<IRegistrationDto, HttpError, IRegistrationDto>({
    defaultValues: {
      team_name: "",
      club_name: "",
      registration_competitors: [
        { first_name: "", personal_id: "", last_name: "", email: "" },
        { first_name: "", personal_id: "", last_name: "", email: "" },
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

  // const { data: dataRules, isLoading: isLoadingRules } = useList<
  //   IRaceCategoryRule,
  //   HttpError
  // >({
  //   resource: resourceRules,
  //   metaData: fieldRules,
  //   config: {
  //     filters: [
  //       {
  //         field: "id_race_category",
  //         operator: "eq",
  //         value: getValues()?.id_race_categories,
  //       },
  //     ],
  //   },
  // });

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
  const { fields } = useFieldArray({
    name: "registration_competitors",
    control,
  });

  //const theme = useTheme();
  // const isSmallOrLess = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) return <>Loading ...</>;

  console.log(getValues());
  console.log(errors);

  const renderFormByStep = (step: number) => {
    switch (step) {
      case 0: {
        return (
          <>
            {!!errors.id_race_categories && (
              <Box sx={{ paddingBottom: 1 }}>
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
                    error={!!errors.club_name}
                    helperText={errors.club_name?.message}
                    margin="normal"
                    fullWidth
                    label="Název klubu"
                  />
                )}
              />
            </Box>
            <Typography>Kategorie</Typography>
            <Box display={"flex"} sx={{ rowGap: 1, columnGap: 1 }}>
              <Controller
                name="id_race_categories"
                control={control}
                rules={{ required: true }}
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
                          console.log(item.id);
                          field.onChange(item.id);
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
          </>
        );
      }
      case 1: {
        const { ref, ...inputProps } = register("note");

        return (
          <>
            {fields.map((item, index) => (
              <Box key={`registration_competitors${item.id}`}>
                <Box sx={{ display: "flex", rowGap: 1, columnGap: 1 }}>
                  <Controller
                    control={control}
                    key={item.first_name}
                    name={`registration_competitors.${index}.first_name`}
                    rules={{ required: "Jmeno nesmí být prázde" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          autoFocus={index === 0}
                          error={
                            !!errors.registration_competitors?.[index]
                              ?.first_name
                          }
                          helperText={
                            errors.registration_competitors?.[index]?.first_name
                              ?.message
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
                    name={`registration_competitors.${index}.last_name`}
                    rules={{ required: "Prijmeni nesmí být prázde" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          error={
                            !!errors.registration_competitors?.[index]
                              ?.last_name
                          }
                          helperText={
                            errors.registration_competitors?.[index]?.last_name
                              ?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_competitors.${index}.last_name`}
                          label={`Prijmeni`}
                        />
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name={`registration_competitors.${index}.personal_id`}
                    rules={{ required: "RC nesmí být prázde" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          error={
                            !!errors.registration_competitors?.[index]
                              ?.personal_id
                          }
                          helperText={
                            errors.registration_competitors?.[index]
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
                    name={`registration_competitors.${index}.email`}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          error={
                            !!errors.registration_competitors?.[index]?.email
                          }
                          helperText={
                            errors.registration_competitors?.[index]?.email
                              ?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_competitors.${index}.email`}
                          label={`Email`}
                        />
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name={`registration_competitors.${index}.phone_number`}
                    rules={{ required: "phone_number nesmí být prázde" }}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          value={field?.value ?? ""}
                          error={
                            !!errors.registration_competitors?.[index]
                              ?.phone_number
                          }
                          helperText={
                            errors.registration_competitors?.[index]
                              ?.phone_number?.message
                          }
                          margin="normal"
                          fullWidth
                          id={`registration_competitors.${index}.phone_number`}
                          label={`Telefon`}
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name={`registration_competitors.${index}.id_race_shirt`}
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
                            console.log(JSON.stringify(newValue, null, " "));
                            field.onChange(newValue?.id ?? "");
                          }}
                          placeholder="Vyberte tricko"
                          renderInput={(params) => (
                            <TextField
                              error={
                                !!errors.registration_competitors?.[index]
                                  ?.id_race_shirt
                              }
                              helperText={
                                errors.registration_competitors?.[index]
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
    }
  };
  console.log(getValues());
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
            <SaveButton onClick={handleSubmit(onFinish)} />
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
