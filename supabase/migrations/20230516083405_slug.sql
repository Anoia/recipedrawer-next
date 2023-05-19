alter table "public"."recipe" add column "slug" text;
CREATE UNIQUE INDEX recipe_slug_key ON public.recipe USING btree (slug);
alter table "public"."recipe" add constraint "recipe_slug_key" UNIQUE using index "recipe_slug_key";
