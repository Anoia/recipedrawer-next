create extension pg_cron with schema extensions;
select cron.schedule('reindex_search', '0 * * * *', 'REFRESH MATERIALIZED VIEW search_index;');
