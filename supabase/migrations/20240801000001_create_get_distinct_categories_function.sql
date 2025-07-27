
create or replace function get_distinct_categories()
returns table(category text)
language sql
as $$
  select distinct category from posts where category is not null and category != '';
$$;

grant execute on function get_distinct_categories() to anon, authenticated;
