create extension if not exists "unaccent" with schema "public" version '1.1';

create materialized view "public"."search_index" as  WITH ingredient_list AS (
         SELECT x.recipe_id,
            string_agg(ingredient.name, ' '::text) AS ingredients
           FROM (( SELECT recipe_ingredient.recipe_id,
                    array_agg(recipe_ingredient.ingredient_id) AS array_agg
                   FROM recipe_ingredient
                  GROUP BY recipe_ingredient.recipe_id) x
             LEFT JOIN ingredient ON ((x.array_agg @> ARRAY[ingredient.id])))
          GROUP BY x.recipe_id
        ), step_list AS (
         SELECT recipe_1.id,
            string_agg((c.value ->> 'content'::text), ' '::text) AS steps
           FROM recipe recipe_1,
            LATERAL jsonb_array_elements(recipe_1.steps) c(value)
          GROUP BY recipe_1.id
        )
 SELECT recipe.id,
    recipe.name,
    recipe.description,
    recipe.image,
    recipe.slug,
    recipe.diet,
    to_tsvector('german'::regconfig, ((((((((recipe.name || ' '::text) || recipe.description) || ' '::text) || recipe.diet) || ' '::text) || COALESCE(ingredient_list.ingredients, ''::text)) || ' '::text) || COALESCE(step_list.steps, ''::text))) AS vector
   FROM ((ingredient_list
     LEFT JOIN recipe ON ((ingredient_list.recipe_id = recipe.id)))
     LEFT JOIN step_list ON ((ingredient_list.recipe_id = step_list.id)));

CREATE INDEX idx_fts_search ON public.search_index USING gin (vector);
