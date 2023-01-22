-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.recipe
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 50 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    image text COLLATE pg_catalog."default",
    steps jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id text COLLATE pg_catalog."default",
    cook_time interval,
    prep_time interval,
    portions integer NOT NULL,
    diet text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT recipe_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.recipe
    OWNER to postgres;

ALTER TABLE IF EXISTS public.recipe
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.recipe TO anon;

GRANT ALL ON TABLE public.recipe TO authenticated;

GRANT ALL ON TABLE public.recipe TO postgres;

GRANT ALL ON TABLE public.recipe TO service_role;
CREATE POLICY "Enable insert for authenticated users only"
    ON public.recipe
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
CREATE POLICY "Enable read access for all users"
    ON public.recipe
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);

CREATE TABLE IF NOT EXISTS public.unit
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 20 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    long_name text COLLATE pg_catalog."default" NOT NULL,
    short_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT unit_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.unit
    OWNER to postgres;

ALTER TABLE IF EXISTS public.unit
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.unit TO anon;

GRANT ALL ON TABLE public.unit TO authenticated;

GRANT ALL ON TABLE public.unit TO postgres;

GRANT ALL ON TABLE public.unit TO service_role;
CREATE POLICY "Enable insert for authenticated users only"
    ON public.unit
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
CREATE POLICY "Enable read access for all users"
    ON public.unit
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);

CREATE TABLE IF NOT EXISTS public.ingredient
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 300 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text COLLATE pg_catalog."default" NOT NULL,
    recipe_id integer,
    diet text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT ingredient_pkey PRIMARY KEY (id),
    CONSTRAINT ingredient_name_key UNIQUE (name),
    CONSTRAINT ingredient_recipe_id_fkey FOREIGN KEY (recipe_id)
        REFERENCES public.recipe (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT diet_constraint CHECK (diet = ANY (ARRAY['vegan'::text, 'vegetarian'::text, 'fish'::text, 'meat'::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ingredient
    OWNER to postgres;

ALTER TABLE IF EXISTS public.ingredient
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.ingredient TO anon;

GRANT ALL ON TABLE public.ingredient TO authenticated;

GRANT ALL ON TABLE public.ingredient TO postgres;

GRANT ALL ON TABLE public.ingredient TO service_role;
CREATE POLICY "Enable insert for authenticated users only"
    ON public.ingredient
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
CREATE POLICY "Enable read access for all users"
    ON public.ingredient
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);

CREATE TABLE IF NOT EXISTS public.recipe_ingredient
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 500 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    recipe_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    amount real NOT NULL,
    unit_id integer NOT NULL DEFAULT 1,
    index integer NOT NULL DEFAULT 0,
    section text COLLATE pg_catalog."default",
    extra_info text COLLATE pg_catalog."default",
    CONSTRAINT recipe_ingredient_pkey PRIMARY KEY (id),
    CONSTRAINT recipe_ingredient_ingredient_id_fkey FOREIGN KEY (ingredient_id)
        REFERENCES public.ingredient (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    CONSTRAINT recipe_ingredient_recipe_id_fkey FOREIGN KEY (recipe_id)
        REFERENCES public.recipe (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE CASCADE,
    CONSTRAINT recipe_ingredient_unit_id_fkey FOREIGN KEY (unit_id)
        REFERENCES public.unit (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.recipe_ingredient
    OWNER to postgres;

ALTER TABLE IF EXISTS public.recipe_ingredient
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.recipe_ingredient TO anon;

GRANT ALL ON TABLE public.recipe_ingredient TO authenticated;

GRANT ALL ON TABLE public.recipe_ingredient TO postgres;

GRANT ALL ON TABLE public.recipe_ingredient TO service_role;
CREATE POLICY "Enable insert for authenticated users only"
    ON public.recipe_ingredient
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
CREATE POLICY "Enable read access for all users"
    ON public.recipe_ingredient
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);
