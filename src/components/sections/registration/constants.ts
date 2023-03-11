export const resourceCategory = "race_categories";
export const resourceRules = "race_category_rules";
export const fieldsCategory = {
  fields: [
    "id",
    "title",
    "shortcut",
    "price",
    "surcharge",
    "accompaniment",
    "description",
  ],
};
export const fieldRules = {
  fields: [
    "id",
    "age_from",
    "age_to",
    "sex",
    "optional",
    "created_at",
    "updated_at",
    "id_race_category",
  ],
};
export const resourceShirts = "race_shirts";

export const fieldsShirts = {
  fields: ["id", "title", "price", "available"],
};

export const resourceUpsells = "race_upsells";
export const fieldsUpsells = {
  fields: ["id", "title", "type", "price", "available", "multiple"],
};
